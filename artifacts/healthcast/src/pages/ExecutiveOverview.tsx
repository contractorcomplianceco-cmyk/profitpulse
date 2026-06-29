import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { DonutChart } from "@/components/charts/DonutChart";
import { GaugeChart } from "@/components/charts/GaugeChart";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { TrendLine } from "@/components/charts/TrendLine";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { integrationsData } from "@/data/overviewData";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  TrendingUp,
  Inbox, 
  Users, 
  ShieldAlert,
  BookOpen,
  BarChart2,
  Target,
  Activity,
  Search,
  Facebook,
  ChevronRight,
  FileText,
  FileBarChart,
  DollarSign,
  Banknote,
  Landmark,
  Percent,
  Lightbulb,
  Wallet,
  Bell,
  LineChart,
  PieChart,
  Info
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { useProfitPulse } from "@/context/ProfitPulseProvider";
import { formatCompactCurrency, formatPercent, formatMonths, formatCurrency } from "@/lib/format";
import {
  revenueByCategory,
  arAgingBuckets,
  cashProjection90d,
  computeScenarioProjection,
} from "@/lib/profit-pulse/calculations";
import { LiveDataBanner } from "@/components/profit-pulse/LiveDataBanner";
import { ExecutiveKpiCard } from "@/components/profit-pulse/ExecutiveKpiCard";
import { ExecutiveQuickActions } from "@/components/profit-pulse/ExecutiveQuickActions";
import { PageHeader } from "@/components/dashboard/PageHeader";

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.015 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } }
};

// Map string icons to components
const IconMap: Record<string, any> = {
  AlertTriangle, Clock, TrendingDown, Inbox, Users, ShieldAlert,
  BookOpen, BarChart2, Target, Activity, Search, Facebook
};

// Tasteful icon per KPI (order matches data.ts topKpis)
const kpiIcons = [DollarSign, Banknote, Landmark, TrendingUp, Percent, Clock];

// Per-KPI accent hues (order matches data.ts topKpis)
const kpiAccents = [
  { tile: "bg-teal-500/10 text-teal-600", bar: "from-teal-500 to-teal-400", spark: "#0d9488" },
  { tile: "bg-sky-500/10 text-sky-600", bar: "from-sky-500 to-sky-400", spark: "#0284c7" },
  { tile: "bg-violet-500/10 text-violet-600", bar: "from-violet-500 to-violet-400", spark: "#7c3aed" },
  { tile: "bg-emerald-500/10 text-emerald-600", bar: "from-emerald-500 to-emerald-400", spark: "#059669" },
  { tile: "bg-amber-500/10 text-amber-600", bar: "from-amber-500 to-amber-400", spark: "#d97706" },
  { tile: "bg-indigo-500/10 text-indigo-600", bar: "from-indigo-500 to-indigo-400", spark: "#4f46e5" },
];

// Rich multi-hue palette for the Revenue Breakdown donut
const revenueColorfulPalette = ["#0d9488", "#2563eb", "#7c3aed", "#d97706", "#e11d48", "#059669", "#475569"];

