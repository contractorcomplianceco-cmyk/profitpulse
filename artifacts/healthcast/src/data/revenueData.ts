export interface RevenueTrend { month: string; recurring: number; oneTime: number; }
export interface ServiceLine { name: string; value: number; share: number; }

export const revenueKpis = {
  totalRevenue: { value: 1250000, priorValue: 1180000, trend: [1100000, 1150000, 1180000, 1250000] },
  recurringRevenue: { value: 850000, priorValue: 810000, trend: [780000, 795000, 810000, 850000] },
  recurringCoverage: { value: 68, priorValue: 68.6, trend: [70.9, 69.1, 68.6, 68] },
  renewalsValue: { value: 145000, priorValue: 130000, trend: [120000, 125000, 130000, 145000] }
};

export const revenueTrendData: RevenueTrend[] = [
  { month: 'Jan', recurring: 720000, oneTime: 230000 },
  { month: 'Feb', recurring: 750000, oneTime: 300000 },
  { month: 'Mar', recurring: 780000, oneTime: 320000 },
  { month: 'Apr', recurring: 795000, oneTime: 355000 },
  { month: 'May', recurring: 810000, oneTime: 370000 },
  { month: 'Jun', recurring: 850000, oneTime: 400000 },
];

export const revenueByService: ServiceLine[] = [
  { name: 'Licensing Mgmt', value: 520000, share: 41.6 },
  { name: 'Compliance Audits', value: 310000, share: 24.8 },
  { name: 'Education/Training', value: 180000, share: 14.4 },
  { name: 'Bonding Services', value: 140000, share: 11.2 },
  { name: 'Software Subs', value: 100000, share: 8.0 }
];

export const revenueByState = [
  { state: 'California', value: 380000 },
  { state: 'Texas', value: 290000 },
  { state: 'Florida', value: 210000 },
  { state: 'New York', value: 180000 },
  { state: 'Other', value: 190000 }
];
