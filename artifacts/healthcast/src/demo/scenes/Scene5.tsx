import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NODES = [
  { label: 'Demand', color: '#7dd3fc', angle: 0 },
  { label: 'Staffing', color: '#14b8a6', angle: 72 },
  { label: 'Service Lines', color: '#2563eb', angle: 144 },
  { label: 'Capacity', color: '#f59e0b', angle: 216 },
  { label: 'Coordination', color: '#fb7185', angle: 288 },
];

export function Scene5() {
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
      className="absolute inset-0 flex items-center justify-center perspective-1000"
      initial={{ opacity: 0, rotateX: -30 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 1 }}
    >
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        
        {/* Connecting Lines */}
        {phase >= 2 && NODES.map((node, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute top-1/2 left-1/2 h-[2px] origin-left"
            style={{ 
              width: '200px', 
              rotate: `${node.angle}deg`,
              background: `linear-gradient(90deg, transparent, ${node.color}40, transparent)`
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}

        {/* Orbiting Nodes */}
        {NODES.map((node, i) => {
          const radius = 220;
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-32 h-32 flex flex-col items-center justify-center gap-3"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={phase >= 1 ? { x, y, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: i * 0.1 }}
            >
              <div 
                className="w-4 h-4 rounded-full shadow-[0_0_15px_currentColor]"
                style={{ backgroundColor: node.color, color: node.color }}
              />
              <div className="text-white/80 font-display text-sm tracking-widest uppercase">{node.label}</div>
            </motion.div>
          );
        })}

        {/* Central Core */}
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-[#0f172a] border border-white/10 flex items-center justify-center z-10 shadow-[0_0_50px_rgba(37,99,235,0.2)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="text-center px-4">
            <div className="text-xs text-[#7dd3fc] uppercase tracking-widest mb-1">One</div>
            <div className="text-2xl font-display font-bold text-white">Operating Picture</div>
          </div>
        </motion.div>
        
        {/* Concentric rings */}
        {[1, 2, 3].map(i => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border border-white/5 pointer-events-none"
            style={{ width: `${i * 150 + 150}px`, height: `${i * 150 + 150}px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}

      </div>
    </motion.div>
  );
}
