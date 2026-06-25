import { Sparkles, ArrowRight, CalendarCheck } from "lucide-react";
import { isDemoMode, demoConfig } from "@/brand/demoMode";
import { useProductFullName } from "@/brand/BrandProvider";

/**
 * Persistent prospect-facing ribbon shown only in the standalone demo build
 * (VITE_DEMO_MODE=1). Keeps the interactive sandbox fully usable while making
 * the "this is a demo + here's how to buy" framing obvious.
 */
export function DemoRibbon() {
  const productFullName = useProductFullName();
  if (!isDemoMode) return null;

  return (
    <div className="relative z-30 flex items-center justify-center gap-3 px-4 py-2 bg-gradient-primary text-primary-foreground shadow-sm">
      <Sparkles className="w-4 h-4 flex-shrink-0" />
      <span className="text-[12.5px] font-semibold tracking-wide text-center hidden sm:inline">
        {demoConfig.ribbonText}
      </span>
      <span className="text-[12.5px] font-semibold tracking-wide text-center sm:hidden">
        {productFullName} interactive demo
      </span>
      <a
        href={demoConfig.secondaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 hidden md:inline-flex items-center gap-1.5 rounded-md bg-white/15 hover:bg-white/25 border border-white/30 px-2.5 py-1 text-[12px] font-bold transition-colors"
      >
        <CalendarCheck className="w-3.5 h-3.5" />
        {demoConfig.secondaryLabel}
      </a>
      <a
        href={demoConfig.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-white text-primary hover:bg-white/90 px-2.5 py-1 text-[12px] font-black transition-colors"
      >
        {demoConfig.ctaLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
