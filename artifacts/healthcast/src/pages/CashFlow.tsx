import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { cashFlowKpis, cashProjection, upcomingBills, expectedPayments, pinchDates } from "@/data/cashFlowData";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function CashFlow() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Cash Flow" 
        description="Liquidity and runway management" 
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Cash In (30d)" value={formatCompactCurrency(cashFlowKpis.cashIn.value)} priorValue={cashFlowKpis.cashIn.priorValue} trend={cashFlowKpis.cashIn.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Cash Out (30d)" value={formatCompactCurrency(cashFlowKpis.cashOut.value)} priorValue={cashFlowKpis.cashOut.priorValue} trend={cashFlowKpis.cashOut.trend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Runway" value={`${cashFlowKpis.runway.value} mos`} priorValue={cashFlowKpis.runway.priorValue} trend={cashFlowKpis.runway.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Payroll Coverage" value={`${cashFlowKpis.payrollCoverage.value}x`} priorValue={cashFlowKpis.payrollCoverage.priorValue} trend={cashFlowKpis.payrollCoverage.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Safe to Spend" value={formatCompactCurrency(cashFlowKpis.safeToSpend.value)} priorValue={cashFlowKpis.safeToSpend.priorValue} trend={cashFlowKpis.safeToSpend.trend} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="90-Day Cash Projection" description="Expected balance based on scheduled AP/AR">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashProjection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorBalance)" name="Projected Balance" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Liquidity Insight">
            Cash inflows have outpaced outflows by $400k over the last 30 days. Runway is extending favorably, providing an ideal window to consider planned Q4 capital expenditures without triggering debt facilities.
          </InsightCard>
          
          {pinchDates.map(pinch => (
            <RiskWarning key={pinch.date} title={`Cash Pinch: ${pinch.date}`} message={`${pinch.reason} leading to a temporary ${formatCurrency(Math.abs(pinch.impact))} dip.`} />
          ))}

          <RecommendedAction title="Sweep Excess Cash" description="Transfer $250k to high-yield sweep account to optimize return on idle cash." actionText="Initiate Transfer" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Upcoming Bills</h3>
          <div className="space-y-3">
            {upcomingBills.map(bill => (
              <div key={bill.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {bill.vendor}
                    {bill.critical && <span className="text-[10px] uppercase bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-bold">Critical</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Due: {bill.date}</div>
                </div>
                <div className="font-semibold text-right">{formatCurrency(bill.amount)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Expected Payments</h3>
          <div className="space-y-3">
            {expectedPayments.map(payment => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium">{payment.client}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Expected: {payment.date} &bull; Prob: {payment.probability}</div>
                </div>
                <div className="font-semibold text-right text-success">{formatCurrency(payment.amount)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}