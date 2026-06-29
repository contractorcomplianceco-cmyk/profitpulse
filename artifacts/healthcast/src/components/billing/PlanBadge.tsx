import { useBilling } from "@/context/BillingProvider";
import { TIER_DEFINITIONS } from "@/billing/tiers";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";

export function PlanBadge() {
  const { tier, subscription } = useBilling();
  const def = TIER_DEFINITIONS[tier];
  const trialing = subscription?.billing.billingStatus === "trialing";

  return (
    <Link href="/billing">
      <div className="mx-4 mb-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 cursor-pointer hover:bg-primary/10 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
            {def.name}
            {trialing ? " · Trial" : ""}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        {tier === "free" && (
          <p className="text-[10px] text-muted-foreground mt-0.5">Upgrade for scenario modeler & more</p>
        )}
      </div>
    </Link>
  );
}
