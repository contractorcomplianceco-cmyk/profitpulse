import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthProvider";
import { canAccessFeature, isWithinLimit, type FeatureAccessResult } from "@/billing/features";
import {
  getTenantSubscription,
  getUsageSnapshot,
  incrementUsage,
  loadBillingRegistry,
  saveBillingRegistry,
  setTenantTier,
} from "@/billing/subscription";
import { TIER_DEFINITIONS, featureForRoute } from "@/billing/tiers";
import type {
  BillingRegistry,
  FeatureKey,
  SubscriptionTier,
  TenantSubscription,
  TierDefinition,
  UsageMetricKey,
  UsageSnapshot,
} from "@/billing/types";

interface BillingContextValue {
  tier: SubscriptionTier;
  tierDefinition: TierDefinition;
  subscription: TenantSubscription | null;
  usage: UsageSnapshot | null;
  canAccess: (feature: FeatureKey) => FeatureAccessResult;
  canAccessRoute: (href: string) => FeatureAccessResult | { allowed: true };
  checkLimit: (metric: UsageMetricKey, currentCount: number) => boolean;
  trackUsage: (metric: UsageMetricKey, amount?: number) => void;
  setTier: (tier: SubscriptionTier) => void;
  startTrial: (tier: "pro" | "enterprise", days?: number) => void;
  allTiers: TierDefinition[];
}

const BillingContext = createContext<BillingContextValue | null>(null);

export function BillingProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const tenantId = session?.tenantId ?? null;
  const [registry, setRegistry] = useState<BillingRegistry>(() => loadBillingRegistry());

  const subscription = useMemo(
    () => (tenantId ? getTenantSubscription(registry, tenantId) : null),
    [registry, tenantId],
  );

  const tier = subscription?.tier ?? "free";
  const tierDefinition = TIER_DEFINITIONS[tier];

  const usage = useMemo(
    () => (tenantId ? getUsageSnapshot(registry, tenantId) : null),
    [registry, tenantId],
  );

  const canAccess = useCallback(
    (feature: FeatureKey) => canAccessFeature(tier, feature),
    [tier],
  );

  const canAccessRoute = useCallback(
    (href: string) => {
      const feature = featureForRoute(href);
      if (!feature) return { allowed: true as const };
      return canAccessFeature(tier, feature);
    },
    [tier],
  );

  const checkLimit = useCallback(
    (metric: UsageMetricKey, currentCount: number) => {
      const limitKey =
        metric === "revenue_records"
          ? "maxRevenueRecords"
          : metric === "expense_records"
            ? "maxExpenseRecords"
            : metric === "facility_records"
              ? "maxFacilities"
              : metric === "opportunity_records"
                ? "maxOpportunities"
                : metric === "scenario_saves"
                  ? "maxSavedScenarios"
                  : null;
      if (!limitKey) return true;
      return isWithinLimit(tier, limitKey, currentCount);
    },
    [tier],
  );

  const trackUsage = useCallback(
    (metric: UsageMetricKey, amount = 1) => {
      if (!tenantId) return;
      const reg = loadBillingRegistry();
      incrementUsage(reg, tenantId, metric, amount);
      setRegistry({ ...reg });
    },
    [tenantId],
  );

  const setTier = useCallback(
    (nextTier: SubscriptionTier) => {
      if (!tenantId) return;
      const reg = loadBillingRegistry();
      setTenantTier(reg, tenantId, nextTier);
      setRegistry({ ...reg });
    },
    [tenantId],
  );

  const startTrial = useCallback(
    (nextTier: "pro" | "enterprise", days = 14) => {
      if (!tenantId) return;
      const reg = loadBillingRegistry();
      const sub = setTenantTier(reg, tenantId, nextTier);
      sub.billing.billingStatus = "trialing";
      sub.billing.trialEndsAt = new Date(Date.now() + days * 86400000).toISOString();
      saveBillingRegistry(reg);
      setRegistry({ ...reg });
    },
    [tenantId],
  );

  const value = useMemo<BillingContextValue>(
    () => ({
      tier,
      tierDefinition,
      subscription,
      usage,
      canAccess,
      canAccessRoute,
      checkLimit,
      trackUsage,
      setTier,
      startTrial,
      allTiers: Object.values(TIER_DEFINITIONS),
    }),
    [
      tier,
      tierDefinition,
      subscription,
      usage,
      canAccess,
      canAccessRoute,
      checkLimit,
      trackUsage,
      setTier,
      startTrial,
    ],
  );

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling(): BillingContextValue {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("useBilling must be used within BillingProvider");
  return ctx;
}
