import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Legend
} from "recharts";
import { staffingKpis, payrollTrend, departmentCosts, workloadStrain, prospectiveHires, capacityData } from "@/data/staffingData";
import { useProfitPulse, createEmptyStaffing } from "@/context/ProfitPulseProvider";
import { EntityCrudTable } from "@/components/profit-pulse/EntityCrudTable";
import type { StaffingRecord } from "@/lib/profit-pulse/types";
import { formatCompactCurrency, formatPercent, formatCurrency } from "@/lib/format";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function StaffingPayroll() {
  const { state, metrics, upsertStaffing, deleteStaffing } = useProfitPulse();
  const payrollPct = metrics.monthlyRevenue > 0 ? (metrics.payrollBurden / metrics.monthlyRevenue) * 100 : 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Staffing & Payroll" 
        description="Workforce Capacity & Cost Efficiency Analysis" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Payroll % of Rev" 
            value={formatPercent(payrollPct)}
            priorValue={payrollPct * 1.02}
            trend={[payrollPct * 1.05, payrollPct * 1.03, payrollPct * 1.01, payrollPct]}
            inverseTrend
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Payroll % of Cash" 
            value={formatPercent(staffingKpis.payrollToCollected.value)}
            priorValue={staffingKpis.payrollToCollected.priorValue}
            trend={staffingKpis.payrollToCollected.trend}
            inverseTrend
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Rev per FTE" 
            value={formatCompactCurrency(staffingKpis.revenuePerEmployee.value)}
            priorValue={staffingKpis.revenuePerEmployee.priorValue}
            trend={staffingKpis.revenuePerEmployee.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Profit per FTE" 
            value={formatCompactCurrency(staffingKpis.profitPerEmployee.value)}
            priorValue={staffingKpis.profitPerEmployee.priorValue}
            trend={staffingKpis.profitPerEmployee.trend}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            label="Hiring Readiness" 
            value={staffingKpis.hiringReadinessScore.value}
            priorValue={staffingKpis.hiringReadinessScore.priorValue}
            trend={staffingKpis.hiringReadinessScore.trend}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Payroll & Contractor Cost Trend" description="Trailing 6 months">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payrollTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorContractor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="payroll" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPayroll)" name="W2 Payroll" stackId="1" />
                  <Area type="monotone" dataKey="contractor" stroke="hsl(var(--warning))" fillOpacity={1} fill="url(#colorContractor)" name="Contractors" stackId="1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Compliance Team Overload">
            Compliance Ops is operating at 92% capacity. Based on the current pipeline, SLA breaches will likely occur within 45 days unless 2 additional specialists are hired or contractor support is expanded.
          </InsightCard>
          
          <RiskWarning 
            title="Safe-to-Hire Threshold Reached" 
            message={`Current payroll is ${formatCurrency(capacityData.currentPayroll)}. With a safe ceiling of ${formatCurrency(capacityData.safeToHireThreshold)}, you have limited capacity for new W2 headcount without jeopardizing runway.`}
          />

          <RecommendedAction 
            title="Shift to Contractor Model" 
            description="Convert 1 planned W2 Compliance hire to a fractional contractor to preserve $15k in monthly cash flow while bridging the capacity gap."
            actionText="Review Model"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ChartCard title="Department Cost & Headcount" description="Monthly run rate by function">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentCosts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
                  <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Monthly Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Prospective Hire Break-Even</h3>
          <div className="space-y-4">
            {prospectiveHires.map((hire, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <h4 className="font-medium">{hire.role}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Salary: {formatCurrency(hire.salary)}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{hire.breakEvenMonths} mo</div>
                  <div className="text-xs text-muted-foreground">Break-even</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <EntityCrudTable<StaffingRecord>
        title="Staffing Records"
        records={state.staffing}
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "department", label: "Dept" },
          { key: "monthlyCost", label: "Monthly Cost", format: (v) => formatCurrency(Number(v)) },
          { key: "status", label: "Status" },
        ]}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "role", label: "Role", required: true },
          { key: "department", label: "Department" },
          { key: "monthlyCost", label: "Monthly Cost", type: "number", required: true },
          { key: "fte", label: "FTE", type: "number" },
          { key: "startDate", label: "Start Date", type: "date" },
          { key: "status", label: "Status", type: "select", options: [
            { value: "active", label: "Active" }, { value: "planned", label: "Planned" }, { value: "terminated", label: "Terminated" },
          ]},
        ]}
        onSave={upsertStaffing}
        onDelete={deleteStaffing}
        createRecord={createEmptyStaffing}
        validate={(s) => (!s.name.trim() || s.monthlyCost < 0 ? "Name and valid cost required." : null)}
        emptyMessage="No staffing records."
      />
    </motion.div>
  );
}
