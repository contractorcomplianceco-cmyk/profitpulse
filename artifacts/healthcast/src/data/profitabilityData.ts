export const profitabilityKpis = {
  grossProfit: { value: 856250, priorValue: 769360, trend: [700000, 730000, 769360, 856250] },
  netProfit: { value: 285000, priorValue: 245000, trend: [210000, 230000, 245000, 285000] },
  grossMargin: { value: 68.5, priorValue: 65.2, trend: [62, 64, 65.2, 68.5] },
  operatingMargin: { value: 22.8, priorValue: 20.7, trend: [18, 19.5, 20.7, 22.8] },
};

export const marginByServiceLine = [
  { name: 'Licensing Prep', margin: 75, revenue: 500000 },
  { name: 'Safety Audits', margin: 62, revenue: 450000 },
  { name: 'Ongoing Compliance', margin: 82, revenue: 300000 },
];

export const marginBySource = [
  { name: 'Organic Search', margin: 72 },
  { name: 'Paid Ads', margin: 58 },
  { name: 'Referrals', margin: 85 },
];

export const costImpacts = {
  pricingLeakage: 18500,
  discountImpact: 42000,
  refundImpact: 12500,
  fulfillmentCost: 393750,
  softwareCost: 45000,
  payrollImpact: 420000,
};

export const lowMarginClients = [
  { id: 1, name: 'SteelFrame Builders', margin: 38, reason: 'High Support Volume' },
  { id: 2, name: 'Terra Nova Group', margin: 42, reason: 'Legacy Pricing' },
];
