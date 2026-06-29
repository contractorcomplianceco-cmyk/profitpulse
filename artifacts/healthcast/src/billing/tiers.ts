import type { FeatureKey, SubscriptionTier, TierDefinition, TierLimits } from "./types";

const FREE_FEATURES: FeatureKey[] = [
  "executive_overview",
  "cash_flow",
  "revenue_intelligence",
  "alerts",
];

const PRO_FEATURES: FeatureKey[] = [
  ...FREE_FEATURES,
  "profitability",
  "cash_calendar",
  "ar_ap",
  "sales_pipeline",
  "staffing",
  "marketing_roi",
  "historical_trends",
  "futurecast",
  "scenario_modeler",
  "facility_intelligence",
  "daily_briefing",
  "reports",
  "integrations",
  "integrations_export",
  "audit_log",
];

const ENTERPRISE_FEATURES: FeatureKey[] = [
  ...PRO_FEATURES,
  "department_performance",
  "client_profitability",
  "market_economy",
  "goals",
  "compliance",
  "integrations_import",
  "copilot",
  "white_label",
  "team_invites",
  "api_access",
];

const FREE_LIMITS: TierLimits = {
  maxRevenueRecords: 50,
  maxExpenseRecords: 50,
  maxFacilities: 3,
  maxOpportunities: 5,
  maxUsers: 2,
  maxSavedScenarios: 0,
  auditLogRetentionDays: 0,
};

const PRO_LIMITS: TierLimits = {
  maxRevenueRecords: null,
  maxExpenseRecords: null,
  maxFacilities: 25,
  maxOpportunities: null,
  maxUsers: 10,
  maxSavedScenarios: 20,
  auditLogRetentionDays: 30,
};

const ENTERPRISE_LIMITS: TierLimits = {
  maxRevenueRecords: null,
  maxExpenseRecords: null,
  maxFacilities: null,
  maxOpportunities: null,
  maxUsers: null,
  maxSavedScenarios: null,
  auditLogRetentionDays: null,
};

export const TIER_DEFINITIONS: Record<SubscriptionTier, TierDefinition> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthlyUsd: 0,
    priceAnnualUsd: 0,
    tagline: "Executive visibility for small teams getting started.",
    limits: FREE_LIMITS,
    features: FREE_FEATURES,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthlyUsd: 149,
    priceAnnualUsd: 1490,
    tagline: "Full financial operations, pipeline, and scenario planning.",
    limits: PRO_LIMITS,
    features: PRO_FEATURES,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    priceMonthlyUsd: null,
    priceAnnualUsd: null,
    tagline: "White-label, copilot, compliance, and unlimited scale.",
    limits: ENTERPRISE_LIMITS,
    features: ENTERPRISE_FEATURES,
  },
};

export const TIER_ORDER: SubscriptionTier[] = ["free", "pro", "enterprise"];

export function tierIncludesFeature(tier: SubscriptionTier, feature: FeatureKey): boolean {
  return TIER_DEFINITIONS[tier].features.includes(feature);
}

export function minimumTierForFeature(feature: FeatureKey): SubscriptionTier {
  if (TIER_DEFINITIONS.free.features.includes(feature)) return "free";
  if (TIER_DEFINITIONS.pro.features.includes(feature)) return "pro";
  return "enterprise";
}

/** Route path → feature key for sidebar gating */
export const ROUTE_FEATURE_MAP: Record<string, FeatureKey> = {
  "/": "executive_overview",
  "/cash-flow": "cash_flow",
  "/revenue-intelligence": "revenue_intelligence",
  "/profitability": "profitability",
  "/cash-calendar": "cash_calendar",
  "/ar-ap-collections": "ar_ap",
  "/sales-pipeline": "sales_pipeline",
  "/staffing-payroll": "staffing",
  "/marketing-roi": "marketing_roi",
  "/department-performance": "department_performance",
  "/client-profitability": "client_profitability",
  "/historical-trends": "historical_trends",
  "/market-economy": "market_economy",
  "/futurecast": "futurecast",
  "/scenario-builder": "scenario_modeler",
  "/goals": "goals",
  "/facility-intelligence": "facility_intelligence",
  "/compliance": "compliance",
  "/alerts": "alerts",
  "/daily-briefing": "daily_briefing",
  "/reports": "reports",
  "/integrations": "integrations",
  "/copilot": "copilot",
  "/settings": "white_label",
  "/team": "team_invites",
  "/audit": "audit_log",
};

export function featureForRoute(href: string): FeatureKey | undefined {
  const path = href.replace(/\/$/, "") || "/";
  return ROUTE_FEATURE_MAP[path];
}
