import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

export function SceneClosing() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="closing">
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[#17A8B8]/25 via-transparent to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-10">
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#49BFF2]/15 border border-[#49BFF2]/30 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          <Sparkles className="w-4 h-4 text-[#49BFF2]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#49BFF2]">Rose demo ready</span>
        </motion.div>

        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        >
          <img
            src={`${import.meta.env.BASE_URL}brand/profitpulse-shield.png`}
            alt="ProfitPulse"
            className="w-14 h-14 md:w-16 md:h-16 object-contain"
          />
          <span className="text-3xl md:text-5xl font-display font-bold text-white">ProfitPulse</span>
        </motion.div>

        {["Know your numbers.", "Protect your margin.", "Lead with confidence."].map((line, i) => (
          <motion.p
            key={line}
            className="text-xl md:text-3xl font-display font-bold text-white mb-2"
            initial={{ opacity: 0, y: 24 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#071827] font-bold text-sm shadow-lg">
            <Play className="w-4 h-4" />
            Ready for Rose demo
          </div>
          <p className="text-xs text-white/45 font-body max-w-xs">
            Sample data only · no login · no live integrations
          </p>
        </motion.div>
      </div>
    </SceneShell>
  );
}
