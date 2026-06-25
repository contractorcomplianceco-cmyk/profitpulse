import { Sparkles, ArrowRight, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { isDemoMode } from "@/brand/demoMode";
import { useProductFullName } from "@/brand/BrandProvider";

/**
 * Persistent prospect-facing ribbon shown only in the standalone demo build
 * (VITE_DEMO_MODE=1). Keeps the interactive sandbox fully usable while making
 * the "this is a demo + here's how to convert" framing obvious. Buy / Sign up
 * route to the in-app conversion pages.
 */
export function DemoRibbon() {
  const productFullName = useProductFullName();
  const [, navigate] = useLocation();
  if (!isDemoMode) return null;

  return (
    <div className="relative z-30 flex items-center justify-center gap-3 px-4 py-2 bg-gradient-primary text-primary-foreground shadow-sm">
      <Sparkles className="w-4 h-4 flex-shrink-0" />
      <span className="text-[12.5px] font-semibold tracking-wide text-center hidden sm:inline">
        You're exploring a live demo of {productFullName} with sample data — nothing you change is saved.
      </span>
      <span className="text-[12.5px] font-semibold tracking-wide text-center sm:hidden">
        {productFullName} live demo
      </span>
      <button
        onClick={() => navigate("/signup")}
        className="ml-1 hidden md:inline-flex items-center gap-1.5 rounded-md bg-white/15 hover:bg-white/25 border border-white/30 px-2.5 py-1 text-[12px] font-bold transition-colors"
      >
        Sign up free
      </button>
      <button
        onClick={() => navigate("/buy")}
        className="inline-flex items-center gap-1.5 rounded-md bg-white text-primary hover:bg-white/90 px-2.5 py-1 text-[12px] font-black transition-colors"
      >
        <CreditCard className="w-3.5 h-3.5" />
        Buy now
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
