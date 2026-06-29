import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Eye, Shield, Tag, TrendingUp } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

const WINS = [
  { icon: Tag, label: "Better pricing", detail: "Bids tied to real job margin", color: "#49BFF2" },
  { icon: Shield, label: "Protected margin", detail: "Catch overruns early", color: "#3FB257" },
  { icon: Eye, label: "Leadership visibility", detail: "One view for the whole team", color: "#a78bfa" },
];

export function SceneOutcome() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1300),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="outcome">
      <div className="relative z-10 w-full max-w-2xl px-4 md:px-8 text-center">
        <motion.h2
          className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-white mb-5 md:mb-7"
          initial={{ opacity: 0, y: 18 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          Outcomes that <span className="text-[#3FB257]">compound</span>
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-3 mb-6 md:mb-8">
          {WINS.map((w, i) => {
            const Icon = w.icon;
            return (
              <motion.div
                key={w.label}
                className="rounded-xl border border-white/10 bg-white/[0.05] p-3 md:p-4 text-left"
                initial={{ opacity: 0, y: 22 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12 }}
              >
                <Icon className="w-5 h-5 mb-2" style={{ color: w.color }} />
                <p className="text-sm md:text-base font-display font-bold text-white">{w.label}</p>
                <p className="text-[10px] md:text-xs text-white/45 font-body mt-1">{w.detail}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="flex items-end justify-center gap-1.5 h-24 md:h-32 mb-4"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
        >
          {[38, 44, 42, 50, 55, 62, 70].map((h, i) => (
            <motion.div
              key={i}
              className="w-5 md:w-7 rounded-t bg-gradient-to-t from-[#17A8B8] to-[#3FB257]"
              initial={{ height: 0 }}
              animate={phase >= 3 ? { height: `${h}%` } : {}}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            />
          ))}
        </motion.div>

        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3FB257]/10 border border-[#3FB257]/20"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#3FB257]" />
          <span className="text-xs md:text-sm font-mono text-[#3FB257]">Sample margin trend · illustrative</span>
        </motion.div>
      </div>
    </SceneShell>
  );
}
