export type EntityId = string;

export type AlertSeverity = "critical" | "warning" | "info";
export type ComplianceStatus = "compliant" | "at-risk" | "non-compliant";
export type OpportunityStage = "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type TaskStatus = "open" | "in_progress" | "done";
export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue";
export type PayableStatus = "scheduled" | "due" | "paid" | "overdue";

export interface OrganizationSettings {
  id: EntityId;
  name: string;
  legalName: string;
  industry: string;
  timezone: string;
  currency: string;
  cashOnHand: number;
  marginThresholdPct: number;
  runwayThresholdMonths: number;
  fiscalYearStartMonth: number;
}

export interface Account {
  id: EntityId;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  state: string;
  segment: string;
  monthlyContractValue: number;
  status: "active" | "at-risk" | "churned";
  notes: string;
}

export interface Facility {
  id: EntityId;
  name: string;
  accountId: EntityId;
  location: string;
  healthScore: number;
  complianceStatus: ComplianceStatus;
  revenueOpportunity: number;
  upsellPotential: number;
  recommendedAction: string;
  priorityRank: number;
  lastInspectionDate: string;
  riskNotes: string;
}

export interface RevenueRecord {
  id: EntityId;
  date: string;
  category: string;
  description: string;
  amount: number;
  accountId: EntityId;
  facilityId?: EntityId;
}

export interface ExpenseRecord {
  id: EntityId;
  date: string;
  category: string;
  description: string;
  amount: number;
  accountId?: EntityId;
  vendor: string;
}

export interface Invoice {
  id: EntityId;
  accountId: EntityId;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: InvoiceStatus;
  description: string;
}

export interface PayableBill {
  id: EntityId;
  vendor: string;
  dueDate: string;
  amount: number;
  category: string;
  status: PayableStatus;
  description: string;
}

export interface StaffingRecord {
  id: EntityId;
  name: string;
  role: string;
  department: string;
  monthlyCost: number;
  fte: number;
  startDate: string;
  status: "active" | "planned" | "terminated";
}

export interface Opportunity {
  id: EntityId;
  accountId: EntityId;
  title: string;
  stage: OpportunityStage;
  value: number;
  probability: number;
  expectedCloseDate: string;
  lastFollowUpDate: string;
  owner: string;
  notes: string;
}

export interface RiskRecord {
  id: EntityId;
  title: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  facilityId?: EntityId;
  accountId?: EntityId;
  dueDate?: string;
  status: "open" | "mitigated" | "closed";
}

export interface Task {
  id: EntityId;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: "high" | "medium" | "low";
  relatedEntityType?: "account" | "facility" | "invoice" | "opportunity";
  relatedEntityId?: EntityId;
}

export interface ScenarioAssumptions {
  revenueGrowthPct: number;
  expenseReductionPct: number;
  priceIncreasePct: number;
  churnRiskPct: number;
  staffingChangePct: number;
  arCollectionImprovementPct: number;
  facilityIntelligenceRevenue: number;
}

export interface SavedScenario {
  id: EntityId;
  name: string;
  savedAt: string;
  assumptions: ScenarioAssumptions;
  note?: string;
}

export interface ProfitPulseState {
  version: 1;
  organization: OrganizationSettings;
  accounts: Account[];
  facilities: Facility[];
  revenueRecords: RevenueRecord[];
  expenseRecords: ExpenseRecord[];
  invoices: Invoice[];
  payables: PayableBill[];
  staffing: StaffingRecord[];
  opportunities: Opportunity[];
  risks: RiskRecord[];
  tasks: Task[];
  scenarioAssumptions: ScenarioAssumptions;
  savedScenarios: SavedScenario[];
}

export interface ComputedAlert {
  id: string;
  category: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  recommendedAction: string;
  affectedMetric: string;
}

export interface DashboardMetrics {
  monthlyRevenue: number;
  priorMonthlyRevenue: number;
  netProfit: number;
  priorNetProfit: number;
  grossMarginPct: number;
  operatingMarginPct: number;
  cashOnHand: number;
  arOutstanding: number;
  apUpcoming: number;
  runwayMonths: number;
  payrollBurden: number;
  revenueAtRisk: number;
  forecastedCash30d: number;
  facilityOpportunityValue: number;
  alertCount: number;
  financialHealthScore: number;
  monthlyExpenses: number;
  revenueTrend: number[];
  cashTrend: number[];
}

export interface ScenarioProjection {
  projectedRevenue: number;
  projectedNetProfit: number;
  projectedMarginPct: number;
  projectedRunwayMonths: number;
  cashImpact: number;
  recommendedAction: string;
}

export interface CsvImportRowError {
  row: number;
  message: string;
}

export interface CsvImportResult {
  imported: number;
  errors: CsvImportRowError[];
  revenueAdded: number;
  expensesAdded: number;
}
