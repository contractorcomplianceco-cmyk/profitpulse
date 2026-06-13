export interface ScenarioBaseline {
  revenue: number;
  cash: number;
  profit: number;
  payroll: number;
  ar: number;
  marketingSpend: number;
}

export interface ScenarioAdjustments {
  adSpendDelta: number;
  hireSalesperson: number;
  hireCompliance: number;
  hireBookkeeper: number;
  raisePricesPct: number;
  reduceExpensesPct: number;
  increaseCloseRatePct: number;
  reduceRefundRatePct: number;
  improveCollectionSpeedDays: number;
  addRetainerPlan: boolean;
  launchNewChannel: boolean;
  increaseReferralPayouts: boolean;
  cutLowMarginService: boolean;
}

export interface ScenarioResult {
  revenueImpact: number;
  cashImpact: number;
  profitImpact: number;
  runwayImpact: number;
  payrollImpact: number;
  breakEvenImpact: number;
  leadImpact: number;
  capacityImpact: number;
  riskScore: number; // 0-100
  timeToPayoffMonths: number;
  decisionString: string;
}

export function calculateScenario(baseline: ScenarioBaseline, adjustments: ScenarioAdjustments): ScenarioResult {
  // Model the P&L impact ONCE, then derive cash/profit/runway from it so the
  // numbers stay internally consistent (no double counting).
  let revenueImpact = 0; // incremental monthly revenue
  let costImpact = 0; // incremental monthly operating cost (non-payroll); negative = savings
  let payrollImpact = 0; // incremental monthly fixed payroll
  let leadImpact = 0;
  let capacityImpact = 0;

  // --- Marketing levers ---
  if (adjustments.adSpendDelta !== 0) {
    const newLeads = adjustments.adSpendDelta / 150; // ~$150 CPL
    leadImpact += newLeads;
    revenueImpact += newLeads * 0.15 * 5000; // 15% close rate, $5k value
    costImpact += adjustments.adSpendDelta;
  }

  if (adjustments.launchNewChannel) {
    leadImpact += 40;
    revenueImpact += 40 * 0.12 * 5000; // new channel converts slightly lower
    costImpact += 12000;
  }

  if (adjustments.increaseReferralPayouts) {
    revenueImpact += 18000;
    costImpact += 6000;
  }

  // --- Hiring levers (fixed payroll) ---
  payrollImpact += adjustments.hireSalesperson * 8000;
  payrollImpact += adjustments.hireCompliance * 6000;
  payrollImpact += adjustments.hireBookkeeper * 5000;
  capacityImpact += adjustments.hireCompliance * 20; // clients of added capacity
  revenueImpact += adjustments.hireSalesperson * 50000; // ramped quota contribution

  // --- Pricing & efficiency levers ---
  if (adjustments.raisePricesPct > 0) {
    revenueImpact += baseline.revenue * (adjustments.raisePricesPct / 100);
  }

  if (adjustments.reduceExpensesPct > 0) {
    costImpact -= baseline.revenue * 0.4 * (adjustments.reduceExpensesPct / 100); // savings
  }

  if (adjustments.increaseCloseRatePct > 0) {
    revenueImpact += baseline.revenue * (adjustments.increaseCloseRatePct / 100);
  }

  if (adjustments.reduceRefundRatePct > 0) {
    revenueImpact += baseline.revenue * 0.05 * (adjustments.reduceRefundRatePct / 100); // recovered refunds
  }

  if (adjustments.addRetainerPlan) {
    revenueImpact += 25000; // new recurring retainer revenue
  }

  if (adjustments.cutLowMarginService) {
    revenueImpact -= 15000; // lose the top-line
    costImpact -= 22000; // but save more than that in fulfillment cost
  }

  // One-time cash acceleration from faster collections (affects cash, not P&L).
  const collectionCashBoost = adjustments.improveCollectionSpeedDays > 0
    ? baseline.ar * Math.min(adjustments.improveCollectionSpeedDays / 30, 1) * 0.5
    : 0;

  const hasChanges =
    revenueImpact !== 0 || costImpact !== 0 || payrollImpact !== 0 || collectionCashBoost !== 0;

  const profitImpact = revenueImpact - costImpact - payrollImpact;
  const cashImpact = profitImpact + collectionCashBoost;

  // Break-even moves with fixed-cost changes (payroll + fixed operating deltas).
  const breakEvenImpact = payrollImpact + costImpact;

  const baselineRunway = baseline.payroll > 0 ? baseline.cash / baseline.payroll : 0;
  const newMonthlyBurn = baseline.payroll + payrollImpact;
  const newRunway = newMonthlyBurn > 0 ? (baseline.cash + cashImpact) / newMonthlyBurn : 0;
  const runwayImpact = newRunway - baselineRunway;

  let riskScore = 25;
  if (payrollImpact > 0) riskScore += Math.min(payrollImpact / 1000, 25);
  if (adjustments.raisePricesPct > 10) riskScore += 15;
  if (cashImpact < 0) riskScore += 20;
  if (profitImpact > 0) riskScore -= 15;

  let timeToPayoffMonths = 0;
  if (cashImpact < 0 && profitImpact > 0) {
    timeToPayoffMonths = Math.abs(cashImpact) / profitImpact;
  } else if (cashImpact < 0) {
    timeToPayoffMonths = 99; // never pays off at current profit trajectory
  }

  let decisionString: string;
  if (!hasChanges) {
    decisionString = "Baseline — No Change Modeled";
  } else if (profitImpact > 0 && cashImpact > -50000) {
    decisionString = "Favorable Growth Move";
  } else if (profitImpact > 0) {
    decisionString = "Profitable but Cash-Intensive";
  } else {
    decisionString = "High Risk / Cash Burn";
  }

  return {
    revenueImpact,
    cashImpact,
    profitImpact,
    runwayImpact,
    payrollImpact,
    breakEvenImpact,
    leadImpact,
    capacityImpact,
    riskScore: Math.min(100, Math.max(0, Math.round(riskScore))),
    timeToPayoffMonths,
    decisionString
  };
}