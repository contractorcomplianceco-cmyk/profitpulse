import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatMonths } from "@/lib/format";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import type { DashboardMetrics, ScenarioProjection } from "@/lib/profit-pulse/types";

interface ScenarioComparePanelProps {
  baseline: DashboardMetrics;
  projection: ScenarioProjection;
  decision: string;
}

function CompareRow({
  label,
  before,
  after,
  format,
  higherIsBetter = true,
}: {
  label: string;
  before: number;
  after: number;
  format: (n: number) => string;
  higherIsBetter?: boolean;
}) {
  const delta = after - before;
  const improved = higherIsBetter ? delta >= 0 : delta <= 0;
  const deltaLabel =
    label.includes("margin")
      ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} pts`
      : label.includes("Runway")
        ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} mos`
        : `${delta >= 0 ? "+" : "-"}${format(Math.abs(delta))}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-border/50 last:border-0">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className="text-muted-foreground">{format(before)}</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-black text-foreground">{format(after)}</span>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1 text-sm font-bold ${improved ? "text-success" : "text-destructive"}`}>
        {improved ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {deltaLabel}
      </span>
    </div>
  );
}

export function ScenarioComparePanel({ baseline, projection, decision }: ScenarioComparePanelProps) {
  return (
    <Card className="border-primary/30 shadow-md">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-lg font-bold">Before / After</CardTitle>
        <p className="text-sm text-muted-foreground">Baseline month vs modeled scenario from your live books</p>
      </CardHeader>
      <CardContent className="pt-4">
        <CompareRow label="Monthly revenue" before={baseline.monthlyRevenue} after={projection.projectedRevenue} format={formatCompactCurrency} />
        <CompareRow label="Net profit" before={baseline.netProfit} after={projection.projectedNetProfit} format={formatCompactCurrency} />
        <CompareRow
          label="Gross margin"
          before={baseline.grossMarginPct}
          after={projection.projectedMarginPct}
          format={(n) => `${n.toFixed(1)}%`}
        />
        <CompareRow label="Runway" before={baseline.runwayMonths} after={projection.projectedRunwayMonths} format={formatMonths} />
        <CompareRow
          label="Cash impact"
          before={baseline.cashOnHand}
          after={baseline.cashOnHand + projection.cashImpact}
          format={formatCompactCurrency}
        />

        <div className="mt-5 rounded-lg bg-primary/10 border border-primary/25 p-4">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Recommended decision</div>
          <p className="text-sm font-semibold text-foreground mt-1.5 leading-relaxed">{decision}</p>
        </div>
      </CardContent>
    </Card>
  );
}
