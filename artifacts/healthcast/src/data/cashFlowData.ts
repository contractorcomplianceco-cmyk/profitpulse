export const cashFlowKpis = {
  cashIn: { value: 1350000, priorValue: 1250000, trend: [1100000, 1200000, 1250000, 1350000] },
  cashOut: { value: 950000, priorValue: 920000, trend: [880000, 900000, 920000, 950000] },
  runway: { value: 8.5, priorValue: 7.8, trend: [6.5, 7.0, 7.8, 8.5] },
  payrollCoverage: { value: 5.2, priorValue: 4.8, trend: [4.2, 4.5, 4.8, 5.2] },
  safeToSpend: { value: 450000, priorValue: 380000, trend: [300000, 320000, 380000, 450000] },
};

export const cashProjection = [
  { day: 'Today', balance: 2400000, min: 2300000, max: 2500000 },
  { day: 'Day 7', balance: 2350000, min: 2200000, max: 2450000 },
  { day: 'Day 14', balance: 2480000, min: 2250000, max: 2600000 },
  { day: 'Day 30', balance: 2600000, min: 2300000, max: 2800000 },
  { day: 'Day 60', balance: 2750000, min: 2350000, max: 3100000 },
  { day: 'Day 90', balance: 2900000, min: 2400000, max: 3300000 },
];

export const upcomingBills = [
  { id: 1, vendor: 'Software Licenses (Annual)', amount: 45000, date: '2023-11-15', critical: false },
  { id: 2, vendor: 'Q3 Tax Estimate', amount: 120000, date: '2023-11-18', critical: true },
  { id: 3, vendor: 'Office Lease', amount: 18000, date: '2023-12-01', critical: false },
];

export const expectedPayments = [
  { id: 1, client: 'Apex Construction', amount: 85000, date: '2023-11-12', probability: 'High' },
  { id: 2, client: 'BuildRight Group', amount: 110000, date: '2023-11-20', probability: 'Medium' },
];

export const pinchDates = [
  { date: 'Nov 18', reason: 'Tax payment + Payroll overlap', impact: -280000 },
];
