import { PageHeader } from "@/components/dashboard/PageHeader";
import { useBilling } from "@/context/BillingProvider";
import { useAuth } from "@/context/AuthProvider";
import { TIER_DEFINITIONS, TIER_ORDER } from "@/billing/tiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { CreditCard, Check } from "lucide-react";
import type { SubscriptionTier } from "@/billing/types";

export default function BillingPage() {
  const { canAccessSettings } = useAuth();
  const {
    tier,
    subscription,
    usage,
    allTiers,
    setTier,
    startTrial,
    trackUsage,
  } = useBilling();
  const [, navigate] = useLocation();

  if (!canAccessSettings) {
    navigate("/");
    return null;
  }

  const handleSelectTier = (t: SubscriptionTier) => {
    if (t === "enterprise") {
      setTier("enterprise");
    } else if (t === "pro") {
      startTrial("pro", 14);
    } else {
      setTier("free");
    }
    trackUsage("api_requests");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <PageHeader
        title="Plans & Billing"
        description="Subscription tiers and usage for this workspace. Stripe integration is not connected yet — changes apply locally."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Current subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Plan:</span> <strong>{TIER_DEFINITIONS[tier].name}</strong></p>
          <p><span className="text-muted-foreground">Status:</span> {subscription?.billing.billingStatus ?? "none"}</p>
          <p><span className="text-muted-foreground">Stripe customer:</span> {subscription?.billing.stripeCustomerId ?? "—"}</p>
          <p><span className="text-muted-foreground">Period ends:</span>{" "}
            {subscription?.billing.currentPeriodEnd
              ? new Date(subscription.billing.currentPeriodEnd).toLocaleDateString()
              : "—"}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {TIER_ORDER.map((id) => {
          const def = allTiers.find((t) => t.id === id)!;
          const active = tier === id;
          return (
            <Card key={id} className={active ? "border-primary shadow-md" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{def.name}</CardTitle>
                  {active && <Badge>Current</Badge>}
                </div>
                <p className="text-2xl font-extrabold">
                  {def.priceMonthlyUsd === null
                    ? "Custom"
                    : def.priceMonthlyUsd === 0
                      ? "Free"
                      : `$${def.priceMonthlyUsd}/mo`}
                </p>
                <p className="text-xs text-muted-foreground">{def.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-xs space-y-1">
                  <li>Revenue rows: {def.limits.maxRevenueRecords ?? "∞"}</li>
                  <li>Facilities: {def.limits.maxFacilities ?? "∞"}</li>
                  <li>Users: {def.limits.maxUsers ?? "∞"}</li>
                  <li>Scenarios: {def.limits.maxSavedScenarios ?? "∞"}</li>
                </ul>
                {!active && (
                  <Button className="w-full" variant={id === "enterprise" ? "outline" : "default"} onClick={() => handleSelectTier(id)}>
                    {id === "free" ? "Downgrade" : id === "pro" ? "Start 14-day trial" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage this period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {Object.entries(usage.metrics).map(([key, val]) => (
                <div key={key} className="rounded-lg border border-border px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{key.replace(/_/g, " ")}</p>
                  <p className="font-bold text-lg">{val}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Check className="w-4 h-4" /> Feature matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          See pricing model documentation in repo <code className="font-mono">docs/PRICING.md</code> for full UI access per tier.
        </CardContent>
      </Card>
    </div>
  );
}
