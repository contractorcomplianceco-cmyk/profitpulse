import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ScreenFrame } from './ScreenFrame';

const CHIPS = ['Profit', 'Cash', 'Runway'];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1700),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-10 py-12 perspective-1000"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(14px)' }}
      transition={{ duration: 0.8 }}
    >
      {/* Headline */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
          Model the decision <span className="text-[#2BD4A8]">before</span> you make it
        </h2>
        <p className="text-[#94a3b8] text-base md:text-lg font-body mt-3">
          Move a lever — watch the future recalculate instantly.
        </p>
      </motion.div>

      {/* Live impact chips */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {CHIPS.map((chip, i) => (
          <motion.div
            key={chip}
            className="px-4 py-1.5 rounded-full bg-[#0f172a] border border-[#34d399]/40 text-[#34d399] text-sm font-body tracking-wide shadow-[0_0_24px_rgba(52,211,153,0.12)]"
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            {chip} recalculated
          </motion.div>
        ))}
      </motion.div>

      {/* Real Scenario Builder screenshot */}
      <motion.div
        className="w-full mx-auto"
        style={{ width: 'min(72rem, calc(56vh * 1.40625))' }}
        initial={{ rotateX: 16, y: 90, opacity: 0 }}
        animate={phase >= 2 ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: 16, y: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      >
        <ScreenFrame
          image="scenario"
          url="app.ccaprofitpulse.com  ·  Scenario Builder"
          durationSec={11.5}
        />
      </motion.div>
    </motion.div>
  );
}
