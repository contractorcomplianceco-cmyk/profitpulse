import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from "recharts";
import { historyKpis, monthlyData, anomalies } from "@/data/historyData";
import { formatPercent } from "@/lib/format";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function HistoricalTrends() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Historical Trends" 
        description="24-Month Retrospective & Anomaly Detection" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="MoM Growth" 
            value={formatPercent(historyKpis.momGrowth.value)}
            priorValue={historyKpis.momGrowth.priorValue}
            trend={historyKpis.momGrowth.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="QoQ Growth" 
            value={formatPercent(historyKpis.qoqGrowth.value)}
            priorValue={historyKpis.qoqGrowth.priorValue}
            trend={historyKpis.qoqGrowth.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="YoY Growth" 
            value={formatPercent(historyKpis.yoyGrowth.value)}
            priorValue={historyKpis.yoyGrowth.priorValue}
            trend={historyKpis.yoyGrowth.trend}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="24-Month Revenue & Cash Velocity" description="Long-term historicals with rolling overlays">
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHistRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHistRev)" name="Revenue" />
                  <Line type="monotone" dataKey="cash" stroke="hsl(var(--success))" strokeWidth={2} dot={false} name="Cash Position" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Accelerating Momentum">
            The historical data shows a clear inflection point starting 6 months ago where revenue growth decoupled from payroll increases, pushing operating margins to all-time highs. YoY growth has accelerated from 35% to 42.5%.
          </InsightCard>
          
          <RiskWarning 
            title="Q4 Seasonality Dip" 
            message="Historical data indicates a consistent 8-12% drop in new client acquisition during Q4. Cash buffers should be expanded starting in September to offset seasonal slowdowns."
          />

          <RecommendedAction 
            title="Lock In Annual Renewals" 
            description="Offset impending Q4 seasonality by launching an early renewal incentive program in Q3."
            actionText="Plan Campaign"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard title="Profit Margin Evolution" description="24-Month net margin tracking">
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="margin" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Net Margin %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Historical Anomalies</h3>
          <div className="space-y-4">
            {anomalies.map((anomaly, i) => (
              <div key={i} className="p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-primary">{anomaly.date}</span>
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">{anomaly.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{anomaly.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
