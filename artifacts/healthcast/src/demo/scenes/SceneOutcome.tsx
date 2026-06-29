import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, TrendingUp } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

export function SceneOutcome() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="outcome">
      <div className="relative z-10 w-full max-w-2xl px-4 md:px-8 text-center">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#3FB257]/20 border border-[#3FB257]/30 mb-6"
          initial={{ scale: 0, rotate: -20 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Shield className="w-10 h-10 text-[#3FB257]" />
        </motion.div>

        <motion.h2
          className="text-2xl md:text-4xl font-display font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          Better decisions. <span className="text-[#3FB257]">Protected profit.</span>
        </motion.h2>

        <motion.div
          className="flex items-end justify-center gap-2 h-32 md:h-40 mb-6"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          {[40, 55, 48, 62, 58, 72, 78].map((h, i) => (
            <motion.div
              key={i}
              className="w-6 md:w-8 rounded-t-md bg-gradient-to-t from-[#17A8B8] to-[#3FB257]"
              initial={{ height: 0 }}
              animate={phase >= 2 ? { height: `${h}%` } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </motion.div>

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3FB257]/10 border border-[#3FB257]/25"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          <TrendingUp className="w-4 h-4 text-[#3FB257]" />
          <span className="text-sm font-mono text-[#3FB257]">Margin recovered to 14.8% · sample outcome</span>
        </motion.div>
      </div>
    </SceneShell>
  );
}
