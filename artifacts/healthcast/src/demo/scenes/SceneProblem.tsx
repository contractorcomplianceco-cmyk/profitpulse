import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, Clock, TrendingDown } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

const LEAKS = [
  { label: "Job #1847 — labor overrun", amount: "-$12,400", pct: "margin −3.2%" },
  { label: "Unbilled change orders", amount: "-$8,200", pct: "uncollected" },
  { label: "Overhead vs plan", amount: "-$5,100", pct: "vs budget" },
];

export function SceneProblem() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3600),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="problem">
      <div className="relative z-10 w-full max-w-3xl px-4 md:px-8">
        <motion.div
          className="flex items-center justify-center gap-2 mb-3"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        >
          <AlertTriangle className="w-7 h-7 md:w-8 md:h-8 text-[#f59e0b]" />
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-white text-center">
            Profit leakage & <span className="text-[#fb7185]">blind spots</span>
          </h2>
        </motion.div>

        <motion.div
          className="flex justify-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/25">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="text-xs md:text-sm text-[#f59e0b] font-body">
              Delayed visibility — numbers arrive 10–14 days late
            </span>
          </div>
        </motion.div>

        <div className="space-y-2.5 md:space-y-3">
          {LEAKS.map((row, i) => (
            <motion.div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/[0.06] px-3 py-2.5 md:px-5 md:py-4"
              initial={{ opacity: 0, x: -36 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.45 }}
            >
              <div className="min-w-0">
                <p className="text-xs md:text-base text-white font-semibold truncate">{row.label}</p>
                <p className="text-[10px] md:text-xs text-[#fb7185]/75 font-mono">{row.pct}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <TrendingDown className="w-3.5 h-3.5 text-[#fb7185]" />
                <span className="text-base md:text-xl font-display font-bold text-[#fb7185]">{row.amount}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-6 md:mt-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-white/50 text-xs md:text-sm font-body">Unclear blended margin</span>
            <motion.span
              className="text-xl md:text-2xl font-display font-bold text-[#fb7185]"
              animate={{ opacity: [1, 0.45, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              9.2%
            </motion.span>
            <span className="text-[10px] md:text-xs text-white/35">sample · target 14.8%</span>
          </div>
        </motion.div>
      </div>
    </SceneShell>
  );
}
