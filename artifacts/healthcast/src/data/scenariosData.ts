export interface ScenarioMetrics {
  id: string;
  name: string;
  description: string;
  revenue: number;
  cash: number;
  profit: number;
  payroll: number;
  ar: number;
  marketingRoi: number;
  runway: number;
  breakEven: number;
  probability: number; // 0-100
  trend: number[];
}

export const scenarios: ScenarioMetrics[] = [
  { id: 'expected', name: 'Expected Base', description: 'Current trajectory with no major changes', revenue: 1250000, cash: 2400000, profit: 285000, payroll: 420000, ar: 420000, marketingRoi: 420, runway: 8.5, breakEven: 850000, probability: 75, trend: [1180000, 1200000, 1220000, 1250000] },
  { id: 'conservative', name: 'Conservative', description: 'Assumes 10% drop in close rates', revenue: 1125000, cash: 2500000, profit: 220000, payroll: 410000, ar: 380000, marketingRoi: 380, runway: 9.0, breakEven: 820000, probability: 60, trend: [1180000, 1160000, 1140000, 1125000] },
  { id: 'aggressive', name: 'Aggressive', description: 'Assumes 15% increase in lead flow', revenue: 1450000, cash: 2200000, profit: 340000, payroll: 450000, ar: 480000, marketingRoi: 450, runway: 7.5, breakEven: 900000, probability: 40, trend: [1180000, 1250000, 1350000, 1450000] },
  { id: 'worst-case', name: 'Worst Case', description: 'Recession impact, slow collections', revenue: 950000, cash: 1800000, profit: 50000, payroll: 420000, ar: 600000, marketingRoi: 250, runway: 4.5, breakEven: 850000, probability: 15, trend: [1180000, 1100000, 1000000, 950000] },
  { id: 'cash-preservation', name: 'Cash Preservation', description: 'Hiring freeze, strict collections', revenue: 1150000, cash: 2800000, profit: 250000, payroll: 380000, ar: 300000, marketingRoi: 400, runway: 11.0, breakEven: 780000, probability: 80, trend: [1180000, 1170000, 1160000, 1150000] },
  { id: 'growth-push', name: 'Growth Push', description: 'Max ad spend, aggressive hiring', revenue: 1600000, cash: 1500000, profit: 180000, payroll: 550000, ar: 550000, marketingRoi: 300, runway: 4.0, breakEven: 1050000, probability: 35, trend: [1180000, 1300000, 1450000, 1600000] },
  { id: 'hiring-expansion', name: 'Hiring Expansion', description: '+5 Sales, +3 Compliance', revenue: 1350000, cash: 2100000, profit: 240000, payroll: 480000, ar: 450000, marketingRoi: 410, runway: 6.5, breakEven: 950000, probability: 65, trend: [1180000, 1220000, 1280000, 1350000] },
  { id: 'marketing-expansion', name: 'Marketing Expansion', description: 'Double ad budget across channels', revenue: 1400000, cash: 2000000, profit: 220000, payroll: 420000, ar: 460000, marketingRoi: 280, runway: 6.0, breakEven: 920000, probability: 55, trend: [1180000, 1240000, 1320000, 1400000] },
  { id: 'price-increase', name: 'Price Increase (+15%)', description: 'Across the board fee increase', revenue: 1380000, cash: 2600000, profit: 390000, payroll: 420000, ar: 440000, marketingRoi: 460, runway: 9.5, breakEven: 850000, probability: 50, trend: [1180000, 1200000, 1280000, 1380000] },
  { id: 'recurring-revenue', name: 'Recurring Revenue Shift', description: 'Push retainers over one-offs', revenue: 1200000, cash: 2300000, profit: 260000, payroll: 430000, ar: 250000, marketingRoi: 400, runway: 10.0, breakEven: 860000, probability: 70, trend: [1180000, 1180000, 1190000, 1200000] }
];

export const scenarioChartData = [
  { month: 'Month 1', expected: 1250000, conservative: 1125000, aggressive: 1450000, 'worst-case': 950000 },
  { month: 'Month 2', expected: 1260000, conservative: 1110000, aggressive: 1480000, 'worst-case': 900000 },
  { month: 'Month 3', expected: 1280000, conservative: 1100000, aggressive: 1520000, 'worst-case': 850000 },
  { month: 'Month 4', expected: 1300000, conservative: 1080000, aggressive: 1580000, 'worst-case': 820000 },
  { month: 'Month 5', expected: 1310000, conservative: 1070000, aggressive: 1650000, 'worst-case': 780000 },
  { month: 'Month 6', expected: 1330000, conservative: 1050000, aggressive: 1720000, 'worst-case': 750000 },
  { month: 'Month 7', expected: 1350000, conservative: 1040000, aggressive: 1800000, 'worst-case': 700000 },
  { month: 'Month 8', expected: 1370000, conservative: 1020000, aggressive: 1880000, 'worst-case': 680000 },
  { month: 'Month 9', expected: 1400000, conservative: 1000000, aggressive: 1950000, 'worst-case': 650000 },
  { month: 'Month 10', expected: 1420000, conservative: 980000, aggressive: 2020000, 'worst-case': 620000 },
  { month: 'Month 11', expected: 1450000, conservative: 960000, aggressive: 2100000, 'worst-case': 600000 },
  { month: 'Month 12', expected: 1480000, conservative: 950000, aggressive: 2200000, 'worst-case': 580000 },
];
