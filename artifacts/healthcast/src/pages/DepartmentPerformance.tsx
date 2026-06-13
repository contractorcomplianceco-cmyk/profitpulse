import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { departmentKpis, departments, deptCostVsRev } from "@/data/departmentsData";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, ArrowRight, Zap } from "lucide-react";

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

export default function DepartmentPerformance() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <PageHeader 
        title="Department Performance" 
        description="Operational efficiency, bottlenecks, and ROI by function" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown Analysis</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Total Overhead" 
            value={formatCompactCurrency(departmentKpis.totalCost.value)}
            priorValue={departmentKpis.totalCost.priorValue}
            trend={departmentKpis.totalCost.trend}
            inverseTrend
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Revenue / Employee" 
            value={formatCompactCurrency(departmentKpis.revenuePerEmployee.value)}
            priorValue={departmentKpis.revenuePerEmployee.priorValue}
            trend={departmentKpis.revenuePerEmployee.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Avg Productivity Score" 
            value={departmentKpis.avgProductivity.value}
            priorValue={departmentKpis.avgProductivity.priorValue}
            trend={departmentKpis.avgProductivity.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Critical Bottlenecks" 
            value={departmentKpis.criticalBottlenecks.value}
            priorValue={departmentKpis.criticalBottlenecks.priorValue}
            trend={departmentKpis.criticalBottlenecks.trend}
            inverseTrend
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Cost vs Revenue Influence" description="Efficiency mapped by department">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    dataKey="cost" 
                    name="Cost" 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(val) => `$${val/1000}k`}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="revenue" 
                    name="Revenue Influence" 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(val) => `$${val/1000}k`}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ZAxis type="category" dataKey="name" name="Department" />
                  <Tooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(val: number, name: string) => [formatCompactCurrency(val), name]}
                  />
                  <Scatter name="Departments" data={deptCostVsRev} fill="hsl(var(--primary))">
                    {deptCostVsRev.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--chart-3))"} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Compliance Bottleneck">
            Compliance Ops is running at 110% capacity, creating a drag on revenue realization. Resolving the state portal backlog could accelerate $120k of pending revenue into this month.
          </InsightCard>
          
          <div className="bg-card/50 border border-border/50 rounded-xl p-5 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-4">
               <Activity className="w-5 h-5 text-primary" />
               <h4 className="font-semibold text-lg">Top Performers</h4>
             </div>
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Licensing Ops</span>
                 <span className="text-sm text-success font-mono">95 Score</span>
               </div>
               <div className="w-full bg-muted rounded-full h-1.5">
                 <div className="bg-success h-1.5 rounded-full" style={{width: '95%'}}></div>
               </div>
               
               <div className="flex justify-between items-center mt-3">
                 <span className="text-sm font-medium">Sales</span>
                 <span className="text-sm text-primary font-mono">92 Score</span>
               </div>
               <div className="w-full bg-muted rounded-full h-1.5">
                 <div className="bg-primary h-1.5 rounded-full" style={{width: '92%'}}></div>
               </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Department Scorecards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <motion.div key={dept.name} variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden relative">
                {dept.riskLevel === 'critical' && <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>}
                {dept.riskLevel === 'warning' && <div className="absolute top-0 left-0 w-full h-1 bg-warning"></div>}
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-lg">{dept.name}</h4>
                    <AlertBadge severity={dept.riskLevel as any} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Cost</div>
                      <div className="font-medium">{formatCompactCurrency(dept.cost)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Output</div>
                      <div className="font-medium truncate">{dept.output}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Productivity</div>
                      <div className="font-medium">{dept.productivityScore}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Bottleneck</div>
                      <div className="font-medium text-warning truncate">{dept.bottleneck !== 'None' ? dept.bottleneck : '—'}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Recommended Action
                    </div>
                    <div className="text-sm font-medium flex justify-between items-center group cursor-pointer hover:text-primary transition-colors">
                      <span className="truncate pr-2">{dept.recommendedAction}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
