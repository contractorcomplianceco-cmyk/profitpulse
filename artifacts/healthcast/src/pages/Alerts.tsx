import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { Button } from "@/components/ui/button";
import { useProfitPulse } from "@/context/ProfitPulseProvider";
import { alertCountBySeverity } from "@/lib/profit-pulse/alerts";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function Alerts() {
  const { alerts, metrics } = useProfitPulse();
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);
  const counts = alertCountBySeverity(alerts);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Alerts Engine"
        description="Rule-based alerts derived from your live AR, AP, margin, runway, facilities, and pipeline data."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
              All Alerts ({alerts.length})
            </Button>
            <Button variant={filter === "critical" ? "default" : "outline"} onClick={() => setFilter("critical")} className={filter === "critical" ? "bg-destructive text-destructive-foreground" : "text-destructive"}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Critical ({counts.critical})
            </Button>
            <Button variant={filter === "warning" ? "default" : "outline"} onClick={() => setFilter("warning")} className={filter === "warning" ? "bg-warning text-warning-foreground" : "text-warning"}>
              Warning ({counts.warning})
            </Button>
            <Button variant={filter === "info" ? "default" : "outline"} onClick={() => setFilter("info")} className={filter === "info" ? "bg-primary text-primary-foreground" : "text-primary"}>
              <Info className="w-4 h-4 mr-2" />
              Info ({counts.info})
            </Button>
          </div>

          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center border border-border/50 rounded-xl bg-card/50">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                <h3 className="text-lg font-medium">All Clear</h3>
                <p className="text-muted-foreground mt-1">No alerts matching this criteria.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-xl bg-card/50 border border-border/50 flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="shrink-0 mt-0.5">
                    <AlertBadge severity={alert.severity} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{alert.category}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-xs text-muted-foreground">Impacts: {alert.affectedMetric}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{alert.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{alert.message}</p>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Recommended Action</span>
                      <p className="text-sm font-medium mt-0.5">{alert.recommendedAction}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Alert Summary">
            {metrics.alertCount} active alerts from live data. Runway {metrics.runwayMonths.toFixed(1)} mo, margin {metrics.grossMarginPct.toFixed(1)}%, AR {Math.round(metrics.arOutstanding / 1000)}K.
          </InsightCard>
          <RecommendedAction
            title="Reduce Alert Volume"
            description="Improve AR collections and resolve high-risk facility compliance items to clear critical alerts."
            actionText="Open Facility Intelligence"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
