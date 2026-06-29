import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, CheckCircle2, Clock, Briefcase } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

const ROWS = [
  {
    job: "Riverside Medical Wing",
    account: "Summit Health",
    type: "Project",
    margin: "18.2%",
    status: "On track",
    ok: true,
  },
  {
    job: "Pacific Care Phase 2",
    account: "Pacific Care Partners",
    type: "Job",
    margin: "6.1%",
    status: "Review",
    ok: false,
  },
  {
    job: "Metro HVAC Retrofit",
    account: "Metro Facilities",
    type: "Account",
    margin: "15.4%",
    status: "On track",
    ok: true,
  },
];

export function SceneWorkflow() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1100),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="workflow">
      <div className="relative z-10 w-full max-w-3xl px-3 md:px-8">
        <motion.div
          className="flex items-center justify-center gap-2 mb-4 md:mb-5"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
        >
          <Users className="w-5 h-5 md:w-6 md:h-6 text-[#49BFF2]" />
          <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-white">
            Jobs · projects · accounts
          </h2>
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/10 bg-[#0b1424]/90 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="grid grid-cols-12 gap-1 px-2.5 py-2 bg-white/[0.04] text-[9px] md:text-xs uppercase tracking-wider text-white/35 font-body">
            <div className="col-span-4">Name</div>
            <div className="col-span-3 hidden sm:block">Account</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1 text-right">Margin</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {ROWS.map((row, i) => (
            <motion.div
              key={row.job}
              className={`grid grid-cols-12 gap-1 items-center px-2.5 py-2.5 md:py-3.5 border-t border-white/5 ${
                !row.ok ? "bg-[#f59e0b]/[0.07]" : ""
              }`}
              initial={{ opacity: 0, x: -18 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.14 }}
            >
              <div className="col-span-4 flex items-center gap-1.5 min-w-0">
                <Briefcase className="w-3 h-3 text-white/25 shrink-0 hidden sm:block" />
                <span className="text-xs md:text-sm text-white font-medium truncate">{row.job}</span>
              </div>
              <div className="col-span-3 hidden sm:block text-[10px] md:text-xs text-white/45 truncate">
                {row.account}
              </div>
              <div className="col-span-2 text-[10px] md:text-xs text-white/50">{row.type}</div>
              <div
                className={`col-span-1 text-right font-mono text-xs md:text-sm ${
                  row.ok ? "text-[#3FB257]" : "text-[#f59e0b]"
                }`}
              >
                {row.margin}
              </div>
              <div className="col-span-2 flex justify-end">
                {row.ok ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] md:text-xs text-[#3FB257]">
                    <CheckCircle2 className="w-3 h-3" /> OK
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9px] md:text-xs text-[#f59e0b]">
                    <Clock className="w-3 h-3" /> Review
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SceneShell>
  );
}
