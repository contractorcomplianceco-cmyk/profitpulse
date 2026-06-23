import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SECTIONS = [
  "Forecasts",
  "Patient Demand",
  "Staffing",
  "Capacity",
  "Risk Alerts",
  "Service Lines",
  "Care Coordination",
  "Reports",
  "Command Center"
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = SECTIONS.map((_, i) =>
      setTimeout(() => setPhase(i + 1), 100 + i * 640)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-12"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full max-w-5xl flex gap-16 items-center relative">
        
        {/* Animated connecting line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
        <motion.div 
          className="absolute left-8 top-10 w-px bg-gradient-to-b from-[#7dd3fc] to-[#2563eb]"
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(phase * 11, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Section List */}
        <div className="flex flex-col gap-4 w-1/3">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-6 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: phase >= i ? (phase === i + 1 ? 1 : 0.4) : 0, 
                x: phase >= i ? (phase === i + 1 ? 10 : 0) : -20,
                scale: phase === i + 1 ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
            >
              <div className={`w-3 h-3 rounded-full z-10 transition-colors duration-300 ${phase === i + 1 ? 'bg-[#7dd3fc] shadow-[0_0_10px_rgba(125,211,252,0.8)]' : 'bg-white/20'}`} />
              <div className={`text-2xl font-display font-medium ${phase === i + 1 ? 'text-white' : 'text-white/40'}`}>
                {section}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Content Panel */}
        <div className="w-2/3 h-[60vh] relative">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col"
              initial={{ opacity: 0, y: 40, rotateY: 20 }}
              animate={phase === i + 1 ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 40, rotateY: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: phase === i + 1 ? 'flex' : 'none' }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2563eb]/20 to-[#7dd3fc]/20 flex items-center justify-center mb-6 border border-white/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" className="w-8 h-8">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <h3 className="text-4xl font-display font-bold text-white mb-4">{section}</h3>
              <div className="space-y-4 flex-1 mt-8">
                <div className="w-full h-4 bg-white/10 rounded" />
                <div className="w-5/6 h-4 bg-white/10 rounded" />
                <div className="w-4/6 h-4 bg-white/10 rounded" />
              </div>
              <div className="h-32 bg-white/5 rounded-xl border border-white/5 mt-auto relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
