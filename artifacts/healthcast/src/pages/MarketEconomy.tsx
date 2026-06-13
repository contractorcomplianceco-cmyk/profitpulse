import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { Button } from "@/components/ui/button";
import { macroKpis, regionalDemand } from "@/data/economyData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function MarketEconomy() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Market & Economy" 
        description="Macroeconomic Impact on Contractor Compliance" 
        actions={<Button variant="outline" className="border-border hover:bg-card">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {macroKpis.map((kpi) => (
          <motion.div key={kpi.id} variants={itemVariants}>
            <KpiCard 
              label={kpi.label} 
              value={kpi.value}
              priorValue={kpi.priorValue}
              trend={kpi.trend}
              inverseTrend={kpi.inverseTrend}
            />
            <div className="mt-1 text-right px-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Source: {kpi.source}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Economic Risk vs Opportunity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <h4 className="font-semibold text-success mb-2">Tailwinds (Opportunity)</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Interest rates dropping reduces capital costs for contractors, encouraging new firm creation.</li>
                <li>• Sunbelt population migration driving heavy commercial construction volume in TX and FL.</li>
                <li>• Material cost stabilization improving contractor profit margins, increasing willingness to pay for compliance.</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <h4 className="font-semibold text-destructive mb-2">Headwinds (Risk)</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• B2B Paid Search CPCs increasing rapidly, squeezing marketing ROI.</li>
                <li>• State licensing boards experiencing severe backlogs, delaying revenue recognition for CCA.</li>
                <li>• Cooling demand in Northeast may lead to higher churn among contractors in that region.</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4">Regional Contractor Demand</h3>
          <div className="space-y-3">
            {regionalDemand.map((reg, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-background/50 border border-border/50">
                <span className="font-medium">{reg.region}</span>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${reg.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                    {reg.growth > 0 ? '+' : ''}{reg.growth}% YoY
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground w-20 text-center">
                    {reg.demand}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <InsightCard title="State Level Bottlenecks">
            State licensing processing times have increased from an average of 38 days to 45 days over the last quarter. This delay pushes CCA's fulfillment timelines and delays final milestone billing.
          </InsightCard>
          
          <RiskWarning 
            title="Marketing Cost Inflation" 
            message="Paid Search CPCs have risen 11.5% this quarter. If close rates remain static, Customer Acquisition Cost (CAC) will break target thresholds by next month."
          />

          <RecommendedAction 
            title="Geographic Budget Shift" 
            description="Reallocate 20% of ad spend from Northeast markets to Sunbelt territories where contractor creation velocity is highest."
            actionText="Shift Ad Spend"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
