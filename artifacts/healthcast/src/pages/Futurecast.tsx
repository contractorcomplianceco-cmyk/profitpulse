import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { scenarios, scenarioChartData } from "@/data/scenariosData";
import { formatCompactCurrency, formatCurrency, formatPercent, formatMonths } from "@/lib/format";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Futurecast() {
  const [selectedScenario1, setSelectedScenario1] = useState(scenarios[0].id);
  const [selectedScenario2, setSelectedScenario2] = useState(scenarios[1].id);

  const s1 = scenarios.find(s => s.id === selectedScenario1) || scenarios[0];
  const s2 = scenarios.find(s => s.id === selectedScenario2) || scenarios[1];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Futurecast Scenarios" 
        description="Predictive modeling of financial outcomes based on strategic operational shifts."
        actions={<Button variant="outline">Drilldown Analysis</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Expected Revenue" value={formatCompactCurrency(s1.revenue)} trend={s1.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Projected Runway" value={formatMonths(s1.runway)} trend={[6, 7, 8, s1.runway]} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Net Profit Est." value={formatCompactCurrency(s1.profit)} trend={[200000, 240000, 260000, s1.profit]} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Target Probability" value={`${s1.probability}%`} trend={[60, 65, 70, s1.probability]} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard 
            title="Scenario Revenue Comparison" 
            description="12-month projection comparing expected vs alternate scenarios"
          >
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <Select value={selectedScenario1} onValueChange={setSelectedScenario1}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {scenarios.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <Select value={selectedScenario2} onValueChange={setSelectedScenario2}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {scenarios.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scenarioChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey={s1.id} stroke="hsl(var(--primary))" strokeWidth={3} name={s1.name} dot={false} />
                  <Line type="monotone" dataKey={s2.id} stroke="hsl(var(--warning))" strokeWidth={3} name={s2.name} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Growth Push Insight">
            The Growth Push scenario yields the highest revenue ($1.6M) but slashes runway to 4.0 months. High execution risk. Requires immediate $500k cash injection to safely execute without violating covenants.
          </InsightCard>
          
          <RiskWarning 
            title="Recession Exposure" 
            message="The Worst Case scenario depletes cash reserves by month 7 if accounts receivable age past 90 days on average. Defensive AR posture is recommended."
          />

          <RecommendedAction 
            title="Lock In Pricing" 
            description="Executing a 15% price increase immediately drives $390k profit with minimal projected churn."
            actionText="Simulate Price Change"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold mb-4 mt-8">All Scenarios Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map(scenario => (
            <Card key={scenario.id} className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{scenario.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                  </div>
                  <AlertBadge severity={scenario.probability > 60 ? "info" : scenario.probability > 30 ? "warning" : "critical"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{formatCompactCurrency(scenario.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit</p>
                    <p className="font-semibold">{formatCompactCurrency(scenario.profit)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Runway</p>
                    <p className="font-semibold">{formatMonths(scenario.runway)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Break-Even</p>
                    <p className="font-semibold">{formatCompactCurrency(scenario.breakEven)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Target Hit Probability</span>
                    <span className="font-medium">{scenario.probability}%</span>
                  </div>
                  <Progress value={scenario.probability} className="h-2 bg-secondary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
