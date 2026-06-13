import { companyKpis } from '../data/mockData';

export interface Alert {
  id: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  recommendedAction: string;
  affectedMetric: string;
}

export function getActiveAlerts(): Alert[] {
  const alerts: Alert[] = [];

  if (companyKpis.arOutstanding.value > 400000) {
    alerts.push({
      id: 'alert-ar-1',
      category: 'AR Aging',
      severity: 'warning',
      title: 'Elevated A/R Balance',
      message: 'Accounts Receivable has crossed $400k threshold.',
      recommendedAction: 'Initiate aggressive collections on 90+ day accounts.',
      affectedMetric: 'AR Outstanding'
    });
  }

  if (companyKpis.runwayMonths.value < 6) {
    alerts.push({
      id: 'alert-cash-1',
      category: 'Cash Risk',
      severity: 'critical',
      title: 'Low Cash Runway',
      message: 'Cash runway has dropped below 6 months.',
      recommendedAction: 'Review upcoming AP and freeze non-essential hiring.',
      affectedMetric: 'Runway Months'
    });
  }

  alerts.push({
    id: 'alert-margin-1',
    category: 'Profitability',
    severity: 'info',
    title: 'Margin Optimization Opportunity',
    message: 'Operating margins are healthy but 2 service lines are underperforming.',
    recommendedAction: 'Review Client Profitability report to identify low-margin accounts.',
    affectedMetric: 'Operating Margin'
  });

  return alerts;
}