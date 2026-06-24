import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ScreenFrame } from './ScreenFrame';

const NAV = [
  'Executive Overview',
  'Cash Flow',
  'Revenue Intelligence',
  'Profitability',
  'AR / AP & Collections',
  'Sales Pipeline',
  'Futurecast',
  'Scenario Builder',
  'Alerts',
  'Integrations',
];

const MONTAGE = [
  { label: 'Cash Flow', image: 'cashflow', url: 'app.healthcast.io  ·  Cash Flow' },
  { label: 'Futurecast', image: 'futurecast', url: 'app.healthcast.io  ·  Futurecast' },
  { label: 'Alerts', image: 'alerts', url: 'app.healthcast.io  ·  Alerts Engine' },
];

export function Scene3() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(0), 100),
      setTimeout(() => setStep(1), 4200),
      setTimeout(() => setStep(2), 8400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const active = MONTAGE[step];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-12"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full max-w-6xl flex gap-10 items-center">
        {/* Nav list */}
        <div className="w-1/4 flex flex-col gap-2.5 shrink-0">
          <div className="text-xs uppercase tracking-widest text-[#7dd3fc]/70 font-body mb-2">
            One click away
          </div>
          {NAV.map((label) => {
            const isActive = label.startsWith(active.label);
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-[#7dd3fc] shadow-[0_0_10px_rgba(125,211,252,0.9)] scale-150' : 'bg-white/20'
                  }`}
                />
                <span
                  className={`font-display text-base md:text-lg transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/35'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Screenshot montage */}
        <div className="flex-1 flex justify-center min-w-0">
          <div className="w-full" style={{ maxWidth: 'calc(64vh * 1.40625)' }}>
            <ScreenFrame image={active.image} url={active.url} durationSec={4.2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
