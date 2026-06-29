import type {
  ProfitPulseState,
  DashboardMetrics,
  ScenarioAssumptions,
  ScenarioProjection,
} from "./types";

const MS_PER_DAY = 86_400_000;

function parseDate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

function isWithinDays(iso: string, ref: Date, days: number): boolean {
  const d = parseDate(iso);
  const diff = daysBetween(ref, d);
  return diff >= 0 && diff <= days;
}

function isWithinPastDays(iso: string, ref: Date, days: number): boolean {
  const d = parseDate(iso);
  const diff = daysBetween(d, ref);
  return diff >= 0 && diff <= days;
}

function sum<T>(items: T[], fn: (item: T) => number): number {
  return items.reduce((acc, item) => acc + fn(item), 0);
}

export function monthlyRevenueTotal(state: ProfitPulseState, ref = new Date()): number {
  return sum(state.revenueRecords.filter((r) => isWithinPastDays(r.date, ref, 30)), (r) => r.amount);
}

export function priorMonthlyRevenueTotal(state: ProfitPulseState, ref = new Date()): number {
  const start = new Date(ref);
  start.setDate(start.getDate() - 30);
  return sum(
    state.revenueRecords.filter((r) => {
      const d = parseDate(r.date);
      const daysAgo = daysBetween(d, ref);
      return daysAgo > 30 && daysAgo <= 60;
    }),
    (r) => r.amount,
  );
}

export function monthlyExpensesTotal(state: ProfitPulseState, ref = new Date()): number {
  return sum(state.expenseRecords.filter((e) => isWithinPastDays(e.date, ref, 30)), (e) => e.amount);
}

export function payrollBurdenTotal(state: ProfitPulseState): number {
  return sum(
    state.staffing.filter((s) => s.status === "active" || s.status === "planned"),
    (s) => s.monthlyCost,
  );
}

export function arOutstandingTotal(state: ProfitPulseState): number {
  return sum(
    state.invoices.filter((i) => i.status !== "paid" && i.status !== "draft"),
    (i) => i.amount - i.amountPaid,
  );
}

export function apUpcomingTotal(state: ProfitPulseState, ref = new Date(), days = 30): number {
  return sum(
    state.payables.filter((p) => p.status !== "paid" && isWithinDays(p.dueDate, ref, days)),
    (p) => p.amount,
  );
}

export function revenueAtRiskTotal(state: ProfitPulseState, ref = new Date()): number {
  const overdueInvoices = sum(
    state.invoices.filter((i) => i.status === "overdue"),
    (i) => i.amount - i.amountPaid,
  );
  const atRiskAccounts = sum(
    state.accounts.filter((a) => a.status === "at-risk"),
    (a) => a.monthlyContractValue * 3,
  );
  const overdueOpps = sum(
    state.opportunities.filter((o) => {
      if (o.stage === "won" || o.stage === "lost") return false;
      return daysBetween(parseDate(o.lastFollowUpDate), ref) > 30;
    }),
    (o) => o.value * (o.probability / 100),
  );
  return overdueInvoices + atRiskAccounts + overdueOpps;
}

export function facilityOpportunityTotal(state: ProfitPulseState): number {
  return sum(state.facilities, (f) => f.revenueOpportunity + f.upsellPotential);
}

export function grossMarginPct(revenue: number, expenses: number): number {
  if (revenue <= 0) return 0;
  return ((revenue - expenses) / revenue) * 100;
}

export function runwayMonths(cash: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return 99;
  return cash / monthlyBurn;
}

export function computeForecastedCash30d(state: ProfitPulseState, ref = new Date()): number {
  const revenue30 = monthlyRevenueTotal(state, ref);
  const expense30 = monthlyExpensesTotal(state, ref);
  const ap30 = apUpcomingTotal(state, ref, 30);
  const arCollect = arOutstandingTotal(state) * 0.35;
  return state.organization.cashOnHand + revenue30 - expense30 - ap30 + arCollect;
}

function buildTrend(values: number[]): number[] {
  if (values.length >= 4) return values.slice(-4);
  while (values.length < 4) values.unshift(values[0] ?? 0);
  return values;
}

