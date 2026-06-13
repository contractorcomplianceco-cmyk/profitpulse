export const marketingKpis = {
  roas: { value: 4.2, priorValue: 3.8, trend: [3.5, 3.7, 3.8, 4.2] },
  trueRoi: { value: 310, priorValue: 280, trend: [250, 270, 280, 310] },
  cpl: { value: 145, priorValue: 160, trend: [180, 165, 160, 145] },
  costPerClosed: { value: 1250, priorValue: 1400, trend: [1550, 1450, 1400, 1250] },
};

export const funnelData = [
  { stage: 'Leads', count: 586, value: 586, fill: 'hsl(var(--chart-3))' },
  { stage: 'Booked Calls', count: 245, value: 245, fill: 'hsl(var(--chart-4))' },
  { stage: 'Proposals', count: 180, value: 180, fill: 'hsl(var(--primary))' },
  { stage: 'Closed Deals', count: 68, value: 68, fill: 'hsl(var(--success))' },
];

export const channelPerformance = [
  { channel: 'Google Ads', spend: 45000, leads: 320, closed: 42, roas: 4.8, qualityScore: 8.5 },
  { channel: 'Meta Ads', spend: 20000, leads: 150, closed: 14, roas: 3.2, qualityScore: 6.8 },
  { channel: 'LinkedIn Ads', spend: 15000, leads: 85, closed: 10, roas: 4.1, qualityScore: 9.1 },
  { channel: 'Microsoft Ads', spend: 5000, leads: 31, closed: 2, roas: 2.1, qualityScore: 7.0 },
];

export const monthlyRoasTrend = [
  { month: 'Jan', roas: 3.5, target: 4.0 },
  { month: 'Feb', roas: 3.2, target: 4.0 },
  { month: 'Mar', roas: 3.7, target: 4.0 },
  { month: 'Apr', roas: 3.8, target: 4.0 },
  { month: 'May', roas: 4.1, target: 4.0 },
  { month: 'Jun', roas: 4.2, target: 4.0 },
];
