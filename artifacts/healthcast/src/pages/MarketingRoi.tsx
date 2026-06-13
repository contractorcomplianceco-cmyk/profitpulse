import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, ComposedChart, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { marketingKpis, funnelData, channelPerformance, monthlyRoasTrend } from "@/data/marketingData";

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

export default function MarketingRoi() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <PageHeader 
        title="Marketing ROI" 
        description="Return on ad spend, funnel metrics, and channel efficiency" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown Analysis</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Return on Ad Spend" 
            value={`${marketingKpis.roas.value}x`}
            priorValue={marketingKpis.roas.priorValue}
            trend={marketingKpis.roas.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="True ROI" 
            value={`${marketingKpis.trueRoi.value}%`}
            priorValue={marketingKpis.trueRoi.priorValue}
            trend={marketingKpis.trueRoi.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Cost Per Lead" 
            value={formatCurrency(marketingKpis.cpl.value)}
            priorValue={marketingKpis.cpl.priorValue}
            trend={marketingKpis.cpl.trend}
            inverseTrend
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Cost Per Acquisition" 
            value={formatCurrency(marketingKpis.costPerClosed.value)}
            priorValue={marketingKpis.costPerClosed.priorValue}
            trend={marketingKpis.costPerClosed.trend}
            inverseTrend
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="ROAS Trend vs Target" description="Trailing 6 months">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyRoasTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `${val}x`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="roas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Actual ROAS" maxBarSize={50} />
                  <Line type="step" dataKey="target" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Target ROAS" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Channel Shift Opportunity">
            LinkedIn Ads are generating high-quality enterprise leads with an ROAS of 4.1x. Shifting $5k from underperforming Microsoft Ads to LinkedIn could yield an estimated 15% bump in pipeline quality.
          </InsightCard>
          
          <RiskWarning 
            title="CPA Creep on Meta Ads" 
            message="Cost Per Acquisition on Meta has increased by 18% in the last 30 days. Creative fatigue is likely the cause."
          />

          <RecommendedAction 
            title="Reallocate Budget" 
            description="Shift budget away from low-performing channels to maximize Q3 pipeline."
            actionText="Adjust Spend"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard title="Marketing Funnel" description="Volume by stage">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Channel Performance" description="Current month ROI by platform">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Channel</TableHead>
                  <TableHead className="text-right text-muted-foreground">Spend</TableHead>
                  <TableHead className="text-right text-muted-foreground">Leads</TableHead>
                  <TableHead className="text-right text-muted-foreground">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channelPerformance.map((channel) => (
                  <TableRow key={channel.channel} className="border-border/50 hover:bg-card/50 transition-colors">
                    <TableCell className="font-medium">{channel.channel}</TableCell>
                    <TableCell className="text-right">{formatCurrency(channel.spend)}</TableCell>
                    <TableCell className="text-right">{channel.leads}</TableCell>
                    <TableCell className="text-right font-medium text-success">{channel.roas.toFixed(1)}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartCard>
        </motion.div>
      </div>

    </motion.div>
  );
}
