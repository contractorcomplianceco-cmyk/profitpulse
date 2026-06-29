import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Account,
  ComputedAlert,
  DashboardMetrics,
  ExpenseRecord,
  Facility,
  Invoice,
  Opportunity,
  PayableBill,
  ProfitPulseState,
  RevenueRecord,
  RiskRecord,
  ScenarioAssumptions,
  SavedScenario,
  StaffingRecord,
  Task,
} from "@/lib/profit-pulse/types";
import { createSeedState } from "@/lib/profit-pulse/seed";
import {
  exportStateJson,
  importStateJson,
  loadState,
  resetStoredState,
  saveState,
} from "@/lib/profit-pulse/storage";
import { computeDashboardMetrics } from "@/lib/profit-pulse/calculations";
import { generateAlerts } from "@/lib/profit-pulse/alerts";
import { parseCsvImport } from "@/lib/profit-pulse/csv-import";
import type { CsvImportResult } from "@/lib/profit-pulse/types";
import { newId } from "@/lib/profit-pulse/id";
import { useAuth } from "@/context/AuthProvider";
import { useBilling } from "@/context/BillingProvider";
import { canWrite as roleCanWrite } from "@/auth/permissions";
import { appendAuditLog } from "@/auth/audit";
import { useToast } from "@/hooks/use-toast";
import type { UsageMetricKey } from "@/billing/types";

type EntityCollection =
  | "accounts"
  | "facilities"
  | "revenueRecords"
  | "expenseRecords"
  | "invoices"
  | "payables"
  | "staffing"
  | "opportunities"
  | "risks"
  | "tasks";

const ENTITY_USAGE: Partial<Record<EntityCollection, UsageMetricKey>> = {
  revenueRecords: "revenue_records",
  expenseRecords: "expense_records",
  facilities: "facility_records",
  opportunities: "opportunity_records",
};

interface ProfitPulseContextValue {
  state: ProfitPulseState;
  metrics: DashboardMetrics;
  alerts: ComputedAlert[];
  tenantId: string | null;
  readOnly: boolean;
  resetDemoData: () => void;
  exportJson: () => string;
  importJson: (raw: string) => void;
  importCsv: (csv: string) => CsvImportResult;
  updateOrganization: (patch: Partial<ProfitPulseState["organization"]>) => void;
  updateScenarioAssumptions: (patch: Partial<ScenarioAssumptions>) => void;
  saveScenario: (name: string) => void;
  promoteFacilityToOpportunity: (facilityId: string) => void;
  upsertAccount: (record: Account) => void;
  deleteAccount: (id: string) => void;
  upsertFacility: (record: Facility) => void;
  deleteFacility: (id: string) => void;
  upsertRevenue: (record: RevenueRecord) => void;
  deleteRevenue: (id: string) => void;
  upsertExpense: (record: ExpenseRecord) => void;
  deleteExpense: (id: string) => void;
  upsertInvoice: (record: Invoice) => void;
  deleteInvoice: (id: string) => void;
  upsertPayable: (record: PayableBill) => void;
  deletePayable: (id: string) => void;
  upsertStaffing: (record: StaffingRecord) => void;
  deleteStaffing: (id: string) => void;
  upsertOpportunity: (record: Opportunity) => void;
  deleteOpportunity: (id: string) => void;
  upsertRisk: (record: RiskRecord) => void;
  deleteRisk: (id: string) => void;
  upsertTask: (record: Task) => void;
  deleteTask: (id: string) => void;
}

const ProfitPulseContext = createContext<ProfitPulseContextValue | null>(null);

function upsertById<T extends { id: string }>(list: T[], record: T): T[] {
  const idx = list.findIndex((x) => x.id === record.id);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = record;
    return next;
  }
  return [...list, record];
}

function removeById<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id);
}

