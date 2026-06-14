export const macroKpis = [
  { id: 'spend', label: 'US Construction Spending', value: '$2.1T', priorValue: 1.9e12, trend: [1.8, 1.9, 2.0, 2.1], prefix: '', source: 'FRED' },
  { id: 'employment', label: 'Contractor Employment', value: '8.2M', priorValue: 8.0e6, trend: [7.8, 8.0, 8.1, 8.2], prefix: '', source: 'BLS' },
  { id: 'rates', label: 'Avg Interest Rate', value: '6.5%', priorValue: 6.8, trend: [7.2, 7.0, 6.8, 6.5], prefix: '', inverseTrend: true, source: 'FRED' },
  { id: 'inflation', label: 'Material Cost Index', value: '142.5', priorValue: 145.0, trend: [148, 146, 145, 142.5], prefix: '', inverseTrend: true, source: 'BLS' },
  { id: 'cpc', label: 'Paid Search CPC (B2B)', value: '$18.40', priorValue: 16.50, trend: [14, 15.5, 16.5, 18.4], prefix: '', inverseTrend: true, source: 'Google Ads' },
  { id: 'cycles', label: 'State Licensing Backlog', value: '45 Days', priorValue: 38, trend: [30, 35, 38, 45], prefix: '', inverseTrend: true, source: 'Internal Data' },
];

export const regionalDemand = [
  { region: 'Sunbelt (TX, FL, AZ)', demand: 'High', growth: 12 },
  { region: 'West Coast (CA, NV)', demand: 'Moderate', growth: 5 },
  { region: 'Northeast (NY, WA)', demand: 'Cooling', growth: -2 },
  { region: 'Midwest (IL, OH)', demand: 'Stable', growth: 3 },
];
