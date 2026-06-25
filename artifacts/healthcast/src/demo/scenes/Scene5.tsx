import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ScreenFrame } from './ScreenFrame';

const SOURCES = ['Accounting', 'CRM', 'Marketing', 'Payroll', 'Banking'];

export function Scene5() {
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
      initial={{ opacity: 0, rotateX: -20 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.9 }}
    >
      {/* Headline */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
          One connected <span className="text-[#2BD4A8]">source of truth</span>
        </h2>
        <p className="text-[#94a3b8] text-base md:text-lg font-body mt-3">
          Plug in your systems — ProfitPulse does the rest.
        </p>
      </motion.div>

      {/* Source chips */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-2.5 mb-6"
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {SOURCES.map((s, i) => (
          <motion.div
            key={s}
            className="px-4 py-1.5 rounded-full bg-[#0f172a] border border-white/10 text-white/70 text-sm font-body tracking-wide"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            {s}
          </motion.div>
        ))}
      </motion.div>

      {/* Real Integrations screenshot */}
      <motion.div
        className="w-full mx-auto"
        style={{ width: 'min(72rem, calc(58vh * 1.40625))' }}
        initial={{ rotateX: 16, y: 90, opacity: 0 }}
        animate={phase >= 2 ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: 16, y: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      >
        <ScreenFrame
          image="integrations"
          url="app.ccaprofitpulse.com  ·  Data Integrations"
          durationSec={9}
        />
      </motion.div>
    </motion.div>
  );
}
