import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LayoutDashboard, TrendingUp, Wallet, Shield } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

const KPIS = [
  { label: "Revenue MTD", value: "$1.24M", trend: "+8.2%", icon: TrendingUp, color: "#49BFF2" },
  { label: "Cash on hand", value: "$412K", trend: "18 wk runway", icon: Wallet, color: "#3FB257" },
  { label: "Net margin", value: "14.8%", trend: "Live", icon: LayoutDashboard, color: "#a78bfa" },
  { label: "Risk score", value: "Low", trend: "3 alerts", icon: Shield, color: "#f59e0b" },
];

export function SceneOpening() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="opening">
      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8 flex flex-col items-center">
        <motion.div
          className="flex items-center gap-3 mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}brand/profitpulse-shield.png`}
            alt=""
            className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-[0_0_24px_rgba(73,191,242,0.4)]"
          />
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              ProfitPulse
            </h1>
            <p className="text-[#49BFF2] text-sm md:text-base font-semibold tracking-wide">
              Executive command view
            </p>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-[#94a3b8] text-base md:text-xl font-body max-w-xl mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          One screen for cash, margin, pipeline, and risk — built for contractor operators.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 md:p-4"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  <span className="text-[10px] md:text-xs text-white/50 font-body uppercase tracking-wide">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-xl md:text-2xl font-display font-bold text-white">{kpi.value}</div>
                <div className="text-xs text-[#49BFF2] font-mono mt-1">{kpi.trend}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
}
