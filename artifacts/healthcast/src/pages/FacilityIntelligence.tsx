import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { EntityCrudTable, formatMoneyCell } from "@/components/profit-pulse/EntityCrudTable";
import { LiveDataBanner } from "@/components/profit-pulse/LiveDataBanner";
import {
  useProfitPulse,
  createEmptyFacility,
} from "@/context/ProfitPulseProvider";
import { formatCompactCurrency } from "@/lib/format";
import type { Facility } from "@/lib/profit-pulse/types";
import { Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

function facilityRiskLevel(f: Facility): "critical" | "warning" | "info" {
  if (f.complianceStatus === "non-compliant" || f.healthScore < 60) return "critical";
  if (f.complianceStatus === "at-risk" || f.healthScore < 75) return "warning";
  return "info";
}

function riskLabel(level: ReturnType<typeof facilityRiskLevel>): string {
  if (level === "critical") return "High risk";
  if (level === "warning") return "Elevated";
  return "Stable";
}

const complianceBadge = (status: Facility["complianceStatus"]) => {
  switch (status) {
    case "compliant":
      return <AlertBadge severity="info" />;
    case "at-risk":
      return <AlertBadge severity="warning" />;
    case "non-compliant":
      return <AlertBadge severity="critical" />;
  }
};

export default function FacilityIntelligence() {
  const { state, metrics, upsertFacility, deleteFacility, promoteFacilityToOpportunity, readOnly } = useProfitPulse();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "at-risk">("all");

  const facilities = [...state.facilities]
    .filter((f) => filter === "all" || f.complianceStatus !== "compliant" || f.healthScore < 75)
    .sort((a, b) => a.priorityRank - b.priorityRank);

  const topAction = facilities.find((f) => f.priorityRank === 1)?.recommendedAction
    ?? "Review facility health scores and compliance status weekly.";

  const validateFacility = (f: Facility): string | null => {
    if (!f.name.trim()) return "Facility name is required.";
    if (!f.accountId) return "Linked account is required.";
    if (f.healthScore < 0 || f.healthScore > 100) return "Health score must be 0–100.";
    return null;
  };

  const accountOptions = state.accounts.map((a) => ({ value: a.id, label: a.name }));

  const handlePromote = (f: Facility) => {
    promoteFacilityToOpportunity(f.id);
    toast({
      title: "Opportunity created",
      description: `"${f.name}" added to Sales Pipeline.`,
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Facility Intelligence"
        description="Facility health, compliance posture, and upsell pipeline — connected to executive KPIs and opportunities."
        actions={
          <Link href="/sales-pipeline">
            <Button variant="outline" size="sm">View pipeline</Button>
          </Link>
        }
      />

      <LiveDataBanner detail={`${state.facilities.length} facilities · ${formatCompactCurrency(metrics.facilityOpportunityValue)} total opportunity value`} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Facilities Tracked" value={String(state.facilities.length)} priorValue={state.facilities.length} trend={[3, 4, 4, state.facilities.length]} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Opportunity Value" value={formatCompactCurrency(metrics.facilityOpportunityValue)} priorValue={metrics.facilityOpportunityValue * 0.9} trend={metrics.cashTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="At-Risk Facilities"
            value={String(state.facilities.filter((f) => f.complianceStatus !== "compliant").length)}
            priorValue={1}
            trend={[1, 2, 2, state.facilities.filter((f) => f.complianceStatus !== "compliant").length]}
            inverseTrend
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard
            label="Avg Health Score"
            value={`${Math.round(state.facilities.reduce((s, f) => s + f.healthScore, 0) / Math.max(state.facilities.length, 1))}`}
            priorValue={78}
            trend={[78, 80, 79, 82]}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <RecommendedAction
          title="Recommended Next Action"
          description={topAction}
          actionText="View alerts"
        />
      </motion.div>

      <div className="flex gap-2">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All facilities</Button>
        <Button size="sm" variant={filter === "at-risk" ? "default" : "outline"} onClick={() => setFilter("at-risk")}>At-risk only</Button>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {facilities.map((f) => {
          const account = state.accounts.find((a) => a.id === f.accountId);
          const monthlyValue = account?.monthlyContractValue ?? 0;
          const risk = facilityRiskLevel(f);
          return (
            <div
              key={f.id}
              className="bg-card border border-border rounded-xl p-5 shadow-soft flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate">{f.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{f.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {complianceBadge(f.complianceStatus)}
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider", risk === "critical" ? "text-destructive" : risk === "warning" ? "text-warning" : "text-success")}>
                    {riskLabel(risk)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-secondary/30 rounded-lg p-2.5 border border-border/50">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Health score</span>
                  <p className="font-black text-lg">{f.healthScore}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2.5 border border-border/50">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Monthly value</span>
                  <p className="font-bold">{formatCompactCurrency(monthlyValue)}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2.5 border border-border/50">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Opportunity</span>
                  <p className="font-bold">{formatCompactCurrency(f.revenueOpportunity)}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2.5 border border-border/50">
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Upsell</span>
                  <p className="font-bold">{formatCompactCurrency(f.upsellPotential)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Account:</span> {account?.name ?? "—"}
              </p>
              <p className="text-xs leading-relaxed flex-1">
                <span className="font-semibold">Next action:</span> {f.recommendedAction || "Schedule compliance review"}
              </p>
              {!readOnly && (
              <Button size="sm" variant="secondary" className="w-full gap-1.5 font-bold" onClick={() => handlePromote(f)}>
                <TrendingUp className="w-3.5 h-3.5" />
                Promote to opportunity
              </Button>
              )}
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <EntityCrudTable<Facility>
          title="Facility Registry"
          description="Manage facilities linked to accounts — changes persist locally."
          records={state.facilities}
          searchKeys={["name", "location", "recommendedAction"]}
          searchPlaceholder="Search facilities…"
          getRecordLabel={(f) => f.name}
          columns={[
            { key: "name", label: "Facility" },
            { key: "location", label: "Location" },
            { key: "healthScore", label: "Health" },
            {
              key: "accountId",
              label: "Account",
              format: (v) => state.accounts.find((a) => a.id === v)?.name ?? "—",
            },
            { key: "priorityRank", label: "Priority" },
            {
              key: "revenueOpportunity",
              label: "Opportunity",
              format: (v) => formatMoneyCell(v),
            },
          ]}
          fields={[
            { key: "name", label: "Name", required: true, placeholder: "Sunrise Tampa Campus" },
            { key: "location", label: "Location", required: true, placeholder: "Tampa, FL" },
            {
              key: "accountId",
              label: "Account",
              type: "select",
              required: true,
              options: accountOptions,
            },
            { key: "healthScore", label: "Health Score", type: "number", required: true },
            {
              key: "complianceStatus",
              label: "Compliance",
              type: "select",
              options: [
                { value: "compliant", label: "Compliant" },
                { value: "at-risk", label: "At Risk" },
                { value: "non-compliant", label: "Non-Compliant" },
              ],
            },
            { key: "revenueOpportunity", label: "Revenue Opportunity", type: "currency" },
            { key: "upsellPotential", label: "Upsell Potential", type: "currency" },
            { key: "priorityRank", label: "Priority Rank", type: "number" },
            { key: "recommendedAction", label: "Recommended Action", type: "textarea" },
            { key: "lastInspectionDate", label: "Last Inspection", type: "date" },
            { key: "riskNotes", label: "Risk Notes", type: "textarea" },
          ]}
          onSave={upsertFacility}
          onDelete={deleteFacility}
          createRecord={() => createEmptyFacility(state.accounts[0]?.id)}
          readOnly={readOnly}
          validate={validateFacility}
          emptyMessage="No facilities tracked. Add your first facility to connect Facility Intelligence."
        />
      </motion.div>
    </motion.div>
  );
}
