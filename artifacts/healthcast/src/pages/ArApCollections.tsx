import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { arApKpis, arAging, clientsAtRisk, vendorBills } from "@/data/arApData";
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

export default function ArApCollections() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="AR/AP & Collections" 
        description="Receivables aging and payable obligations" 
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Total AR" value={formatCompactCurrency(arApKpis.totalAr.value)} priorValue={arApKpis.totalAr.priorValue} trend={arApKpis.totalAr.trend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Overdue Amount" value={formatCompactCurrency(arApKpis.overdueAmount.value)} priorValue={arApKpis.overdueAmount.priorValue} trend={arApKpis.overdueAmount.trend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Collection Rate" value={formatPercent(arApKpis.collectionRate.value)} priorValue={arApKpis.collectionRate.priorValue} trend={arApKpis.collectionRate.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Total AP" value={formatCompactCurrency(arApKpis.totalAp.value)} priorValue={arApKpis.totalAp.priorValue} trend={arApKpis.totalAp.trend} inverseTrend />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="A/R Aging" description="Outstanding balances by days overdue">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arAging} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="bucket" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} formatter={(val: number) => [formatCurrency(val), 'Amount']} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {arAging.map((entry, index) => {
                      let color = "hsl(var(--primary))";
                      if (entry.bucket === '61-90 Days') color = "hsl(var(--warning))";
                      if (entry.bucket === '90+ Days') color = "hsl(var(--destructive))";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Collections Velocity">
            Average days to pay has increased by 4 days this quarter. The 90+ days bucket now represents 6% of total AR. Automating follow-ups at day 15 could accelerate $80k into earlier buckets.
          </InsightCard>
          
          <RiskWarning title="High Concentration Risk" message="One client (Foundation First) accounts for 64% of the 90+ days aging bucket." />

          <RecommendedAction title="Halt Services" description="Stop active services for Foundation First until payment plan is established." actionText="Initiate Hold" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Clients at Risk</h3>
            <span className="text-xs text-muted-foreground">{clientsAtRisk.length} Actionable</span>
          </div>
          <div className="space-y-3">
            {clientsAtRisk.map(client => (
              <div key={client.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {client.name}
                    {client.daysOverdue >= 90 ? <AlertBadge severity="critical" /> : <AlertBadge severity="warning" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{client.status} &bull; {client.daysOverdue} Days Overdue</div>
                </div>
                <div className="font-semibold text-right text-destructive">{formatCurrency(client.amount)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upcoming Payables</h3>
            <span className="text-xs text-muted-foreground">Next 14 Days</span>
          </div>
          <div className="space-y-3">
            {vendorBills.map(bill => (
              <div key={bill.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium">{bill.vendor}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Due: {bill.dueDate}</div>
                </div>
                <div className="font-semibold text-right">{formatCurrency(bill.amount)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}