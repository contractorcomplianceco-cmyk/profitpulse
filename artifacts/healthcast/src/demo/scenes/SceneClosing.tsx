import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

export function SceneClosing() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 450),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2700),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="closing">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(23,168,184,0.2),transparent_60%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-5 md:px-10">
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#49BFF2]/12 border border-[#49BFF2]/28 mb-5 md:mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          <Sparkles className="w-4 h-4 text-[#49BFF2]" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#49BFF2]">
            Product demo
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 mb-6 md:mb-8"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 160 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}brand/profitpulse-shield.png`}
            alt=""
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
          <span className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white">ProfitPulse</span>
        </motion.div>

        {[
          "Executive clarity.",
          "Margin you can defend.",
          "Built for contractor operators.",
        ].map((line, i) => (
          <motion.p
            key={line}
            className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-white/95 mb-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.45 }}
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          className="mt-8 md:mt-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 14 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-white text-[#071827] font-bold text-xs md:text-sm shadow-lg">
            <Play className="w-4 h-4" />
            Sample walkthrough
          </div>
          <p className="text-[10px] md:text-xs text-white/40 font-body max-w-xs">
            Sample data · no login · no live integrations
          </p>
        </motion.div>
      </div>
    </SceneShell>
  );
}
