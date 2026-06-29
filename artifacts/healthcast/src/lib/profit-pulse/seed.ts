import type { ProfitPulseState } from "./types";
import { newId } from "./id";

const now = new Date();
const iso = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};
const isoFuture = (daysAhead: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
};

export function createSeedState(): ProfitPulseState {
  const acc1 = newId("acc");
  const acc2 = newId("acc");
  const acc3 = newId("acc");
  const acc4 = newId("acc");
  const acc5 = newId("acc");

  const fac1 = newId("fac");
  const fac2 = newId("fac");
  const fac3 = newId("fac");
  const fac4 = newId("fac");
  const fac5 = newId("fac");

  return {
    version: 1,
    organization: {
      id: newId("org"),
      name: "Contractor Compliance Authority",
      legalName: "CCA Holdings LLC",
      industry: "Healthcare Compliance Services",
      timezone: "America/New_York",
      currency: "USD",
      cashOnHand: 2_400_000,
      marginThresholdPct: 20,
      runwayThresholdMonths: 6,
      fiscalYearStartMonth: 1,
    },
    accounts: [
      { id: acc1, name: "Sunrise Senior Living", contactName: "Maria Chen", email: "mchen@sunrise.example", phone: "555-0101", state: "FL", segment: "Senior Care", monthlyContractValue: 42000, status: "active", notes: "Multi-facility retainer" },
      { id: acc2, name: "Heartland Health Group", contactName: "James Ortiz", email: "jortiz@heartland.example", phone: "555-0102", state: "TX", segment: "Hospital Network", monthlyContractValue: 68000, status: "active", notes: "Enterprise compliance package" },
      { id: acc3, name: "Pacific Care Partners", contactName: "Lisa Park", email: "lpark@pacific.example", phone: "555-0103", state: "CA", segment: "Outpatient", monthlyContractValue: 31000, status: "at-risk", notes: "Payment delays on last two invoices" },
      { id: acc4, name: "Midwest Rehab Centers", contactName: "Tom Bradley", email: "tbradley@midwest.example", phone: "555-0104", state: "IL", segment: "Rehab", monthlyContractValue: 24000, status: "active", notes: "" },
      { id: acc5, name: "Coastal Medical Alliance", contactName: "Nina Patel", email: "npatel@coastal.example", phone: "555-0105", state: "NC", segment: "Clinic Network", monthlyContractValue: 52000, status: "active", notes: "Expansion opportunity Q3" },
    ],
    facilities: [
      { id: fac1, name: "Sunrise Tampa Campus", accountId: acc1, location: "Tampa, FL", healthScore: 88, complianceStatus: "compliant", revenueOpportunity: 45000, upsellPotential: 12000, recommendedAction: "Propose annual audit retainer upgrade", priorityRank: 2, lastInspectionDate: iso(45), riskNotes: "" },
      { id: fac2, name: "Heartland Dallas Medical", accountId: acc2, location: "Dallas, TX", healthScore: 72, complianceStatus: "at-risk", revenueOpportunity: 92000, upsellPotential: 28000, recommendedAction: "Schedule compliance remediation review", priorityRank: 1, lastInspectionDate: iso(120), riskNotes: "Documentation gaps flagged" },
      { id: fac3, name: "Pacific LA Outpatient", accountId: acc3, location: "Los Angeles, CA", healthScore: 58, complianceStatus: "non-compliant", revenueOpportunity: 38000, upsellPotential: 8500, recommendedAction: "Escalate to executive sponsor", priorityRank: 1, lastInspectionDate: iso(200), riskNotes: "Overdue corrective action plan" },
      { id: fac4, name: "Midwest Chicago Rehab", accountId: acc4, location: "Chicago, IL", healthScore: 91, complianceStatus: "compliant", revenueOpportunity: 22000, upsellPotential: 6000, recommendedAction: "Cross-sell staffing compliance module", priorityRank: 4, lastInspectionDate: iso(30), riskNotes: "" },
      { id: fac5, name: "Coastal Raleigh Clinic", accountId: acc5, location: "Raleigh, NC", healthScore: 84, complianceStatus: "compliant", revenueOpportunity: 67000, upsellPotential: 18000, recommendedAction: "Present Facility Intelligence bundle", priorityRank: 3, lastInspectionDate: iso(60), riskNotes: "" },
    ],
    revenueRecords: [
      { id: newId("rev"), date: iso(5), category: "Compliance Retainer", description: "Monthly retainer - Heartland", amount: 68000, accountId: acc2, facilityId: fac2 },
      { id: newId("rev"), date: iso(8), category: "Audit Services", description: "Quarterly audit - Sunrise", amount: 42000, accountId: acc1, facilityId: fac1 },
      { id: newId("rev"), date: iso(12), category: "Compliance Retainer", description: "Monthly retainer - Coastal", amount: 52000, accountId: acc5, facilityId: fac5 },
      { id: newId("rev"), date: iso(18), category: "Training", description: "Staff compliance training", amount: 18500, accountId: acc4, facilityId: fac4 },
      { id: newId("rev"), date: iso(22), category: "Compliance Retainer", description: "Monthly retainer - Pacific", amount: 31000, accountId: acc3, facilityId: fac3 },
      { id: newId("rev"), date: iso(28), category: "Implementation", description: "New module rollout", amount: 45000, accountId: acc2 },
      { id: newId("rev"), date: iso(35), category: "Compliance Retainer", description: "Monthly retainer - Midwest", amount: 24000, accountId: acc4, facilityId: fac4 },
      { id: newId("rev"), date: iso(42), category: "Advisory", description: "Executive advisory hours", amount: 12000, accountId: acc5 },
    ],
    expenseRecords: [
      { id: newId("exp"), date: iso(3), category: "Payroll", description: "Bi-weekly payroll run", amount: 210000, vendor: "Payroll Services Inc" },
      { id: newId("exp"), date: iso(7), category: "Software", description: "SaaS subscriptions", amount: 12400, vendor: "Various" },
      { id: newId("exp"), date: iso(10), category: "Marketing", description: "Google Ads campaign", amount: 28500, vendor: "Google" },
      { id: newId("exp"), date: iso(14), category: "Payroll", description: "Bi-weekly payroll run", amount: 210000, vendor: "Payroll Services Inc" },
      { id: newId("exp"), date: iso(20), category: "Facilities", description: "Office lease", amount: 18500, vendor: "WeWork" },
      { id: newId("exp"), date: iso(25), category: "Contractors", description: "Compliance auditors", amount: 32000, vendor: "Audit Partners LLC" },
      { id: newId("exp"), date: iso(30), category: "Payroll", description: "Bi-weekly payroll run", amount: 210000, vendor: "Payroll Services Inc" },
      { id: newId("exp"), date: iso(38), category: "Insurance", description: "Professional liability", amount: 8900, vendor: "Hartford" },
    ],
    invoices: [
      { id: newId("inv"), accountId: acc3, invoiceNumber: "INV-2025-0412", issueDate: iso(75), dueDate: iso(45), amount: 62000, amountPaid: 0, status: "overdue", description: "Q1 compliance services" },
      { id: newId("inv"), accountId: acc1, invoiceNumber: "INV-2025-0488", issueDate: iso(35), dueDate: iso(5), amount: 42000, amountPaid: 0, status: "overdue", description: "April retainer" },
      { id: newId("inv"), accountId: acc2, invoiceNumber: "INV-2025-0501", issueDate: iso(20), dueDate: isoFuture(10), amount: 68000, amountPaid: 34000, status: "partial", description: "May retainer" },
      { id: newId("inv"), accountId: acc5, invoiceNumber: "INV-2025-0515", issueDate: iso(10), dueDate: isoFuture(20), amount: 52000, amountPaid: 0, status: "sent", description: "May retainer" },
      { id: newId("inv"), accountId: acc4, invoiceNumber: "INV-2025-0520", issueDate: iso(5), dueDate: isoFuture(25), amount: 24000, amountPaid: 24000, status: "paid", description: "May retainer" },
      { id: newId("inv"), accountId: acc3, invoiceNumber: "INV-2025-0530", issueDate: iso(2), dueDate: isoFuture(28), amount: 31000, amountPaid: 0, status: "sent", description: "May retainer" },
    ],
    payables: [
      { id: newId("ap"), vendor: "Payroll Services Inc", dueDate: isoFuture(3), amount: 210000, category: "Payroll", status: "scheduled", description: "Bi-weekly payroll" },
      { id: newId("ap"), vendor: "Google", dueDate: isoFuture(7), amount: 28500, category: "Marketing", status: "scheduled", description: "Ads invoice" },
      { id: newId("ap"), vendor: "WeWork", dueDate: isoFuture(12), amount: 18500, category: "Facilities", status: "due", description: "Office lease" },
      { id: newId("ap"), vendor: "Audit Partners LLC", dueDate: isoFuture(18), amount: 32000, category: "Contractors", status: "scheduled", description: "External audit fees" },
      { id: newId("ap"), vendor: "AWS", dueDate: isoFuture(22), amount: 8400, category: "Software", status: "scheduled", description: "Cloud hosting" },
    ],
    staffing: [
      { id: newId("stf"), name: "Sarah Mitchell", role: "Compliance Director", department: "Operations", monthlyCost: 14200, fte: 1, startDate: iso(900), status: "active" },
      { id: newId("stf"), name: "David Kim", role: "Senior Auditor", department: "Audit", monthlyCost: 11800, fte: 1, startDate: iso(600), status: "active" },
      { id: newId("stf"), name: "Emily Rodriguez", role: "Account Executive", department: "Sales", monthlyCost: 10500, fte: 1, startDate: iso(400), status: "active" },
      { id: newId("stf"), name: "Michael Torres", role: "CFO", department: "Finance", monthlyCost: 18500, fte: 1, startDate: iso(1200), status: "active" },
      { id: newId("stf"), name: "Jennifer Walsh", role: "Marketing Manager", department: "Marketing", monthlyCost: 9800, fte: 1, startDate: iso(300), status: "active" },
      { id: newId("stf"), name: "Compliance Analyst (Open)", role: "Compliance Analyst", department: "Operations", monthlyCost: 8500, fte: 1, startDate: isoFuture(30), status: "planned" },
    ],
    opportunities: [
      { id: newId("opp"), accountId: acc5, title: "Facility Intelligence Bundle - Coastal", stage: "proposal", value: 180000, probability: 65, expectedCloseDate: isoFuture(45), lastFollowUpDate: iso(7), owner: "Emily Rodriguez", notes: "Strong executive sponsor" },
      { id: newId("opp"), accountId: acc2, title: "Enterprise Compliance Expansion", stage: "negotiation", value: 240000, probability: 75, expectedCloseDate: isoFuture(21), lastFollowUpDate: iso(3), owner: "Emily Rodriguez", notes: "Legal review in progress" },
      { id: newId("opp"), accountId: acc1, title: "Multi-site Audit Retainer", stage: "qualified", value: 96000, probability: 40, expectedCloseDate: isoFuture(60), lastFollowUpDate: iso(14), owner: "Emily Rodriguez", notes: "Needs budget approval" },
      { id: newId("opp"), accountId: acc3, title: "Remediation Services Package", stage: "lead", value: 72000, probability: 25, expectedCloseDate: isoFuture(90), lastFollowUpDate: iso(45), owner: "Emily Rodriguez", notes: "Follow-up overdue" },
    ],
    risks: [
      { id: newId("risk"), title: "Pacific Care payment default", category: "Collections", severity: "high", description: "Two consecutive overdue invoices", accountId: acc3, dueDate: isoFuture(7), status: "open" },
      { id: newId("risk"), title: "Heartland documentation gaps", category: "Compliance", severity: "critical", description: "Audit findings require remediation", facilityId: fac2, accountId: acc2, status: "open" },
      { id: newId("risk"), title: "Marketing spend efficiency", category: "Operations", severity: "medium", description: "CPL rising 12% month over month", status: "open" },
    ],
    tasks: [
      { id: newId("task"), title: "Follow up on $62K Pacific invoice", description: "Call Lisa Park regarding overdue Q1 invoice", dueDate: isoFuture(1), status: "open", priority: "high", relatedEntityType: "invoice", relatedEntityId: acc3 },
      { id: newId("task"), title: "Schedule Heartland remediation review", description: "Book executive review for Dallas facility", dueDate: isoFuture(3), status: "open", priority: "high", relatedEntityType: "facility", relatedEntityId: fac2 },
      { id: newId("task"), title: "Update cash forecast", description: "Refresh 30-day cash projection", dueDate: isoFuture(5), status: "in_progress", priority: "medium" },
      { id: newId("task"), title: "Coastal upsell presentation", description: "Prepare Facility Intelligence deck", dueDate: isoFuture(10), status: "open", priority: "medium", relatedEntityType: "opportunity" },
    ],
    scenarioAssumptions: {
      revenueGrowthPct: 5,
      expenseReductionPct: 0,
      priceIncreasePct: 3,
      churnRiskPct: 2,
      staffingChangePct: 0,
      arCollectionImprovementPct: 10,
      facilityIntelligenceRevenue: 25000,
    },
    savedScenarios: [],
  };
}
