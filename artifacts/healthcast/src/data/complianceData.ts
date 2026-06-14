export interface ComplianceScore {
  overall: number;
  prior: number;
  target: number;
  trend: number[];
  rating: string;
}

export interface ComplianceKpi {
  label: string;
  value: string;
  sub: string;
  status: "good" | "warning" | "risk";
}

export interface ScoreCategory {
  name: string;
  score: number;
  weight: number;
}

export interface RenewalItem {
  id: string;
  name: string;
  authority: string;
  jurisdiction: string;
  dueDate: string;
  daysLeft: number;
  status: "on-track" | "due-soon" | "overdue";
  owner: string;
}

export interface AuditItem {
  id: string;
  label: string;
  category: string;
  complete: boolean;
  owner: string;
}

export interface FilingDeadline {
  id: string;
  name: string;
  type: string;
  dueDate: string;
  daysLeft: number;
  status: "on-track" | "due-soon" | "overdue";
}

export interface RiskRegisterItem {
  id: string;
  title: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  likelihood: string;
  impact: string;
  recommendedAction: string;
  owner: string;
}

export const complianceScore: ComplianceScore = {
  overall: 87,
  prior: 82,
  target: 92,
  trend: [78, 80, 79, 83, 82, 84, 85, 87],
  rating: "Strong",
};

export const complianceKpis: ComplianceKpi[] = [
  { label: "Active Licenses", value: "42 / 45", sub: "3 pending renewal", status: "warning" },
  { label: "Audit Readiness", value: "91%", sub: "11 of 12 controls", status: "good" },
  { label: "Open Risks", value: "7", sub: "2 critical", status: "risk" },
  { label: "Filings On Time", value: "98.4%", sub: "trailing 12 mo", status: "good" },
  { label: "Days to Next Filing", value: "9", sub: "Q2 941 deposit", status: "warning" },
  { label: "Avg Remediation", value: "4.2 days", sub: "vs 6.0 target", status: "good" },
];

export const scoreCategories: ScoreCategory[] = [
  { name: "Licensing & Registration", score: 88, weight: 25 },
  { name: "Tax & Filings", score: 94, weight: 25 },
  { name: "Internal Controls", score: 85, weight: 20 },
  { name: "Data & Privacy", score: 79, weight: 15 },
  { name: "Contracts & Bonding", score: 90, weight: 15 },
];

export const scoreDonut = [
  { name: "Compliant", value: 87, fill: "hsl(var(--success))" },
  { name: "At Risk", value: 9, fill: "hsl(var(--warning))" },
  { name: "Non-Compliant", value: 4, fill: "hsl(var(--destructive))" },
];

export const upcomingRenewals: RenewalItem[] = [
  {
    id: "ren-1",
    name: "State Contractor License (Class A)",
    authority: "State Licensing Board",
    jurisdiction: "California",
    dueDate: "May 18, 2025",
    daysLeft: 12,
    status: "due-soon",
    owner: "L. Park",
  },
  {
    id: "ren-2",
    name: "Surety Bond ($500K)",
    authority: "Western Surety Co.",
    jurisdiction: "Multi-State",
    dueDate: "Jun 02, 2025",
    daysLeft: 27,
    status: "due-soon",
    owner: "D. Reyes",
  },
  {
    id: "ren-3",
    name: "Business Registration Renewal",
    authority: "Secretary of State",
    jurisdiction: "Nevada",
    dueDate: "Jul 15, 2025",
    daysLeft: 70,
    status: "on-track",
    owner: "M. Chen",
  },
  {
    id: "ren-4",
    name: "Workers' Comp Certification",
    authority: "Dept. of Labor",
    jurisdiction: "California",
    dueDate: "May 05, 2025",
    daysLeft: -1,
    status: "overdue",
    owner: "S. Patel",
  },
  {
    id: "ren-5",
    name: "Professional Liability Coverage",
    authority: "Hartford Insurance",
    jurisdiction: "Multi-State",
    dueDate: "Aug 21, 2025",
    daysLeft: 107,
    status: "on-track",
    owner: "D. Reyes",
  },
];

