import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Alert Pulse */}
      <motion.div
        className="absolute inset-0 bg-[#fb7185]/5"
        animate={phase >= 2 ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="w-full max-w-4xl p-8 relative z-10 flex flex-col items-center">
        
        <motion.h2 
          className="text-3xl md:text-5xl font-display font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Detect risk <span className="text-[#fb7185]">before</span> the week breaks.
        </motion.h2>

        <div className="relative w-full h-80 flex items-center justify-center">
          
          {/* Central Hub */}
          <motion.div
            className="w-40 h-40 rounded-full bg-[#071827] border-2 border-[#1e293b] flex items-center justify-center z-20 relative shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="text-[#f8fafc] font-display font-bold text-xl">Thursday</div>
            <motion.div
              className="absolute inset-[-4px] rounded-full border-2 border-[#fb7185] border-t-transparent border-r-transparent"
              animate={phase >= 2 ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Cards */}
          <div className="absolute inset-0 flex items-center justify-between px-10">
            {/* Card 1 */}
            <motion.div
              className="w-64 bg-[#0f172a] border border-[#fb7185]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(251,113,133,0.1)] relative"
              initial={{ x: 100, opacity: 0 }}
              animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <div className="text-[#fb7185] font-bold text-sm mb-2 tracking-wider uppercase">Rising Demand</div>
              <div className="text-white font-display text-2xl mb-1">+42% Expected</div>
              <div className="text-[#94a3b8] text-sm">Emergency Dept</div>
              
              <motion.div 
                className="absolute -right-16 top-1/2 h-0.5 bg-gradient-to-r from-[#fb7185] to-transparent w-16 -translate-y-1/2"
                initial={{ scaleX: 0, originX: 0 }}
                animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="w-64 bg-[#0f172a] border border-[#f59e0b]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.1)] relative"
              initial={{ x: -100, opacity: 0 }}
              animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <div className="text-[#f59e0b] font-bold text-sm mb-2 tracking-wider uppercase">Staffing Pressure</div>
              <div className="text-white font-display text-2xl mb-1">-3 Nurses</div>
              <div className="text-[#94a3b8] text-sm">ICU Capacity Risk</div>
              
              <motion.div 
                className="absolute -left-16 top-1/2 h-0.5 bg-gradient-to-l from-[#f59e0b] to-transparent w-16 -translate-y-1/2"
                initial={{ scaleX: 0, originX: 1 }}
                animate={phase >= 4 ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