export default function ExecutiveOverview() {
  const { toast } = useToast();
  const { state, metrics, alerts } = useProfitPulse();

  const pctChange = (current: number, prior: number) => {
    if (prior === 0) return "+0%";
    const delta = ((current - prior) / prior) * 100;
    return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
  };

  type RiskLevel = "critical" | "warning" | "info" | null;

  const liveTopKpis: {
    label: string;
    value: string;
    basis: string;
    trend: string;
    trendUp: boolean;
    vs: string;
    sparkline: number[];
    risk: RiskLevel;
  }[] = [
    {
      label: "Monthly Revenue",
      value: formatCompactCurrency(metrics.monthlyRevenue),
      basis: `Sum of ${state.revenueRecords.length} revenue records (last 30 days)`,
      trend: pctChange(metrics.monthlyRevenue, metrics.priorMonthlyRevenue),
      trendUp: metrics.monthlyRevenue >= metrics.priorMonthlyRevenue,
      vs: "vs prior 30d",
      sparkline: metrics.revenueTrend,
      risk: null,
    },
    {
      label: "Net Profit",
      value: formatCompactCurrency(metrics.netProfit),
      basis: `Revenue minus ${state.expenseRecords.length} expense records (30d)`,
      trend: pctChange(metrics.netProfit, metrics.priorNetProfit),
      trendUp: metrics.netProfit >= metrics.priorNetProfit,
      vs: "vs prior 30d",
      sparkline: metrics.revenueTrend,
      risk: metrics.netProfit < 0 ? "critical" : null,
    },
    {
      label: "Cash on Hand",
      value: formatCompactCurrency(metrics.cashOnHand),
      basis: "Organization setting — edit in Settings",
      trend: pctChange(metrics.cashOnHand, metrics.cashOnHand * 0.92),
      trendUp: true,
      vs: "current balance",
      sparkline: metrics.cashTrend,
      risk: metrics.runwayMonths < state.organization.runwayThresholdMonths ? "warning" : null,
    },
    {
      label: "AR Outstanding",
      value: formatCompactCurrency(metrics.arOutstanding),
      basis: `${state.invoices.filter((i) => i.status !== "paid").length} open invoices`,
      trend: pctChange(metrics.arOutstanding, metrics.arOutstanding * 1.05),
      trendUp: false,
      vs: "uncollected",
      sparkline: metrics.cashTrend,
      risk: metrics.arOutstanding > 400000 ? "warning" : null,
    },
    {
      label: "Gross Margin",
      value: formatPercent(metrics.grossMarginPct),
      basis: `(Revenue − expenses) ÷ revenue; target ${state.organization.marginThresholdPct}%`,
      trend: `${metrics.grossMarginPct.toFixed(1)}%`,
      trendUp: metrics.grossMarginPct >= state.organization.marginThresholdPct,
      vs: "margin health",
      sparkline: metrics.revenueTrend,
      risk: metrics.grossMarginPct < state.organization.marginThresholdPct ? "warning" : null,
    },
    {
      label: "Runway",
      value: formatMonths(metrics.runwayMonths),
      basis: `Cash ÷ monthly burn; threshold ${state.organization.runwayThresholdMonths} mo`,
      trend: formatMonths(metrics.runwayMonths),
      trendUp: metrics.runwayMonths >= state.organization.runwayThresholdMonths,
      vs: "liquidity",
      sparkline: metrics.cashTrend,
      risk: metrics.runwayMonths < state.organization.runwayThresholdMonths ? "critical" : null,
    },
  ];

  const liveAlerts = alerts.slice(0, 5).map((a) => ({
    count: a.severity === "critical" ? "!" : "•",
    title: a.title,
    desc: a.message,
    type: a.severity === "critical" ? "risk" : a.severity === "warning" ? "warning" : "info",
    icon: a.severity === "critical" ? "AlertTriangle" : a.severity === "warning" ? "Clock" : "Inbox",
  }));

  const arAgingLive = arAgingBuckets(state).map((b, i) => ({
    name: b.bucket,
    value: b.amount,
    fill: ["#0d9488", "#2563eb", "#d97706", "#e11d48"][i] ?? "#475569",
  }));
  const arTotal = arAgingLive.reduce((s, x) => s + x.value, 0);

  const scenarioProjection = useMemo(
    () => computeScenarioProjection(state, state.scenarioAssumptions),
    [state],
  );

  const cashChartData = useMemo(
    () => cashProjection90d(state).map((p) => ({ date: p.date, balance: p.balance, in: p.in, out: p.out })),
    [state],
  );

  const displayRevBreakdown = useMemo(() => {
    const items = revenueByCategory(state).slice(0, 6);
    const total = items.reduce((s, r) => s + r.value, 0) || metrics.monthlyRevenue || 1;
    return items.map((r) => ({
      name: r.name,
      value: r.value,
      percentage: Math.round((r.value / total) * 100),
    }));
  }, [state, metrics.monthlyRevenue]);

  const pipelineFunnel = useMemo(() => {
    const stages = [
      { key: "lead" as const, label: "Leads", fill: "hsl(var(--primary))" },
      { key: "qualified" as const, label: "Qualified", fill: "hsl(var(--primary)/0.8)" },
      { key: "proposal" as const, label: "Proposal", fill: "hsl(var(--primary)/0.6)" },
      { key: "negotiation" as const, label: "Negotiation", fill: "hsl(var(--primary)/0.4)" },
      { key: "won" as const, label: "Won", fill: "hsl(var(--success))" },
    ];
    return stages.map((s) => ({
      stage: s.label,
      count: state.opportunities.filter((o) => o.stage === s.key).length,
      fill: s.fill,
    }));
  }, [state.opportunities]);

  const pipelineWeighted = useMemo(
    () => state.opportunities.reduce((s, o) => s + o.value * (o.probability / 100), 0),
    [state.opportunities],
  );
  const pipelineTotal = useMemo(
    () => state.opportunities.reduce((s, o) => s + o.value, 0),
    [state.opportunities],
  );
  const winRate = useMemo(() => {
    const closed = state.opportunities.filter((o) => o.stage === "won" || o.stage === "lost");
    if (closed.length === 0) return 0;
    return (state.opportunities.filter((o) => o.stage === "won").length / closed.length) * 100;
  }, [state.opportunities]);

  const marketingSpend = useMemo(
    () =>
      state.expenseRecords
        .filter((e) => e.category.toLowerCase().includes("marketing"))
        .reduce((s, e) => s + e.amount, 0),
    [state.expenseRecords],
  );
  const marketingRoi = marketingSpend > 0 ? metrics.netProfit / marketingSpend : 0;

  const profitMarginByCategory = useMemo(
    () =>
      revenueByCategory(state)
        .slice(0, 5)
        .map((r) => ({ service: r.name, margin: metrics.grossMarginPct })),
    [state, metrics.grossMarginPct],
  );

  const financialSnapshot = useMemo(
    () => [
      { label: "AR Outstanding", value: formatCompactCurrency(metrics.arOutstanding), status: metrics.arOutstanding > 400000 ? "risk" : "good" },
      { label: "AP Upcoming", value: formatCompactCurrency(metrics.apUpcoming), status: "risk-up" },
      { label: "Payroll Burden", value: formatPercent(metrics.monthlyRevenue > 0 ? (metrics.payrollBurden / metrics.monthlyRevenue) * 100 : 0), status: "good" },
      { label: "Marketing Spend", value: formatCompactCurrency(marketingSpend), status: "risk-up" },
      { label: "Net Profit", value: formatCompactCurrency(metrics.netProfit), status: metrics.netProfit > 0 ? "good" : "risk" },
      { label: "Revenue at Risk", value: formatCompactCurrency(metrics.revenueAtRisk), status: "risk" },
      { label: "Facility Opportunity", value: formatCompactCurrency(metrics.facilityOpportunityValue), status: "good" },
      { label: "Forecasted Cash (30d)", value: formatCompactCurrency(metrics.forecastedCash30d), status: metrics.forecastedCash30d < metrics.cashOnHand ? "risk" : "good" },
    ],
    [metrics, marketingSpend],
  );

  const executiveInsightsLive = useMemo(
    () =>
      alerts.slice(0, 4).map((a) => ({
        text: a.message,
        status: a.severity === "critical" ? "risk" : a.severity === "warning" ? "warning" : "info",
      })),
    [alerts],
  );

  const collectibleAr = useMemo(
    () =>
      state.invoices
        .filter((i) => i.status === "overdue" || i.status === "sent" || i.status === "partial")
        .reduce((s, i) => s + (i.amount - i.amountPaid), 0),
    [state.invoices],
  );

  const pinchRiskLabel =
    metrics.forecastedCash30d < metrics.cashOnHand * 0.85 ? "Elevated" : metrics.forecastedCash30d < metrics.cashOnHand ? "Moderate" : "Low";
  const safeToSpend = Math.max(0, metrics.cashOnHand - metrics.apUpcoming - metrics.payrollBurden * 0.25);

  const futurecastTrend = useMemo(
    () => [
      { month: "Now", revenue: metrics.monthlyRevenue, cash: metrics.cashOnHand, profit: metrics.netProfit },
      { month: "M+1", revenue: scenarioProjection.projectedRevenue, cash: metrics.cashOnHand + scenarioProjection.cashImpact * 0.33, profit: scenarioProjection.projectedNetProfit },
      { month: "M+2", revenue: scenarioProjection.projectedRevenue, cash: metrics.cashOnHand + scenarioProjection.cashImpact * 0.66, profit: scenarioProjection.projectedNetProfit },
      { month: "M+3", revenue: scenarioProjection.projectedRevenue, cash: metrics.cashOnHand + scenarioProjection.cashImpact, profit: scenarioProjection.projectedNetProfit },
    ],
    [metrics, scenarioProjection],
  );

  const marketImpactLive = useMemo(
    () => [
      { label: "Runway", value: formatMonths(metrics.runwayMonths), risk: metrics.runwayMonths < state.organization.runwayThresholdMonths, up: metrics.runwayMonths >= state.organization.runwayThresholdMonths },
      { label: "Gross margin", value: `${metrics.grossMarginPct.toFixed(1)}%`, risk: metrics.grossMarginPct < state.organization.marginThresholdPct, up: metrics.grossMarginPct >= state.organization.marginThresholdPct },
      { label: "AR vs monthly rev", value: metrics.monthlyRevenue > 0 ? `${((metrics.arOutstanding / metrics.monthlyRevenue) * 100).toFixed(0)}%` : "—", risk: metrics.arOutstanding > metrics.monthlyRevenue * 0.4, up: false },
      { label: "Facility opportunity", value: formatCompactCurrency(metrics.facilityOpportunityValue), risk: false, up: true },
    ],
    [metrics, state.organization],
  );

  const openTasks = useMemo(() => state.tasks.filter((t) => t.status !== "done").slice(0, 5), [state.tasks]);
  const briefingDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const topActionText =
    alerts.find((a) => a.severity === "critical")?.recommendedAction ??
    alerts[0]?.recommendedAction ??
    `Focus on collections — ${formatCompactCurrency(collectibleAr)} in open AR.`;

  const handleReportClick = (name: string) => {
    toast({
      title: "Generating Report",
      description: `${name} is being prepared for download...`,
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 pb-12 w-full"
    >
      <PageHeader
        title="Executive Overview"
        description={`${state.organization.name} command center — KPIs calculated from your local books in real time.`}
      />

      <LiveDataBanner
        detail={`${state.accounts.length} accounts · ${state.facilities.length} facilities · ${metrics.alertCount} active alerts`}
      />

      <ExecutiveQuickActions />

      {/* A) TOP KPI ROW */}
      <div data-tour="kpi-strip" className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3">
        {liveTopKpis.map((kpi, i) => {
          const KpiIcon = kpiIcons[i];
          const accent = kpiAccents[i % kpiAccents.length];
          return (
          <motion.div key={i} variants={itemVariants}>
            <ExecutiveKpiCard
              label={kpi.label}
              value={kpi.value}
              basis={kpi.basis}
              trend={kpi.trend}
              trendUp={kpi.trendUp}
              vs={kpi.vs}
              sparkline={kpi.sparkline}
              icon={KpiIcon}
              accent={accent}
              risk={kpi.risk}
            />
          </motion.div>
          );
        })}
      </div>

      {/* B, C, D Wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* LEFT SIDE (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          
          {/* B) TWO-PANEL ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Executive Insights */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-extrabold tracking-widest text-foreground uppercase flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  EXECUTIVE INSIGHTS
                </h3>
                <Link href="/alerts" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center tracking-wide">
                  View All Insights <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {executiveInsightsLive.map((insight, i) => {
                  const CatIcon = insight.status === 'warning' ? AlertTriangle : insight.status === 'risk' ? TrendingDown : Info;
                  return (
                  <div key={i} className="flex items-start gap-4 bg-secondary/20 rounded-lg p-4 border border-border/50 hover:bg-secondary/40 transition-colors">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${insight.status === 'warning' ? 'bg-warning shadow-[0_0_10px_hsl(var(--warning))]' : 'bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]'}`} />
                    <CatIcon className="mt-0.5 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[14px] text-foreground font-medium leading-relaxed">{insight.text}</p>
                  </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Financial KPI Cluster */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
               <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-4 flex items-center gap-2">
                 <Wallet className="h-3.5 w-3.5 flex-shrink-0 text-sky-500" />
                 AR / AP Snapshot
               </h3>
               <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-5">
                 {financialSnapshot.map((kpi, i) => (
                   <div key={i} className="flex flex-col">
                     <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="text-lg font-black text-foreground">{kpi.value}</span>
                       {kpi.status === 'risk' && <ArrowUpRight className="w-4 h-4 text-destructive stroke-[3]" />}
                       {kpi.status === 'good' && <ArrowDownRight className="w-4 h-4 text-success stroke-[3]" />}
                       {kpi.status === 'risk-up' && <ArrowUpRight className="w-4 h-4 text-destructive stroke-[3]" />}
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-auto pt-4 border-t border-border">
                 <div className="bg-primary/10 border-l-4 border-primary rounded-r-md p-3.5 text-[13px] text-foreground leading-relaxed">
                   <strong className="text-primary mb-1.5 font-extrabold tracking-wide flex items-center gap-1.5">
                     <Target className="h-3.5 w-3.5 flex-shrink-0" />
                     RECOMMENDED ACTION
                   </strong>
                   {topActionText}
                 </div>
                 <Link href="/daily-briefing" className="mt-4 text-[13px] font-bold text-primary hover:text-primary-foreground hover:bg-primary flex items-center justify-center w-full border border-primary rounded-md py-2 transition-colors">
                   View All Actions
                 </Link>
               </div>
            </motion.div>
          </div>

          {/* C) MAIN GRID (8 Chart Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Cash Flow Forecast */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5 flex items-center gap-2">
                <LineChart className="h-3.5 w-3.5 flex-shrink-0 text-teal-500" />
                Cash Flow Forecast
              </h3>
              <div className="h-40 mb-5">
                <TrendLine 
                  data={cashChartData} 
                  lines={[
                    { key: "balance", color: "#0d9488", name: "Cash Balance" },
                    { key: "in", color: "#059669", name: "Cash In" },
                    { key: "out", color: "#e11d48", name: "Cash Out" }
                  ]}
                  xAxisKey="date"
                  type="area"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Runway</span><span className="font-black text-foreground">{formatMonths(metrics.runwayMonths)}</span></div>
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Cash Pinch Risk</span><span className="font-black text-warning">{pinchRiskLabel}</span></div>
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Forecast (30d)</span><span className="font-black text-foreground">{formatCompactCurrency(metrics.forecastedCash30d)}</span></div>
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Safe to Spend</span><span className="font-black text-success">{formatCompactCurrency(safeToSpend)}</span></div>
              </div>
              <Link href="/cash-flow" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Cash Flow Center</Button>
              </Link>
            </motion.div>

            {/* Revenue Breakdown */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3 flex items-center gap-2">
                <PieChart className="h-3.5 w-3.5 flex-shrink-0 text-violet-500" />
                Revenue Breakdown
              </h3>
              <div className="flex items-center h-[190px]">
                <div className="w-1/2 h-full">
                  <DonutChart data={displayRevBreakdown} centerText={formatCompactCurrency(metrics.monthlyRevenue)} centerSubtext="Total Revenue" palette={revenueColorfulPalette} />
                </div>
                <div className="w-1/2 flex flex-col gap-2.5 pl-4 justify-center">
                  {displayRevBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center text-[12px] font-medium">
                      <div className="w-2.5 h-2.5 rounded-sm mr-3 flex-shrink-0" style={{ backgroundColor: revenueColorfulPalette[i % revenueColorfulPalette.length] }} />
                      <span className="text-muted-foreground truncate mr-auto">{item.name}</span>
                      <span className="text-foreground font-bold ml-3">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/revenue-intelligence" className="mt-5 block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Revenue Intelligence</Button>
              </Link>
            </motion.div>

            {/* Sales Pipeline */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Sales Pipeline to Cash</h3>
              <div className="flex gap-6 mb-5 h-44">
                <div className="w-1/2 h-full">
                  <FunnelChart data={pipelineFunnel} />
                </div>
                <div className="w-1/2 flex flex-col gap-2.5 justify-center text-[13px]">
                  <div className="bg-secondary/30 p-3 rounded-lg border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Weighted Pipeline</span><span className="font-black text-lg text-success">{formatCompactCurrency(pipelineWeighted)}</span></div>
                  <div className="flex justify-between border-b border-border pb-1.5"><span className="text-muted-foreground font-medium">Win Rate</span><span className="text-foreground font-bold">{winRate.toFixed(1)}%</span></div>
                  <div className="flex justify-between border-b border-border pb-1.5"><span className="text-muted-foreground font-medium">Open Opps</span><span className="text-foreground font-bold">{state.opportunities.filter((o) => o.stage !== "won" && o.stage !== "lost").length}</span></div>
                  <div className="flex justify-between border-b border-border pb-1.5"><span className="text-muted-foreground font-medium">Total Pipeline</span><span className="text-foreground font-bold">{formatCompactCurrency(pipelineTotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground font-medium">Coverage</span><span className="text-foreground font-bold">{metrics.monthlyRevenue > 0 ? `${(pipelineWeighted / metrics.monthlyRevenue).toFixed(1)}x` : "—"}</span></div>
                </div>
              </div>
              <Link href="/sales-pipeline" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Pipeline Center</Button>
              </Link>
            </motion.div>

            {/* Marketing ROI */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3">Marketing ROI (True ROI)</h3>
              <div className="flex h-44 mb-3">
                <div className="w-1/2 h-full relative">
                  <GaugeChart value={Math.min(marketingRoi, 10)} label="Net Profit / Marketing" />
                </div>
                <div className="w-1/2 flex flex-col gap-1.5 text-[12px] justify-center pl-4 font-medium">
                  <div className="flex justify-between"><span className="text-muted-foreground">Net Profit</span><span className="text-foreground font-bold">{formatCurrency(metrics.netProfit)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Marketing Spend</span><span className="text-foreground font-bold">{formatCurrency(marketingSpend)}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Marketing ROI</span><span className="text-foreground font-bold">{marketingRoi.toFixed(2)}x</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Monthly Revenue</span><span className="text-foreground font-bold">{formatCurrency(metrics.monthlyRevenue)}</span></div>
                  <div className="flex justify-between text-success mt-1"><span className="opacity-80">Gross Margin</span><span className="font-bold">{metrics.grossMarginPct.toFixed(1)}%</span></div>
                </div>
              </div>
              <Link href="/marketing-roi" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Marketing ROI Center</Button>
              </Link>
            </motion.div>

            {/* Top Services by Margin */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Top Services by Profit Margin</h3>
              <div className="h-44 mb-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitMarginByCategory} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="service" type="category" width={110} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="margin" radius={[0, 4, 4, 0]} barSize={16} fill="hsl(var(--primary))" isAnimationActive={false}>
                      {profitMarginByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.margin > 60 ? 'hsl(var(--primary))' : entry.margin > 40 ? 'hsl(var(--primary)/0.7)' : 'hsl(var(--primary)/0.4)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Link href="/profitability" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Profitability Center</Button>
              </Link>
            </motion.div>

            {/* AR Aging Summary */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3">AR Aging Summary</h3>
              <div className="flex items-center h-[190px] mb-3">
                <div className="w-1/2 h-full">
                  <DonutChart data={arAgingLive} centerText={formatCompactCurrency(arTotal || metrics.arOutstanding)} centerSubtext="Total AR" />
                </div>
                <div className="w-1/2 flex flex-col gap-3 pl-5 justify-center">
                  {arAgingLive.map((item, i) => (
                    <div key={i} className="flex flex-col text-[12px]">
                      <div className="flex justify-between mb-1 font-medium">
                        <span className="text-muted-foreground flex items-center">
                          <div className="w-2.5 h-2.5 rounded-sm mr-2.5" style={{ backgroundColor: item.fill }} />
                          {item.name}
                        </span>
                        <span className="text-foreground font-bold">{formatCompactCurrency(item.value)}</span>
                      </div>
                      <div className="w-full bg-secondary/50 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${arTotal > 0 ? (item.value / arTotal) * 100 : 0}%`, backgroundColor: item.fill }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/ar-ap-collections" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Collections Center</Button>
              </Link>
            </motion.div>

            {/* Futurecast */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Futurecast (Expected Scenario)</h3>
              <div className="h-36 mb-5">
                <TrendLine 
                  data={futurecastTrend} 
                  lines={[
                    { key: "revenue", color: "hsl(var(--primary))", name: "Revenue" },
                    { key: "cash", color: "hsl(152 76% 40%)", name: "Cash End" },
                    { key: "profit", color: "hsl(35 92% 50%)", name: "Profit" }
                  ]}
                  xAxisKey="month"
                  type="line"
                />
              </div>
              <div className="grid grid-cols-4 gap-3 mb-5 text-center text-[13px]">
                <div className="bg-secondary/30 p-2.5 rounded-lg border border-border/50 flex flex-col"><span className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-widest">Revenue</span><span className="font-black text-foreground">{formatCompactCurrency(scenarioProjection.projectedRevenue)}</span></div>
                <div className="bg-secondary/30 p-2.5 rounded-lg border border-border/50 flex flex-col"><span className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-widest">Cash</span><span className="font-black text-success">{formatCompactCurrency(metrics.cashOnHand + scenarioProjection.cashImpact)}</span></div>
                <div className="bg-secondary/30 p-2.5 rounded-lg border border-border/50 flex flex-col"><span className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-widest">Profit</span><span className="font-black text-warning">{formatCompactCurrency(scenarioProjection.projectedNetProfit)}</span></div>
                <div className="bg-primary/10 border-2 border-primary p-2.5 rounded-lg flex flex-col shadow-lg shadow-primary/20"><span className="text-primary font-extrabold mb-1 text-[10px] uppercase tracking-widest">Runway</span><span className="font-black text-foreground text-base leading-none mt-0.5">{formatMonths(scenarioProjection.projectedRunwayMonths)}</span></div>
              </div>
              <Link href="/futurecast" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Futurecast Center</Button>
              </Link>
            </motion.div>

            {/* Market & Economy Impact */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Market & Economy Impact</h3>
              <div className="flex flex-col gap-3 mb-5 flex-1">
                {marketImpactLive.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary/30 border border-border/50 rounded-lg px-4 py-2.5 text-[13px] font-medium">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.risk ? 'text-destructive' : 'text-success'}`}>{item.value}</span>
                      {item.up ? <ArrowUpRight className={`w-4 h-4 stroke-[3] ${item.risk ? 'text-destructive' : 'text-success'}`} /> : <ArrowDownRight className={`w-4 h-4 stroke-[3] ${item.risk ? 'text-success' : 'text-destructive'}`} />}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/market-economy" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Market Impact Center</Button>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* RIGHT SIDE (1 col) */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          
          {/* Alerts Panel */}
          <motion.div data-tour="alerts" variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-soft">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 flex-shrink-0 text-rose-500" />
                Alerts <span className="ml-1 bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-sm font-black shadow-md shadow-destructive/30">{metrics.alertCount}</span>
              </h3>
              <Link href="/alerts" className="text-[11px] font-bold tracking-wide text-primary hover:text-primary/80">View All Alerts</Link>
            </div>
            <div className="flex flex-col gap-3">
              {liveAlerts.map((alert, i) => {
                const Icon = IconMap[alert.icon];
                return (
                  <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-lg bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors border border-border/50">
                    <div className={`mt-0.5 p-2 rounded-md shadow-sm ${alert.type === 'risk' ? 'bg-destructive/10 text-destructive border border-destructive/20' : alert.type === 'warning' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                      {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-foreground font-bold leading-tight">
                        <span className="font-black mr-1.5">{alert.count}</span>
                        {alert.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1.5 font-medium leading-snug">{alert.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Daily Executive Briefing */}
          <motion.div variants={itemVariants} className="bg-primary border border-primary-foreground/20 rounded-xl p-6 flex flex-col shadow-xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[50px] pointer-events-none rounded-full" />
            <h3 className="text-[11px] font-black tracking-widest text-primary-foreground/80 uppercase mb-1 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 flex-shrink-0 text-emerald-300" />
              Daily Executive Briefing
            </h3>
            <div className="text-[12px] font-bold text-primary-foreground/60 mb-6">{briefingDate}</div>
            
            <div className="flex flex-col gap-5 text-[13px]">
              <div className="bg-black/10 rounded-lg p-4 border border-white/5">
                <strong className="text-emerald-300 block mb-1.5 font-extrabold tracking-wide text-[11px] uppercase">What Improved</strong>
                <p className="text-primary-foreground font-medium leading-relaxed">
                  Revenue {pctChange(metrics.monthlyRevenue, metrics.priorMonthlyRevenue)} vs prior 30d; net profit {formatCompactCurrency(metrics.netProfit)}.
                </p>
              </div>
              <div className="bg-black/10 rounded-lg p-4 border border-white/5">
                <strong className="text-rose-300 block mb-1.5 font-extrabold tracking-wide text-[11px] uppercase">What Needs Attention</strong>
                <p className="text-primary-foreground font-medium leading-relaxed">
                  {metrics.alertCount} active alerts; AR {formatCompactCurrency(metrics.arOutstanding)}; runway {formatMonths(metrics.runwayMonths)}.
                </p>
              </div>
              <div>
                <strong className="text-amber-200 block mb-1">Needs Action Today</strong>
                <p className="text-primary-foreground/80">{topActionText}</p>
              </div>
              
              <div className="mt-2 pt-4 border-t border-white/5">
                <strong className="text-primary-foreground block mb-2 font-semibold">Open tasks ({openTasks.length}):</strong>
                <ol className="list-decimal list-inside space-y-1.5 text-primary-foreground/70 ml-1">
                  {openTasks.length === 0 ? (
                    <li>No open tasks — add tasks in your workflow or alerts page.</li>
                  ) : (
                    openTasks.map((t) => <li key={t.id}>{t.title}</li>)
                  )}
                </ol>
              </div>
            </div>
            
            <Link href="/daily-briefing" className="mt-6 block">
              <Button className="w-full text-xs h-9 bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary transition-all">
                <FileText className="w-4 h-4 mr-2" />
                View Full Briefing
              </Button>
            </Link>
          </motion.div>

          {/* Quick Reports */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5 flex flex-col shadow-soft">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <FileBarChart className="h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                Quick Reports
              </h3>
              <Link href="/reports" className="text-xs text-primary hover:text-primary/80">View All</Link>
            </div>
            <div className="flex flex-col gap-2">
              {['CFO Weekly Report', 'Marketing ROI Report', 'AR Collection Report', 'Sales Pipeline Report', 'Service Profitability Report', 'Board Summary Report'].map((report, i) => (
                <button 
                  key={i} 
                  onClick={() => handleReportClick(report)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-left border border-border/50 hover:border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-foreground">{report}</span>
                  </div>
                  <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">Report</span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* E) BOTTOM INTEGRATION STRIP */}
      <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">System Integrations Sync Status</h3>
          <Link href="/integrations" className="text-[10px] text-primary hover:text-primary/80">View All Integrations</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {integrationsData.map((integration, i) => {
            const Icon = IconMap[integration.icon];
            return (
              <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-lg py-2 px-3 flex-shrink-0 min-w-[160px]">
                <div className="p-1.5 bg-secondary/30 rounded flex-shrink-0">
                  {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                    {integration.name}
                    <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_hsl(var(--success))]" />
                  </span>
                  <span className="text-[9px] text-muted-foreground">Last sync: {integration.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
      
    </motion.div>
  );
}
