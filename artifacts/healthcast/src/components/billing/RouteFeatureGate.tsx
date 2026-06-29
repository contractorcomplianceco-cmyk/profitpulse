import { useEffect } from "react";
import { useLocation } from "wouter";
import { useBilling } from "@/context/BillingProvider";
import { FeatureGate } from "@/components/billing/FeatureGate";
import { featureForRoute } from "@/billing/tiers";
import type { FeatureKey } from "@/billing/types";

interface RouteFeatureGateProps {
  path: string;
  children: React.ReactNode;
}

export function RouteFeatureGate({ path, children }: RouteFeatureGateProps) {
  const { canAccessRoute } = useBilling();
  const [, navigate] = useLocation();
  const feature = featureForRoute(path) as FeatureKey | undefined;
  const access = canAccessRoute(path);

  useEffect(() => {
    if (feature && !access.allowed) {
      // Stay on page but show upgrade card — no redirect
    }
  }, [feature, access.allowed]);

  if (!feature || access.allowed) return <>{children}</>;

  return <FeatureGate feature={feature}>{children}</FeatureGate>;
}
