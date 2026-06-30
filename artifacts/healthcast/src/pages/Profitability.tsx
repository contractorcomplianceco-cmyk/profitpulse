import { useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { useProfitPulse } from "@/context/ProfitPulseProvider";
import { LiveDataBanner } from "@/components/profit-pulse/LiveDataBanner";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import {
  expenseByCategoryLive,
  lowMarginAccountsLive,
  marginByCategoryLive,
} from "@/lib/profit-pulse/calculations";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function Profitability() {
  const { state, metrics } = useProfitPulse();

  const marginByLine = useMemo(() => marginByCategoryLive(state), [state]);
  const costBreakdown = useMemo(() => expenseByCategoryLive(state), [state]);
  const lowMargin = useMemo(() => lowMarginAccountsLive(state), [state]);

  const worstLine = marginByLine.length ? marginByLine.reduce((a, b) => (a.margin < b.margin ? a : b)) : null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Profitability"
        description="Margin analysis from your revenue and expense records — sample evaluation workspace."
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <LiveDataBanner detail={`Gross margin ${metrics.grossMarginPct.toFixed(1)}% · target ${state.organization.marginThresholdPct}%`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Gross Profit" value={formatCompactCurrency(metrics.monthlyRevenue - metrics.monthlyExpenses)} priorValue={metrics.priorMonthlyRevenue - metrics.monthlyExpenses} trend={metrics.revenueTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Net Profit" value={formatCompactCurrency(metrics.netProfit)} priorValue={metrics.priorNetProfit} trend={metrics.revenueTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Gross Margin" value={formatPercent(metrics.grossMarginPct)} priorValue={metrics.grossMarginPct * 0.97} trend={metrics.revenueTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Operating Margin" value={formatPercent(metrics.operatingMarginPct)} priorValue={metrics.operatingMarginPct * 0.97} trend={metrics.revenueTrend} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Margin by Revenue Category" description="Estimated from revenue and allocated job costs">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marginByLine} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} formatter={(val) => [`${val}%`, "Margin"]} />
                  <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                    {marginByLine.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.margin >= state.organization.marginThresholdPct ? "hsl(var(--success))" : entry.margin >= 10 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          {worstLine && worstLine.margin < state.organization.marginThresholdPct ? (
            <InsightCard title="Margin pressure">
              {worstLine.name} is running at {worstLine.margin.toFixed(1)}% margin — below your {state.organization.marginThresholdPct}% target. Review labor and materials on active jobs in this category.
            </InsightCard>
          ) : (
            <InsightCard title="Margin health">Categories are at or above target based on current sample records.</InsightCard>
          )}

          {lowMargin.length > 0 && (
            <RiskWarning title="Low-margin clients" message={`${lowMargin[0].name} at ${lowMargin[0].margin}% — ${lowMargin[0].reason}`} />
          )}

          <RecommendedAction title="Scenario planning" description="Model price and collection improvements in Scenario Modeler." actionText="Open Scenario Modeler" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown (90d)</h3>
          <div className="space-y-4">
            {costBreakdown.slice(0, 5).map((row) => (
              <div key={row.category} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-muted-foreground">{row.category}</span>
                <span className="font-semibold">{formatCurrency(row.amount)}</span>
              </div>
            ))}
            {costBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground">Add expense records to see cost breakdown.</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5 col-span-2">
          <h3 className="text-lg font-semibold mb-4">Low-Margin Clients</h3>
          <div className="space-y-3">
            {lowMargin.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients below {state.organization.marginThresholdPct}% margin in sample data.</p>
            ) : (
              lowMargin.map((client) => (
                <div key={client.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-background/50 rounded-lg border border-border gap-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {client.name}
                      <AlertBadge severity="warning" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{client.reason}</div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Margin</div>
                      <div className="font-bold text-destructive">{client.margin}%</div>
                    </div>
                    <Button variant="secondary" size="sm" className="ml-auto">Review</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
