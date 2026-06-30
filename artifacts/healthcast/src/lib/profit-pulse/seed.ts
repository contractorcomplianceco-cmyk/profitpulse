import type { ProfitPulseState } from "./types";
import { newId } from "./id";
import { DEFAULT_TENANT_ID, DEFAULT_TENANT_NAME } from "@/auth/types";

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
      name: "Summit Mechanical Contractors",
      legalName: "Summit Mechanical LLC",
      industry: "Commercial HVAC & Mechanical Contracting",
      timezone: "America/New_York",
      currency: "USD",
      cashOnHand: 412_000,
      marginThresholdPct: 14,
      runwayThresholdMonths: 6,
      fiscalYearStartMonth: 1,
    },
    accounts: [
      { id: acc1, name: "Riverside Medical Wing", contactName: "Maria Chen", email: "mchen@riverside.example", phone: "555-0101", state: "FL", segment: "Healthcare GC", monthlyContractValue: 84000, status: "active", notes: "Design-build HVAC · on track" },
      { id: acc2, name: "Summit Health Network", contactName: "James Ortiz", email: "jortiz@summit.example", phone: "555-0102", state: "TX", segment: "Hospital", monthlyContractValue: 112000, status: "active", notes: "Multi-phase retrofit program" },
      { id: acc3, name: "Pacific Care Partners", contactName: "Lisa Park", email: "lpark@pacific.example", phone: "555-0103", state: "CA", segment: "Outpatient", monthlyContractValue: 52000, status: "at-risk", notes: "Pacific Care Phase 2 — margin review" },
      { id: acc4, name: "Metro Facilities Group", contactName: "Tom Bradley", email: "tbradley@metro.example", phone: "555-0104", state: "IL", segment: "Commercial", monthlyContractValue: 68000, status: "active", notes: "Metro HVAC Retrofit" },
      { id: acc5, name: "Coastal Property Mgmt", contactName: "Nina Patel", email: "npatel@coastal.example", phone: "555-0105", state: "NC", segment: "Property Mgmt", monthlyContractValue: 44000, status: "active", notes: "Portfolio service agreement" },
    ],
    facilities: [
      { id: fac1, name: "Riverside Tampa — Wing B", accountId: acc1, location: "Tampa, FL", healthScore: 88, complianceStatus: "compliant", revenueOpportunity: 62000, upsellPotential: 18000, recommendedAction: "Propose controls upgrade change order", priorityRank: 2, lastInspectionDate: iso(45), riskNotes: "" },
      { id: fac2, name: "Summit Dallas Campus", accountId: acc2, location: "Dallas, TX", healthScore: 76, complianceStatus: "at-risk", revenueOpportunity: 94000, upsellPotential: 24000, recommendedAction: "Review labor burn on Phase 2", priorityRank: 1, lastInspectionDate: iso(90), riskNotes: "Labor 12% over plan" },
      { id: fac3, name: "Pacific Care Phase 2", accountId: acc3, location: "Los Angeles, CA", healthScore: 54, complianceStatus: "at-risk", revenueOpportunity: 48000, upsellPotential: 12000, recommendedAction: "Margin at 6.1% — pricing review", priorityRank: 1, lastInspectionDate: iso(14), riskNotes: "Job #1847 labor overrun" },
      { id: fac4, name: "Metro Chicago Tower", accountId: acc4, location: "Chicago, IL", healthScore: 91, complianceStatus: "compliant", revenueOpportunity: 38000, upsellPotential: 9000, recommendedAction: "On track — bill remaining milestones", priorityRank: 4, lastInspectionDate: iso(30), riskNotes: "" },
      { id: fac5, name: "Coastal Raleigh Portfolio", accountId: acc5, location: "Raleigh, NC", healthScore: 82, complianceStatus: "compliant", revenueOpportunity: 55000, upsellPotential: 15000, recommendedAction: "Cross-sell preventive maintenance", priorityRank: 3, lastInspectionDate: iso(60), riskNotes: "" },
    ],
    revenueRecords: [
      { id: newId("rev"), date: iso(5), category: "Monthly Service Contract", description: "Summit Health — June progress billing", amount: 112000, accountId: acc2, facilityId: fac2 },
      { id: newId("rev"), date: iso(8), category: "Job Progress Billing", description: "Riverside Medical Wing — draw 4", amount: 84000, accountId: acc1, facilityId: fac1 },
      { id: newId("rev"), date: iso(12), category: "Monthly Service Contract", description: "Coastal portfolio — June", amount: 44000, accountId: acc5, facilityId: fac5 },
      { id: newId("rev"), date: iso(18), category: "Change Order", description: "Metro HVAC — controls upgrade", amount: 28500, accountId: acc4, facilityId: fac4 },
      { id: newId("rev"), date: iso(22), category: "Job Progress Billing", description: "Pacific Care Phase 2 — draw 2", amount: 52000, accountId: acc3, facilityId: fac3 },
      { id: newId("rev"), date: iso(28), category: "Job Progress Billing", description: "Summit Dallas — equipment release", amount: 67000, accountId: acc2, facilityId: fac2 },
      { id: newId("rev"), date: iso(35), category: "Monthly Service Contract", description: "Metro Facilities — June", amount: 68000, accountId: acc4, facilityId: fac4 },
      { id: newId("rev"), date: iso(42), category: "T&M Repair", description: "Riverside emergency call-out", amount: 12400, accountId: acc1, facilityId: fac1 },
      { id: newId("rev"), date: iso(48), category: "Job Progress Billing", description: "Pacific Care Phase 2 — mobilization", amount: 38000, accountId: acc3, facilityId: fac3 },
      { id: newId("rev"), date: iso(55), category: "Monthly Service Contract", description: "Coastal — May catch-up", amount: 44000, accountId: acc5, facilityId: fac5 },
    ],
    expenseRecords: [
      { id: newId("exp"), date: iso(3), category: "Payroll", description: "Field crews — bi-weekly", amount: 186000, vendor: "Payroll Services Inc", accountId: acc2 },
      { id: newId("exp"), date: iso(7), category: "Materials", description: "HVAC equipment — Summit job", amount: 42000, vendor: "Carrier Supply", accountId: acc2 },
      { id: newId("exp"), date: iso(10), category: "Subcontractors", description: "Electrical sub — Riverside", amount: 28400, vendor: "Spark Electric", accountId: acc1 },
      { id: newId("exp"), date: iso(14), category: "Payroll", description: "Field crews — bi-weekly", amount: 186000, vendor: "Payroll Services Inc" },
      { id: newId("exp"), date: iso(16), category: "Materials", description: "Duct & fittings — Pacific Care", amount: 31200, vendor: "ABC Supply", accountId: acc3 },
      { id: newId("exp"), date: iso(20), category: "Overhead", description: "Office lease & admin", amount: 18500, vendor: "WeWork" },
      { id: newId("exp"), date: iso(22), category: "Labor Burden", description: "Pacific Care Phase 2 — overtime", amount: 12400, vendor: "Internal allocation", accountId: acc3 },
      { id: newId("exp"), date: iso(25), category: "Payroll", description: "Field crews — bi-weekly", amount: 186000, vendor: "Payroll Services Inc" },
      { id: newId("exp"), date: iso(30), category: "Equipment Rental", description: "Crane & lift — Metro retrofit", amount: 9800, vendor: "United Rentals", accountId: acc4 },
      { id: newId("exp"), date: iso(38), category: "Insurance", description: "GL & workers comp", amount: 11200, vendor: "Hartford" },
    ],
    invoices: [
      { id: newId("inv"), accountId: acc3, invoiceNumber: "INV-2026-0412", issueDate: iso(75), dueDate: iso(45), amount: 62000, amountPaid: 0, status: "overdue", description: "Pacific Care Phase 2 — draw 1" },
      { id: newId("inv"), accountId: acc1, invoiceNumber: "INV-2026-0488", issueDate: iso(35), dueDate: iso(5), amount: 42000, amountPaid: 0, status: "overdue", description: "Riverside draw 3" },
      { id: newId("inv"), accountId: acc2, invoiceNumber: "INV-2026-0501", issueDate: iso(20), dueDate: isoFuture(10), amount: 112000, amountPaid: 56000, status: "partial", description: "Summit Health — June billing" },
      { id: newId("inv"), accountId: acc5, invoiceNumber: "INV-2026-0515", issueDate: iso(10), dueDate: isoFuture(20), amount: 44000, amountPaid: 0, status: "sent", description: "Coastal — June service" },
      { id: newId("inv"), accountId: acc4, invoiceNumber: "INV-2026-0520", issueDate: iso(5), dueDate: isoFuture(25), amount: 68000, amountPaid: 68000, status: "paid", description: "Metro — June progress" },
      { id: newId("inv"), accountId: acc3, invoiceNumber: "INV-2026-0530", issueDate: iso(2), dueDate: isoFuture(28), amount: 52000, amountPaid: 0, status: "sent", description: "Pacific Care — draw 2" },
    ],
    payables: [
      { id: newId("ap"), vendor: "Payroll Services Inc", dueDate: isoFuture(3), amount: 186000, category: "Payroll", status: "scheduled", description: "Bi-weekly field payroll" },
      { id: newId("ap"), vendor: "Carrier Supply", dueDate: isoFuture(7), amount: 42000, category: "Materials", status: "due", description: "Summit equipment PO" },
      { id: newId("ap"), vendor: "ABC Supply", dueDate: isoFuture(12), amount: 31200, category: "Materials", status: "due", description: "Pacific Care materials" },
      { id: newId("ap"), vendor: "Spark Electric", dueDate: isoFuture(18), amount: 28400, category: "Subcontractors", status: "scheduled", description: "Riverside electrical" },
      { id: newId("ap"), vendor: "United Rentals", dueDate: isoFuture(22), amount: 9800, category: "Equipment Rental", status: "scheduled", description: "Metro lift rental" },
    ],
    staffing: [
      { id: newId("stf"), name: "Sarah Mitchell", role: "Project Executive", department: "Operations", monthlyCost: 14200, fte: 1, startDate: iso(900), status: "active" },
      { id: newId("stf"), name: "David Kim", role: "Field Superintendent", department: "Field", monthlyCost: 11800, fte: 1, startDate: iso(600), status: "active" },
      { id: newId("stf"), name: "Emily Rodriguez", role: "Estimator", department: "Preconstruction", monthlyCost: 10500, fte: 1, startDate: iso(400), status: "active" },
      { id: newId("stf"), name: "Michael Torres", role: "CFO", department: "Finance", monthlyCost: 18500, fte: 1, startDate: iso(1200), status: "active" },
      { id: newId("stf"), name: "Jennifer Walsh", role: "Service Manager", department: "Service", monthlyCost: 9800, fte: 1, startDate: iso(300), status: "active" },
      { id: newId("stf"), name: "Foreman (Open Req)", role: "Working Foreman", department: "Field", monthlyCost: 8500, fte: 1, startDate: isoFuture(30), status: "planned" },
    ],
    opportunities: [
      { id: newId("opp"), accountId: acc3, title: "Pacific Care Phase 2 — HVAC", stage: "proposal", value: 480000, probability: 65, expectedCloseDate: isoFuture(45), lastFollowUpDate: iso(7), owner: "Emily Rodriguez", notes: "Margin at 6.1% — labor over plan" },
      { id: newId("opp"), accountId: acc2, title: "Summit Health — Phase 3 Expansion", stage: "negotiation", value: 890000, probability: 72, expectedCloseDate: isoFuture(21), lastFollowUpDate: iso(3), owner: "Emily Rodriguez", notes: "18.2% target margin" },
      { id: newId("opp"), accountId: acc1, title: "Riverside Medical — Wing C", stage: "qualified", value: 620000, probability: 45, expectedCloseDate: isoFuture(60), lastFollowUpDate: iso(14), owner: "Emily Rodriguez", notes: "Design-assist bid due Q3" },
      { id: newId("opp"), accountId: acc4, title: "Metro Portfolio — Service Renewal", stage: "lead", value: 320000, probability: 30, expectedCloseDate: isoFuture(90), lastFollowUpDate: iso(45), owner: "Emily Rodriguez", notes: "15.4% margin on current work" },
      { id: newId("opp"), accountId: acc5, title: "Coastal — Controls Upgrade Program", stage: "qualified", value: 210000, probability: 50, expectedCloseDate: isoFuture(55), lastFollowUpDate: iso(10), owner: "Emily Rodriguez", notes: "Upsell from service contract" },
    ],
    risks: [
      { id: newId("risk"), title: "Pacific Care Phase 2 — margin at 6.1%", category: "Margin", severity: "critical", description: "Labor running 12% over plan on Job #1847", accountId: acc3, facilityId: fac3, status: "open" },
      { id: newId("risk"), title: "Pacific Care payment delay", category: "Collections", severity: "high", description: "Two consecutive overdue draws", accountId: acc3, dueDate: isoFuture(7), status: "open" },
      { id: newId("risk"), title: "Materials cost spike — equipment", category: "Costs", severity: "medium", description: "Carrier lead times extended 3 weeks", status: "open" },
    ],
    tasks: [
      { id: newId("task"), title: "Review Pacific Care Phase 2 pricing", description: "Margin alert — labor 12% over plan", dueDate: isoFuture(1), status: "open", priority: "high", relatedEntityType: "account", relatedEntityId: acc3 },
      { id: newId("task"), title: "Collect Riverside overdue draw", description: "Call Maria Chen — $42K outstanding", dueDate: isoFuture(2), status: "open", priority: "high", relatedEntityType: "invoice" },
      { id: newId("task"), title: "Update 13-week cash forecast", description: "Refresh after June payroll run", dueDate: isoFuture(5), status: "in_progress", priority: "medium" },
      { id: newId("task"), title: "Summit Phase 3 estimate kickoff", description: "Precon meeting with GC", dueDate: isoFuture(10), status: "open", priority: "medium", relatedEntityType: "opportunity" },
    ],
    scenarioAssumptions: {
      revenueGrowthPct: 6,
      expenseReductionPct: 2,
      priceIncreasePct: 4,
      churnRiskPct: 3,
      staffingChangePct: 0,
      arCollectionImprovementPct: 12,
      facilityIntelligenceRevenue: 0,
    },
    savedScenarios: [],
  };
}

export function createSeedStateForTenant(
  tenantId: string = DEFAULT_TENANT_ID,
  tenantName: string = DEFAULT_TENANT_NAME,
): ProfitPulseState {
  const seed = createSeedState();
  return {
    ...seed,
    tenantId,
    organization: {
      ...seed.organization,
      id: newId("org"),
      name: tenantName === DEFAULT_TENANT_NAME ? seed.organization.name : tenantName,
      legalName: tenantName === DEFAULT_TENANT_NAME ? seed.organization.legalName : `${tenantName} LLC`,
    },
  };
}
