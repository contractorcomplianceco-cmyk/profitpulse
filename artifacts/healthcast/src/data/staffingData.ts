export interface KpiData {
  value: number;
  priorValue: number;
  trend: number[];
}

export const staffingKpis = {
  payrollToRevenue: { value: 34.5, priorValue: 32.1, trend: [30, 31.5, 32.1, 34.5] },
  payrollToCollected: { value: 37.8, priorValue: 36.2, trend: [35, 36.5, 36.2, 37.8] },
  revenuePerEmployee: { value: 25000, priorValue: 24200, trend: [23000, 24000, 24200, 25000] },
  profitPerEmployee: { value: 5700, priorValue: 5100, trend: [4500, 4800, 5100, 5700] },
  hiringReadinessScore: { value: 72, priorValue: 78, trend: [85, 80, 78, 72] },
};

export const payrollTrend = [
  { month: 'Jan', payroll: 380000, contractor: 45000 },
  { month: 'Feb', payroll: 385000, contractor: 48000 },
  { month: 'Mar', payroll: 390000, contractor: 52000 },
  { month: 'Apr', payroll: 400000, contractor: 49000 },
  { month: 'May', payroll: 410000, contractor: 55000 },
  { month: 'Jun', payroll: 420000, contractor: 60000 },
];

export const departmentCosts = [
  { name: 'Compliance Ops', cost: 180000, headcount: 22 },
  { name: 'Sales & Marketing', cost: 110000, headcount: 12 },
  { name: 'Engineering/IT', cost: 75000, headcount: 6 },
  { name: 'G&A', cost: 55000, headcount: 10 },
];

export const capacityData = {
  safeToHireThreshold: 450000,
  currentPayroll: 420000,
  remainingCapacity: 30000,
};

export const workloadStrain = [
  { department: 'Compliance Ops', strainPct: 92, status: 'Critical' },
  { department: 'Sales & Marketing', strainPct: 75, status: 'Healthy' },
  { department: 'Engineering/IT', strainPct: 88, status: 'Warning' },
  { department: 'G&A', strainPct: 65, status: 'Healthy' },
];

export const prospectiveHires = [
  { role: 'Senior Compliance Specialist', salary: 85000, breakEvenMonths: 3.5, impact: 'High' },
  { role: 'Account Executive', salary: 75000, breakEvenMonths: 2.0, impact: 'High' },
  { role: 'Data Analyst', salary: 95000, breakEvenMonths: 6.0, impact: 'Medium' },
];
