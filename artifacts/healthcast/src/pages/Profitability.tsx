import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { profitabilityKpis, marginByServiceLine, marginBySource, costImpacts, lowMarginClients } from "@/data/profitabilityData";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Profitability() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Profitability" 
        description="Margin analysis and cost impact" 
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Gross Profit" value={formatCompactCurrency(profitabilityKpis.grossProfit.value)} priorValue={profitabilityKpis.grossProfit.priorValue} trend={profitabilityKpis.grossProfit.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Net Profit" value={formatCompactCurrency(profitabilityKpis.netProfit.value)} priorValue={profitabilityKpis.netProfit.priorValue} trend={profitabilityKpis.netProfit.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Gross Margin" value={formatPercent(profitabilityKpis.grossMargin.value)} priorValue={profitabilityKpis.grossMargin.priorValue} trend={profitabilityKpis.grossMargin.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Operating Margin" value={formatPercent(profitabilityKpis.operatingMargin.value)} priorValue={profitabilityKpis.operatingMargin.priorValue} trend={profitabilityKpis.operatingMargin.trend} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Margin by Service Line" description="Profitability across core offerings">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marginByServiceLine} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} formatter={(val) => [`${val}%`, 'Margin']} />
                  <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                    {marginByServiceLine.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.margin > 70 ? "hsl(var(--success))" : "hsl(var(--primary))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Margin Erosion">
            Safety Audits are pulling down overall gross margin. Despite high revenue ($450k), fulfillment costs and legacy pricing have compressed the margin to 62%, compared to 82% for Ongoing Compliance.
          </InsightCard>
          
          <RiskWarning title="Pricing Leakage" message={`We are losing ${formatCurrency(costImpacts.pricingLeakage)} monthly due to un-billed overages on retainer clients.`} />

          <RecommendedAction title="Enforce Scope Boundaries" description="Implement strict time-tracking for 3 legacy clients." actionText="Review Accounts" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Cost Impacts</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Fulfillment</span>
              <span className="font-semibold text-destructive">{formatCurrency(costImpacts.fulfillmentCost)}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Discounts</span>
              <span className="font-semibold text-warning">{formatCurrency(costImpacts.discountImpact)}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Software</span>
              <span className="font-semibold text-foreground">{formatCurrency(costImpacts.softwareCost)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5 col-span-2">
          <h3 className="text-lg font-semibold mb-4">Low-Margin Clients Alert</h3>
          <div className="space-y-3">
            {lowMarginClients.map(client => (
              <div key={client.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-background/50 rounded-lg border border-border gap-2">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {client.name}
                    <AlertBadge severity="warning" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Root Cause: {client.reason}</div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Margin</div>
                    <div className="font-bold text-destructive">{client.margin}%</div>
                  </div>
                  <Button variant="secondary" size="sm" className="ml-auto">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}