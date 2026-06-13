import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { AlertBadge } from "@/components/dashboard/AlertBadge";
import { clientKpis, clientsList } from "@/data/clientsData";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function ClientProfitability() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Client Profitability" 
        description="Margin performance by account and LTV analysis" 
        actions={<Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Drilldown</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Total Client LTV" value={formatCompactCurrency(clientKpis.totalLtv.value)} priorValue={clientKpis.totalLtv.priorValue} trend={clientKpis.totalLtv.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Average Margin" value={formatPercent(clientKpis.avgMargin.value)} priorValue={clientKpis.avgMargin.priorValue} trend={clientKpis.avgMargin.trend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="At-Risk Accounts" value={clientKpis.atRiskCount.value} priorValue={clientKpis.atRiskCount.priorValue} trend={clientKpis.atRiskCount.trend} inverseTrend />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Upsell Opportunity" value={formatCompactCurrency(clientKpis.upsellValue.value)} priorValue={clientKpis.upsellValue.priorValue} trend={clientKpis.upsellValue.trend} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:col-span-2">
          <InsightCard title="Power Law Dynamics">
            The top 20% of your clients (VIPs) generate 65% of your total margin, while consuming only 15% of support resources. Conversely, the bottom 3 "At Risk" clients operate at sub-45% margin while generating disproportionate fulfillment load.
          </InsightCard>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <RiskWarning title="High Support Overhead" message="SteelFrame Builders margin has dropped to 38% due to excessive non-billable support hours." />
          <RecommendedAction title="Renegotiate Scope" description="Schedule executive review to convert excessive support hours to a retainer." actionText="Schedule Review" />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Client Ledger</h3>
          <div className="text-sm text-muted-foreground">{clientsList.length} Active Accounts</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b border-border/50">
              <tr>
                <th className="px-5 py-4 font-semibold">Client Name</th>
                <th className="px-5 py-4 font-semibold text-right"><div className="flex items-center justify-end gap-1">Revenue <ArrowUpDown className="w-3 h-3" /></div></th>
                <th className="px-5 py-4 font-semibold text-right">Margin</th>
                <th className="px-5 py-4 font-semibold text-center">Support Load</th>
                <th className="px-5 py-4 font-semibold text-right">LTV</th>
                <th className="px-5 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {clientsList.sort((a, b) => b.revenue - a.revenue).map((client) => (
                <tr key={client.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{client.name}</td>
                  <td className="px-5 py-4 text-right font-mono">{formatCurrency(client.revenue)}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={client.margin < 50 ? "text-destructive font-semibold" : client.margin > 75 ? "text-success font-semibold" : ""}>
                      {client.margin}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                      client.supportLoad === 'High' ? 'bg-destructive/10 text-destructive' : 
                      client.supportLoad === 'Low' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {client.supportLoad}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-muted-foreground font-mono">{formatCompactCurrency(client.ltv)}</td>
                  <td className="px-5 py-4 text-center">
                    {client.status === 'VIP' && <AlertBadge severity="info" />}
                    {client.status === 'At Risk' && <AlertBadge severity="critical" />}
                    {client.status === 'Standard' && <span className="text-xs text-muted-foreground">Standard</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}