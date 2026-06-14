import { motion } from "framer-motion";
import { Link } from "wouter";
import { Sparkline } from "@/components/charts/Sparkline";
import { DonutChart } from "@/components/charts/DonutChart";
import { GaugeChart } from "@/components/charts/GaugeChart";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { TrendLine } from "@/components/charts/TrendLine";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  topKpis,
  executiveInsights,
  financialKpis,
  revenueBreakdown,
  pipelineData,
  profitMarginData,
  arAgingData,
  futurecastData,
  marketImpact,
  cashFlowData,
  alertsData,
  integrationsData
} from "@/data/overviewData";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
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
  FileText
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";

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

export default function ExecutiveOverview() {
  const { toast } = useToast();

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
      {/* A) TOP KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3">
        {topKpis.map((kpi, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-card border border-border rounded-xl p-4 shadow-lg shadow-black/20 hover:border-primary/50 transition-all flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            <div className="text-[10px] font-extrabold tracking-wide text-muted-foreground uppercase whitespace-nowrap">{kpi.label}</div>
            <div className="text-2xl 2xl:text-[1.7rem] font-black tracking-tight text-white whitespace-nowrap tabular-nums leading-tight">{kpi.value}</div>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
              <div className="flex flex-col">
                <span className={`text-[13px] flex items-center font-bold ${kpi.trendUp ? 'text-success' : 'text-destructive'}`}>
                  {kpi.trendUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                  {kpi.trend}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{kpi.vs}</span>
              </div>
              <div className="w-16 h-8">
                <Sparkline data={kpi.sparkline} color={kpi.trendUp ? "hsl(var(--success))" : "hsl(var(--destructive))"} type="area" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* B, C, D Wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* LEFT SIDE (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          
          {/* B) TWO-PANEL ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Executive Insights */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-extrabold tracking-widest text-foreground uppercase">EXECUTIVE INSIGHTS</h3>
                <Link href="/alerts" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center tracking-wide">
                  View All Insights <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {executiveInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-4 bg-secondary/20 rounded-lg p-4 border border-border/50 hover:bg-secondary/40 transition-colors">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${insight.status === 'warning' ? 'bg-warning shadow-[0_0_10px_hsl(var(--warning))]' : 'bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]'}`} />
                    <p className="text-[14px] text-white font-medium leading-relaxed">{insight.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financial KPI Cluster */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
               <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-5">
                 {financialKpis.map((kpi, i) => (
                   <div key={i} className="flex flex-col">
                     <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">{kpi.label} {kpi.sub && <span className="opacity-60">{kpi.sub}</span>}</span>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="text-lg font-black text-white">{kpi.value}</span>
                       {kpi.status === 'risk' && <ArrowUpRight className="w-4 h-4 text-destructive stroke-[3]" />}
                       {kpi.status === 'good' && <ArrowDownRight className="w-4 h-4 text-success stroke-[3]" />}
                       {kpi.status === 'risk-up' && <ArrowUpRight className="w-4 h-4 text-destructive stroke-[3]" />}
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-auto pt-4 border-t border-border">
                 <div className="bg-primary/10 border-l-4 border-primary rounded-r-md p-3.5 text-[13px] text-primary-foreground leading-relaxed">
                   <strong className="text-primary block mb-1.5 font-extrabold tracking-wide">RECOMMENDED ACTION</strong>
                   Focus on improving collections this week. $127K collectible with immediate follow-up.
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
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Cash Flow Forecast</h3>
              <div className="h-40 mb-5">
                <TrendLine 
                  data={cashFlowData} 
                  lines={[
                    { key: "balance", color: "hsl(var(--primary))", name: "Cash Balance" },
                    { key: "in", color: "hsl(var(--success))", name: "Cash In" },
                    { key: "out", color: "hsl(var(--destructive))", name: "Cash Out" }
                  ]}
                  xAxisKey="date"
                  type="area"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Runway</span><span className="font-black text-foreground">4.7 months</span></div>
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Cash Pinch Risk</span><span className="font-black text-warning">Moderate</span></div>
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Pinch Date</span><span className="font-black text-foreground">May 30 2025</span></div>
                <div className="bg-secondary/30 p-3 rounded-lg text-[13px] border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Safe to Spend This Week</span><span className="font-black text-success">$23,850</span></div>
              </div>
              <Link href="/cash-flow" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Cash Flow Center</Button>
              </Link>
            </motion.div>

            {/* Revenue Breakdown */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3">Revenue Breakdown</h3>
              <div className="flex items-center h-[190px]">
                <div className="w-1/2 h-full">
                  <DonutChart data={revenueBreakdown} centerText="$1.25M" centerSubtext="Total Revenue" />
                </div>
                <div className="w-1/2 flex flex-col gap-2.5 pl-4 justify-center">
                  {revenueBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center text-[12px] font-medium">
                      <div className="w-2.5 h-2.5 rounded-sm mr-3 flex-shrink-0" style={{ backgroundColor: item.fill }} />
                      <span className="text-muted-foreground truncate mr-auto">{item.name}</span>
                      <span className="text-white font-bold ml-3">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/revenue-intelligence" className="mt-5 block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Revenue Intelligence</Button>
              </Link>
            </motion.div>

            {/* Sales Pipeline */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Sales Pipeline to Cash</h3>
              <div className="flex gap-6 mb-5 h-44">
                <div className="w-1/2 h-full">
                  <FunnelChart data={pipelineData} />
                </div>
                <div className="w-1/2 flex flex-col gap-2.5 justify-center text-[13px]">
                  <div className="bg-secondary/30 p-3 rounded-lg border border-border/50"><span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest block mb-1">Expected Cash</span><span className="font-black text-lg text-success">$1.48M</span></div>
                  <div className="flex justify-between border-b border-border pb-1.5"><span className="text-muted-foreground font-medium">Win Rate</span><span className="text-white font-bold">24.4%</span></div>
                  <div className="flex justify-between border-b border-border pb-1.5"><span className="text-muted-foreground font-medium">Avg Cycle</span><span className="text-white font-bold">31 Days</span></div>
                  <div className="flex justify-between border-b border-border pb-1.5"><span className="text-muted-foreground font-medium">Weighted</span><span className="text-white font-bold">$2.31M</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground font-medium">Coverage</span><span className="text-white font-bold">2.7x</span></div>
                </div>
              </div>
              <Link href="/sales-pipeline" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Pipeline Center</Button>
              </Link>
            </motion.div>

            {/* Marketing ROI */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3">Marketing ROI (True ROI)</h3>
              <div className="flex h-44 mb-3">
                <div className="w-1/2 h-full relative">
                  <GaugeChart value={3.21} label="Collected Profit" />
                </div>
                <div className="w-1/2 flex flex-col gap-1.5 text-[12px] justify-center pl-4 font-medium">
                  <div className="flex justify-between"><span className="text-muted-foreground">Collected Profit</span><span className="text-white font-bold">$281,240</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Spend</span><span className="text-white font-bold">$87,540</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Cost per Click</span><span className="text-white font-bold">$2.18</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cost per Lead</span><span className="text-white font-bold">$24.60</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cost per SQL</span><span className="text-white font-bold">$68.23</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CAC</span><span className="text-white font-bold">$1,122</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ROAS (Rev)</span><span className="text-white font-bold">5.72x</span></div>
                  <div className="flex justify-between text-success mt-1"><span className="opacity-80">Payback Period</span><span className="font-bold">32 Days</span></div>
                </div>
              </div>
              <Link href="/marketing-roi" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Marketing ROI Center</Button>
              </Link>
            </motion.div>

            {/* Top Services by Margin */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Top Services by Profit Margin</h3>
              <div className="h-44 mb-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitMarginData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="service" type="category" width={110} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="margin" radius={[0, 4, 4, 0]} barSize={16} fill="hsl(var(--primary))" isAnimationActive={false}>
                      {profitMarginData.map((entry, index) => (
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
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3">AR Aging Summary</h3>
              <div className="flex items-center h-[190px] mb-3">
                <div className="w-1/2 h-full">
                  <DonutChart data={arAgingData} centerText="$487K" centerSubtext="Total AR" />
                </div>
                <div className="w-1/2 flex flex-col gap-3 pl-5 justify-center">
                  {arAgingData.map((item, i) => (
                    <div key={i} className="flex flex-col text-[12px]">
                      <div className="flex justify-between mb-1 font-medium">
                        <span className="text-muted-foreground flex items-center">
                          <div className="w-2.5 h-2.5 rounded-sm mr-2.5" style={{ backgroundColor: item.fill }} />
                          {item.name}
                        </span>
                        <span className="text-white font-bold">${(item.value / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="w-full bg-secondary/50 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.value / 487230) * 100}%`, backgroundColor: item.fill }} />
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
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Futurecast (Expected Scenario)</h3>
              <div className="h-36 mb-5">
                <TrendLine 
                  data={futurecastData} 
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
                <div className="bg-secondary/30 p-2.5 rounded-lg border border-border/50 flex flex-col"><span className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-widest">Revenue</span><span className="font-black text-white">$4.21M</span></div>
                <div className="bg-secondary/30 p-2.5 rounded-lg border border-border/50 flex flex-col"><span className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-widest">Cash</span><span className="font-black text-success">$1.32M</span></div>
                <div className="bg-secondary/30 p-2.5 rounded-lg border border-border/50 flex flex-col"><span className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-widest">Profit</span><span className="font-black text-warning">$842K</span></div>
                <div className="bg-primary/10 border-2 border-primary p-2.5 rounded-lg flex flex-col shadow-lg shadow-primary/20"><span className="text-primary font-extrabold mb-1 text-[10px] uppercase tracking-widest">Prob Goal</span><span className="font-black text-white text-base leading-none mt-0.5">78%</span></div>
              </div>
              <Link href="/futurecast" className="mt-auto block">
                <Button variant="secondary" className="w-full text-[13px] font-bold h-10 bg-secondary/50 hover:bg-secondary border-0">View Futurecast Center</Button>
              </Link>
            </motion.div>

            {/* Market & Economy Impact */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase mb-5">Market & Economy Impact</h3>
              <div className="flex flex-col gap-3 mb-5 flex-1">
                {marketImpact.map((item, i) => (
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
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase flex items-center">
                Alerts <span className="ml-3 bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-sm font-black shadow-md shadow-destructive/30">14</span>
              </h3>
              <Link href="/alerts" className="text-[11px] font-bold tracking-wide text-primary hover:text-primary/80">View All Alerts</Link>
            </div>
            <div className="flex flex-col gap-3">
              {alertsData.map((alert, i) => {
                const Icon = IconMap[alert.icon];
                return (
                  <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-lg bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors border border-border/50">
                    <div className={`mt-0.5 p-2 rounded-md shadow-sm ${alert.type === 'risk' ? 'bg-destructive/10 text-destructive border border-destructive/20' : alert.type === 'warning' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                      {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white font-bold leading-tight">
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
            <h3 className="text-[11px] font-black tracking-widest text-primary-foreground/80 uppercase mb-1">Daily Executive Briefing</h3>
            <div className="text-[12px] font-bold text-primary-foreground/60 mb-6">May 13, 2025</div>
            
            <div className="flex flex-col gap-5 text-[13px]">
              <div className="bg-black/10 rounded-lg p-4 border border-white/5">
                <strong className="text-emerald-400 block mb-1.5 font-extrabold tracking-wide text-[11px] uppercase">What Improved</strong>
                <p className="text-primary-foreground font-medium leading-relaxed">Revenue up 18.6%, cash up 8.7%, pipeline up 12%</p>
              </div>
              <div className="bg-black/10 rounded-lg p-4 border border-white/5">
                <strong className="text-rose-400 block mb-1.5 font-extrabold tracking-wide text-[11px] uppercase">What Got Worse</strong>
                <p className="text-primary-foreground font-medium leading-relaxed">AR aging up 18%, marketing ROI down 0.4x</p>
              </div>
              <div>
                <strong className="text-warning block mb-1">Needs Action Today</strong>
                <p className="text-white/80">Follow up on 17 invoices, review Google Ads, 3 stale deals need next steps</p>
              </div>
              <div>
                <strong className="text-destructive block mb-1">At Risk</strong>
                <p className="text-white/80">Cash pinch in 17 days, 2 clients at payment risk</p>
              </div>
              <div>
                <strong className="text-primary block mb-1">Opportunity to Push</strong>
                <p className="text-white/80">Florida market expansion, retainer upsell, low CPC keywords</p>
              </div>
              <div>
                <strong className="text-muted-foreground block mb-1">Decision Should Wait</strong>
                <p className="text-white/80">Hiring additional salesperson, large software purchase</p>
              </div>
              
              <div className="mt-2 pt-4 border-t border-white/5">
                <strong className="text-white block mb-2 font-semibold">Top 5 Actions Today:</strong>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground ml-1">
                  <li>Follow up on $127K collectible invoices</li>
                  <li>Pause underperforming Google Ads campaigns</li>
                  <li>Review 3 stale pipeline opportunities</li>
                  <li>Approve retention email campaign</li>
                  <li>Update cash forecast for next 30 days</li>
                </ol>
              </div>
            </div>
            
            <Link href="/daily-briefing" className="mt-6 block">
              <Button className="w-full text-xs h-9 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]">
                <FileText className="w-4 h-4 mr-2" />
                View Full Briefing
              </Button>
            </Link>
          </motion.div>

          {/* Quick Reports */}
          <motion.div variants={itemVariants} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-xl p-5 flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Quick Reports</h3>
              <Link href="/reports" className="text-xs text-primary hover:text-primary/80">View All</Link>
            </div>
            <div className="flex flex-col gap-2">
              {['CFO Weekly Report', 'Marketing ROI Report', 'AR Collection Report', 'Sales Pipeline Report', 'Service Profitability Report', 'Board Summary Report'].map((report, i) => (
                <button 
                  key={i} 
                  onClick={() => handleReportClick(report)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-white/90">{report}</span>
                  </div>
                  <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">Report</span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* E) BOTTOM INTEGRATION STRIP */}
      <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">System Integrations Sync Status</h3>
          <Link href="/integrations" className="text-[10px] text-primary hover:text-primary/80">View All Integrations</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {integrationsData.map((integration, i) => {
            const Icon = IconMap[integration.icon];
            return (
              <div key={i} className="flex items-center gap-3 bg-card/30 border border-white/5 rounded-lg py-2 px-3 flex-shrink-0 min-w-[160px]">
                <div className="p-1.5 bg-white/5 rounded flex-shrink-0">
                  {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-white/90 flex items-center gap-1.5">
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
