import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center text-center perspective-1000"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo Mark */}
        <motion.div
          className="w-24 h-24 mb-8 relative flex items-center justify-center"
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -45, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-[#7dd3fc] opacity-80" />
          <div className="absolute inset-1 rounded-xl bg-[#071827] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </motion.div>

        {/* Wordmark */}
        <h1 className="text-6xl md:text-[6vw] font-display font-bold text-white tracking-tight leading-none mb-6">
          {'HealthCast'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: 90 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: 90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: phase >= 2 ? i * 0.04 : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.div
          className="text-xl md:text-2xl text-[#94a3b8] font-body"
          initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
          animate={phase >= 3 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(5px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Where operations meet financial intelligence
        </motion.div>
      </div>

      {/* Background visual element */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-[1px] border-white/5 rounded-full"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.1, opacity: 0 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border-[1px] border-white/5 rounded-full"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.1, opacity: 0 }}
        transition={{ duration: 3, delay: 0.2, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
