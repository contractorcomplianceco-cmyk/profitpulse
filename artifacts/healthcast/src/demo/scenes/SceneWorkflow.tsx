import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, CheckCircle2, Clock } from "lucide-react";
import { SceneShell } from "../components/SceneShell";

const ROWS = [
  { job: "Riverside Medical Wing", account: "Summit Health", margin: "18.2%", status: "On track", ok: true },
  { job: "Pacific Care Phase 2", account: "Pacific Care Partners", margin: "6.1%", status: "Review", ok: false },
  { job: "Metro HVAC Retrofit", account: "Metro Facilities", margin: "15.4%", status: "On track", ok: true },
];

export function SceneWorkflow() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell sceneKey="workflow">
      <div className="relative z-10 w-full max-w-3xl px-4 md:px-8">
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
        >
          <Users className="w-6 h-6 text-[#49BFF2]" />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Team review workflow</h2>
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/10 bg-[#0b1424]/80 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        >
          <div className="grid grid-cols-12 gap-2 px-3 py-2.5 bg-white/5 text-[10px] md:text-xs uppercase tracking-wider text-white/40 font-body">
            <div className="col-span-5">Job / project</div>
            <div className="col-span-3 hidden sm:block">Account</div>
            <div className="col-span-2 text-right">Margin</div>
            <div className="col-span-2 sm:col-span-2 text-right">Status</div>
          </div>
          {ROWS.map((row, i) => (
            <motion.div
              key={row.job}
              className={`grid grid-cols-12 gap-2 items-center px-3 py-3 md:py-4 border-t border-white/5 ${
                !row.ok ? "bg-[#f59e0b]/5" : ""
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.18 }}
            >
              <div className="col-span-5 text-sm md:text-base text-white font-medium truncate">{row.job}</div>
              <div className="col-span-3 hidden sm:block text-xs text-white/50 truncate">{row.account}</div>
              <div
                className={`col-span-2 text-right font-mono text-sm ${
                  row.ok ? "text-[#3FB257]" : "text-[#f59e0b]"
                }`}
              >
                {row.margin}
              </div>
              <div className="col-span-2 flex justify-end">
                {row.ok ? (
                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-[#3FB257]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> On track
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-[#f59e0b]">
                    <Clock className="w-3.5 h-3.5" /> Review
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-xs text-white/40 mt-4 font-body"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          Ops, finance, and owners align on the same sample job list.
        </motion.p>
      </div>
    </SceneShell>
  );
}
