import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

export function SceneInsight() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 450),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="insight">
      <div className="relative z-10 w-full max-w-lg px-4 md:px-8">
        <motion.div
          className="rounded-2xl border border-[#49BFF2]/35 bg-gradient-to-b from-[#0f2744]/95 to-[#071827] p-5 md:p-8 shadow-[0_0_60px_rgba(73,191,242,0.18)] demo-card-premium"
          initial={{ opacity: 0, scale: 0.9, y: 28 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#49BFF2]/20 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0 rgba(73,191,242,0)", "0 0 24px rgba(73,191,242,0.35)", "0 0 0 rgba(73,191,242,0)"] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-[#49BFF2]" />
            </motion.div>
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#49BFF2] font-bold">
                Margin insight
              </p>
              <p className="text-white/45 text-[10px] md:text-xs font-body">Illustrative guidance · demo</p>
            </div>
          </div>

          <motion.h3
            className="text-lg md:text-2xl font-display font-bold text-white mb-2.5 leading-snug"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
          >
            Review pricing on Pacific Care Phase 2 — margin at 6.1%
          </motion.h3>

          <motion.p
            className="text-[#94a3b8] font-body text-xs md:text-base leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
          >
            Labor is running 12% over plan. Consider a change-order conversation before approving new purchase orders.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-1.5 mb-4"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
          >
            {["Margin warning", "Labor variance", "Sample scenario"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[9px] md:text-xs bg-[#f59e0b]/12 text-[#f59e0b] border border-[#f59e0b]/22"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="text-[10px] md:text-xs text-white/35 font-body pt-3 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
          >
            Not connected to live AI or accounting systems in this demo.
          </motion.p>
        </motion.div>
      </div>
    </SceneShell>
  );
}
