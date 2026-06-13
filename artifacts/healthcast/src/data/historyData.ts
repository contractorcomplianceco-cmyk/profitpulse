export const historyKpis = {
  momGrowth: { value: 5.9, priorValue: 4.2, trend: [3, 4.2, 5.9] },
  qoqGrowth: { value: 14.2, priorValue: 12.1, trend: [10, 12.1, 14.2] },
  yoyGrowth: { value: 42.5, priorValue: 38.4, trend: [35, 38.4, 42.5] },
};

export const monthlyData = Array.from({ length: 24 }).map((_, i) => {
  const baseRev = 700000;
  const growth = Math.pow(1.03, i);
  const revenue = baseRev * growth + (Math.random() * 50000 - 25000);
  const profit = revenue * 0.22 + (Math.random() * 20000 - 10000);
  const cash = 1000000 + (i * 60000) + (Math.random() * 100000 - 50000);
  
  const date = new Date();
  date.setMonth(date.getMonth() - (23 - i));
  
  return {
    month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
    revenue: Math.round(revenue),
    profit: Math.round(profit),
    cash: Math.round(cash),
    margin: Math.round((profit / revenue) * 1000) / 10
  };
});

export const anomalies = [
  { date: 'Nov 23', metric: 'Profit Margin', type: 'Drop', desc: 'Margin fell 4% due to end-of-year software renewals.' },
  { date: 'Mar 24', metric: 'Revenue', type: 'Spike', desc: '18% MoM jump driven by spring licensing rush.' },
  { date: 'Jun 24', metric: 'Cash', type: 'Build', desc: '$300k cash build following aggressive AR collections push.' }
];
