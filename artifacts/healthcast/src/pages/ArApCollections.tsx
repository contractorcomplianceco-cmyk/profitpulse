import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { arApKpis, arAging, clientsAtRisk, vendorBills } from "@/data/arApData";
import { useProfitPulse, createEmptyInvoice, createEmptyPayable } from "@/context/ProfitPulseProvider";
import { arAgingBuckets } from "@/lib/profit-pulse/calculations";
import { EntityCrudTable } from "@/components/profit-pulse/EntityCrudTable";
import type { Invoice, PayableBill } from "@/lib/profit-pulse/types";
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
  const { state, metrics, upsertInvoice, deleteInvoice, upsertPayable, deletePayable } = useProfitPulse();
  const liveArAging = arAgingBuckets(state);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="AR/AP & Collections" 
        description="Receivables aging and payable obligations" 
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Total AR" value={formatCompactCurrency(metrics.arOutstanding)} priorValue={metrics.arOutstanding * 1.05} trend={metrics.cashTrend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Overdue Amount" value={formatCompactCurrency(state.invoices.filter(i => i.status === "overdue").reduce((s,i) => s + i.amount - i.amountPaid, 0))} priorValue={70000} trend={metrics.cashTrend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Revenue at Risk" value={formatCompactCurrency(metrics.revenueAtRisk)} priorValue={metrics.revenueAtRisk * 0.9} trend={metrics.revenueTrend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Total AP (30d)" value={formatCompactCurrency(metrics.apUpcoming)} priorValue={metrics.apUpcoming * 0.95} trend={metrics.cashTrend} inverseTrend />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="A/R Aging" description="Outstanding balances by days overdue">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveArAging.map(b => ({ bucket: b.bucket, amount: b.amount }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="bucket" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} formatter={(val: number) => [formatCurrency(val), 'Amount']} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {liveArAging.map((entry, index) => {
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
            {state.invoices.filter(i => i.status === "overdue").map(client => (
              <div key={client.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {state.accounts.find(a => a.id === client.accountId)?.name ?? client.invoiceNumber}
                    <AlertBadge severity="critical" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{client.status} &bull; Due {client.dueDate}</div>
                </div>
                <div className="font-semibold text-right text-destructive">{formatCurrency(client.amount - client.amountPaid)}</div>
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
            {state.payables.filter(p => p.status !== "paid").slice(0, 6).map(bill => (
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

      <div className="grid grid-cols-1 gap-6">
        <EntityCrudTable<Invoice>
          title="Invoices (AR)"
          records={state.invoices}
          columns={[
            { key: "invoiceNumber", label: "Invoice #" },
            { key: "dueDate", label: "Due" },
            { key: "status", label: "Status" },
            { key: "amount", label: "Amount", format: (v) => formatCurrency(Number(v)) },
          ]}
          fields={[
            { key: "invoiceNumber", label: "Invoice #", required: true },
            { key: "accountId", label: "Account ID", required: true },
            { key: "issueDate", label: "Issue Date", type: "date" },
            { key: "dueDate", label: "Due Date", type: "date", required: true },
            { key: "amount", label: "Amount", type: "number", required: true },
            { key: "amountPaid", label: "Paid", type: "number" },
            { key: "status", label: "Status", type: "select", options: [
              { value: "draft", label: "Draft" }, { value: "sent", label: "Sent" },
              { value: "partial", label: "Partial" }, { value: "paid", label: "Paid" }, { value: "overdue", label: "Overdue" },
            ]},
            { key: "description", label: "Description", type: "textarea" },
          ]}
          onSave={upsertInvoice}
          onDelete={deleteInvoice}
          createRecord={() => createEmptyInvoice(state.accounts[0]?.id)}
          validate={(r) => (!r.invoiceNumber.trim() || r.amount <= 0 ? "Invoice # and amount required." : null)}
          emptyMessage="No invoices."
        />
        <EntityCrudTable<PayableBill>
          title="Payables (AP)"
          records={state.payables}
          columns={[
            { key: "vendor", label: "Vendor" },
            { key: "dueDate", label: "Due" },
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount", format: (v) => formatCurrency(Number(v)) },
          ]}
          fields={[
            { key: "vendor", label: "Vendor", required: true },
            { key: "dueDate", label: "Due Date", type: "date", required: true },
            { key: "category", label: "Category", required: true },
            { key: "amount", label: "Amount", type: "number", required: true },
            { key: "status", label: "Status", type: "select", options: [
              { value: "scheduled", label: "Scheduled" }, { value: "due", label: "Due" },
              { value: "paid", label: "Paid" }, { value: "overdue", label: "Overdue" },
            ]},
            { key: "description", label: "Description", type: "textarea" },
          ]}
          onSave={upsertPayable}
          onDelete={deletePayable}
          createRecord={createEmptyPayable}
          validate={(r) => (!r.vendor.trim() || r.amount <= 0 ? "Vendor and amount required." : null)}
          emptyMessage="No payables."
        />
      </div>
    </motion.div>
  );
}