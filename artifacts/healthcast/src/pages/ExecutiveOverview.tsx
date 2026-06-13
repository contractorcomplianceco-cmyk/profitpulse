import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { companyKpis, historical } from "@/data/mockData";
import { getActiveAlerts } from "@/lib/alertEngine";
import { formatCompactCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";

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

export default function ExecutiveOverview() {
  const alerts = getActiveAlerts();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <PageHeader 
        title="Executive Overview" 
        description="Command Center for Contractor Compliance Authority" 
        actions={<Button variant="default">Generate Forecast</Button>}
      />

      {alerts.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-3 mb-6">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-3 bg-card border border-border p-3 rounded-md">
              <AlertBadge severity={alert.severity} />
              <span className="text-sm font-medium">{alert.title}</span>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">- {alert.message}</span>
            </div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Monthly Revenue" 
            value={formatCompactCurrency(companyKpis.monthlyRevenue.value)}
            priorValue={companyKpis.monthlyRevenue.priorValue}
            trend={companyKpis.monthlyRevenue.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Cash on Hand" 
            value={formatCompactCurrency(companyKpis.cashOnHand.value)}
            priorValue={companyKpis.cashOnHand.priorValue}
            trend={companyKpis.cashOnHand.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Net Profit" 
            value={formatCompactCurrency(companyKpis.netProfit.value)}
            priorValue={companyKpis.netProfit.priorValue}
            trend={companyKpis.netProfit.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="AR Outstanding" 
            value={formatCompactCurrency(companyKpis.arOutstanding.value)}
            priorValue={companyKpis.arOutstanding.priorValue}
            trend={companyKpis.arOutstanding.trend}
            inverseTrend
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Revenue vs Collected Trend" description="Last 6 months performance">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historical.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
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
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                  <Area type="monotone" dataKey="collected" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorCol)" name="Collected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Cash Optimization">
            Accounts receivable over 60 days has increased by 15% this month. Implementing strict automated follow-ups for the top 5 delinquent accounts could free up $85k in immediate cash flow.
          </InsightCard>
          
          <RiskWarning 
            title="Payroll Burden Creep" 
            message="Payroll has increased to 34% of revenue, slightly above the 30% target. Ensure new hires reach capacity before opening new reqs."
          />

          <RecommendedAction 
            title="Increase Ad Spend" 
            description="CPL has dropped by 12% in the last 2 weeks. $5k additional spend recommended."
            actionText="Adjust Budget"
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Gross Margin" 
            value={formatPercent(companyKpis.grossMargin.value)}
            priorValue={companyKpis.grossMargin.priorValue}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Runway" 
            value={`${companyKpis.runwayMonths.value} mos`}
            priorValue={companyKpis.runwayMonths.priorValue}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Health Score" 
            value={companyKpis.financialHealthScore.value}
            priorValue={companyKpis.financialHealthScore.priorValue}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}