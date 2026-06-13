import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { Button } from "@/components/ui/button";
import { alertsData } from "@/data/alertsData";
import { getActiveAlerts } from "@/lib/alertEngine";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Alerts() {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  
  // Merge static data with engine alerts, deduplicating by ID
  const engineAlerts = getActiveAlerts();
  const allAlertsMap = new Map();
  alertsData.forEach(a => allAlertsMap.set(a.id, a));
  engineAlerts.forEach(a => allAlertsMap.set(a.id, a));
  const mergedAlerts = Array.from(allAlertsMap.values());

  const filteredAlerts = filter === "all" ? mergedAlerts : mergedAlerts.filter(a => a.severity === filter);

  const criticalCount = mergedAlerts.filter(a => a.severity === "critical").length;
  const warningCount = mergedAlerts.filter(a => a.severity === "warning").length;
  const infoCount = mergedAlerts.filter(a => a.severity === "info").length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Alerts Engine" 
        description="Command Center Incident & Risk Log" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Acknowledge All</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              onClick={() => setFilter("all")}
              className="border-border"
            >
              All Alerts ({mergedAlerts.length})
            </Button>
            <Button 
              variant={filter === "critical" ? "default" : "outline"} 
              onClick={() => setFilter("critical")}
              className={filter === "critical" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "border-border text-destructive hover:bg-destructive/10"}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Critical ({criticalCount})
            </Button>
            <Button 
              variant={filter === "warning" ? "default" : "outline"} 
              onClick={() => setFilter("warning")}
              className={filter === "warning" ? "bg-warning text-warning-foreground hover:bg-warning/90" : "border-border text-warning hover:bg-warning/10"}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Warning ({warningCount})
            </Button>
            <Button 
              variant={filter === "info" ? "default" : "outline"} 
              onClick={() => setFilter("info")}
              className={filter === "info" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border text-primary hover:bg-primary/10"}
            >
              <Info className="w-4 h-4 mr-2" />
              Info ({infoCount})
            </Button>
          </div>

          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center border border-border/50 rounded-xl bg-card/50 backdrop-blur-xl">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                <h3 className="text-lg font-medium">All Clear</h3>
                <p className="text-muted-foreground mt-1">No alerts matching this criteria.</p>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-xl bg-card/50 backdrop-blur-xl border border-border/50 flex flex-col sm:flex-row sm:items-start gap-4"
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
                    
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Recommended Action</span>
                        <p className="text-sm font-medium mt-0.5">{alert.recommendedAction}</p>
                      </div>
                      <Button size="sm" variant="secondary">Execute Action</Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="Automated Resolution Available">
            3 of your current alerts can be resolved automatically via the Scenario Builder. Approving the "Q3 Ad Budget Shift" scenario will clear the Marketing Waste and Cash Risk alerts.
          </InsightCard>
          
          <RiskWarning 
            title="Critical Volume High" 
            message="You have 2 critical alerts requiring immediate executive attention. SLA breaches will impact recognized revenue next month."
          />

          <RecommendedAction 
            title="Deploy Overflow Team" 
            description="Instantly provision 3 fractional compliance specialists via Upwork API integration to resolve the SLA bottleneck."
            actionText="1-Click Deploy"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
