import type { ComponentType } from "react";
import { RouteFeatureGate } from "@/components/billing/RouteFeatureGate";

/** Wrap a page component with tier-based route gating. */
export function withFeatureGate(path: string, Component: ComponentType) {
  function GatedPage() {
    return (
      <RouteFeatureGate path={path}>
        <Component />
      </RouteFeatureGate>
    );
  }
  GatedPage.displayName = `Gated(${Component.displayName ?? Component.name ?? "Page"})`;
  return GatedPage;
}
