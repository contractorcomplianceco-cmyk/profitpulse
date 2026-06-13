export const departmentKpis = {
  totalCost: { value: 420000, priorValue: 410000, trend: [390000, 400000, 410000, 420000] },
  revenuePerEmployee: { value: 25000, priorValue: 23600, trend: [22000, 23000, 23600, 25000] },
  avgProductivity: { value: 88, priorValue: 85, trend: [82, 84, 85, 88] },
  criticalBottlenecks: { value: 2, priorValue: 3, trend: [4, 3, 3, 2] },
};

export const departments = [
  {
    name: 'Sales',
    cost: 110000,
    output: '68 Closed Deals',
    revenueInfluence: 1250000,
    bottleneck: 'Lead Quality',
    riskLevel: 'info',
    productivityScore: 92,
    recommendedAction: 'Increase commission tier for high-margin packages'
  },
  {
    name: 'Marketing',
    cost: 85000,
    output: '586 Leads',
    revenueInfluence: 950000,
    bottleneck: 'Creative Fatigue',
    riskLevel: 'warning',
    productivityScore: 84,
    recommendedAction: 'Refresh Meta ad creatives'
  },
  {
    name: 'Compliance Ops',
    cost: 95000,
    output: '412 Audits',
    revenueInfluence: 650000,
    bottleneck: 'State Portal Delays',
    riskLevel: 'critical',
    productivityScore: 76,
    recommendedAction: 'Hire 2 temp processors for CA backlog'
  },
  {
    name: 'Licensing Ops',
    cost: 65000,
    output: '185 Approvals',
    revenueInfluence: 520000,
    bottleneck: 'None',
    riskLevel: 'info',
    productivityScore: 95,
    recommendedAction: 'Document SOPs for franchise expansion'
  },
  {
    name: 'Education/Training',
    cost: 25000,
    output: '1,250 Certs',
    revenueInfluence: 180000,
    bottleneck: 'LMS Platform Limits',
    riskLevel: 'warning',
    productivityScore: 88,
    recommendedAction: 'Migrate to Enterprise LMS'
  },
  {
    name: 'Customer Support',
    cost: 40000,
    output: '2.5hr Avg Resolution',
    revenueInfluence: 450000,
    bottleneck: 'Documentation Gaps',
    riskLevel: 'info',
    productivityScore: 91,
    recommendedAction: 'Implement AI knowledge base'
  }
];

export const deptCostVsRev = [
  { name: 'Sales', cost: 110000, revenue: 1250000 },
  { name: 'Marketing', cost: 85000, revenue: 950000 },
  { name: 'Compliance', cost: 95000, revenue: 650000 },
  { name: 'Licensing', cost: 65000, revenue: 520000 },
  { name: 'Support', cost: 40000, revenue: 450000 },
];
