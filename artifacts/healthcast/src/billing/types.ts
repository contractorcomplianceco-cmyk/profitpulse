export type SubscriptionTier = "free" | "pro" | "enterprise";

export type BillingStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "none";

/** Feature keys map to routes, UI modules, and API capabilities. */
export type FeatureKey =
  | "executive_overview"
  | "cash_flow"
  | "revenue_intelligence"
  | "profitability"
  | "cash_calendar"
  | "ar_ap"
  | "sales_pipeline"
  | "staffing"
  | "marketing_roi"
  | "department_performance"
  | "client_profitability"
  | "historical_trends"
  | "market_economy"
  | "futurecast"
  | "scenario_modeler"
  | "goals"
  | "facility_intelligence"
  | "compliance"
  | "alerts"
  | "daily_briefing"
  | "reports"
  | "integrations"
  | "integrations_import"
  | "integrations_export"
  | "copilot"
  | "white_label"
  | "team_invites"
  | "audit_log"
  | "api_access";

export type UsageMetricKey =
  | "revenue_records"
  | "expense_records"
  | "facility_records"
  | "opportunity_records"
  | "scenario_saves"
  | "data_exports"
  | "data_imports"
  | "copilot_queries"
  | "api_requests";

export interface TierLimits {
  maxRevenueRecords: number | null;
  maxExpenseRecords: number | null;
  maxFacilities: number | null;
  maxOpportunities: number | null;
  maxUsers: number | null;
  maxSavedScenarios: number | null;
  auditLogRetentionDays: number | null;
}

export interface TierDefinition {
  id: SubscriptionTier;
  name: string;
  priceMonthlyUsd: number | null;
  priceAnnualUsd: number | null;
  tagline: string;
  limits: TierLimits;
  features: FeatureKey[];
}

export interface BillingFlags {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  billingStatus: BillingStatus;
  trialEndsAt: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface TenantSubscription {
  tenantId: string;
  tier: SubscriptionTier;
  billing: BillingFlags;
  updatedAt: string;
}

export interface UsageSnapshot {
  tenantId: string;
  periodStart: string;
  metrics: Record<UsageMetricKey, number>;
  updatedAt: string;
}

export interface BillingRegistry {
  version: 1;
  subscriptions: TenantSubscription[];
  usage: UsageSnapshot[];
}

export const BILLING_REGISTRY_KEY = "profit-pulse-billing-v1";
