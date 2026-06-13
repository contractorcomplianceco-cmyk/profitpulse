export const arApKpis = {
  totalAr: { value: 420000, priorValue: 480000, trend: [510000, 490000, 480000, 420000] },
  totalAp: { value: 185000, priorValue: 175000, trend: [160000, 170000, 175000, 185000] },
  overdueAmount: { value: 150000, priorValue: 165000, trend: [180000, 175000, 165000, 150000] },
  collectionRate: { value: 92.5, priorValue: 89.2, trend: [85, 87, 89.2, 92.5] },
};

export const arAging = [
  { bucket: '0-30 Days', amount: 270000 },
  { bucket: '31-60 Days', amount: 80000 },
  { bucket: '61-90 Days', amount: 45000 },
  { bucket: '90+ Days', amount: 25000 },
];

export const clientsAtRisk = [
  { id: 1, name: 'Foundation First', amount: 45000, daysOverdue: 95, status: 'Failed Payment' },
  { id: 2, name: 'CityScapes', amount: 28000, daysOverdue: 65, status: 'Promise to Pay' },
  { id: 3, name: 'Pioneer Works', amount: 15000, daysOverdue: 45, status: 'Follow-up Needed' },
];

export const vendorBills = [
  { id: 1, vendor: 'Legal Counsel', amount: 15000, dueDate: '2023-11-10' },
  { id: 2, vendor: 'Cloud Services', amount: 8500, dueDate: '2023-11-15' },
  { id: 3, vendor: 'Marketing Agency', amount: 25000, dueDate: '2023-11-20' },
];
