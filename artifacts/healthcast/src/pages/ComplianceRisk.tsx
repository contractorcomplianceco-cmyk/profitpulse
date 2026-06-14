import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { Sparkline } from "@/components/charts/Sparkline";
import { DonutChart } from "@/components/charts/DonutChart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  complianceScore,
  complianceKpis,
  scoreCategories,
  scoreDonut,
  upcomingRenewals,
  auditChecklist,
  filingDeadlines,
  riskRegister,
} from "@/data/complianceData";
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  CalendarClock,
  FileCheck,
  ScrollText,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

const statusStyles: Record<string, { label: string; classes: string }> = {
  "on-track": { label: "On Track", classes: "text-success bg-success/15 border-success/30" },
  "due-soon": { label: "Due Soon", classes: "text-warning bg-warning/15 border-warning/30" },
  overdue: { label: "Overdue", classes: "text-destructive bg-destructive/15 border-destructive/30" },
};

const severityRank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

const severityBadge: Record<string, "critical" | "warning" | "info"> = {
  critical: "critical",
  high: "warning",
  medium: "warning",
  low: "info",
};

const severityAccent: Record<string, string> = {
  critical: "border-l-destructive",
  high: "border-l-warning",
  medium: "border-l-warning/70",
  low: "border-l-primary",
};

