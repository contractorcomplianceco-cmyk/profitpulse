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

interface ProfitPulseContextValue {
  state: ProfitPulseState;
  metrics: DashboardMetrics;
  alerts: ComputedAlert[];
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
  const [state, setState] = useState<ProfitPulseState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const alerts = useMemo(() => generateAlerts(state), [state]);
  const metrics = useMemo(
    () => computeDashboardMetrics(state, alerts.length),
    [state, alerts.length],
  );

  const commit = useCallback((updater: (prev: ProfitPulseState) => ProfitPulseState) => {
    setState((prev) => updater(prev));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(resetStoredState());
  }, []);

  const exportJson = useCallback(() => exportStateJson(state), [state]);

  const importJson = useCallback((raw: string) => {
    setState(importStateJson(raw));
  }, []);

  const importCsv = useCallback(
    (csv: string): CsvImportResult => {
      const draft = structuredClone(state);
      const result = parseCsvImport(csv, draft);
      if (result.imported > 0) setState(draft);
      return result;
    },
    [state],
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
    },
    [commit],
  );

  const promoteFacilityToOpportunity = useCallback(
    (facilityId: string) => {
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
    },
    [commit],
  );

  const makeCrud = <T extends { id: string }>(key: EntityCollection) => ({
    upsert: (record: T) =>
      commit((prev) => ({ ...prev, [key]: upsertById(prev[key] as unknown as T[], record) })),
    remove: (id: string) =>
      commit((prev) => ({ ...prev, [key]: removeById(prev[key] as unknown as T[], id) })),
  });

  const accountsCrud = makeCrud<Account>("accounts");
  const facilitiesCrud = makeCrud<Facility>("facilities");
  const revenueCrud = makeCrud<RevenueRecord>("revenueRecords");
  const expenseCrud = makeCrud<ExpenseRecord>("expenseRecords");
  const invoicesCrud = makeCrud<Invoice>("invoices");
  const payablesCrud = makeCrud<PayableBill>("payables");
  const staffingCrud = makeCrud<StaffingRecord>("staffing");
  const opportunitiesCrud = makeCrud<Opportunity>("opportunities");
  const risksCrud = makeCrud<RiskRecord>("risks");
  const tasksCrud = makeCrud<Task>("tasks");

  const value = useMemo<ProfitPulseContextValue>(
    () => ({
      state,
      metrics,
      alerts,
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

export { createSeedState };
