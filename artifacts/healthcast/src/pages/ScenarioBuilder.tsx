import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { ScenarioSlider } from "@/components/dashboard/ScenarioSlider";
import { calculateScenario, ScenarioBaseline, ScenarioAdjustments } from "@/lib/calculations";
import { formatCompactCurrency, formatPercent, formatMonths, formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

const BASELINE: ScenarioBaseline = {
  revenue: 1250000,
  cash: 2400000,
  profit: 285000,
  payroll: 420000,
  ar: 420000,
  marketingSpend: 85000,
};

export default function ScenarioBuilder() {
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({
    adSpendDelta: 0,
    hireSalesperson: 0,
    hireCompliance: 0,
    hireBookkeeper: 0,
    raisePricesPct: 0,
    reduceExpensesPct: 0,
    increaseCloseRatePct: 0,
    reduceRefundRatePct: 0,
    improveCollectionSpeedDays: 0,
    addRetainerPlan: false,
    launchNewChannel: false,
    increaseReferralPayouts: false,
    cutLowMarginService: false,
  });

  const updateAdj = (key: keyof ScenarioAdjustments, val: number | boolean) => {
    setAdjustments(prev => ({ ...prev, [key]: val }));
  };

  const result = useMemo(() => calculateScenario(BASELINE, adjustments), [adjustments]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Scenario Builder" 
        description="Live operational modeling. Adjust levers to see immediate impact on cash, profit, and risk."
        actions={<Button variant="outline">Save Scenario</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls - Left Side */}
        <motion.div data-tour="scenario-levers" variants={itemVariants} className="lg:col-span-4 space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-semibold">Growth Levers</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ScenarioSlider label="Ad Spend Delta ($)" value={adjustments.adSpendDelta} min={-50000} max={100000} step={1000} onChange={v => updateAdj('adSpendDelta', v)} formatValue={v => `$${v/1000}k`} />
              <ScenarioSlider label="Hire Salesperson (Headcount)" value={adjustments.hireSalesperson} min={0} max={10} onChange={v => updateAdj('hireSalesperson', v)} />
              <ScenarioSlider label="Hire Compliance (Headcount)" value={adjustments.hireCompliance} min={0} max={20} onChange={v => updateAdj('hireCompliance', v)} />
              <ScenarioSlider label="Raise Prices (%)" value={adjustments.raisePricesPct} min={0} max={50} step={1} onChange={v => updateAdj('raisePricesPct', v)} formatValue={v => `${v}%`} />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-semibold">Efficiency Levers</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ScenarioSlider label="Reduce Expenses (%)" value={adjustments.reduceExpensesPct} min={0} max={30} step={1} onChange={v => updateAdj('reduceExpensesPct', v)} formatValue={v => `${v}%`} />
              <ScenarioSlider label="Increase Close Rate (%)" value={adjustments.increaseCloseRatePct} min={0} max={20} step={1} onChange={v => updateAdj('increaseCloseRatePct', v)} formatValue={v => `${v}%`} />
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="retainer" className="cursor-pointer">Add Retainer Plan</Label>
                  <Switch id="retainer" checked={adjustments.addRetainerPlan} onCheckedChange={v => updateAdj('addRetainerPlan', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cut" className="cursor-pointer">Cut Low-Margin Service</Label>
                  <Switch id="cut" checked={adjustments.cutLowMarginService} onCheckedChange={v => updateAdj('cutLowMarginService', v)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results - Right Side */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard label="Projected Revenue" value={formatCompactCurrency(BASELINE.revenue + result.revenueImpact)} priorValue={BASELINE.revenue} />
            <KpiCard label="Projected Cash" value={formatCompactCurrency(BASELINE.cash + result.cashImpact)} priorValue={BASELINE.cash} />
            <KpiCard label="Projected Net Profit" value={formatCompactCurrency(BASELINE.profit + result.profitImpact)} priorValue={BASELINE.profit} />
            <KpiCard label="Projected Runway" value={formatMonths((BASELINE.cash + result.cashImpact) / (BASELINE.payroll + result.payrollImpact))} priorValue={BASELINE.cash / BASELINE.payroll} />
            <KpiCard label="Projected Payroll" value={formatCompactCurrency(BASELINE.payroll + result.payrollImpact)} priorValue={BASELINE.payroll} inverseTrend />
            <KpiCard label="Risk Score" value={result.riskScore} priorValue={30} inverseTrend />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardContent className="p-5 flex flex-col justify-center h-full">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Algorithm Decision</h4>
                  <div className={`text-2xl font-bold ${result.riskScore > 60 ? 'text-destructive' : 'text-success'}`}>
                    {result.decisionString}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Time to payoff: {result.timeToPayoffMonths === 99 ? 'Never' : formatMonths(result.timeToPayoffMonths)}
                  </p>
                </CardContent>
             </Card>
             <div className="flex flex-col gap-4">
               <InsightCard title="Impact Analysis">
                 Adding {adjustments.hireSalesperson} sales reps and ${formatNumber(adjustments.adSpendDelta)} to marketing generates an estimated {formatNumber(result.leadImpact)} new leads. Capacity expands by {result.capacityImpact} units.
               </InsightCard>
               {result.riskScore > 50 && (
                 <RiskWarning title="High Execution Risk" message="This scenario pushes risk tolerance above recommended thresholds. Cash burn rate is critically high." />
               )}
             </div>
          </div>
          
          <RecommendedAction 
            title="Deploy Scenario Sandbox" 
            description="Save this scenario to your Futurecast modeling suite to track its real-world viability over the next 90 days."
            actionText="Save Scenario to Futurecast"
            onAction={() => {}}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
