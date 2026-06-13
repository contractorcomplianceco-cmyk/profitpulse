export interface KpiData {
  value: number;
  priorValue: number;
  trend: number[];
}

export const companyKpis = {
  monthlyRevenue: { value: 1250000, priorValue: 1180000, trend: [1100000, 1150000, 1180000, 1250000] },
  collectedRevenue: { value: 1150000, priorValue: 1050000, trend: [1000000, 1080000, 1050000, 1150000] },
  cashOnHand: { value: 2400000, priorValue: 2100000, trend: [1800000, 1950000, 2100000, 2400000] },
  netProfit: { value: 285000, priorValue: 245000, trend: [210000, 230000, 245000, 285000] },
  grossMargin: { value: 68.5, priorValue: 65.2, trend: [62, 64, 65.2, 68.5] },
  operatingMargin: { value: 22.8, priorValue: 20.7, trend: [18, 19.5, 20.7, 22.8] },
  arOutstanding: { value: 420000, priorValue: 480000, trend: [510000, 490000, 480000, 420000] },
  apUpcoming: { value: 185000, priorValue: 175000, trend: [160000, 170000, 175000, 185000] },
  payrollBurden: { value: 420000, priorValue: 410000, trend: [390000, 400000, 410000, 420000] },
  marketingSpend: { value: 85000, priorValue: 80000, trend: [75000, 78000, 80000, 85000] },
  marketingRoi: { value: 420, priorValue: 380, trend: [350, 370, 380, 420] },
  revenuePerEmployee: { value: 25000, priorValue: 23600, trend: [22000, 23000, 23600, 25000] },
  runwayMonths: { value: 8.5, priorValue: 7.2, trend: [6.5, 6.8, 7.2, 8.5] },
  breakEvenRevenue: { value: 850000, priorValue: 840000, trend: [820000, 835000, 840000, 850000] },
  financialHealthScore: { value: 92, priorValue: 88, trend: [82, 85, 88, 92] }
};

export const arAp = {
  agingBuckets: [
    { label: "0-30 Days", value: 150000 },
    { label: "31-60 Days", value: 120000 },
    { label: "61-90 Days", value: 80000 },
    { label: "90+ Days", value: 70000 }
  ]
};

export const historical = {
  revenueTrend: [
    { month: 'Jan', revenue: 950000, collected: 900000, profit: 150000 },
    { month: 'Feb', revenue: 1050000, collected: 980000, profit: 180000 },
    { month: 'Mar', revenue: 1100000, collected: 1000000, profit: 210000 },
    { month: 'Apr', revenue: 1150000, collected: 1080000, profit: 230000 },
    { month: 'May', revenue: 1180000, collected: 1050000, profit: 245000 },
    { month: 'Jun', revenue: 1250000, collected: 1150000, profit: 285000 },
  ]
}