import { motion } from "framer-motion";

export function HealthScoreCard() {
  const score = 82;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 border-t border-border surface-gradient-accent relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/15 via-cyan/5 to-transparent opacity-70 z-0"></div>
      
      <div className="relative z-10">
        <h4 className="text-[10px] tracking-widest text-muted-foreground uppercase mb-4 font-extrabold">Financial Health Score</h4>
        
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            {/* Background Track */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="hsl(var(--muted)/0.4)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Ring */}
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                stroke="url(#health-gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
              <defs>
                <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--cyan))" />
                  <stop offset="50%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--success))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center justify-center bg-background rounded-full w-14 h-14 shadow-inner ring-1 ring-primary/20 shadow-[inset_0_0_12px_-2px_hsl(var(--primary)/0.4)]">
              <span className="text-xl font-black tracking-tighter text-gradient-primary">{score}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] font-bold text-foreground">Very Healthy</span>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="text-success flex items-center bg-success/15 px-1.5 py-0.5 rounded text-[10px]">
                +12 pts
              </span>
              <span className="text-muted-foreground uppercase tracking-widest text-[9px] ml-1">/ 30d</span>
            </div>
            {/* Tiny sparkline */}
            <svg width="48" height="12" viewBox="0 0 48 12" className="mt-1">
              <path d="M0 10 L10 8 L20 9 L30 5 L40 6 L48 2" fill="none" stroke="hsl(var(--success))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
