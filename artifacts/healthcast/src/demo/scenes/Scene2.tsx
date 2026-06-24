import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ScreenFrame } from './ScreenFrame';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-10 py-12 perspective-1000"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Headline */}
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
          The whole organization, <span className="text-[#7dd3fc]">in focus</span>
        </h2>
        <p className="text-[#94a3b8] text-base md:text-lg font-body mt-3">
          Cash, revenue, staffing, and risk — live, in one place.
        </p>
      </motion.div>

      {/* Real dashboard screenshot in a browser frame */}
      <motion.div
        className="w-full mx-auto"
        style={{ width: 'min(72rem, calc(60vh * 1.40625))' }}
        initial={{ rotateX: 16, y: 90, opacity: 0 }}
        animate={phase >= 2 ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: 16, y: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      >
        <ScreenFrame
          image="dashboard"
          url="app.healthcast.io  ·  Executive Overview"
          durationSec={12.5}
        />
      </motion.div>
    </motion.div>
  );
}
