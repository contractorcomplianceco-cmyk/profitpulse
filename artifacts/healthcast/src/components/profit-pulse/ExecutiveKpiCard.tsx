import { Sparkline } from "@/components/charts/Sparkline";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ExecutiveKpiCardProps {
  label: string;
  value: string;
  basis: string;
  trend: string;
  trendUp: boolean;
  vs: string;
  sparkline: number[];
  icon: LucideIcon;
  accent: { tile: string; bar: string; spark: string };
  risk?: "critical" | "warning" | "info" | null;
}

export function ExecutiveKpiCard({
  label,
  value,
  basis,
  trend,
  trendUp,
  vs,
  sparkline,
  icon: Icon,
  accent,
  risk,
}: ExecutiveKpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-soft hover:border-primary/50 transition-all flex flex-col gap-2 relative overflow-hidden group">
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accent.bar} pointer-events-none`} />
      <div className="flex items-start justify-between gap-2">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent.tile}`}>
          <Icon className="h-5 w-5" />
        </div>
        {risk && <AlertBadge severity={risk} />}
      </div>
      <div className="text-[10px] font-extrabold tracking-wide text-muted-foreground uppercase whitespace-nowrap">{label}</div>
      <div className="text-2xl 2xl:text-[1.7rem] font-black tracking-tight text-foreground whitespace-nowrap tabular-nums leading-tight">{value}</div>
      <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{basis}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <div className="flex flex-col">
          <span className={`text-[13px] flex items-center font-bold ${trendUp ? "text-success" : "text-destructive"}`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
            {trend}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{vs}</span>
        </div>
        <div className="w-16 h-8">
          <Sparkline data={sparkline} color={accent.spark} type="area" />
        </div>
      </div>
    </div>
  );
}
