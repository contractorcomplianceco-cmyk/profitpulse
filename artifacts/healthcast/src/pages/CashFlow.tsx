import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { cashFlowKpis, cashProjection, upcomingBills, expectedPayments, pinchDates } from "@/data/cashFlowData";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import { useProfitPulse, createEmptyRevenue, createEmptyExpense } from "@/context/ProfitPulseProvider";
import { cashProjection90d } from "@/lib/profit-pulse/calculations";
import { LiveDataBanner } from "@/components/profit-pulse/LiveDataBanner";
import { EntityCrudTable, formatMoneyCell } from "@/components/profit-pulse/EntityCrudTable";
import type { RevenueRecord, ExpenseRecord } from "@/lib/profit-pulse/types";
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
  const { state, metrics, upsertRevenue, deleteRevenue, upsertExpense, deleteExpense, readOnly } = useProfitPulse();
  const projection = cashProjection90d(state).map((p) => ({ day: p.date, balance: p.balance }));
  const livePayables = state.payables.filter((p) => p.status !== "paid").slice(0, 6);
  const liveInvoices = state.invoices.filter((i) => i.status !== "paid").slice(0, 6);

  const accountOptions = state.accounts.map((a) => ({ value: a.id, label: a.name }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Cash Flow" 
        description="Liquidity, runway, and cash movement from your revenue, expense, AR, and AP records." 
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <LiveDataBanner detail={`Runway ${metrics.runwayMonths.toFixed(1)} mo · Forecast 30d ${formatCompactCurrency(metrics.forecastedCash30d)}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Cash In (30d)" value={formatCompactCurrency(metrics.monthlyRevenue)} priorValue={metrics.priorMonthlyRevenue} trend={metrics.revenueTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Cash Out (30d)" value={formatCompactCurrency(metrics.monthlyExpenses)} priorValue={metrics.monthlyExpenses * 0.97} trend={metrics.cashTrend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Runway" value={`${metrics.runwayMonths.toFixed(1)} mos`} priorValue={metrics.runwayMonths * 0.95} trend={metrics.cashTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Payroll Burden" value={formatCompactCurrency(metrics.payrollBurden)} priorValue={metrics.payrollBurden * 0.98} trend={metrics.cashTrend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Forecasted Cash (30d)" value={formatCompactCurrency(metrics.forecastedCash30d)} priorValue={metrics.cashOnHand} trend={metrics.cashTrend} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div data-tour="cashflow-chart" variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="90-Day Cash Projection" description="Expected balance based on scheduled AP/AR">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection.length ? projection : cashProjection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            Cash on hand {formatCompactCurrency(metrics.cashOnHand)} with {metrics.runwayMonths.toFixed(1)} months runway. AP upcoming {formatCompactCurrency(metrics.apUpcoming)} in the next 30 days.
          </InsightCard>
          
          {metrics.forecastedCash30d < metrics.cashOnHand * 0.85 && (
            <RiskWarning title="Cash Pinch Risk" message={`Forecasted 30-day cash ${formatCurrency(metrics.forecastedCash30d)} may pressure liquidity.`} />
          )}

          <RecommendedAction title="Optimize Collections" description={`${formatCompactCurrency(metrics.arOutstanding)} in open AR — prioritize overdue invoices.`} actionText="View AR/AP" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Upcoming Bills</h3>
          <div className="space-y-3">
            {livePayables.map(bill => (
              <div key={bill.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {bill.vendor}
                    {bill.status === "overdue" && <span className="text-[10px] uppercase bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-bold">Overdue</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Due: {bill.dueDate}</div>
                </div>
                <div className="font-semibold text-right">{formatCurrency(bill.amount)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Expected Payments</h3>
          <div className="space-y-3">
            {liveInvoices.map(payment => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium">{state.accounts.find((a) => a.id === payment.accountId)?.name ?? payment.invoiceNumber}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Due: {payment.dueDate} &bull; {payment.status}</div>
                </div>
                <div className="font-semibold text-right text-success">{formatCurrency(payment.amount - payment.amountPaid)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <EntityCrudTable<RevenueRecord>
          title="Revenue Records"
          records={state.revenueRecords}
          searchKeys={["category", "description"]}
          getRecordLabel={(r) => r.description}
          columns={[
            { key: "date", label: "Date" },
            { key: "category", label: "Category" },
            { key: "description", label: "Description" },
            { key: "amount", label: "Amount", format: (v) => formatMoneyCell(v) },
          ]}
          fields={[
            { key: "date", label: "Date", type: "date", required: true },
            { key: "accountId", label: "Account", type: "select", required: true, options: accountOptions },
            { key: "category", label: "Category", required: true, placeholder: "Compliance Retainer" },
            { key: "description", label: "Description", required: true },
            { key: "amount", label: "Amount", type: "currency", required: true },
          ]}
          onSave={upsertRevenue}
          onDelete={deleteRevenue}
          createRecord={() => createEmptyRevenue(state.accounts[0]?.id)}
          readOnly={readOnly}
          validate={(r) => (!r.description.trim() || r.amount <= 0 ? "Description and positive amount required." : null)}
          emptyMessage="No revenue records. Add your first inflow."
        />
        <EntityCrudTable<ExpenseRecord>
          title="Expense Records"
          records={state.expenseRecords}
          searchKeys={["category", "description", "vendor"]}
          getRecordLabel={(r) => r.description}
          columns={[
            { key: "date", label: "Date" },
            { key: "category", label: "Category" },
            { key: "vendor", label: "Vendor" },
            { key: "amount", label: "Amount", format: (v) => formatMoneyCell(v) },
          ]}
          fields={[
            { key: "date", label: "Date", type: "date", required: true },
            { key: "category", label: "Category", required: true, placeholder: "Payroll" },
            { key: "description", label: "Description", required: true },
            { key: "vendor", label: "Vendor", placeholder: "Vendor name" },
            { key: "amount", label: "Amount", type: "currency", required: true },
          ]}
          onSave={upsertExpense}
          onDelete={deleteExpense}
          createRecord={createEmptyExpense}
          readOnly={readOnly}
          validate={(r) => (!r.description.trim() || r.amount <= 0 ? "Description and positive amount required." : null)}
          emptyMessage="No expense records. Add your first outflow."
        />
      </div>
    </motion.div>
  );
}