export const topKpis = [
  { label: "Monthly Revenue", value: "$1,248,850", trend: "+18.6%", trendUp: true, vs: "vs Apr 2025", sparkline: [40, 50, 45, 60, 55, 70, 85] },
  { label: "Collected Revenue", value: "$1,075,430", trend: "+16.3%", trendUp: true, vs: "vs Apr 2025", sparkline: [35, 45, 40, 55, 50, 60, 75] },
  { label: "Cash on Hand", value: "$842,750", trend: "+8.7%", trendUp: true, vs: "vs Apr 2025", sparkline: [80, 82, 81, 85, 84, 88, 90] },
  { label: "Net Profit", value: "$236,540", trend: "+22.4%", trendUp: true, vs: "vs Apr 2025", sparkline: [10, 15, 12, 20, 18, 25, 30] },
  { label: "Gross Margin", value: "68.7%", trend: "+3.2 pts", trendUp: true, vs: "vs Apr 2025", sparkline: [60, 62, 61, 64, 65, 67, 69] },
  { label: "Runway", value: "4.7 Months", trend: "+0.8 mo", trendUp: true, vs: "vs Apr 2025", sparkline: [3.5, 3.8, 3.7, 4.0, 4.2, 4.5, 4.7] }
];

export const executiveInsights = [
  { text: "Cash is healthy, but AR is aging too fast — AR over 30 days increased 18% vs last month.", status: "warning" },
  { text: "Marketing spend increased 22%, but paid-client conversion only increased 6%.", status: "warning" },
  { text: "Revenue per employee is below target — Current $18,734 vs Target $20,000+.", status: "risk" },
  { text: "Recurring revenue covers 41% of fixed overhead — target should be 100%+.", status: "risk" }
];

export const financialKpis = [
  { label: "AR Outstanding", value: "$487,230", status: "risk" },
  { label: "AP Upcoming", value: "$186,340", status: "risk" },
  { label: "Payroll Burden", value: "32.4%", status: "good" },
  { label: "Marketing Spend", value: "$87,540", status: "risk-up" },
  { label: "Marketing ROI", value: "3.21x", status: "good", sub: "(Collected Profit)" },
  { label: "Revenue/Employee", value: "$18,734", status: "risk" },
  { label: "Recurring Rev. Coverage", value: "41%", status: "risk" },
  { label: "Break-even Revenue", value: "$842,000", status: "neutral", sub: "(Monthly)" }
];

export const revenueBreakdown = [
  { name: "Licensing Services", value: 475600, percentage: 38, fill: "hsl(var(--primary))" },
  { name: "Compliance Monitoring", value: 274500, percentage: 22, fill: "hsl(160 84% 39%)" },
  { name: "Business Compliance", value: 199810, percentage: 16, fill: "hsl(210 16% 82%)" },
  { name: "Qualifications", value: 124350, percentage: 10, fill: "hsl(38 92% 50%)" },
  { name: "Education/Training", value: 87640, percentage: 7, fill: "hsl(346 84% 61%)" },
  { name: "Other Services", value: 87910, percentage: 7, fill: "hsl(217 19% 27%)" }
];

export const pipelineData = [
  { stage: "New Leads", count: 1248, fill: "hsl(var(--primary))" },
  { stage: "Qualified Leads", count: 642, fill: "hsl(var(--primary)/0.8)" },
  { stage: "Booked Calls", count: 312, fill: "hsl(var(--primary)/0.6)" },
  { stage: "Proposals Sent", count: 162, fill: "hsl(var(--primary)/0.4)" },
  { stage: "Deals Won", count: 78, fill: "hsl(var(--success))" }
];

export const profitMarginData = [
  { service: "Compliance Monitoring", margin: 72.4 },
  { service: "Licensing Services", margin: 68.1 },
  { service: "Business Compliance", margin: 61.7 },
  { service: "Qualifications", margin: 55.2 },
  { service: "Education/Training", margin: 48.3 },
  { service: "Other Services", margin: 32.6 }
];

export const arAgingData = [
  { name: "Current 0-15d", value: 231450, fill: "hsl(var(--success))" },
  { name: "16-30d", value: 98540, fill: "hsl(var(--primary))" },
  { name: "31-60d", value: 82230, fill: "hsl(var(--warning))" },
  { name: "61-90d", value: 42780, fill: "hsl(var(--destructive)/0.7)" },
  { name: "90+", value: 32230, fill: "hsl(var(--destructive))" }
];

export const futurecastData = [
  { month: "May", revenue: 1.25, cash: 0.84, profit: 0.24 },
  { month: "Jun", revenue: 1.35, cash: 0.92, profit: 0.28 },
  { month: "Jul", revenue: 1.50, cash: 1.05, profit: 0.35 },
  { month: "Aug", revenue: 2.10, cash: 1.15, profit: 0.50 },
  { month: "Sep", revenue: 3.00, cash: 1.20, profit: 0.70 },
  { month: "Oct", revenue: 4.21, cash: 1.32, profit: 0.84 }
];

export const marketImpact = [
  { label: "Construction Spending YOY", value: "+6.2%", up: true, risk: false },
  { label: "Contractor Employment YOY", value: "+3.8%", up: true, risk: false },
  { label: "Interest Rate (Prime)", value: "7.75%", up: true, risk: true },
  { label: "Inflation (CPI)", value: "2.3%", up: true, risk: true },
  { label: "Small Business Optimism", value: "91.3", up: true, risk: false },
  { label: "Search CPC Trend (30d)", value: "+12%", up: true, risk: true }
];

export const cashFlowData = [
  { date: "May 1", balance: 800, in: 120, out: 90 },
  { date: "May 8", balance: 830, in: 150, out: 100 },
  { date: "May 15", balance: 880, in: 180, out: 110 },
  { date: "May 22", balance: 850, in: 90, out: 120 },
  { date: "May 29", balance: 820, in: 100, out: 130 },
  { date: "Jun 5", balance: 842, in: 160, out: 138 }
];

export const alertsData = [
  { icon: "AlertTriangle", count: 3, title: "Cash Flow Alerts", desc: "High risk cash pinch in 17 days", type: "warning" },
  { icon: "Clock", count: 4, title: "AR Aging Alerts", desc: "$127K collectible this week", type: "info" },
  { icon: "TrendingDown", count: 2, title: "Marketing Waste Alerts", desc: "$24K spent with low return", type: "risk" },
  { icon: "Inbox", count: 2, title: "Pipeline Alerts", desc: "$312K in stale opportunities", type: "warning" },
  { icon: "Users", count: 1, title: "Payroll Risk Alert", desc: "Payroll is 32.4% of revenue", type: "risk" },
  { icon: "ShieldAlert", count: 2, title: "Client Risk Alerts", desc: "2 clients with high payment risk", type: "risk" }
];

export const integrationsData = [
  { name: "Zoho Books", time: "5 min ago", icon: "BookOpen" },
  { name: "Zoho CRM", time: "3 min ago", icon: "Users" },
  { name: "Zoho Analytics", time: "8 min ago", icon: "BarChart2" },
  { name: "Google Ads", time: "15 min ago", icon: "Target" },
  { name: "Google Analytics 4", time: "15 min ago", icon: "Activity" },
  { name: "Search Console", time: "1 day ago", icon: "Search" },
  { name: "Meta Ads", time: "3 hrs ago", icon: "Facebook" }
];
