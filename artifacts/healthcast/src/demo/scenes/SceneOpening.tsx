import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LayoutDashboard, TrendingUp, Wallet, Shield } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

const KPIS = [
  { label: "Revenue MTD", value: "$1.24M", trend: "+8.2% vs prior", icon: TrendingUp, color: "#49BFF2" },
  { label: "Cash on hand", value: "$412K", trend: "18 wk runway", icon: Wallet, color: "#3FB257" },
  { label: "Net margin", value: "14.8%", trend: "Sample · live view", icon: LayoutDashboard, color: "#a78bfa" },
  { label: "Risk items", value: "3 open", trend: "Flagged early", icon: Shield, color: "#f59e0b" },
];

export function SceneOpening() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 350),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="opening">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(73,191,242,0.12),transparent_65%)] pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8 flex flex-col items-center">
        <motion.div
          className="flex items-center gap-3 mb-5 md:mb-7"
          initial={{ opacity: 0, y: -24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, type: "spring", stiffness: 180 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}brand/profitpulse-shield.png`}
            alt=""
            className="w-11 h-11 md:w-16 md:h-16 object-contain drop-shadow-[0_0_28px_rgba(73,191,242,0.45)]"
          />
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              ProfitPulse
            </h1>
            <p className="text-[#49BFF2] text-xs md:text-base font-semibold tracking-wide">
              Financial command center
            </p>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-[#94a3b8] text-sm md:text-lg font-body max-w-lg mb-6 md:mb-9"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          One executive view for operators who need clarity — not another spreadsheet.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 w-full">
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                className="rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm p-3 md:p-4"
                initial={{ opacity: 0, y: 28 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.09, duration: 0.5, type: "spring" }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: kpi.color }} />
                  <span className="text-[9px] md:text-xs text-white/45 font-body uppercase tracking-wide truncate">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-lg md:text-2xl font-display font-bold text-white">{kpi.value}</div>
                <div className="text-[10px] md:text-xs text-[#49BFF2]/90 font-mono mt-0.5">{kpi.trend}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="mt-5 text-[10px] md:text-xs text-white/30 font-body"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
        >
          Illustrative sample data
        </motion.p>
      </div>
    </SceneShell>
  );
}
