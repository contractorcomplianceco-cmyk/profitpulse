import type { TenantContext } from "../types";

export interface TenantRecord {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  displayName?: string;
  createdAt: string;
}

export interface RevenueRecord {
  id: string;
  tenantId: string;
  accountId?: string;
  facilityId?: string;
  recordDate: string;
  category: string;
  description: string;
  amount: number;
}

export interface ExpenseRecord {
  id: string;
  tenantId: string;
  accountId?: string;
  recordDate: string;
  category: string;
  description: string;
  amount: number;
  vendor: string;
}

export interface FacilityRecord {
  id: string;
  tenantId: string;
  accountId: string;
  name: string;
  location: string;
  healthScore: number;
  complianceStatus: "compliant" | "at-risk" | "non-compliant";
  revenueOpportunity: number;
  upsellPotential: number;
  recommendedAction: string;
  priorityRank: number;
  lastInspectionDate?: string;
  riskNotes: string;
}

export interface OpportunityRecord {
  id: string;
  tenantId: string;
  accountId: string;
  title: string;
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  value: number;
  probability: number;
  expectedCloseDate?: string;
  lastFollowUpDate?: string;
  owner: string;
  notes: string;
}

export interface SessionResponse {
  authenticated: boolean;
  tenant: TenantRecord | null;
  user: UserRecord | null;
  permissions: {
    canWrite: boolean;
    canAccessSettings: boolean;
  };
}

export type CreateRevenueInput = Omit<RevenueRecord, "id" | "tenantId">;
export type CreateExpenseInput = Omit<ExpenseRecord, "id" | "tenantId">;
export type CreateFacilityInput = Omit<FacilityRecord, "id" | "tenantId">;
export type CreateOpportunityInput = Omit<OpportunityRecord, "id" | "tenantId">;

export interface AuthRepository {
  getSession(ctx: TenantContext): Promise<SessionResponse>;
  login(email: string, password?: string): Promise<{ token: string; session: SessionResponse }>;
  logout(ctx: TenantContext): Promise<void>;
}

export interface TenantsRepository {
  getCurrent(ctx: TenantContext): Promise<TenantRecord | null>;
}

export interface RevenueRepository {
  list(ctx: TenantContext): Promise<RevenueRecord[]>;
  getById(ctx: TenantContext, id: string): Promise<RevenueRecord | null>;
  create(ctx: TenantContext, input: CreateRevenueInput): Promise<RevenueRecord>;
  update(ctx: TenantContext, id: string, input: Partial<CreateRevenueInput>): Promise<RevenueRecord | null>;
  delete(ctx: TenantContext, id: string): Promise<boolean>;
}

export interface ExpensesRepository {
  list(ctx: TenantContext): Promise<ExpenseRecord[]>;
  getById(ctx: TenantContext, id: string): Promise<ExpenseRecord | null>;
  create(ctx: TenantContext, input: CreateExpenseInput): Promise<ExpenseRecord>;
  update(ctx: TenantContext, id: string, input: Partial<CreateExpenseInput>): Promise<ExpenseRecord | null>;
  delete(ctx: TenantContext, id: string): Promise<boolean>;
}

export interface FacilitiesRepository {
  list(ctx: TenantContext): Promise<FacilityRecord[]>;
  getById(ctx: TenantContext, id: string): Promise<FacilityRecord | null>;
  create(ctx: TenantContext, input: CreateFacilityInput): Promise<FacilityRecord>;
  update(ctx: TenantContext, id: string, input: Partial<CreateFacilityInput>): Promise<FacilityRecord | null>;
  delete(ctx: TenantContext, id: string): Promise<boolean>;
}

export interface OpportunitiesRepository {
  list(ctx: TenantContext): Promise<OpportunityRecord[]>;
  getById(ctx: TenantContext, id: string): Promise<OpportunityRecord | null>;
  create(ctx: TenantContext, input: CreateOpportunityInput): Promise<OpportunityRecord>;
  update(ctx: TenantContext, id: string, input: Partial<CreateOpportunityInput>): Promise<OpportunityRecord | null>;
  delete(ctx: TenantContext, id: string): Promise<boolean>;
}
