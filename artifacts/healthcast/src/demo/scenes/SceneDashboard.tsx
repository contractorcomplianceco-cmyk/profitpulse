import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { MiniSparkline } from "../components/SceneCaption";
import { SceneShell } from "../components/SceneShell";

const METRICS = [
  {
    key: "revenue",
    label: "Revenue",
    value: "$1.24M",
    sub: "MTD",
    trend: "+8.2%",
    trendUp: true,
    spark: [62, 68, 65, 72, 78, 82, 88],
    highlight: "#49BFF2",
    delay: 0,
  },
  {
    key: "costs",
    label: "Direct costs",
    value: "$892K",
    sub: "Jobs + materials",
    trend: "+4.1%",
    trendUp: false,
    spark: [70, 72, 74, 76, 78, 80, 82],
    highlight: "#f59e0b",
    delay: 0.1,
  },
  {
    key: "margin",
    label: "Net margin",
    value: "14.8%",
    sub: "After overhead",
    trend: "+1.2 pts",
    trendUp: true,
    spark: [48, 50, 49, 52, 54, 55, 58],
    highlight: "#3FB257",
    delay: 0.2,
  },
  {
    key: "risk",
    label: "Risk exposure",
    value: "$47K",
    sub: "3 open items",
    trend: "−$12K",
    trendUp: true,
    spark: [80, 75, 70, 68, 62, 58, 52],
    highlight: "#fb7185",
    delay: 0.3,
  },
];

export function SceneDashboard() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1100),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="dashboard">
      <div className="relative z-10 w-full max-w-4xl px-3 md:px-8">
        <motion.h2
          className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-white text-center mb-1"
          initial={{ opacity: 0, y: 14 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          Executive <span className="text-[#49BFF2]">dashboard</span>
        </motion.h2>
        <motion.p
          className="text-center text-[#94a3b8] font-body mb-6 md:mb-8 text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
        >
          Trend cards · sample contractor portfolio
        </motion.p>

        <div className="grid grid-cols-2 gap-2.5 md:gap-4">
          {METRICS.map((m) => (
            <motion.div
              key={m.key}
              className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-transparent p-3 md:p-5 overflow-hidden demo-card-premium"
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: m.delay, duration: 0.5, type: "spring" }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{ background: `radial-gradient(circle at 20% 0%, ${m.highlight}, transparent 65%)` }}
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: m.delay }}
              />
              <div className="flex items-start justify-between gap-1 mb-1">
                <p className="text-[9px] md:text-xs uppercase tracking-widest text-white/45 font-body">{m.label}</p>
                <MiniSparkline values={m.spark} color={m.highlight} />
              </div>
              <p className="text-xl md:text-3xl font-display font-bold text-white leading-none">{m.value}</p>
              <p className="text-[10px] md:text-xs text-white/40 font-body mt-1">{m.sub}</p>
              <div className="flex items-center gap-1 mt-2">
                {m.trendUp ? (
                  <TrendingUp className="w-3 h-3" style={{ color: m.highlight }} />
                ) : (
                  <TrendingDown className="w-3 h-3" style={{ color: m.highlight }} />
                )}
                <span className="text-[10px] md:text-xs font-mono" style={{ color: m.highlight }}>
                  {m.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
