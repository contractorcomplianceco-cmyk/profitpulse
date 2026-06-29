import type { FeatureKey, SubscriptionTier, TierLimits, UsageMetricKey } from "./types";
import { TIER_DEFINITIONS, tierIncludesFeature } from "./tiers";

export interface FeatureAccessResult {
  allowed: boolean;
  feature: FeatureKey;
  tier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  reason?: string;
}

export function canAccessFeature(tier: SubscriptionTier, feature: FeatureKey): FeatureAccessResult {
  const allowed = tierIncludesFeature(tier, feature);
  const requiredTier = minimumTierFor(feature);
  return {
    allowed,
    feature,
    tier,
    requiredTier,
    reason: allowed ? undefined : `Requires ${TIER_DEFINITIONS[requiredTier].name} plan`,
  };
}

function minimumTierFor(feature: FeatureKey): SubscriptionTier {
  if (TIER_DEFINITIONS.free.features.includes(feature)) return "free";
  if (TIER_DEFINITIONS.pro.features.includes(feature)) return "pro";
  return "enterprise";
}

export function isWithinLimit(
  tier: SubscriptionTier,
  limitKey: keyof TierLimits,
  currentCount: number,
): boolean {
  const limit = TIER_DEFINITIONS[tier].limits[limitKey];
  if (limit === null) return true;
  if (typeof limit === "number" && limitKey === "maxSavedScenarios" && limit === 0) {
    return currentCount < 1;
  }
  return currentCount < limit;
}

export function limitLabel(limitKey: keyof TierLimits, tier: SubscriptionTier): string {
  const v = TIER_DEFINITIONS[tier].limits[limitKey];
  if (v === null) return "Unlimited";
  return String(v);
}

export const USAGE_LIMIT_MAP: Partial<Record<UsageMetricKey, keyof TierLimits>> = {
  revenue_records: "maxRevenueRecords",
  expense_records: "maxExpenseRecords",
  facility_records: "maxFacilities",
  opportunity_records: "maxOpportunities",
  scenario_saves: "maxSavedScenarios",
};
