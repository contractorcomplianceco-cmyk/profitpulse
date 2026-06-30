import { useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { LiveDataBanner } from "@/components/profit-pulse/LiveDataBanner";
import { formatCompactCurrency, formatPercent } from "@/lib/format";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfitPulse, createEmptyAccount } from "@/context/ProfitPulseProvider";
import { EntityCrudTable } from "@/components/profit-pulse/EntityCrudTable";
import type { Account } from "@/lib/profit-pulse/types";
import {
  recurringRevenueMetrics,
  revenueByCategoryWithShare,
  revenueByMonthLast6,
  revenueByStateLive,
} from "@/lib/profit-pulse/calculations";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function RevenueIntelligence() {
  const { state, metrics, upsertAccount, deleteAccount, readOnly } = useProfitPulse();

  const trendData = useMemo(() => revenueByMonthLast6(state), [state]);
  const byService = useMemo(() => revenueByCategoryWithShare(state), [state]);
  const byState = useMemo(() => revenueByStateLive(state), [state]);
  const recurring = useMemo(() => recurringRevenueMetrics(state), [state]);
  const stateTotal = useMemo(() => byState.reduce((s, r) => s + r.value, 0) || 1, [byState]);

  const topState = byState[0];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Revenue Intelligence"
        description="Revenue streams calculated from your sample books — edit records below to see charts update."
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown Analysis</Button>}
      />

      <LiveDataBanner detail={`${state.revenueRecords.length} revenue records · ${state.accounts.length} client accounts`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Total Revenue (30d)"
            value={formatCompactCurrency(metrics.monthlyRevenue)}
            priorValue={metrics.priorMonthlyRevenue}
            trend={metrics.revenueTrend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Recurring / Contract"
            value={formatCompactCurrency(recurring.recurring)}
            priorValue={recurring.recurring * 0.94}
            trend={metrics.revenueTrend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Recurring Coverage"
            value={formatPercent(recurring.coverage)}
            priorValue={recurring.coverage * 0.97}
            trend={metrics.revenueTrend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Open Billings"
            value={formatCompactCurrency(recurring.renewals)}
            priorValue={recurring.renewals * 1.05}
            trend={metrics.revenueTrend}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Revenue Trend" description="Trailing 6 months from your revenue records">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOne" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
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
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area type="monotone" dataKey="recurring" stackId="1" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRec)" name="Contract / Recurring" />
                  <Area type="monotone" dataKey="oneTime" stackId="1" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorOne)" name="Progress / T&M" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Sample data insight">
            {topState
              ? `${topState.state} accounts for ${((topState.value / stateTotal) * 100).toFixed(0)}% of recorded revenue. Concentration risk should be monitored as jobs scale.`
              : "Add revenue records to see geographic insights."}
          </InsightCard>

          {state.accounts.some((a) => a.status === "at-risk") && (
            <RiskWarning
              title="At-risk client"
              message={`${state.accounts.filter((a) => a.status === "at-risk").map((a) => a.name).join(", ")} flagged — review margin and collections.`}
            />
          )}

          <RecommendedAction
            title="Tie revenue to jobs"
            description="Link progress billings to active pipeline jobs on Sales Pipeline for margin tracking."
            actionText="View Pipeline"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard title="Revenue by Category" description="From revenue record categories">
            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byService} cx="50%" cy="50%" innerRadius="62%" outerRadius="92%" paddingAngle={2} dataKey="value" isAnimationActive={false}>
                      {byService.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(val: number) => formatCompactCurrency(val)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {byService.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground truncate">{item.name}</span>
                    </div>
                    <span className="font-medium shrink-0 ml-2">{item.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Revenue by State" description="Client account geography">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">State</TableHead>
                  <TableHead className="text-right text-muted-foreground">Revenue</TableHead>
                  <TableHead className="text-right text-muted-foreground">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byState.map((row) => (
                  <TableRow key={row.state} className="border-border/50 hover:bg-card/50 transition-colors">
                    <TableCell className="font-medium">{row.state}</TableCell>
                    <TableCell className="text-right">{formatCompactCurrency(row.value)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>{((row.value / stateTotal) * 100).toFixed(1)}%</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(row.value / stateTotal) * 100}%` }} />
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

      <EntityCrudTable<Account>
        title="Accounts / Clients"
        description="Manage client accounts tied to revenue and jobs."
        records={state.accounts}
        columns={[
          { key: "name", label: "Account" },
          { key: "state", label: "State" },
          { key: "segment", label: "Segment" },
          { key: "status", label: "Status" },
          { key: "monthlyContractValue", label: "Contract/mo", format: (v) => formatCompactCurrency(Number(v)) },
        ]}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "contactName", label: "Contact" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "state", label: "State" },
          { key: "segment", label: "Segment" },
          { key: "monthlyContractValue", label: "Monthly Contract Value", type: "number" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "at-risk", label: "At Risk" },
              { value: "churned", label: "Churned" },
            ],
          },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
        onSave={upsertAccount}
        onDelete={deleteAccount}
        createRecord={createEmptyAccount}
        readOnly={readOnly}
        validate={(a) => (!a.name.trim() ? "Account name is required." : null)}
        emptyMessage="No accounts yet."
      />
    </motion.div>
  );
}