export function ProfitPulseProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const { checkLimit, trackUsage, canAccess } = useBilling();
  const { toast } = useToast();
  const tenantId = session?.tenantId ?? null;
  const readOnly = session ? !roleCanWrite(session.role) : true;

  const audit = useCallback(
    (
      action: "entity.create" | "entity.update" | "entity.delete" | "data.import" | "data.export" | "data.reset",
      entityType: string,
      summary: string,
      entityId?: string,
    ) => {
      if (!session || !tenantId) return;
      appendAuditLog({
        tenantId,
        userId: session.sub,
        userEmail: session.email,
        action,
        entityType,
        entityId,
        summary,
      });
    },
    [session, tenantId],
  );

  const [state, setState] = useState<ProfitPulseState>(() =>
    tenantId ? loadState(tenantId) : createSeedState(),
  );

  useEffect(() => {
    if (tenantId) {
      setState(loadState(tenantId));
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) saveState(state, tenantId);
  }, [state, tenantId]);

  const alerts = useMemo(() => generateAlerts(state), [state]);
  const metrics = useMemo(
    () => computeDashboardMetrics(state, alerts.length),
    [state, alerts.length],
  );

  const commit = useCallback(
    (updater: (prev: ProfitPulseState) => ProfitPulseState) => {
      if (readOnly || !tenantId) return;
      setState((prev) => updater(prev));
    },
    [readOnly, tenantId],
  );

  const resetDemoData = useCallback(() => {
    if (!tenantId || readOnly) return;
    setState(resetStoredState(tenantId));
    audit("data.reset", "workspace", "Reset demo data to seed state");
  }, [tenantId, readOnly, audit]);

  const exportJson = useCallback(() => {
    trackUsage("data_exports");
    audit("data.export", "workspace", "Exported JSON workspace backup");
    return exportStateJson(state);
  }, [state, trackUsage, audit]);

  const importJson = useCallback(
    (raw: string) => {
      if (!tenantId || readOnly) return;
      if (!canAccess("integrations_import").allowed) {
        toast({
          title: "Import not available",
          description: "Workspace import requires an Enterprise plan.",
          variant: "destructive",
        });
        return;
      }
      setState(importStateJson(raw, tenantId));
      trackUsage("data_imports");
      audit("data.import", "workspace", "Imported JSON workspace backup");
    },
    [tenantId, readOnly, audit, canAccess, trackUsage, toast],
  );

  const importCsv = useCallback(
    (csv: string): CsvImportResult => {
      if (readOnly || !tenantId) {
        return { imported: 0, errors: [{ row: 0, message: "Read-only access." }], revenueAdded: 0, expensesAdded: 0 };
      }
      if (!canAccess("integrations_import").allowed) {
        toast({
          title: "Import not available",
          description: "CSV import requires an Enterprise plan.",
          variant: "destructive",
        });
        return { imported: 0, errors: [{ row: 0, message: "Requires Enterprise plan." }], revenueAdded: 0, expensesAdded: 0 };
      }
      const draft = structuredClone(state);
      const result = parseCsvImport(csv, draft);
      if (result.imported > 0) {
        setState(draft);
        trackUsage("data_imports", result.imported);
        audit("data.import", "csv", `Imported ${result.revenueAdded} revenue and ${result.expensesAdded} expense rows`);
      }
      return result;
    },
    [state, readOnly, tenantId, audit, canAccess, trackUsage, toast],
  );

  const updateOrganization = useCallback(
    (patch: Partial<ProfitPulseState["organization"]>) => {
      commit((prev) => ({
        ...prev,
        organization: { ...prev.organization, ...patch },
      }));
    },
    [commit],
  );

  const updateScenarioAssumptions = useCallback(
    (patch: Partial<ScenarioAssumptions>) => {
      commit((prev) => ({
        ...prev,
        scenarioAssumptions: { ...prev.scenarioAssumptions, ...patch },
      }));
    },
    [commit],
  );

  const saveScenario = useCallback(
    (name: string) => {
      if (!checkLimit("scenario_saves", state.savedScenarios.length)) {
        toast({
          title: "Scenario limit reached",
          description: "Upgrade to Pro or Enterprise to save more scenarios.",
          variant: "destructive",
        });
        return;
      }
      commit((prev) => ({
        ...prev,
        savedScenarios: [
          ...prev.savedScenarios,
          {
            id: newId("scn"),
            name: name.trim() || `Scenario ${prev.savedScenarios.length + 1}`,
            savedAt: new Date().toISOString(),
            assumptions: { ...prev.scenarioAssumptions },
          },
        ],
      }));
      trackUsage("scenario_saves");
    },
    [commit, checkLimit, state.savedScenarios.length, trackUsage, toast],
  );

  const promoteFacilityToOpportunity = useCallback(
    (facilityId: string) => {
      if (!checkLimit("opportunity_records", state.opportunities.length)) {
        toast({
          title: "Opportunity limit reached",
          description: "Upgrade your plan to add more pipeline opportunities.",
          variant: "destructive",
        });
        return;
      }
      commit((prev) => {
        const facility = prev.facilities.find((f) => f.id === facilityId);
        if (!facility) return prev;
        const value = facility.revenueOpportunity + facility.upsellPotential;
        const opp: Opportunity = {
          id: newId("opp"),
          accountId: facility.accountId,
          title: `Facility Intelligence — ${facility.name}`,
          stage: "qualified",
          value,
          probability: Math.min(85, Math.max(25, facility.healthScore)),
          expectedCloseDate: new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10),
          lastFollowUpDate: new Date().toISOString().slice(0, 10),
          owner: "Sales",
          notes: facility.recommendedAction || facility.riskNotes,
        };
        return { ...prev, opportunities: [...prev.opportunities, opp] };
      });
      trackUsage("opportunity_records");
    },
    [commit, checkLimit, state.opportunities.length, trackUsage, toast],
  );

  const makeCrud = <T extends { id: string }>(
    key: EntityCollection,
    label: string,
    usageMetric?: UsageMetricKey,
  ) => ({
    upsert: (record: T) => {
      commit((prev) => {
        const exists = (prev[key] as unknown as T[]).some((x) => x.id === record.id);
        if (!exists && usageMetric && !checkLimit(usageMetric, (prev[key] as unknown as T[]).length)) {
          toast({
            title: "Plan limit reached",
            description: `Upgrade your plan to add more ${label} records.`,
            variant: "destructive",
          });
          return prev;
        }
        const next = { ...prev, [key]: upsertById(prev[key] as unknown as T[], record) };
        audit(exists ? "entity.update" : "entity.create", label, `${exists ? "Updated" : "Created"} ${label}`, record.id);
        if (!exists && usageMetric) trackUsage(usageMetric);
        return next;
      });
    },
    remove: (id: string) => {
      commit((prev) => {
        audit("entity.delete", label, `Deleted ${label}`, id);
        return { ...prev, [key]: removeById(prev[key] as unknown as T[], id) };
      });
    },
  });

  const accountsCrud = makeCrud<Account>("accounts", "account");
  const facilitiesCrud = makeCrud<Facility>("facilities", "facility", ENTITY_USAGE.facilities);
  const revenueCrud = makeCrud<RevenueRecord>("revenueRecords", "revenue", ENTITY_USAGE.revenueRecords);
  const expenseCrud = makeCrud<ExpenseRecord>("expenseRecords", "expense", ENTITY_USAGE.expenseRecords);
  const invoicesCrud = makeCrud<Invoice>("invoices", "invoice");
  const payablesCrud = makeCrud<PayableBill>("payables", "payable");
  const staffingCrud = makeCrud<StaffingRecord>("staffing", "staffing");
  const opportunitiesCrud = makeCrud<Opportunity>("opportunities", "opportunity", ENTITY_USAGE.opportunities);
  const risksCrud = makeCrud<RiskRecord>("risks", "risk");
  const tasksCrud = makeCrud<Task>("tasks", "task");

  const value = useMemo<ProfitPulseContextValue>(
    () => ({
      state,
      metrics,
      alerts,
      tenantId,
      readOnly,
      resetDemoData,
      exportJson,
      importJson,
      importCsv,
      updateOrganization,
      updateScenarioAssumptions,
      saveScenario,
      promoteFacilityToOpportunity,
      upsertAccount: accountsCrud.upsert,
      deleteAccount: accountsCrud.remove,
      upsertFacility: facilitiesCrud.upsert,
      deleteFacility: facilitiesCrud.remove,
      upsertRevenue: revenueCrud.upsert,
      deleteRevenue: revenueCrud.remove,
      upsertExpense: expenseCrud.upsert,
      deleteExpense: expenseCrud.remove,
      upsertInvoice: invoicesCrud.upsert,
      deleteInvoice: invoicesCrud.remove,
      upsertPayable: payablesCrud.upsert,
      deletePayable: payablesCrud.remove,
      upsertStaffing: staffingCrud.upsert,
      deleteStaffing: staffingCrud.remove,
      upsertOpportunity: opportunitiesCrud.upsert,
      deleteOpportunity: opportunitiesCrud.remove,
      upsertRisk: risksCrud.upsert,
      deleteRisk: risksCrud.remove,
      upsertTask: tasksCrud.upsert,
      deleteTask: tasksCrud.remove,
    }),
    [
      state,
      metrics,
      alerts,
      tenantId,
      readOnly,
      resetDemoData,
      exportJson,
      importJson,
      importCsv,
      updateOrganization,
      updateScenarioAssumptions,
      saveScenario,
      promoteFacilityToOpportunity,
      accountsCrud,
      facilitiesCrud,
      revenueCrud,
      expenseCrud,
      invoicesCrud,
      payablesCrud,
      staffingCrud,
      opportunitiesCrud,
      risksCrud,
      tasksCrud,
    ],
  );

  return (
    <ProfitPulseContext.Provider value={value}>{children}</ProfitPulseContext.Provider>
  );
}

