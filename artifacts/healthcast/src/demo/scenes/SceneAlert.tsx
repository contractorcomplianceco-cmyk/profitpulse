import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

export function SceneAlert() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="alert">
      <div className="relative z-10 w-full max-w-lg px-4 md:px-8">
        <motion.div
          className="rounded-2xl border border-[#49BFF2]/30 bg-gradient-to-b from-[#0f2744] to-[#071827] p-5 md:p-8 shadow-[0_0_60px_rgba(73,191,242,0.15)]"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#49BFF2]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#49BFF2]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#49BFF2] font-bold">AI recommendation</p>
              <p className="text-white/50 text-xs font-body">ProfitPulse Copilot · demo</p>
            </div>
          </div>

          <motion.h3
            className="text-xl md:text-2xl font-display font-bold text-white mb-3"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
          >
            Pause Pacific Care Phase 2 spend
          </motion.h3>

          <motion.p
            className="text-[#94a3b8] font-body text-sm md:text-base leading-relaxed mb-5"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
          >
            Margin dropped to 6.1% — labor is 12% over plan. Hold new POs until the ops lead signs off.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2 mb-5"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
          >
            {["Margin risk", "Labor overrun", "Sample alert"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[10px] md:text-xs bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/25 font-medium"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center justify-between pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
          >
            <span className="text-xs text-white/40 font-body">Simulated — no live integration</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#49BFF2]">
              View in command center <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </SceneShell>
  );
}
