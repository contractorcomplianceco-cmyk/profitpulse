import type { ReactNode } from "react";
import { Link } from "wouter";
import { useBilling } from "@/context/BillingProvider";
import type { FeatureKey } from "@/billing/types";
import { TIER_DEFINITIONS } from "@/billing/tiers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  /** When true, hide children entirely instead of showing upgrade card */
  hide?: boolean;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, hide = false, fallback }: FeatureGateProps) {
  const { canAccess } = useBilling();
  const access = canAccess(feature);

  if (access.allowed) return <>{children}</>;

  if (hide) return null;

  if (fallback) return <>{fallback}</>;

  const required = TIER_DEFINITIONS[access.requiredTier];

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="py-10 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-bold text-lg">{required.name} plan required</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {access.reason}. Upgrade to unlock this module and additional limits.
        </p>
        <Button asChild>
          <Link href="/billing">View plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
