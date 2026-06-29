import type { BillingRegistry, TenantSubscription, UsageMetricKey, UsageSnapshot, SubscriptionTier } from "./types";
import { BILLING_REGISTRY_KEY, type BillingFlags } from "./types";
import { DEFAULT_TENANT_ID, ACME_TENANT_ID } from "@/auth/types";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function defaultBillingFlags(): BillingFlags {
  return {
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    billingStatus: "none",
    trialEndsAt: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  };
}

function defaultSubscription(tenantId: string, tier: SubscriptionTier): TenantSubscription {
  const now = new Date().toISOString();
  return {
    tenantId,
    tier,
    billing: {
      ...defaultBillingFlags(),
      billingStatus: tier === "free" ? "none" : "active",
      currentPeriodStart: now,
      currentPeriodEnd: tier === "free" ? null : new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    updatedAt: now,
  };
}

export function createDefaultBillingRegistry(): BillingRegistry {
  return {
    version: 1,
    subscriptions: [
      defaultSubscription(DEFAULT_TENANT_ID, "free"),
      defaultSubscription(ACME_TENANT_ID, "enterprise"),
    ],
    usage: [],
  };
}

export function loadBillingRegistry(): BillingRegistry {
  if (!isBrowser()) return createDefaultBillingRegistry();
  try {
    const raw = localStorage.getItem(BILLING_REGISTRY_KEY);
    if (!raw) {
      const seed = createDefaultBillingRegistry();
      saveBillingRegistry(seed);
      return seed;
    }
    const parsed = JSON.parse(raw) as BillingRegistry;
    if (parsed?.version !== 1 || !Array.isArray(parsed.subscriptions)) {
      const seed = createDefaultBillingRegistry();
      saveBillingRegistry(seed);
      return seed;
    }
    if (!parsed.usage) parsed.usage = [];
    return parsed;
  } catch {
    const seed = createDefaultBillingRegistry();
    saveBillingRegistry(seed);
    return seed;
  }
}

export function saveBillingRegistry(registry: BillingRegistry): void {
  if (!isBrowser()) return;
  localStorage.setItem(BILLING_REGISTRY_KEY, JSON.stringify(registry));
}

export function getTenantSubscription(registry: BillingRegistry, tenantId: string): TenantSubscription {
  const existing = registry.subscriptions.find((s) => s.tenantId === tenantId);
  if (existing) return existing;
  const sub = defaultSubscription(tenantId, "free");
  registry.subscriptions.push(sub);
  saveBillingRegistry(registry);
  return sub;
}

export function setTenantTier(
  registry: BillingRegistry,
  tenantId: string,
  tier: SubscriptionTier,
): TenantSubscription {
  const sub = getTenantSubscription(registry, tenantId);
  sub.tier = tier;
  sub.updatedAt = new Date().toISOString();
  sub.billing.billingStatus = tier === "free" ? "none" : "active";
  if (tier !== "free" && !sub.billing.currentPeriodEnd) {
    sub.billing.currentPeriodEnd = new Date(Date.now() + 30 * 86400000).toISOString();
  }
  saveBillingRegistry(registry);
  return sub;
}

function periodStart(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

export function getUsageSnapshot(registry: BillingRegistry, tenantId: string): UsageSnapshot {
  const start = periodStart();
  let snap = registry.usage.find((u) => u.tenantId === tenantId && u.periodStart === start);
  if (!snap) {
    snap = {
      tenantId,
      periodStart: start,
      metrics: {
        revenue_records: 0,
        expense_records: 0,
        facility_records: 0,
        opportunity_records: 0,
        scenario_saves: 0,
        data_exports: 0,
        data_imports: 0,
        copilot_queries: 0,
        api_requests: 0,
      },
      updatedAt: new Date().toISOString(),
    };
    registry.usage.push(snap);
    saveBillingRegistry(registry);
  }
  return snap;
}

export function incrementUsage(
  registry: BillingRegistry,
  tenantId: string,
  metric: UsageMetricKey,
  amount = 1,
): UsageSnapshot {
  const snap = getUsageSnapshot(registry, tenantId);
  snap.metrics[metric] = (snap.metrics[metric] ?? 0) + amount;
  snap.updatedAt = new Date().toISOString();
  saveBillingRegistry(registry);
  return snap;
}
