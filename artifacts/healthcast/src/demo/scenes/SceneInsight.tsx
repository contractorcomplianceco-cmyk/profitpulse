import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SceneShell } from "../components/SceneShell";

const METRICS = [
  { key: "revenue", label: "Revenue", value: "$1.24M", sub: "MTD · +8.2%", highlight: "#49BFF2", delay: 0 },
  { key: "costs", label: "Direct costs", value: "$892K", sub: "Jobs + materials", highlight: "#f59e0b", delay: 0.12 },
  { key: "margin", label: "Net margin", value: "14.8%", sub: "After overhead", highlight: "#3FB257", delay: 0.24 },
  { key: "risk", label: "Risk exposure", value: "$47K", sub: "3 open items", highlight: "#fb7185", delay: 0.36 },
];

export function SceneInsight() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="insight">
      <div className="relative z-10 w-full max-w-4xl px-4 md:px-8">
        <motion.h2
          className="text-2xl md:text-4xl font-display font-bold text-white text-center mb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          Live insight, <span className="text-[#49BFF2]">one dashboard</span>
        </motion.h2>
        <motion.p
          className="text-center text-[#94a3b8] font-body mb-8 md:mb-10 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
        >
          Sample contractor portfolio — demo data only.
        </motion.p>

        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {METRICS.map((m) => (
            <motion.div
              key={m.key}
              className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 md:p-6 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: m.delay, duration: 0.5, type: "spring" }}
            >
              <motion.div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 20%, ${m.highlight}, transparent 70%)` }}
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: m.delay }}
              />
              <p className="text-xs uppercase tracking-widest text-white/50 font-body mb-2">{m.label}</p>
              <p className="text-2xl md:text-4xl font-display font-bold text-white">{m.value}</p>
              <p className="text-xs md:text-sm font-mono mt-2" style={{ color: m.highlight }}>
                {m.sub}
              </p>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: m.highlight }}
                initial={{ scaleX: 0 }}
                animate={phase >= 2 ? { scaleX: 1 } : {}}
                transition={{ delay: m.delay + 0.3, duration: 0.6 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
