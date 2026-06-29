import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { ScenarioSlider } from "@/components/dashboard/ScenarioSlider";
import { ScenarioComparePanel } from "@/components/profit-pulse/ScenarioComparePanel";
import { LiveDataBanner } from "@/components/profit-pulse/LiveDataBanner";
import { useProfitPulse } from "@/context/ProfitPulseProvider";
import { computeScenarioProjection } from "@/lib/profit-pulse/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateChecklistItem } from "@/lib/profit-pulse/onboarding";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function ScenarioBuilder() {
  const { state, metrics, updateScenarioAssumptions, saveScenario, readOnly } = useProfitPulse();
  const { toast } = useToast();
  const assumptions = state.scenarioAssumptions;
  const [saveOpen, setSaveOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");

  const projection = useMemo(
    () => computeScenarioProjection(state, assumptions),
    [state, assumptions],
  );

  const setAssumption = (key: keyof typeof assumptions, val: number) => {
    if (readOnly) return;
    updateScenarioAssumptions({ [key]: val });
    if (key === "revenueGrowthPct" || key === "facilityIntelligenceRevenue") {
      updateChecklistItem("runScenario", true);
    }
  };

  const handleSave = () => {
    saveScenario(scenarioName);
    toast({
      title: "Scenario saved",
      description: `"${scenarioName.trim() || "Untitled"}" stored with current assumptions.`,
    });
    setSaveOpen(false);
    setScenarioName("");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="Scenario Modeler"
        description="Model revenue, margin, runway, and cash impact against your current books — assumptions auto-save as you adjust."
        actions={
          !readOnly ? (
            <Button variant="outline" onClick={() => setSaveOpen(true)}>
              Save scenario
            </Button>
          ) : undefined
        }
      />

      <LiveDataBanner detail={`Baseline: ${metrics.monthlyRevenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} revenue · ${metrics.runwayMonths.toFixed(1)} mo runway`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div data-tour="scenario-levers" variants={itemVariants} className="lg:col-span-4 space-y-6">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold">Growth assumptions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ScenarioSlider label="Revenue Growth (%)" value={assumptions.revenueGrowthPct} min={-10} max={30} step={1} onChange={(v) => setAssumption("revenueGrowthPct", v)} formatValue={(v) => `${v}%`} />
              <ScenarioSlider label="Price Increase (%)" value={assumptions.priceIncreasePct} min={0} max={25} step={1} onChange={(v) => setAssumption("priceIncreasePct", v)} formatValue={(v) => `${v}%`} />
              <ScenarioSlider label="Churn / Risk (%)" value={assumptions.churnRiskPct} min={0} max={20} step={1} onChange={(v) => setAssumption("churnRiskPct", v)} formatValue={(v) => `${v}%`} />
              <ScenarioSlider label="Facility Intelligence Revenue ($)" value={assumptions.facilityIntelligenceRevenue} min={0} max={150000} step={5000} onChange={(v) => setAssumption("facilityIntelligenceRevenue", v)} formatValue={(v) => `$${v / 1000}k`} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-soft">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold">Efficiency assumptions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ScenarioSlider label="Expense Reduction (%)" value={assumptions.expenseReductionPct} min={0} max={30} step={1} onChange={(v) => setAssumption("expenseReductionPct", v)} formatValue={(v) => `${v}%`} />
              <ScenarioSlider label="Staffing Change (%)" value={assumptions.staffingChangePct} min={-20} max={20} step={1} onChange={(v) => setAssumption("staffingChangePct", v)} formatValue={(v) => `${v}%`} />
              <ScenarioSlider label="AR Collection Improvement (%)" value={assumptions.arCollectionImprovementPct} min={0} max={50} step={5} onChange={(v) => setAssumption("arCollectionImprovementPct", v)} formatValue={(v) => `${v}%`} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
          <ScenarioComparePanel
            baseline={metrics}
            projection={projection}
            decision={projection.recommendedAction}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard title="Assumption summary">
              Revenue +{assumptions.revenueGrowthPct}%, prices +{assumptions.priceIncreasePct}%, expenses −{assumptions.expenseReductionPct}%, staffing {assumptions.staffingChangePct >= 0 ? "+" : ""}{assumptions.staffingChangePct}%, AR collection +{assumptions.arCollectionImprovementPct}%.
            </InsightCard>
            {projection.projectedRunwayMonths < state.organization.runwayThresholdMonths && (
              <RiskWarning
                title="Runway below threshold"
                message={`Projected runway falls to ${projection.projectedRunwayMonths.toFixed(1)} months (target: ${state.organization.runwayThresholdMonths}).`}
              />
            )}
          </div>

          {state.savedScenarios.length > 0 && (
            <Card className="border-border shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Saved scenarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {state.savedScenarios.slice().reverse().map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-muted-foreground text-xs">{new Date(s.savedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Save scenario</DialogTitle>
          </DialogHeader>
          <Input
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="Q3 growth plan"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
