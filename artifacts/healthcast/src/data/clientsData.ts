export const clientKpis = {
  totalLtv: { value: 12500000, priorValue: 11800000, trend: [10500000, 11000000, 11800000, 12500000] },
  avgMargin: { value: 68.5, priorValue: 67.2, trend: [65, 66, 67.2, 68.5] },
  atRiskCount: { value: 3, priorValue: 5, trend: [6, 4, 5, 3] },
  upsellValue: { value: 850000, priorValue: 720000, trend: [600000, 650000, 720000, 850000] },
};

export const clientsList = [
  { id: 1, name: 'Apex Construction', revenue: 250000, collected: 250000, openInvoices: 0, serviceCost: 45000, margin: 82, supportLoad: 'Low', refundRisk: 'Low', renewalLikelihood: 95, upsellOpportunity: 50000, ltv: 850000, source: 'Referral', status: 'VIP' },
  { id: 2, name: 'BuildRight Group', revenue: 180000, collected: 120000, openInvoices: 60000, serviceCost: 65000, margin: 64, supportLoad: 'High', refundRisk: 'Medium', renewalLikelihood: 75, upsellOpportunity: 25000, ltv: 450000, source: 'Paid Ads', status: 'Standard' },
  { id: 3, name: 'SteelFrame Builders', revenue: 120000, collected: 120000, openInvoices: 0, serviceCost: 75000, margin: 38, supportLoad: 'High', refundRisk: 'High', renewalLikelihood: 40, upsellOpportunity: 0, ltv: 280000, source: 'Organic', status: 'At Risk' },
  { id: 4, name: 'Terra Nova Group', revenue: 95000, collected: 80000, openInvoices: 15000, serviceCost: 55000, margin: 42, supportLoad: 'Medium', refundRisk: 'Low', renewalLikelihood: 85, upsellOpportunity: 120000, ltv: 320000, source: 'Event', status: 'Standard' },
  { id: 5, name: 'CityScapes', revenue: 310000, collected: 282000, openInvoices: 28000, serviceCost: 70000, margin: 77, supportLoad: 'Low', refundRisk: 'Low', renewalLikelihood: 98, upsellOpportunity: 150000, ltv: 1200000, source: 'Referral', status: 'VIP' },
  { id: 6, name: 'Foundation First', revenue: 85000, collected: 40000, openInvoices: 45000, serviceCost: 20000, margin: 76, supportLoad: 'Medium', refundRisk: 'Medium', renewalLikelihood: 60, upsellOpportunity: 10000, ltv: 150000, source: 'Outbound', status: 'Standard' },
  { id: 7, name: 'Pioneer Works', revenue: 150000, collected: 135000, openInvoices: 15000, serviceCost: 40000, margin: 73, supportLoad: 'Low', refundRisk: 'Low', renewalLikelihood: 90, upsellOpportunity: 75000, ltv: 600000, source: 'Organic', status: 'Standard' },
  { id: 8, name: 'HighRise Co', revenue: 420000, collected: 420000, openInvoices: 0, serviceCost: 80000, margin: 80, supportLoad: 'Medium', refundRisk: 'Low', renewalLikelihood: 99, upsellOpportunity: 200000, ltv: 2500000, source: 'Referral', status: 'VIP' }
];
