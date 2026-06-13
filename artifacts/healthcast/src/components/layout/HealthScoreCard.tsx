import { motion } from "framer-motion";

export function HealthScoreCard() {
  const score = 82;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-4 border-t border-border/50 bg-card/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 z-0"></div>
      
      <div className="relative z-10">
        <h4 className="text-[10px] tracking-wider text-muted-foreground uppercase mb-3 font-semibold">Financial Health Score</h4>
        
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            {/* Background Track */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="hsl(var(--muted)/0.3)"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress Ring */}
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                stroke="url(#health-gradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
              <defs>
                <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--success))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xl font-bold tracking-tight">{score}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Very Healthy</span>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-success font-medium flex items-center">
                +12 pts
              </span>
              <span className="text-muted-foreground">/ 30d</span>
            </div>
            {/* Tiny sparkline */}
            <svg width="48" height="12" viewBox="0 0 48 12" className="mt-1">
              <path d="M0 10 L10 8 L20 9 L30 5 L40 6 L48 2" fill="none" stroke="hsl(var(--success))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
