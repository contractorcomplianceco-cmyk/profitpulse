import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { formatCompactCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pipelineKpis, pipelineStages, salespersonPerformance, staleDeals } from "@/data/pipelineData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function SalesPipeline() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <PageHeader 
        title="Sales Pipeline" 
        description="Pipeline velocity, conversion metrics, and sales rep performance" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown Analysis</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Weighted Pipeline" 
            value={formatCompactCurrency(pipelineKpis.weightedPipeline.value)}
            priorValue={pipelineKpis.weightedPipeline.priorValue}
            trend={pipelineKpis.weightedPipeline.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Expected Cash (30d)" 
            value={formatCompactCurrency(pipelineKpis.expectedCash.value)}
            priorValue={pipelineKpis.expectedCash.priorValue}
            trend={pipelineKpis.expectedCash.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Close Rate" 
            value={formatPercent(pipelineKpis.closeRate.value)}
            priorValue={pipelineKpis.closeRate.priorValue}
            trend={pipelineKpis.closeRate.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Avg Sales Cycle" 
            value={`${pipelineKpis.avgSalesCycle.value} days`}
            priorValue={pipelineKpis.avgSalesCycle.priorValue}
            trend={pipelineKpis.avgSalesCycle.trend}
            inverseTrend
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Pipeline Value by Stage" description="Total potential revenue across funnel">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineStages} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000000}M`}
                  />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(val: number) => formatCompactCurrency(val)}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {pipelineStages.map((entry, index) => {
                      // Gradient of colors from primary to success
                      const colors = ['hsl(var(--primary))', 'hsl(var(--primary)/0.8)', 'hsl(var(--chart-2))', 'hsl(var(--success)/0.8)', 'hsl(var(--success))'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Deal Velocity Alert">
            Deals stuck in "Proposal Sent" for over 14 days have a win rate of only 8%. Implementing an automated expiration sequence could force decisions and clean up the pipeline.
          </InsightCard>
          
          <RiskWarning 
            title="Stale Deals Detected" 
            message={`There are ${staleDeals.length} high-value deals sitting idle for 30+ days. Follow up required.`}
          />

          <RecommendedAction 
            title="Pipeline Scrub" 
            description="Remove dead wood to improve forecast accuracy."
            actionText="Review Stale Deals"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard title="Sales Rep Performance" description="Win rates and cycle times">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Rep</TableHead>
                  <TableHead className="text-right text-muted-foreground">Pipeline</TableHead>
                  <TableHead className="text-right text-muted-foreground">Win Rate</TableHead>
                  <TableHead className="text-center text-muted-foreground">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salespersonPerformance.map((rep) => (
                  <TableRow key={rep.name} className="border-border/50 hover:bg-card/50 transition-colors">
                    <TableCell className="font-medium">{rep.name}</TableCell>
                    <TableCell className="text-right">{formatCompactCurrency(rep.pipeline)}</TableCell>
                    <TableCell className="text-right">{rep.winRate}%</TableCell>
                    <TableCell className="text-center">
                      <AlertBadge 
                        severity={rep.risk === 'Critical' ? 'critical' : rep.risk === 'High' ? 'warning' : 'info'} 
                        className={rep.risk === 'Low' ? 'bg-success/10 text-success border-success/20' : ''}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Stale Deals (30+ Days)" description="High priority interventions">
            <div className="space-y-4">
              {staleDeals.map((deal, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/30">
                  <div className="space-y-1">
                    <div className="font-medium">{deal.client}</div>
                    <div className="text-xs text-muted-foreground">Rep: {deal.rep}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-warning">{deal.daysInStage} days</div>
                    <div className="text-xs text-muted-foreground">{formatCompactCurrency(deal.value)}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 border-border/50">View All Stale Deals</Button>
            </div>
          </ChartCard>
        </motion.div>
      </div>

    </motion.div>
  );
}
