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

const RECURRING_CATEGORY_RE = /retainer|contract|monthly|service agreement/i;

function isRecurringCategory(category: string): boolean {
  return RECURRING_CATEGORY_RE.test(category);
}

export function revenueByMonthLast6(state: ProfitPulseState, ref = new Date()): {
  month: string;
  recurring: number;
  oneTime: number;
  total: number;
}[] {
  const months: { month: string; recurring: number; oneTime: number; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const end = new Date(ref);
    end.setDate(end.getDate() - i * 30);
    const start = new Date(end);
    start.setDate(start.getDate() - 30);

    let recurring = 0;
    let oneTime = 0;
    for (const r of state.revenueRecords) {
      const d = parseDate(r.date);
      const daysAgo = daysBetween(d, end);
      if (daysAgo < 0 || daysAgo > 30) continue;
      if (isRecurringCategory(r.category)) recurring += r.amount;
      else oneTime += r.amount;
    }
    const label = end.toLocaleDateString("en-US", { month: "short" });
    months.push({ month: label, recurring, oneTime, total: recurring + oneTime });
  }
  return months;
}

export function revenueByStateLive(state: ProfitPulseState): { state: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of state.revenueRecords) {
    const acc = state.accounts.find((a) => a.id === r.accountId);
    const st = acc?.state ?? "—";
    map.set(st, (map.get(st) ?? 0) + r.amount);
  }
  return Array.from(map.entries())
    .map(([state, value]) => ({ state, value }))
    .sort((a, b) => b.value - a.value);
}

export function revenueByCategoryWithShare(state: ProfitPulseState): { name: string; value: number; share: number }[] {
  const items = revenueByCategory(state);
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return items.map((i) => ({
    name: i.name,
    value: i.value,
    share: Math.round((i.value / total) * 100),
  }));
}

export function recurringRevenueMetrics(state: ProfitPulseState, ref = new Date()) {
  const total30 = monthlyRevenueTotal(state, ref);
  const recurring = sum(
    state.revenueRecords.filter(
      (r) => isRecurringCategory(r.category) && isWithinPastDays(r.date, ref, 30),
    ),
    (r) => r.amount,
  );
  const fixedOverhead = monthlyExpensesTotal(state, ref) * 0.65;
  const coverage = fixedOverhead > 0 ? (recurring / fixedOverhead) * 100 : 0;
  const renewals = sum(
    state.invoices.filter((i) => i.status === "sent" || i.status === "partial"),
    (i) => i.amount - i.amountPaid,
  );
  return { recurring, coverage, renewals, oneTime: total30 - recurring };
}

function expensesForAccount(state: ProfitPulseState, accountId: string, ref = new Date()): number {
  const direct = sum(
    state.expenseRecords.filter(
      (e) => e.accountId === accountId && isWithinPastDays(e.date, ref, 90),
    ),
    (e) => e.amount,
  );
  if (direct > 0) return direct;
  const accountRev = sum(
    state.revenueRecords.filter((r) => r.accountId === accountId && isWithinPastDays(r.date, ref, 90)),
    (r) => r.amount,
  );
  const totalRev = sum(
    state.revenueRecords.filter((r) => isWithinPastDays(r.date, ref, 90)),
    (r) => r.amount,
  );
  const totalExp = monthlyExpensesTotal(state, ref) * 3;
  if (totalRev <= 0) return 0;
  return totalExp * (accountRev / totalRev);
}

export function marginByCategoryLive(state: ProfitPulseState, ref = new Date()): { name: string; margin: number; revenue: number }[] {
  return revenueByCategory(state).map((cat) => {
    const revRecords = state.revenueRecords.filter((r) => r.category === cat.name && isWithinPastDays(r.date, ref, 90));
    const rev = sum(revRecords, (r) => r.amount);
    const acctIds = new Set(revRecords.map((r) => r.accountId));
    let exp = 0;
    for (const id of acctIds) exp += expensesForAccount(state, id, ref);
    if (exp === 0 && rev > 0) {
      exp = rev * (1 - grossMarginPct(monthlyRevenueTotal(state, ref), monthlyExpensesTotal(state, ref)) / 100);
    }
    const margin = rev > 0 ? ((rev - exp) / rev) * 100 : 0;
    return { name: cat.name, margin: Math.round(margin * 10) / 10, revenue: rev };
  });
}

export function expenseByCategoryLive(state: ProfitPulseState, ref = new Date()): { category: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const e of state.expenseRecords.filter((x) => isWithinPastDays(x.date, ref, 90))) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function lowMarginAccountsLive(
  state: ProfitPulseState,
  thresholdPct?: number,
  ref = new Date(),
): { id: string; name: string; margin: number; reason: string; revenue: number }[] {
  const threshold = thresholdPct ?? state.organization.marginThresholdPct;
  return state.accounts
    .map((acc) => {
      const rev = sum(
        state.revenueRecords.filter((r) => r.accountId === acc.id && isWithinPastDays(r.date, ref, 90)),
        (r) => r.amount,
      );
      const exp = expensesForAccount(state, acc.id, ref);
      const margin = rev > 0 ? ((rev - exp) / rev) * 100 : 0;
      let reason = "Below target margin";
      if (acc.status === "at-risk") reason = "At-risk account · collection delays";
      else if (exp > rev * 0.85) reason = "Labor and materials over plan";
      return { id: acc.id, name: acc.name, margin: Math.round(margin * 10) / 10, reason, revenue: rev };
    })
    .filter((a) => a.revenue > 0 && a.margin < threshold)
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 5);
}

export interface DerivedJobSnapshot {
  id: string;
  name: string;
  accountName: string;
  contractValue: number;
  revenueToDate: number;
  costToDate: number;
  marginPct: number;
  status: string;
}

export function deriveJobSnapshots(state: ProfitPulseState, ref = new Date()): DerivedJobSnapshot[] {
  const openOpps = state.opportunities.filter((o) => o.stage !== "lost" && o.stage !== "won");
  const snapshots: DerivedJobSnapshot[] = openOpps.map((opp) => {
    const acc = state.accounts.find((a) => a.id === opp.accountId);
    const revenueToDate = sum(
      state.revenueRecords.filter((r) => r.accountId === opp.accountId && isWithinPastDays(r.date, ref, 120)),
      (r) => r.amount,
    );
    const costToDate = expensesForAccount(state, opp.accountId, ref);
    const marginPct = revenueToDate > 0 ? ((revenueToDate - costToDate) / revenueToDate) * 100 : 0;
    return {
      id: opp.id,
      name: opp.title,
      accountName: acc?.name ?? "Unknown client",
      contractValue: opp.value,
      revenueToDate,
      costToDate,
      marginPct: Math.round(marginPct * 10) / 10,
      status: opp.stage,
    };
  });

  return snapshots.sort((a, b) => a.marginPct - b.marginPct).slice(0, 6);
}

export interface IntegrationSyncRow {
  name: string;
  status: "manual" | "preview";
  detail: string;
}

export function integrationSyncStatus(): IntegrationSyncRow[] {
  return [
    { name: "CSV Import", status: "manual", detail: "Manual · Integrations page" },
    { name: "JSON Backup", status: "manual", detail: "Manual · Settings export" },
    { name: "QuickBooks", status: "preview", detail: "Preview · not connected" },
    { name: "Google Ads", status: "preview", detail: "Preview · not connected" },
    { name: "Payroll API", status: "preview", detail: "Preview · not connected" },
  ];
}