export function useProfitPulse(): ProfitPulseContextValue {
  const ctx = useContext(ProfitPulseContext);
  if (!ctx) throw new Error("useProfitPulse must be used within ProfitPulseProvider");
  return ctx;
}

export function createEmptyAccount(): Account {
  return {
    id: newId("acc"),
    name: "",
    contactName: "",
    email: "",
    phone: "",
    state: "",
    segment: "",
    monthlyContractValue: 0,
    status: "active",
    notes: "",
  };
}

export function createEmptyFacility(accountId?: string): Facility {
  return {
    id: newId("fac"),
    name: "",
    accountId: accountId ?? "",
    location: "",
    healthScore: 75,
    complianceStatus: "compliant",
    revenueOpportunity: 0,
    upsellPotential: 0,
    recommendedAction: "",
    priorityRank: 5,
    lastInspectionDate: new Date().toISOString().slice(0, 10),
    riskNotes: "",
  };
}

export function createEmptyRevenue(accountId?: string): RevenueRecord {
  return {
    id: newId("rev"),
    date: new Date().toISOString().slice(0, 10),
    category: "",
    description: "",
    amount: 0,
    accountId: accountId ?? "",
  };
}

export function createEmptyExpense(): ExpenseRecord {
  return {
    id: newId("exp"),
    date: new Date().toISOString().slice(0, 10),
    category: "",
    description: "",
    amount: 0,
    vendor: "",
  };
}