export default function ComplianceRisk() {
  const { toast } = useToast();

  const completedAudit = auditChecklist.filter((a) => a.complete).length;
  const auditPct = Math.round((completedAudit / auditChecklist.length) * 100);
  const sortedRisks = [...riskRegister].sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
  const criticalRisks = riskRegister.filter((r) => r.severity === "critical").length;

  const handleResolve = (title: string) => {
    toast({
      title: "Remediation Queued",
      description: `${title} has been routed to its owner with a tracking ticket.`,
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Compliance & Risk Center"
        description="Contractor Compliance Authority — licensing, audit readiness, regulatory filings, and enterprise risk register."
        actions={
          <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 font-bold tracking-wide" onClick={() => handleResolve("Compliance pack")}>
            <FileCheck className="w-4 h-4 mr-2" />
            Generate Audit Pack
          </Button>
        }
      />

      {/* KPI ROW */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3">
        {complianceKpis.map((kpi, i) => (
          <div
            key={i}
            className="surface-gradient border border-border rounded-xl p-4 shadow-lg shadow-black/20 hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group accent-topline"
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
            <div className="text-[10px] font-extrabold tracking-wide text-muted-foreground uppercase whitespace-nowrap">{kpi.label}</div>
            <div className="text-2xl 2xl:text-[1.6rem] font-black tracking-tight text-white tabular-nums leading-tight">{kpi.value}</div>
            <div
              className={`mt-auto inline-flex w-fit items-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                kpi.status === "good"
                  ? "text-success bg-success/15"
                  : kpi.status === "warning"
                  ? "text-warning bg-warning/15"
                  : "text-destructive bg-destructive/15"
              }`}
            >
              {kpi.sub}
            </div>
          </div>
        ))}
      </motion.div>

      {/* SCORE + CATEGORIES + INSIGHT */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <ChartCard title="Overall Compliance Score" className="h-full">
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[180px]">
                <DonutChart data={scoreDonut} centerText={`${complianceScore.overall}`} centerSubtext={complianceScore.rating} />
                <div className="absolute top-2 left-2 bg-gradient-primary p-2 rounded-lg border border-primary/30 shadow-md shadow-primary/30">
                  <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
                <div className="bg-secondary/30 border border-border/50 rounded-lg p-2">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Prior</div>
                  <div className="text-sm font-black text-white">{complianceScore.prior}</div>
                </div>
                <div className="bg-success/10 border border-success/30 rounded-lg p-2">
                  <div className="text-[9px] font-bold text-success uppercase tracking-widest">Current</div>
                  <div className="text-sm font-black text-white">{complianceScore.overall}</div>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-2">
                  <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Target</div>
                  <div className="text-sm font-black text-white">{complianceScore.target}</div>
                </div>
              </div>
              <div className="w-full h-10 mt-3">
                <Sparkline data={complianceScore.trend} color="hsl(var(--success))" type="area" />
              </div>
            </div>
          </ChartCard>
        </motion.div>

        {/* Category Scores */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <ChartCard title="Score by Category" className="h-full">
            <div className="flex flex-col gap-4 pt-1">
              {scoreCategories.map((cat, i) => {
                const color =
                  cat.score >= 90 ? "hsl(var(--success))" : cat.score >= 80 ? "hsl(var(--primary))" : "hsl(var(--warning))";
                return (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-white font-bold">{cat.name}</span>
                      <span className="text-muted-foreground font-medium">
                        Weight {cat.weight}% · <span className="text-white font-bold tabular-nums">{cat.score}</span>
                      </span>
                    </div>
                    <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.score}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </motion.div>

        {/* Insight + Risk Warning */}
        <motion.div variants={itemVariants} className="xl:col-span-1 flex flex-col gap-4">
          <InsightCard title="Compliance Pulse">
            Overall posture improved <strong className="text-success">+5 pts</strong> QoQ to {complianceScore.overall}. Tax & filings lead at 94, while Data & Privacy at 79 is the largest drag on reaching the {complianceScore.target} target.
          </InsightCard>
          <RiskWarning
            title="Action Required"
            message={`${criticalRisks} critical items are overdue. Workers' Comp certification and the annual report are past due and affecting good standing.`}
          />
        </motion.div>
      </div>

      {/* RENEWALS + FILINGS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Upcoming Renewals */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <ChartCard title="License & Registration Renewals" className="h-full">
            <div className="flex flex-col gap-2.5">
              {upcomingRenewals.map((r) => {
                const s = statusStyles[r.status];
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 bg-secondary/20 hover:bg-secondary/40 transition-colors border border-border/50 rounded-lg p-3.5"
                  >
                    <div
                      className={`p-2 rounded-md border ${
                        r.status === "overdue"
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : r.status === "due-soon"
                          ? "bg-warning/10 text-warning border-warning/30"
                          : "bg-primary/10 text-primary border-primary/30"
                      }`}
                    >
                      <ScrollText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-white truncate">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground font-medium truncate">
                        {r.authority} · {r.jurisdiction} · Owner {r.owner}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[12px] font-bold text-white whitespace-nowrap">{r.dueDate}</div>
                      <div
                        className={`text-[10px] font-bold tabular-nums ${
                          r.daysLeft < 0 ? "text-destructive" : r.daysLeft <= 14 ? "text-warning" : "text-muted-foreground"
                        }`}
                      >
                        {r.daysLeft < 0 ? `${Math.abs(r.daysLeft)}d overdue` : `${r.daysLeft}d left`}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${s.classes}`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </motion.div>

        {/* Filing Deadlines */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <ChartCard title="Regulatory Filing Deadlines" className="h-full">
            <div className="flex flex-col gap-2.5">
              {filingDeadlines.map((f) => {
                const s = statusStyles[f.status];
                return (
                  <div key={f.id} className="bg-secondary/20 border border-border/50 rounded-lg p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CalendarClock
                          className={`w-4 h-4 shrink-0 ${
                            f.status === "overdue" ? "text-destructive" : f.status === "due-soon" ? "text-warning" : "text-primary"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-white truncate">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{f.type}</div>
                        </div>
                      </div>
                      <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${s.classes}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[11px]">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {f.dueDate}
                      </span>
                      <span
                        className={`font-bold tabular-nums ${
                          f.daysLeft < 0 ? "text-destructive" : f.daysLeft <= 14 ? "text-warning" : "text-success"
                        }`}
                      >
                        {f.daysLeft < 0 ? `${Math.abs(f.daysLeft)}d overdue` : `${f.daysLeft}d left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* AUDIT CHECKLIST */}
      <motion.div variants={itemVariants}>
        <ChartCard
          title="Audit-Readiness Checklist"
          description={`${completedAudit} of ${auditChecklist.length} controls verified`}
        >
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2 text-[12px]">
              <span className="text-muted-foreground font-bold uppercase tracking-widest">Readiness</span>
              <span className="text-white font-black tabular-nums">{auditPct}%</span>
            </div>
            <div className="w-full bg-secondary/50 h-2.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-success shadow-[0_0_12px_-2px_hsl(var(--success)/0.7)]" style={{ width: `${auditPct}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {auditChecklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg p-3 border transition-colors ${
                  item.complete
                    ? "bg-secondary/20 border-border/50"
                    : "bg-warning/5 border-warning/30"
                }`}
              >
                {item.complete ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-warning shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className={`text-[12px] font-bold truncate ${item.complete ? "text-white" : "text-warning-foreground"}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {item.category} · {item.owner}
                  </div>
                </div>
                {!item.complete && (
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border text-warning bg-warning/15 border-warning/30">
                    Open
                  </span>
                )}
              </div>
            ))}
          </div>
        </ChartCard>
      </motion.div>

      {/* RISK REGISTER */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="xl:col-span-3">
          <ChartCard title="Top Risks Register" description="Sorted by severity">
            <div className="flex flex-col gap-3">
              {sortedRisks.map((risk) => (
                <div
                  key={risk.id}
                  className={`bg-secondary/20 hover:bg-secondary/40 transition-colors rounded-lg p-4 border border-border/50 border-l-4 ${severityAccent[risk.severity]}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 ${
                          risk.severity === "critical"
                            ? "text-destructive"
                            : risk.severity === "high" || risk.severity === "medium"
                            ? "text-warning"
                            : "text-primary"
                        }`}
                      />
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-white truncate">{risk.title}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{risk.category}</span>
                      </div>
                    </div>
                    <AlertBadge severity={severityBadge[risk.severity]} />
                  </div>
                  <p className="text-[12px] text-muted-foreground font-medium leading-relaxed mb-3 pl-7">{risk.impact}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/40 rounded-lg p-3 border border-border/50 ml-7">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Recommended Action</span>
                      <p className="text-[12px] font-medium text-white mt-0.5">{risk.recommendedAction}</p>
                      <div className="flex gap-4 mt-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        <span>Likelihood {risk.likelihood}</span>
                        <span>Owner {risk.owner}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" className="shrink-0 font-bold" onClick={() => handleResolve(risk.title)}>
                      Assign &amp; Track
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 flex flex-col gap-4">
          <RecommendedAction
            title="Clear Overdue Critical Items"
            description="Expedite the Workers' Comp certification and annual report filing to restore full good standing within 48 hours."
            actionText="Launch Remediation"
            onAction={() => handleResolve("Critical remediation plan")}
          />
          <InsightCard title="Automation Opportunity">
            Automating COI tracking and subcontractor license verification would close 2 register items and lift internal-controls score by an estimated 4 points.
          </InsightCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
