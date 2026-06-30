import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PreviewModuleBanner } from "@/components/profit-pulse/PreviewModuleBanner";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  copilotMeta,
  suggestedPrompts,
  copilotAnswers,
  proactiveInsights,
  recentQuestions,
  type CopilotAnswer,
} from "@/data/copilotData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import {
  Sparkles,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Cpu,
  Zap,
  ShieldCheck,
  CornerDownRight,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

function StreamingText({ text, speed = 14, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const done = count >= text.length;
  return (
    <span>
      {text.slice(0, count)}
      {!done && <span className="inline-block w-1.5 h-4 align-middle ml-0.5 bg-cyan animate-pulse-glow rounded-sm" />}
    </span>
  );
}

interface FeedEntry extends CopilotAnswer {
  key: string;
}

const insightIcon = {
  positive: TrendingUp,
  warning: AlertTriangle,
  risk: ShieldAlert,
};

const insightStyle = {
  positive: {
    wrap: "from-success/15 via-success/5 to-transparent border-l-success border-success/20 shadow-success/10",
    chip: "bg-success/20 text-success border-success/30",
    glow: "bg-success/10",
  },
  warning: {
    wrap: "from-warning/15 via-warning/5 to-transparent border-l-warning border-warning/20 shadow-warning/10",
    chip: "bg-warning/20 text-warning border-warning/30",
    glow: "bg-warning/10",
  },
  risk: {
    wrap: "from-destructive/15 via-destructive/5 to-transparent border-l-destructive border-destructive/20 shadow-destructive/10",
    chip: "bg-destructive/20 text-destructive border-destructive/30",
    glow: "bg-destructive/10",
  },
};

function resolveAnswer(query: string): CopilotAnswer {
  const normalized = query.toLowerCase();
  const promptMatch = suggestedPrompts.find((p) => p.label.toLowerCase() === normalized);
  if (promptMatch) return copilotAnswers[promptMatch.targetId];

  const keywordMap: { id: string; words: string[] }[] = [
    { id: "cash-trend", words: ["cash", "runway", "liquidity", "burn"] },
    { id: "margin-leak", words: ["margin", "profit", "losing", "cost"] },
    { id: "ar-driver", words: ["ar", "receivable", "collections", "dso", "invoice"] },
    { id: "hiring-afford", words: ["hire", "hiring", "headcount", "payroll", "afford"] },
    { id: "churn-risk", words: ["churn", "client", "retention", "risk"] },
    { id: "marketing-roi", words: ["marketing", "spend", "roi", "campaign", "ad"] },
  ];
  for (const entry of keywordMap) {
    if (entry.words.some((w) => normalized.includes(w))) return copilotAnswers[entry.id];
  }
  return copilotAnswers["cash-trend"];
}

export default function CfoCopilot() {
  const [feed, setFeed] = useState<FeedEntry[]>([{ ...copilotAnswers["cash-trend"], key: "seed-cash-trend" }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const ask = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || thinking) return;
    setInput("");
    setThinking(true);
    const answer = resolveAnswer(trimmed);
    window.setTimeout(() => {
      setFeed((prev) => [
        ...prev,
        { ...answer, question: trimmed || answer.question, key: `${answer.id}-${Date.now()}` },
      ]);
      setThinking(false);
    }, 850);
  };

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [feed.length, thinking]);

  const stats = [
    { label: "Confidence", value: `${copilotMeta.confidence}%`, icon: ShieldCheck, accent: "text-success" },
    { label: "Avg Response", value: copilotMeta.avgResponse, icon: Zap, accent: "text-cyan" },
    { label: "Questions Answered", value: copilotMeta.questionsAnswered.toLocaleString(), icon: Sparkles, accent: "text-primary" },
    { label: "Last Sync", value: copilotMeta.lastSync, icon: Cpu, accent: "text-foreground" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      <PageHeader
        title="AI CFO Copilot"
        description="Preview UI — illustrative responses only, not connected to live AI or accounting systems."
        actions={
          <Badge
            variant="outline"
            className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold tracking-widest uppercase text-[10px] px-3 py-1"
          >
            Preview
          </Badge>
        }
      />

      <PreviewModuleBanner detail="Canned demo responses for layout review. Use Executive Overview, Alerts, and Scenario Modeler for live sample metrics." />

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="surface-gradient border border-border rounded-xl p-4 shadow-soft flex items-center gap-3 accent-topline relative overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <stat.icon className={`w-4 h-4 ${stat.accent}`} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase truncate">{stat.label}</div>
              <div className="text-base font-black text-foreground tabular-nums truncate">{stat.value}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: conversation surface */}
        <motion.div variants={itemVariants} className="xl:col-span-2 flex flex-col gap-4">
          {/* Suggested prompt chips */}
          <div className="surface-gradient-accent border border-primary/20 rounded-xl p-5 shadow-lg shadow-primary/10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-4 relative">
              <Sparkles className="w-4 h-4 text-cyan" />
              <h3 className="text-[11px] font-extrabold tracking-widest text-foreground uppercase">Suggested Questions</h3>
            </div>
            <div className="flex flex-wrap gap-2 relative">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.targetId}
                  onClick={() => ask(prompt.label)}
                  disabled={thinking}
                  className="group text-left text-[13px] font-medium text-foreground bg-secondary/30 hover:bg-primary/15 border border-border/60 hover:border-primary/50 rounded-full px-4 py-2 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Answer feed */}
          <div className="surface-gradient border border-border rounded-xl shadow-soft flex flex-col overflow-hidden accent-topline">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-gradient-primary border border-primary/30 shadow-md shadow-primary/30">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-[11px] font-extrabold tracking-widest text-foreground uppercase">{copilotMeta.model}</span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{copilotMeta.scope}</span>
            </div>

            <div className="custom-scrollbar max-h-[640px] overflow-y-auto p-5 flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {feed.map((entry, idx) => {
                  const isLatest = idx === feed.length - 1;
                  return (
                    <motion.div
                      key={entry.key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring" as const, stiffness: 280, damping: 26 }}
                      className="flex flex-col gap-3"
                    >
                      {/* Question bubble */}
                      <div className="self-end max-w-[85%] bg-primary/15 border border-primary/30 rounded-2xl rounded-br-sm px-4 py-2.5 text-[13px] font-semibold text-foreground shadow-md shadow-primary/10">
                        {entry.question}
                      </div>

                      {/* Answer */}
                      <div className="flex gap-3">
                        <div className="mt-1 p-2 rounded-lg bg-gradient-primary border border-primary/30 h-fit shadow-md shadow-primary/30 shrink-0">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="bg-secondary/40 border-border/60 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                              {entry.category}
                            </Badge>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{copilotMeta.confidence}% confidence</span>
                          </div>

                          <h4 className="text-[15px] font-black tracking-tight text-foreground leading-snug">
                            {isLatest ? <StreamingText text={entry.headline} /> : entry.headline}
                          </h4>

                          {/* Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {entry.metrics.map((m, i) => (
                              <div key={i} className="bg-secondary/30 border border-border/50 rounded-lg p-3 flex flex-col gap-1">
                                <span className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase truncate">{m.label}</span>
                                <span className="text-base font-black text-foreground tabular-nums truncate">{m.value}</span>
                                {m.delta && (
                                  <span className={`text-[11px] font-bold flex items-center ${m.positive ? "text-success" : "text-destructive"}`}>
                                    {m.positive ? <ArrowUpRight className="w-3 h-3 mr-0.5 stroke-[3]" /> : <ArrowDownRight className="w-3 h-3 mr-0.5 stroke-[3]" />}
                                    {m.delta}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Narrative */}
                          <div className="space-y-2.5">
                            {entry.narrative.map((para, i) => (
                              <p key={i} className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                                {para}
                              </p>
                            ))}
                          </div>

                          {/* Mini chart */}
                          {entry.trend && (
                            <div className="bg-secondary/20 border border-border/50 rounded-lg p-4">
                              <div className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase mb-3">{entry.trend.label}</div>
                              <div className="h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={entry.trend.points} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                      cursor={{ fill: "hsl(var(--primary) / 0.08)" }}
                                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                                      itemStyle={{ color: "#fff" }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={26} isAnimationActive={false}>
                                      {entry.trend.points.map((_, i) => (
                                        <Cell key={i} fill={i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--cyan))"} />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}

                          {/* Follow-ups */}
                          {entry.followUps.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {entry.followUps.map((fid) => {
                                const fa = copilotAnswers[fid];
                                if (!fa) return null;
                                return (
                                  <button
                                    key={fid}
                                    onClick={() => ask(fa.question)}
                                    disabled={thinking}
                                    className="text-[12px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/25 hover:border-primary/50 rounded-full px-3 py-1.5 transition-all disabled:opacity-50"
                                  >
                                    {fa.question}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {thinking && (
                <div className="flex gap-3 items-center">
                  <div className="p-2 rounded-lg bg-gradient-primary border border-primary/30 shadow-md shadow-primary/30">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                    Analyzing financial data
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={feedEndRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-border/60 p-4 flex items-center gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the CFO Copilot about cash, margin, AR, hiring, churn or marketing..."
                className="flex-1 bg-secondary/30 border-border/60 focus-visible:ring-primary/40 text-[13px]"
              />
              <Button
                type="submit"
                disabled={thinking || !input.trim()}
                className="font-bold tracking-wide bg-gradient-primary shadow-md shadow-primary/40 shrink-0"
              >
                <Send className="w-4 h-4 mr-2" />
                Ask
              </Button>
            </form>
          </div>
        </motion.div>

        {/* RIGHT: proactive insights + recent */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan" />
              <h3 className="text-[11px] font-extrabold tracking-widest text-foreground uppercase">Proactive Insights</h3>
            </div>
            {proactiveInsights.map((insight) => {
              const Icon = insightIcon[insight.severity];
              const style = insightStyle[insight.severity];
              return (
                <div
                  key={insight.id}
                  className={`flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-r ${style.wrap} border-l-4 border-y border-r shadow-lg relative overflow-hidden`}
                >
                  <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none ${style.glow}`} />
                  <div className="flex items-start gap-3 relative">
                    <div className={`p-2 rounded-lg border ${style.chip} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-extrabold text-foreground leading-snug">{insight.title}</h4>
                      <p className="text-[12px] text-muted-foreground font-medium leading-relaxed mt-1.5">{insight.body}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/40 pt-2.5 relative">
                    <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">{insight.metricLabel}</span>
                    <span className="text-sm font-black text-foreground tabular-nums">{insight.metricValue}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="surface-gradient border border-border rounded-xl shadow-soft p-5 accent-topline relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-primary" />
                <h3 className="text-[11px] font-extrabold tracking-widest text-foreground uppercase">Recent Questions</h3>
              </div>
              <div className="flex flex-col gap-1">
                {recentQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => ask(q.question)}
                    disabled={thinking}
                    className="group flex items-center justify-between gap-3 text-left rounded-lg px-3 py-2.5 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/60 disabled:opacity-50"
                  >
                    <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">{q.question}</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">{q.askedAt}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <InsightCard title="How Copilot Works">
              Every answer is generated against your live financial graph and re-checked on each sync. Figures shown are mock data for demonstration. Use the suggested questions or type your own to explore cash, margin, collections, hiring, churn and marketing performance.
            </InsightCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
