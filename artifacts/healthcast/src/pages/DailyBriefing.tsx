import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PreviewModuleBanner } from "@/components/profit-pulse/PreviewModuleBanner";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { RiskWarning } from "@/components/dashboard/RiskWarning";
import { RecommendedAction } from "@/components/dashboard/RecommendedAction";
import { briefingData } from "@/data/briefingData";
import { formatCompactCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { CheckCircle2, AlertCircle, AlertTriangle, TrendingUp, Clock, FileText } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function DailyBriefing() {
  const dateStr = new Date(briefingData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader 
        title="Daily Executive Briefing" 
        description={`Preview memo layout · ${dateStr}`}
        actions={<Button variant="outline">Share Briefing</Button>}
      />

      <PreviewModuleBanner detail="Static sample narrative. Live alerts and KPIs are on Executive Overview and Alerts." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <KpiCard label="Live Revenue" value={formatCompactCurrency(briefingData.kpis.revenue.value)} priorValue={briefingData.kpis.revenue.prior} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Live Cash" value={formatCompactCurrency(briefingData.kpis.cash.value)} priorValue={briefingData.kpis.cash.prior} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard label="Live AR Risk" value={formatCompactCurrency(briefingData.kpis.ar.value)} priorValue={briefingData.kpis.ar.prior} inverseTrend />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-8 prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold flex items-center gap-2 mt-0">
                <FileText className="text-primary w-6 h-6" /> 
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-success flex items-center gap-2 text-lg"><CheckCircle2 className="w-5 h-5"/> What Improved</h3>
                  <ul className="space-y-2 mt-3">
                    {briefingData.whatImproved.map((item, i) => <li key={i} className="text-muted-foreground leading-relaxed">{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-destructive flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5"/> What Got Worse</h3>
                  <ul className="space-y-2 mt-3">
                    {briefingData.whatGotWorse.map((item, i) => <li key={i} className="text-muted-foreground leading-relaxed">{item}</li>)}
                  </ul>
                </div>
              </div>

              <hr className="border-border/50 my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-warning flex items-center gap-2 text-lg"><AlertTriangle className="w-5 h-5"/> What Needs Action Today</h3>
                  <ul className="space-y-2 mt-3">
                    {briefingData.whatNeedsActionToday.map((item, i) => <li key={i} className="text-muted-foreground leading-relaxed">{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-destructive flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5"/> What's At Risk</h3>
                  <ul className="space-y-2 mt-3">
                    {briefingData.whatsAtRisk.map((item, i) => <li key={i} className="text-muted-foreground leading-relaxed">{item}</li>)}
                  </ul>
                </div>
              </div>

              <hr className="border-border/50 my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-0">
                <div>
                  <h3 className="text-primary flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5"/> Opportunity to Push</h3>
                  <ul className="space-y-2 mt-3">
                    {briefingData.whatOpportunityToPush.map((item, i) => <li key={i} className="text-muted-foreground leading-relaxed">{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-muted-foreground flex items-center gap-2 text-lg"><Clock className="w-5 h-5"/> Decision Should Wait</h3>
                  <ul className="space-y-2 mt-3">
                    {briefingData.whatDecisionShouldWait.map((item, i) => <li key={i} className="text-muted-foreground leading-relaxed">{item}</li>)}
                  </ul>
                </div>
              </div>

            </CardContent>
          </Card>

          <InsightCard title="Daily System Insight">
            The CRM health score algorithms have flagged 3 mid-tier clients as churn risks due to lack of portal engagement in the last 14 days. Initiating proactive customer success outreach is highly recommended.
          </InsightCard>

        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50 border-t-4 border-t-primary">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                Top 5 Executive Actions
              </h3>
              <div className="space-y-6">
                {briefingData.top5Actions.map((action, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-snug">{action.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{action.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ChartCard title="Overall Health Trend" description="Rolling 5-day OS health score">
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={briefingData.trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          
          <RiskWarning 
            title="AP Escalation" 
            message="2 critical vendor payments are due tomorrow totaling $18,500. Cash is sufficient, but requires manual CEO approval in portal."
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
