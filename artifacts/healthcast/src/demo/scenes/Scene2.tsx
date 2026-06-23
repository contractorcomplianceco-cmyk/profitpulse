import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-12 perspective-1000"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background headline */}
      <motion.div 
        className="absolute top-12 left-12 z-0"
        initial={{ opacity: 0, x: -30 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-display font-bold text-white mb-2">Command Center</h2>
        <p className="text-[#7dd3fc] text-lg">System-wide operational view</p>
      </motion.div>

      {/* Stylized Dashboard */}
      <motion.div
        className="relative w-full max-w-6xl h-[70vh] mt-16 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
        initial={{ rotateX: 20, y: 100, opacity: 0 }}
        animate={phase >= 2 ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: 20, y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Dashboard Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="h-4 w-48 bg-white/5 rounded-md ml-4" />
        </div>

        {/* Dashboard Grid */}
        <div className="p-6 grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {/* Main Chart Area */}
          <div className="col-span-2 flex flex-col gap-6">
            <motion.div 
              className="flex-1 bg-white/5 rounded-xl border border-white/5 p-6 relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-32 h-4 bg-white/10 rounded mb-6" />
              {/* Fake Graph */}
              <div className="absolute bottom-6 left-6 right-6 h-32 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#2563eb] to-[#7dd3fc] rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={phase >= 4 ? { height: `${h}%` } : { height: 0 }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                  />
                ))}
              </div>
            </motion.div>
            <div className="h-32 grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="bg-white/5 rounded-xl border border-white/5 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={phase >= 3 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-16 h-3 bg-white/10 rounded mb-4" />
                  <div className="w-24 h-8 bg-white/20 rounded" />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Side Panel */}
          <motion.div 
            className="col-span-1 bg-white/5 rounded-xl border border-white/5 p-6 flex flex-col gap-4"
            initial={{ x: 50, opacity: 0 }}
            animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-4 bg-white/10 rounded mb-2" />
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-full h-12 bg-white/5 rounded-lg flex items-center px-4"
                initial={{ opacity: 0, x: 20 }}
                animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 mr-3" />
                <div className="w-32 h-2 bg-white/10 rounded" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
