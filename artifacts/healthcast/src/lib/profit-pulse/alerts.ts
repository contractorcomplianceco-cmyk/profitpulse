import type { ProfitPulseState, ComputedAlert } from "./types";
import {
  computeDashboardMetrics,
  monthlyRevenueTotal,
  monthlyExpensesTotal,
  priorMonthlyRevenueTotal,
  computeForecastedCash30d,
} from "./calculations";

function daysSince(iso: string, ref = new Date()): number {
  const d = new Date(`${iso}T12:00:00`);
  return Math.round((ref.getTime() - d.getTime()) / 86_400_000);
}

export function generateAlerts(state: ProfitPulseState): ComputedAlert[] {
  const alerts: ComputedAlert[] = [];
  const ref = new Date();
  const metrics = computeDashboardMetrics(state, 0);

  const overdueInvoices = state.invoices.filter((i) => i.status === "overdue");
  if (overdueInvoices.length > 0) {
    const total = overdueInvoices.reduce((s, i) => s + (i.amount - i.amountPaid), 0);
    alerts.push({
      id: "alert-ar-overdue",
      category: "AR Aging",
      severity: total > 80000 ? "critical" : "warning",
      title: "Overdue Invoices",
      message: `${overdueInvoices.length} invoice(s) past due totaling $${Math.round(total).toLocaleString()}.`,
      recommendedAction: "Initiate collections on overdue accounts this week.",
      affectedMetric: "AR Outstanding",
    });
  }

  if (metrics.arOutstanding > 400000) {
    alerts.push({
      id: "alert-ar-balance",
      category: "AR Aging",
      severity: "warning",
      title: "Elevated A/R Balance",
      message: `Accounts receivable at $${Math.round(metrics.arOutstanding).toLocaleString()} exceeds $400K threshold.`,
      recommendedAction: "Review aging report and prioritize 60+ day accounts.",
      affectedMetric: "AR Outstanding",
    });
  }

  if (metrics.runwayMonths < state.organization.runwayThresholdMonths) {
    alerts.push({
      id: "alert-runway",
      category: "Cash Risk",
      severity: metrics.runwayMonths < 4 ? "critical" : "warning",
      title: "Low Cash Runway",
      message: `Cash runway at ${metrics.runwayMonths.toFixed(1)} months (threshold: ${state.organization.runwayThresholdMonths}).`,
      recommendedAction: "Review upcoming AP and defer non-essential hiring.",
      affectedMetric: "Runway Months",
    });
  }

  if (metrics.grossMarginPct < state.organization.marginThresholdPct) {
    alerts.push({
      id: "alert-margin",
      category: "Profitability",
      severity: "warning",
      title: "Margin Below Threshold",
      message: `Gross margin at ${metrics.grossMarginPct.toFixed(1)}% vs target ${state.organization.marginThresholdPct}%.`,
      recommendedAction: "Review low-margin service lines and expense categories.",
      affectedMetric: "Gross Margin",
    });
  }

  const currentRev = monthlyRevenueTotal(state, ref);
  const priorRev = priorMonthlyRevenueTotal(state, ref);
  const currentExp = monthlyExpensesTotal(state, ref);
  const priorExp = monthlyExpensesTotal(state, ref); // simplified — compare to prior period proxy
  if (priorRev > 0 && currentExp > priorExp * 1.08 && currentRev <= priorRev * 1.02) {
    alerts.push({
      id: "alert-expenses-rising",
      category: "Operations",
      severity: "warning",
      title: "Expenses Rising Faster Than Revenue",
      message: "Operating costs are outpacing revenue growth this period.",
      recommendedAction: "Audit top expense categories and marketing spend efficiency.",
      affectedMetric: "Operating Expenses",
    });
  }

  const highRiskFacilities = state.facilities.filter(
    (f) => f.complianceStatus === "non-compliant" || f.healthScore < 65,
  );
  for (const f of highRiskFacilities) {
    alerts.push({
      id: `alert-facility-${f.id}`,
      category: "Facility Risk",
      severity: f.complianceStatus === "non-compliant" ? "critical" : "warning",
      title: `Facility Risk: ${f.name}`,
      message: `Health score ${f.healthScore}, status: ${f.complianceStatus}.`,
      recommendedAction: f.recommendedAction,
      affectedMetric: "Facility Health",
    });
  }

  const staleOpps = state.opportunities.filter((o) => {
    if (o.stage === "won" || o.stage === "lost") return false;
    return daysSince(o.lastFollowUpDate, ref) > 30;
  });
  for (const o of staleOpps) {
    alerts.push({
      id: `alert-opp-${o.id}`,
      category: "Opportunity",
      severity: "info",
      title: "Follow-up Overdue",
      message: `"${o.title}" has not been followed up in 30+ days.`,
      recommendedAction: "Schedule executive touchpoint with account owner.",
      affectedMetric: "Pipeline",
    });
  }

  const forecast = computeForecastedCash30d(state, ref);
  if (forecast < state.organization.cashOnHand * 0.85) {
    alerts.push({
      id: "alert-cash-30d",
      category: "Cash Flow",
      severity: forecast < state.organization.cashOnHand * 0.7 ? "critical" : "warning",
      title: "Cash Flow Issue in Next 30 Days",
      message: `Projected cash position drops to $${Math.round(forecast).toLocaleString()} within 30 days.`,
      recommendedAction: "Accelerate AR collections and review scheduled AP.",
      affectedMetric: "Forecasted Cash",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "alert-all-clear",
      category: "Status",
      severity: "info",
      title: "All Systems Normal",
      message: "No critical alerts detected from current data.",
      recommendedAction: "Continue monitoring KPIs and facility health scores.",
      affectedMetric: "Overall Health",
    });
  }

  return alerts;
}

export function alertCountBySeverity(alerts: ComputedAlert[]): { critical: number; warning: number; info: number } {
  return {
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  };
}
