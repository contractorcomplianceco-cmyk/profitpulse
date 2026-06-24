import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background Flare */}
      <motion.div
        className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-[#2563eb]/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        
        {/* Final CTA Text */}
        <div className="flex flex-col gap-2 mb-16 overflow-hidden">
          {['See everything.', 'Decide faster.', 'Lead with confidence.'].map((text, i) => (
            <motion.h2
              key={i}
              className="text-4xl md:text-5xl font-display font-bold text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.h2>
          ))}
        </div>

        {/* Logo Lockup */}
        <motion.div
          className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#7dd3fc] p-0.5">
            <div className="w-full h-full bg-[#071827] rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </div>
          <span className="text-3xl font-display font-bold text-white tracking-tight">HealthCast</span>
        </motion.div>

        {/* Fake CTA button visual (non-interactive) */}
        <motion.div
          className="mt-12 px-8 py-4 bg-white text-[#071827] rounded-full font-bold tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Request Demo
        </motion.div>

      </div>
    </motion.div>
  );
}
