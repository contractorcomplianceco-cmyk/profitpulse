export interface ReportMeta {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  category: 'financial' | 'operational' | 'strategic';
}

export const reports: ReportMeta[] = [
  { id: 'cfo-weekly', name: 'CFO Weekly Report', description: 'Comprehensive weekly digest of all primary financial KPIs, cash flow, and immediate risks.', lastGenerated: 'Today, 8:00 AM', category: 'financial' },
  { id: 'monthly-health', name: 'Monthly Financial Health', description: 'Deep dive into P&L, balance sheet, and margin analysis for the previous month.', lastGenerated: 'Oct 1, 9:15 AM', category: 'financial' },
  { id: 'marketing-roi', name: 'Marketing ROI Report', description: 'Channel-by-channel breakdown of spend, CPL, CAC, and LTV ratio.', lastGenerated: 'Yesterday, 4:30 PM', category: 'operational' },
  { id: 'sales-pipeline', name: 'Sales Pipeline to Cash', description: 'Conversion velocity from lead to closed won, and time-to-first-cash metrics.', lastGenerated: 'Today, 7:45 AM', category: 'operational' },
  { id: 'ar-collection', name: 'AR Collection Report', description: 'Aging buckets, highest at-risk accounts, and DSO trends.', lastGenerated: '2 days ago', category: 'financial' },
  { id: 'service-profitability', name: 'Service Profitability', description: 'Gross and operating margin broken down by distinct compliance service lines.', lastGenerated: 'Oct 3, 11:20 AM', category: 'strategic' },
  { id: 'dept-performance', name: 'Department Performance', description: 'Budget vs Actuals for Marketing, Sales, Operations, and G&A.', lastGenerated: 'Oct 1, 9:30 AM', category: 'operational' },
  { id: 'client-profitability', name: 'Client Profitability', description: 'Analysis of top and bottom 20% of clients by lifetime margin.', lastGenerated: 'Sep 28, 2:10 PM', category: 'strategic' },
  { id: 'futurecast', name: 'Futurecast Report', description: '12-month rolling projection of cash, revenue, and payroll based on expected baseline.', lastGenerated: 'Today, 10:00 AM', category: 'strategic' },
  { id: 'scenario-comp', name: 'Scenario Comparison', description: 'Side-by-side output of all saved financial planning scenarios.', lastGenerated: '3 days ago', category: 'strategic' },
  { id: 'board-summary', name: 'Board/Investor Summary', description: 'High-level executive summary tailored for quarterly board presentations.', lastGenerated: 'Oct 1, 8:00 AM', category: 'strategic' }
];

export const reportsChartData = [
  { month: 'May', views: 45, exports: 12 },
  { month: 'Jun', views: 52, exports: 15 },
  { month: 'Jul', views: 48, exports: 14 },
  { month: 'Aug', views: 61, exports: 18 },
  { month: 'Sep', views: 59, exports: 22 },
  { month: 'Oct', views: 68, exports: 25 },
];
