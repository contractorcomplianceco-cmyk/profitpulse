import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { DonutChart } from "@/components/charts/DonutChart";
import { TrendLine } from "@/components/charts/TrendLine";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCompactCurrency } from "@/lib/format";
import {
  goalsSummary,
  quarterMeta,
  statusBreakdown,
  attainmentTrend,
  objectives,
  pacingAlert,
  recommendedFocus,
  objectiveInsight,
  type GoalStatus,
  type KeyResult,
} from "@/data/goalsData";
import { Target, CalendarClock, CheckCircle2, AlertTriangle, TrendingDown, Minus } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const statusMeta: Record<GoalStatus, { label: string; text: string; bg: string; bar: string; dot: string }> = {
  "on-track": {
    label: "On Track",
    text: "text-success",
    bg: "bg-success/15 border-success/30",
    bar: "bg-gradient-success",
    dot: "bg-success shadow-[0_0_10px_hsl(var(--success))]",
  },
  "at-risk": {
    label: "At Risk",
    text: "text-warning",
    bg: "bg-warning/15 border-warning/30",
    bar: "bg-gradient-warning",
    dot: "bg-warning shadow-[0_0_10px_hsl(var(--warning))]",
  },
  behind: {
    label: "Behind",
    text: "text-destructive",
    bg: "bg-destructive/15 border-destructive/30",
    bar: "bg-gradient-to-r from-destructive to-[hsl(360_80%_45%)]",
    dot: "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]",
  },
  achieved: {
    label: "Achieved",
    text: "text-primary",
    bg: "bg-primary/15 border-primary/30",
    bar: "bg-gradient-primary",
    dot: "bg-primary shadow-[0_0_10px_hsl(var(--primary))]",
  },
};

function formatKrValue(unit: KeyResult["unit"], value: number): string {
  switch (unit) {
    case "currency":
      return formatCompactCurrency(value);
    case "percent":
      return `${value}%`;
    case "months":
      return `${value} mo`;
    case "days":
      return `${value} d`;
    case "ratio":
      return `${value}x`;
    case "count":
    default:
      return `${value}`;
  }
}

