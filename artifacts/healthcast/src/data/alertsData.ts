export interface Alert {
  id: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  recommendedAction: string;
  affectedMetric: string;
}

export const alertsData: Alert[] = [
  {
    id: 'alert-cash-1',
    category: 'Cash Risk',
    severity: 'critical',
    title: 'Low Cash Runway Forecast',
    message: 'Cash runway projected to drop below 6 months within 45 days based on current burn rate.',
    recommendedAction: 'Review upcoming AP and freeze non-essential hiring.',
    affectedMetric: 'Runway Months'
  },
  {
    id: 'alert-ar-1',
    category: 'AR Aging',
    severity: 'warning',
    title: 'Elevated 90+ Day A/R',
    message: 'Accounts Receivable over 90 days has crossed the $70k threshold.',
    recommendedAction: 'Initiate aggressive collections protocol on delinquent accounts.',
    affectedMetric: 'AR Outstanding'
  },
  {
    id: 'alert-payroll-1',
    category: 'Payroll Risk',
    severity: 'warning',
    title: 'Payroll Burden Creep',
    message: 'Payroll has increased to 34.5% of revenue, breaking the 30% target ceiling.',
    recommendedAction: 'Pause backfill hiring for Q3.',
    affectedMetric: 'Payroll % of Rev'
  },
  {
    id: 'alert-marketing-1',
    category: 'Marketing Waste',
    severity: 'info',
    title: 'Rising CAC in Tier 2 Markets',
    message: 'Customer Acquisition Cost in Tier 2 geographic markets is up 15% WoW.',
    recommendedAction: 'Reallocate budget to Tier 1 performing markets.',
    affectedMetric: 'Marketing ROI'
  },
  {
    id: 'alert-capacity-1',
    category: 'Department Bottleneck',
    severity: 'critical',
    title: 'Compliance SLA Risk',
    message: 'Compliance Ops is operating at 92% capacity. SLA breaches imminent.',
    recommendedAction: 'Immediately deploy fractional contractors to handle overflow.',
    affectedMetric: 'Workload Strain'
  },
  {
    id: 'alert-margin-1',
    category: 'Profitability',
    severity: 'info',
    title: 'Margin Optimization Opportunity',
    message: 'Operating margins are healthy but 2 service lines are underperforming targets by 5%.',
    recommendedAction: 'Review Client Profitability report to identify low-margin accounts.',
    affectedMetric: 'Operating Margin'
  }
];