export function computeFinancialHealthScore(metrics: {
  grossMarginPct: number;
  runwayMonths: number;
  arOutstanding: number;
  monthlyRevenue: number;
  alertCount: number;
}): number {
  let score = 70;
  if (metrics.grossMarginPct >= 25) score += 10;
  else if (metrics.grossMarginPct >= 15) score += 5;
  else score -= 10;

  if (metrics.runwayMonths >= 8) score += 10;
  else if (metrics.runwayMonths >= 6) score += 5;
  else score -= 15;

  const arRatio = metrics.monthlyRevenue > 0 ? metrics.arOutstanding / metrics.monthlyRevenue : 0;
  if (arRatio < 0.3) score += 5;
  else if (arRatio > 0.5) score -= 10;

  score -= Math.min(metrics.alertCount * 2, 20);
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function computeDashboardMetrics(state: ProfitPulseState, alertCount = 0): DashboardMetrics {
  const ref = new Date();
  const monthlyRevenue = monthlyRevenueTotal(state, ref);
  const priorMonthlyRevenue = priorMonthlyRevenueTotal(state, ref) || monthlyRevenue * 0.94;
  const monthlyExpenses = monthlyExpensesTotal(state, ref);
  const netProfit = monthlyRevenue - monthlyExpenses;
  const priorNetProfit = priorMonthlyRevenue - monthlyExpenses * 0.97;
  const grossMargin = grossMarginPct(monthlyRevenue, monthlyExpenses);
  const payroll = payrollBurdenTotal(state);
  const arOutstanding = arOutstandingTotal(state);
  const apUpcoming = apUpcomingTotal(state, ref, 30);
  const cashOnHand = state.organization.cashOnHand;
  const monthlyBurn = monthlyExpenses > 0 ? monthlyExpenses : payroll;
  const runway = runwayMonths(cashOnHand, monthlyBurn);
  const revenueAtRisk = revenueAtRiskTotal(state, ref);
  const forecastedCash30d = computeForecastedCash30d(state, ref);
  const facilityOpportunityValue = facilityOpportunityTotal(state);

  const healthScore = computeFinancialHealthScore({
    grossMarginPct: grossMargin,
    runwayMonths: runway,
    arOutstanding,
    monthlyRevenue,
    alertCount,
  });

  return {
    monthlyRevenue,
    priorMonthlyRevenue,
    netProfit,
    priorNetProfit,
    grossMarginPct: grossMargin,
    operatingMarginPct: monthlyRevenue > 0 ? (netProfit / monthlyRevenue) * 100 : 0,
    cashOnHand,
    arOutstanding,
    apUpcoming,
    runwayMonths: runway,
    payrollBurden: payroll,
    revenueAtRisk,
    forecastedCash30d,
    facilityOpportunityValue,
    alertCount,
    financialHealthScore: healthScore,
    monthlyExpenses,
    revenueTrend: buildTrend([
      priorMonthlyRevenue * 0.96,
      priorMonthlyRevenue,
      monthlyRevenue * 0.97,
      monthlyRevenue,
    ]),
    cashTrend: buildTrend([
      cashOnHand * 0.88,
      cashOnHand * 0.92,
      cashOnHand * 0.96,
      cashOnHand,
    ]),
  };
}

export function computeScenarioProjection(
  state: ProfitPulseState,
  assumptions: ScenarioAssumptions,
): ScenarioProjection {
  const base = computeDashboardMetrics(state, 0);
  const growthMult = 1 + assumptions.revenueGrowthPct / 100;
  const priceMult = 1 + assumptions.priceIncreasePct / 100;
  const churnMult = 1 - assumptions.churnRiskPct / 100;
  const expenseMult = 1 - assumptions.expenseReductionPct / 100;
  const staffingMult = 1 + assumptions.staffingChangePct / 100;

  const projectedRevenue =
    base.monthlyRevenue * growthMult * priceMult * churnMult +
    assumptions.facilityIntelligenceRevenue;

  const projectedExpenses =
    base.monthlyExpenses * expenseMult +
    base.payrollBurden * (staffingMult - 1);

  const arBoost =
    base.arOutstanding * (assumptions.arCollectionImprovementPct / 100) * 0.5;

  const projectedNetProfit = projectedRevenue - projectedExpenses;
  const projectedMarginPct = grossMarginPct(projectedRevenue, projectedExpenses);
  const cashImpact = projectedNetProfit - base.netProfit + arBoost;
  const newCash = base.cashOnHand + cashImpact;
  const projectedRunwayMonths = runwayMonths(newCash, projectedExpenses);

  let recommendedAction = "Maintain current trajectory and monitor KPIs weekly.";
  if (projectedNetProfit > base.netProfit * 1.1 && cashImpact > 0) {
    recommendedAction = "Favorable scenario — prioritize Facility Intelligence upsells and AR collection.";
  } else if (projectedRunwayMonths < state.organization.runwayThresholdMonths) {
    recommendedAction = "Runway at risk — reduce discretionary spend and accelerate collections.";
  } else if (projectedMarginPct < state.organization.marginThresholdPct) {
    recommendedAction = "Margin below target — review expense categories and pricing levers.";
  }

  return {
    projectedRevenue,
    projectedNetProfit,
    projectedMarginPct,
    projectedRunwayMonths,
    cashImpact,
    recommendedAction,
  };
}

export function revenueByCategory(state: ProfitPulseState): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of state.revenueRecords) {
    map.set(r.category, (map.get(r.category) ?? 0) + r.amount);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function revenueByAccount(state: ProfitPulseState): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of state.revenueRecords) {
    const acc = state.accounts.find((a) => a.id === r.accountId);
    const name = acc?.name ?? "Unknown";
    map.set(name, (map.get(name) ?? 0) + r.amount);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function arAgingBuckets(state: ProfitPulseState, ref = new Date()): { bucket: string; amount: number }[] {
  const buckets = [
    { bucket: "0-30 Days", amount: 0 },
    { bucket: "31-60 Days", amount: 0 },
    { bucket: "61-90 Days", amount: 0 },
    { bucket: "90+ Days", amount: 0 },
  ];
  for (const inv of state.invoices) {
    if (inv.status === "paid" || inv.status === "draft") continue;
    const outstanding = inv.amount - inv.amountPaid;
    const days = daysBetween(parseDate(inv.dueDate), ref);
    if (days <= 0) buckets[0].amount += outstanding;
    else if (days <= 30) buckets[0].amount += outstanding;
    else if (days <= 60) buckets[1].amount += outstanding;
    else if (days <= 90) buckets[2].amount += outstanding;
    else buckets[3].amount += outstanding;
  }
  return buckets;
}

export function cashProjection90d(state: ProfitPulseState, ref = new Date()): { date: string; balance: number; in: number; out: number }[] {
  const points: { date: string; balance: number; in: number; out: number }[] = [];
  let balance = state.organization.cashOnHand;
  for (let w = 0; w < 13; w++) {
    const d = new Date(ref);
    d.setDate(d.getDate() + w * 7);
    const dateStr = d.toISOString().slice(0, 10);
    const cashIn = monthlyRevenueTotal(state, d) / 4;
    const cashOut = (monthlyExpensesTotal(state, d) + apUpcomingTotal(state, d, 7)) / 4;
    balance = balance + cashIn - cashOut;
    points.push({ date: dateStr.slice(5), balance: Math.round(balance), in: Math.round(cashIn), out: Math.round(cashOut) });
  }
  return points;
}

export function calendarEvents(state: ProfitPulseState, ref = new Date()): {
  id: string;
  date: string;
  type: "inflow" | "outflow";
  label: string;
  amount: number;
}[] {
  const events: { id: string; date: string; type: "inflow" | "outflow"; label: string; amount: number }[] = [];
  for (const inv of state.invoices) {
    if (inv.status === "paid") continue;
    if (isWithinDays(inv.dueDate, ref, 45)) {
      events.push({
        id: inv.id,
        date: inv.dueDate,
        type: "inflow",
        label: `AR: ${inv.invoiceNumber}`,
        amount: inv.amount - inv.amountPaid,
      });
    }
  }
  for (const p of state.payables) {
    if (p.status === "paid") continue;
    if (isWithinDays(p.dueDate, ref, 45)) {
      events.push({
        id: p.id,
        date: p.dueDate,
        type: "outflow",
        label: `AP: ${p.vendor}`,
        amount: p.amount,
      });
    }
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}