export const auditChecklist: AuditItem[] = [
  { id: "aud-1", label: "Trial balance reconciled to GL", category: "Financials", complete: true, owner: "Controller" },
  { id: "aud-2", label: "Bank statements reconciled (12 mo)", category: "Financials", complete: true, owner: "Controller" },
  { id: "aud-3", label: "Revenue recognition policy documented", category: "Controls", complete: true, owner: "CFO" },
  { id: "aud-4", label: "Segregation of duties matrix current", category: "Controls", complete: true, owner: "Controller" },
  { id: "aud-5", label: "Fixed asset register tied to ledger", category: "Financials", complete: true, owner: "Sr. Accountant" },
  { id: "aud-6", label: "AP aging & accruals reviewed", category: "Financials", complete: true, owner: "AP Lead" },
  { id: "aud-7", label: "Payroll tax filings on file", category: "Tax", complete: true, owner: "Payroll" },
  { id: "aud-8", label: "Related-party transactions disclosed", category: "Controls", complete: true, owner: "CFO" },
  { id: "aud-9", label: "Inventory count documentation", category: "Operations", complete: true, owner: "Ops Lead" },
  { id: "aud-10", label: "Contract & bonding files complete", category: "Legal", complete: true, owner: "Legal" },
  { id: "aud-11", label: "IT access controls reviewed", category: "Controls", complete: true, owner: "IT" },
  { id: "aud-12", label: "Data retention policy attestation", category: "Privacy", complete: false, owner: "Compliance" },
];

export const filingDeadlines: FilingDeadline[] = [
  { id: "fil-1", name: "Form 941 Federal Deposit", type: "Payroll Tax", dueDate: "May 15, 2025", daysLeft: 9, status: "due-soon" },
  { id: "fil-2", name: "State Sales & Use Tax", type: "Sales Tax", dueDate: "May 20, 2025", daysLeft: 14, status: "on-track" },
  { id: "fil-3", name: "Q2 Estimated Income Tax", type: "Income Tax", dueDate: "Jun 16, 2025", daysLeft: 41, status: "on-track" },
  { id: "fil-4", name: "Annual Report / Franchise Tax", type: "Corporate", dueDate: "May 01, 2025", daysLeft: -5, status: "overdue" },
  { id: "fil-5", name: "1099-NEC Contractor Recap", type: "Information", dueDate: "Jul 31, 2025", daysLeft: 86, status: "on-track" },
];

export const riskRegister: RiskRegisterItem[] = [
  {
    id: "risk-1",
    title: "Overdue Workers' Comp Certification",
    category: "Licensing",
    severity: "critical",
    likelihood: "High",
    impact: "Work stoppage on 4 active jobsites; potential fines.",
    recommendedAction: "Expedite DOL filing today; engage broker for same-day binder.",
    owner: "S. Patel",
  },
  {
    id: "risk-2",
    title: "Annual Report Past Due",
    category: "Corporate",
    severity: "critical",
    likelihood: "High",
    impact: "Loss of good standing; late penalties accruing daily.",
    recommendedAction: "File franchise tax report and remit penalty before grace period ends.",
    owner: "M. Chen",
  },
  {
    id: "risk-3",
    title: "Data Retention Policy Unattested",
    category: "Data & Privacy",
    severity: "high",
    likelihood: "Medium",
    impact: "Gap in audit readiness; privacy exposure on client records.",
    recommendedAction: "Complete policy attestation and document retention schedule.",
    owner: "Compliance",
  },
  {
    id: "risk-4",
    title: "Surety Bond Capacity Nearing Limit",
    category: "Bonding",
    severity: "high",
    likelihood: "Medium",
    impact: "Could cap bid capacity on $2.1M pipeline of large projects.",
    recommendedAction: "Request capacity increase from surety; provide updated financials.",
    owner: "D. Reyes",
  },
  {
    id: "risk-5",
    title: "Subcontractor License Verification Lag",
    category: "Vendor Risk",
    severity: "medium",
    likelihood: "Medium",
    impact: "Unverified subs create liability pass-through on 6 jobs.",
    recommendedAction: "Run automated license check across active subcontractor roster.",
    owner: "Ops Lead",
  },
  {
    id: "risk-6",
    title: "Sales Tax Nexus in 2 New States",
    category: "Tax",
    severity: "medium",
    likelihood: "Medium",
    impact: "Potential back-tax liability from expanded operations.",
    recommendedAction: "Conduct nexus study and register where thresholds are met.",
    owner: "Tax Lead",
  },
  {
    id: "risk-7",
    title: "Insurance COI Tracking Manual",
    category: "Controls",
    severity: "low",
    likelihood: "Low",
    impact: "Risk of lapsed certificates going unnoticed.",
    recommendedAction: "Automate COI collection and expiry alerts via portal.",
    owner: "Compliance",
  },
];