function krProgress(kr: KeyResult): number {
  const span = kr.target - kr.baseline;
  if (span === 0) return 100;
  const pct = ((kr.current - kr.baseline) / span) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function StatusBadge({ status }: { status: GoalStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge
      variant="outline"
      className={cn("uppercase tracking-widest text-[10px] px-2 py-0.5 rounded-sm font-bold", meta.bg, meta.text)}
    >
      {meta.label}
    </Badge>
  );
}

function KrStatusIcon({ status }: { status: GoalStatus }) {
  if (status === "on-track" || status === "achieved")
    return <CheckCircle2 className="w-4 h-4 text-success" />;
  if (status === "at-risk") return <AlertTriangle className="w-4 h-4 text-warning" />;
  return <TrendingDown className="w-4 h-4 text-destructive" />;
}

export default function GoalsOkrs() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Goals & OKRs"
        description="Track financial objectives and key results against target, pace, and owner accountability."
        actions={
          <div className="flex items-center gap-2 rounded-lg surface-gradient border border-primary/30 px-3.5 py-2 shadow-md shadow-primary/10">
            <CalendarClock className="w-4 h-4 text-primary" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                {quarterMeta.label}
              </span>
              <span className="text-[11px] font-bold text-foreground">{quarterMeta.daysRemaining} days remaining</span>
            </div>
          </div>
        }
      />

      {/* SUMMARY KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Overall Attainment"
            value={goalsSummary.overallAttainment.value}
            suffix="%"
            priorValue={goalsSummary.overallAttainment.priorValue}
            trend={goalsSummary.overallAttainment.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Objectives On Track"
            value={`${goalsSummary.objectivesOnTrack.value}/${goalsSummary.objectivesOnTrack.total}`}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Key Results Tracked"
            value={goalsSummary.keyResultsTracked.value}
            priorValue={goalsSummary.keyResultsTracked.priorValue}
            trend={goalsSummary.keyResultsTracked.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Key Results At Risk"
            value={goalsSummary.atRiskCount.value}
            priorValue={goalsSummary.atRiskCount.priorValue}
            trend={goalsSummary.atRiskCount.trend}
            inverseTrend
          />
        </motion.div>
      </div>

      {/* PACING + ATTAINMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Attainment vs Target Pace" description="Cumulative goal attainment against planned pace">
            <div className="h-[260px] w-full mt-2">
              <TrendLine
                data={attainmentTrend}
                lines={[
                  { key: "target", color: "hsl(var(--muted-foreground))", name: "Target Pace" },
                  { key: "actual", color: "hsl(var(--primary))", name: "Actual" },
                ]}
                xAxisKey="month"
                type="area"
              />
            </div>
            <div className="mt-4 rounded-lg surface-gradient border border-border/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  {quarterMeta.label} Time Elapsed
                </span>
                <span className="text-[12px] font-bold text-foreground tabular-nums">
                  {quarterMeta.timeElapsedPct}%
                </span>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan to-primary"
                  style={{ width: `${quarterMeta.timeElapsedPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                <span>{quarterMeta.startDate}</span>
                <span>{quarterMeta.endDate}</span>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <ChartCard title="Key Result Status">
            <div className="flex items-center h-[180px] mt-2">
              <div className="w-1/2 h-full">
                <DonutChart data={statusBreakdown} centerText="18" centerSubtext="Key Results" />
              </div>
              <div className="w-1/2 flex flex-col gap-2.5 pl-3 justify-center">
                {statusBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center text-[12px] font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm mr-2.5 flex-shrink-0" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground truncate mr-auto">{item.name}</span>
                    <span className="text-white font-bold ml-3 tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <InsightCard title="OKR Intelligence">{objectiveInsight}</InsightCard>
        </motion.div>
      </div>

      {/* RISK + ACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <RiskWarning title={pacingAlert.title} message={pacingAlert.message} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <RecommendedAction
            title={recommendedFocus.title}
            description={recommendedFocus.description}
            actionText={recommendedFocus.actionText}
          />
        </motion.div>
      </div>

      {/* OBJECTIVES + KEY RESULTS */}
      <motion.div variants={itemVariants} className="flex items-center gap-2.5 pt-2">
        <Target className="w-5 h-5 text-primary" />
        <h2 className="text-sm font-extrabold tracking-widest uppercase text-foreground">Objectives & Key Results</h2>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {objectives.map((obj) => {
          const meta = statusMeta[obj.status];
          const pacingGap = obj.progress - quarterMeta.timeElapsedPct;
          return (
            <motion.div
              key={obj.id}
              variants={itemVariants}
              className="surface-gradient border border-border rounded-xl shadow-lg shadow-black/20 hover:border-primary/40 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden accent-topline"
            >
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="p-6 relative">
                {/* Objective header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={cn("mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0", meta.dot)} />
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-black tracking-tight text-foreground leading-tight">
                        {obj.title}
                      </h3>
                      <p className="text-[12px] text-muted-foreground font-medium mt-1 leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={obj.status} />
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pl-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    {obj.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{obj.period}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">Owner: {obj.owner}</span>
                </div>

                {/* Objective progress */}
                <div className="mt-4 pl-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                      Objective Progress
                    </span>
                    <span className="text-[12px] font-black text-foreground tabular-nums">{obj.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary/50 h-2.5 rounded-full overflow-hidden relative">
                    <div className={cn("h-full rounded-full", meta.bar)} style={{ width: `${obj.progress}%` }} />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-foreground/70"
                      style={{ left: `${quarterMeta.timeElapsedPct}%` }}
                      title="Time elapsed"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {pacingGap >= 0 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span
                      className={cn(
                        "text-[11px] font-bold",
                        pacingGap >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {pacingGap >= 0 ? `+${pacingGap}` : pacingGap} pts vs pace
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                      ({quarterMeta.timeElapsedPct}% elapsed)
                    </span>
                  </div>
                </div>

                {/* Key results */}
                <div className="mt-5 pt-4 border-t border-border/60 space-y-4">
                  {obj.keyResults.map((kr) => {
                    const prog = krProgress(kr);
                    const krm = statusMeta[kr.status];
                    return (
                      <div key={kr.id}>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <KrStatusIcon status={kr.status} />
                            <span className="text-[13px] font-bold text-white truncate">{kr.metric}</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 flex-shrink-0">
                            <span className={cn("text-[13px] font-black tabular-nums", krm.text)}>
                              {formatKrValue(kr.unit, kr.current)}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
                              / {formatKrValue(kr.unit, kr.target)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-secondary/50 h-1.5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", krm.bar)} style={{ width: `${prog}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                            {kr.owner}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                            {prog}% to target
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
