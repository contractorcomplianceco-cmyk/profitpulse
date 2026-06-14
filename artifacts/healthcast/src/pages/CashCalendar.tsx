import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { TrendLine } from "@/components/charts/TrendLine";
import { cn } from "@/lib/utils";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import {
  openingBalance,
  closingBalance,
  totalInflow,
  totalOutflow,
  netCashFlow,
  lowestBalance,
  lowestBalanceDate,
  biggestInflowDay,
  biggestOutflowDay,
  balanceTrend,
  typeTotals,
  eventsWithBalance,
  eventTypeMeta,
  lowBalanceThreshold,
  type CashEventType,
} from "@/data/cashCalendarData";
import {
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Users,
  Landmark,
  Receipt,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CalendarClock,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const typeIconMap: Record<CashEventType, any> = {
  collection: Banknote,
  payroll: Users,
  tax: Landmark,
  vendor: Receipt,
  debt: CreditCard,
};

const typeColorMap: Record<CashEventType, string> = {
  collection: "hsl(var(--success))",
  payroll: "hsl(var(--destructive))",
  tax: "hsl(35 92% 55%)",
  vendor: "hsl(var(--cyan))",
  debt: "hsl(280 70% 62%)",
};

const confidenceLabel: Record<string, string> = {
  confirmed: "Confirmed",
  expected: "Expected",
  estimated: "Estimated",
};

const tint = (color: string, alpha: number) => `${color.slice(0, -1)} / ${alpha})`;

function bucketLabel(dayOffset: number): string {
  if (dayOffset <= 30) return "Days 1 - 30";
  if (dayOffset <= 60) return "Days 31 - 60";
  return "Days 61 - 90";
}

export default function CashCalendar() {
  const buckets = ["Days 1 - 30", "Days 31 - 60", "Days 61 - 90"];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Cash Calendar"
        description="Forward-looking 90-day timeline of expected cash movements and running projected balance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Opening Balance" value={formatCompactCurrency(openingBalance)} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Projected (90d)" value={formatCompactCurrency(closingBalance)} priorValue={openingBalance} trend={balanceTrend.map((b) => b.balance)} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Total Inflows" value={formatCompactCurrency(totalInflow)} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Total Outflows" value={formatCompactCurrency(totalOutflow)} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Lowest Balance" value={formatCompactCurrency(lowestBalance)} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Projected Cash Balance" description="Running balance across all scheduled movements over the next 90 days">
            <div className="h-[300px] w-full mt-4">
              <TrendLine
                data={balanceTrend}
                lines={[{ key: "balance", color: "hsl(var(--primary))", name: "Projected Balance" }]}
                xAxisKey="date"
                type="area"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Net 90-Day Flow</span>
                <span className={cn("font-black text-base", netCashFlow >= 0 ? "text-success" : "text-destructive")}>
                  {netCashFlow >= 0 ? "+" : "-"}{formatCompactCurrency(Math.abs(netCashFlow))}
                </span>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Lowest Point</span>
                <span className="font-black text-base text-warning">{lowestBalanceDate}</span>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Scheduled Events</span>
                <span className="font-black text-base text-foreground">{eventsWithBalance.length}</span>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="surface-gradient border border-border rounded-xl p-5 shadow-lg shadow-black/20 relative overflow-hidden accent-topline">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-success/10 p-2 rounded-lg border border-success/20 text-success">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">Biggest Inflow Day</span>
              </div>
              <div className="text-2xl font-black text-success tracking-tight">+{formatCompactCurrency(biggestInflowDay.amount)}</div>
              <div className="text-[13px] font-bold text-foreground mt-1">{biggestInflowDay.label}</div>
              <div className="text-[11px] font-medium text-muted-foreground mt-0.5">{biggestInflowDay.date} &bull; {biggestInflowDay.detail}</div>
            </div>

            <div className="surface-gradient border border-border rounded-xl p-5 shadow-lg shadow-black/20 relative overflow-hidden accent-topline">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-destructive/10 p-2 rounded-lg border border-destructive/20 text-destructive">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">Biggest Outflow Day</span>
              </div>
              <div className="text-2xl font-black text-destructive tracking-tight">-{formatCompactCurrency(biggestOutflowDay.amount)}</div>
              <div className="text-[13px] font-bold text-foreground mt-1">{biggestOutflowDay.label}</div>
              <div className="text-[11px] font-medium text-muted-foreground mt-0.5">{biggestOutflowDay.date} &bull; {biggestOutflowDay.detail}</div>
            </div>
          </div>

          {lowestBalance < lowBalanceThreshold ? (
            <RiskWarning
              title={`Low Balance Risk: ${lowestBalanceDate}`}
              message={`Projected balance dips to ${formatCurrency(lowestBalance)} — below the ${formatCompactCurrency(lowBalanceThreshold)} safety floor. Accelerate collections or defer discretionary spend ahead of this window.`}
            />
          ) : (
            <InsightCard title="Liquidity Outlook">
              Projected balance stays above the {formatCompactCurrency(lowBalanceThreshold)} safety floor across the full 90-day window, with the tightest point of {formatCurrency(lowestBalance)} on {lowestBalanceDate}.
            </InsightCard>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {typeTotals.map((t) => {
          const Icon = typeIconMap[t.type];
          return (
            <motion.div
              key={t.type}
              variants={itemVariants}
              className="surface-gradient border border-border rounded-xl p-4 shadow-lg shadow-black/20 hover:border-primary/40 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div
                  className="p-2 rounded-lg border"
                  style={{ backgroundColor: tint(t.color, 0.12), borderColor: tint(t.color, 0.25), color: t.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.count}x</span>
              </div>
              <div className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">{t.label}</div>
              <div className={cn("text-lg font-black tracking-tight", t.direction === "in" ? "text-success" : "text-foreground")}>
                {t.direction === "in" ? "+" : "-"}{formatCompactCurrency(t.total)}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants}>
        <ChartCard title="90-Day Cash Timeline" description="Every scheduled movement with the resulting running balance">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-1 mb-5">
            {eventTypeMeta.map((meta) => (
              <div key={meta.type} className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: meta.color }} />
                {meta.label}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {buckets.map((bucket) => {
              const bucketEvents = eventsWithBalance.filter((e) => bucketLabel(e.dayOffset) === bucket);
              if (bucketEvents.length === 0) return null;
              return (
                <div key={bucket}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <CalendarClock className="w-4 h-4 text-primary" />
                    <h4 className="text-[11px] font-extrabold tracking-widest text-foreground uppercase">{bucket}</h4>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-2.5">
                    {bucketEvents.map((event) => {
                      const Icon = typeIconMap[event.type];
                      const color = typeColorMap[event.type];
                      const isIn = event.direction === "in";
                      const lowFlag = event.balanceAfter < lowBalanceThreshold;
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-4 p-3.5 rounded-lg bg-secondary/20 hover:bg-secondary/40 border border-border/50 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center min-w-[52px]">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{event.date}</span>
                          </div>
                          <div
                            className="p-2 rounded-md border shrink-0"
                            style={{
                              backgroundColor: tint(color, 0.12),
                              borderColor: tint(color, 0.25),
                              color,
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-bold text-white leading-tight truncate">{event.label}</div>
                            <div className="text-[11px] font-medium text-muted-foreground mt-0.5 truncate">{event.detail}</div>
                          </div>
                          <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/40 border border-border/50 px-2 py-0.5 rounded">
                            {confidenceLabel[event.confidence]}
                          </span>
                          <div className="text-right shrink-0 w-[110px]">
                            <div className={cn("text-[14px] font-black flex items-center justify-end gap-1", isIn ? "text-success" : "text-destructive")}>
                              {isIn ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" /> : <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />}
                              {isIn ? "+" : "-"}{formatCompactCurrency(event.amount)}
                            </div>
                            <div className={cn("text-[11px] font-bold tabular-nums mt-0.5", lowFlag ? "text-warning" : "text-muted-foreground")}>
                              {formatCompactCurrency(event.balanceAfter)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <RecommendedAction
          title="Smooth the Day 15 outflow cluster"
          description="Tax estimate, lease, and an upcoming payroll concentrate near the lowest projected balance. Pull forward two confirmed collections or arrange a short-term sweep to hold a comfortable buffer."
          actionText="Build Mitigation Plan"
        />
      </motion.div>
    </motion.div>
  );
}
