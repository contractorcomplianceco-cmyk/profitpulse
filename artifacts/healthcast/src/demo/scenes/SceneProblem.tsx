import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, TrendingDown } from "lucide-react";
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
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="problem">
      <div className="relative z-10 w-full max-w-3xl px-4 md:px-8">
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        >
          <AlertTriangle className="w-8 h-8 text-[#f59e0b]" />
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white text-center">
            Where did the <span className="text-[#fb7185]">profit</span> go?
          </h2>
        </motion.div>

        <motion.p
          className="text-center text-[#94a3b8] font-body mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
        >
          Sample data — unclear margins hide leakage across jobs and accounts.
        </motion.p>

        <div className="space-y-3">
          {LEAKS.map((row, i) => (
            <motion.div
              key={row.label}
              className="flex items-center justify-between gap-4 rounded-xl border border-[#fb7185]/25 bg-[#fb7185]/5 px-4 py-3 md:px-5 md:py-4"
              initial={{ opacity: 0, x: -40 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.45 }}
            >
              <div className="min-w-0">
                <p className="text-sm md:text-base text-white font-semibold truncate">{row.label}</p>
                <p className="text-xs text-[#fb7185]/80 font-mono">{row.pct}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TrendingDown className="w-4 h-4 text-[#fb7185]" />
                <span className="text-lg md:text-xl font-display font-bold text-[#fb7185]">{row.amount}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-white/60 text-sm font-body">Blended margin</span>
            <motion.span
              className="text-2xl font-display font-bold text-[#fb7185]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              9.2%
            </motion.span>
            <span className="text-xs text-white/40 line-through">14.8% target</span>
          </div>
        </motion.div>
      </div>
    </SceneShell>
  );
}
