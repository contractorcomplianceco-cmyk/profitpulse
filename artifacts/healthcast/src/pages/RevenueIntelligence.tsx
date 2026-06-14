import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { formatCompactCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { revenueKpis, revenueTrendData, revenueByService, revenueByState } from "@/data/revenueData";

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

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function RevenueIntelligence() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <PageHeader 
        title="Revenue Intelligence" 
        description="Comprehensive analysis of revenue streams and growth vectors" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown Analysis</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Total Revenue" 
            value={formatCompactCurrency(revenueKpis.totalRevenue.value)}
            priorValue={revenueKpis.totalRevenue.priorValue}
            trend={revenueKpis.totalRevenue.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Recurring Revenue" 
            value={formatCompactCurrency(revenueKpis.recurringRevenue.value)}
            priorValue={revenueKpis.recurringRevenue.priorValue}
            trend={revenueKpis.recurringRevenue.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Recurring Coverage" 
            value={formatPercent(revenueKpis.recurringCoverage.value)}
            priorValue={revenueKpis.recurringCoverage.priorValue}
            trend={revenueKpis.recurringCoverage.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Renewals Value" 
            value={formatCompactCurrency(revenueKpis.renewalsValue.value)}
            priorValue={revenueKpis.renewalsValue.priorValue}
            trend={revenueKpis.renewalsValue.trend}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Revenue Growth: Recurring vs One-Time" description="Trailing 6-month performance">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOne" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="recurring" stackId="1" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRec)" name="Recurring" />
                  <Area type="monotone" dataKey="oneTime" stackId="1" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOne)" name="One-Time" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Recurring Growth Opportunity">
            Software Subscriptions have grown 12% MoM, but still represent only 8% of total revenue. Pushing the new bundled compliance+software tier could shift $150k/mo from one-time audits to recurring MRR.
          </InsightCard>
          
          <RiskWarning 
            title="Geographic Concentration" 
            message="California accounts for 30%+ of revenue. Regulatory changes in CA could disproportionately impact Q3 targets. Diversification into TX/FL is recommended."
          />

          <RecommendedAction 
            title="Audit to Retainer Conversion" 
            description="35 clients completed compliance audits last month without signing up for ongoing maintenance. Follow up with targeted offer."
            actionText="Launch Campaign"
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard title="Revenue by Service Line" description="Current month breakdown">
            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
              <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByService}
                    cx="50%"
                    cy="50%"
                    innerRadius="62%"
                    outerRadius="92%"
                    paddingAngle={2}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(val: number) => formatCompactCurrency(val)}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {revenueByService.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-muted-foreground truncate">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Top States Performance" description="Revenue by geographic region">
             <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">State</TableHead>
                    <TableHead className="text-right text-muted-foreground">Revenue</TableHead>
                    <TableHead className="text-right text-muted-foreground">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByState.map((state) => (
                    <TableRow key={state.state} className="border-border/50 hover:bg-card/50 transition-colors">
                      <TableCell className="font-medium">{state.state}</TableCell>
                      <TableCell className="text-right">{formatCompactCurrency(state.value)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{((state.value / 1250000) * 100).toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(state.value / 1250000) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
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