export function createEmptyInvoice(accountId?: string): Invoice {
  return {
    id: newId("inv"),
    accountId: accountId ?? "",
    invoiceNumber: "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    amount: 0,
    amountPaid: 0,
    status: "draft",
    description: "",
  };
}

export function createEmptyPayable(): PayableBill {
  return {
    id: newId("ap"),
    vendor: "",
    dueDate: new Date().toISOString().slice(0, 10),
    amount: 0,
    category: "",
    status: "scheduled",
    description: "",
  };
}

export function createEmptyStaffing(): StaffingRecord {
  return {
    id: newId("stf"),
    name: "",
    role: "",
    department: "",
    monthlyCost: 0,
    fte: 1,
    startDate: new Date().toISOString().slice(0, 10),
    status: "active",
  };
}

export function createEmptyOpportunity(accountId?: string): Opportunity {
  return {
    id: newId("opp"),
    accountId: accountId ?? "",
    title: "",
    stage: "lead",
    value: 0,
    probability: 25,
    expectedCloseDate: new Date().toISOString().slice(0, 10),
    lastFollowUpDate: new Date().toISOString().slice(0, 10),
    owner: "",
    notes: "",
  };
}

export { createSeedState, createSeedStateForTenant } from "@/lib/profit-pulse/seed";
