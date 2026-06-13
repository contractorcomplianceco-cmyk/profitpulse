export const pipelineKpis = {
  weightedPipeline: { value: 2150000, priorValue: 1950000, trend: [1800000, 1900000, 1950000, 2150000] },
  expectedCash: { value: 850000, priorValue: 780000, trend: [700000, 750000, 780000, 850000] },
  closeRate: { value: 28.5, priorValue: 26.2, trend: [24, 25.5, 26.2, 28.5] },
  avgSalesCycle: { value: 34, priorValue: 38, trend: [42, 39, 38, 34] },
};

export const pipelineStages = [
  { stage: 'Qualified Leads', count: 145, value: 4350000 },
  { stage: 'Discovery', count: 92, value: 2760000 },
  { stage: 'Proposal Sent', count: 64, value: 1920000 },
  { stage: 'Negotiation', count: 38, value: 1140000 },
  { stage: 'Verbal Commit', count: 18, value: 540000 },
];

export const salespersonPerformance = [
  { name: 'Sarah Jenkins', pipeline: 850000, winRate: 32, cycle: 28, risk: 'Low' },
  { name: 'Marcus Chen', pipeline: 620000, winRate: 28, cycle: 35, risk: 'Medium' },
  { name: 'Elena Rodriguez', pipeline: 480000, winRate: 25, cycle: 41, risk: 'High' },
  { name: 'David Thompson', pipeline: 200000, winRate: 18, cycle: 45, risk: 'Critical' },
];

export const staleDeals = [
  { client: 'Apex Construction', value: 85000, daysInStage: 45, rep: 'Elena R.' },
  { client: 'BuildRight Inc', value: 120000, daysInStage: 38, rep: 'David T.' },
  { client: 'Summit Builders', value: 65000, daysInStage: 31, rep: 'Marcus C.' },
];
