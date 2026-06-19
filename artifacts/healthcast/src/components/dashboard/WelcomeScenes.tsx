import { motion } from "framer-motion";
import { Activity, MessageSquare, DollarSign, Sliders, TrendingUp, ShieldCheck, Bell } from "lucide-react";

interface SceneProps {
  isActive: boolean;
}

export function SceneExecutiveOverview({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
        transition={{ duration: 0.5, type: "spring" as const, bounce: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center gap-4 mb-8 justify-center">
          <Activity className="w-12 h-12 text-primary" />
          <h3 className="text-2xl font-black text-foreground">Command Center</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-secondary/30 h-24 rounded-lg border border-border/50 p-4 flex flex-col justify-end"
            >
              <div className="h-2 w-1/3 bg-muted rounded-full mb-2" />
              <div className="h-4 w-2/3 bg-primary/50 rounded-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function SceneCopilot({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md flex flex-col gap-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div className="h-8 w-48 bg-secondary/50 rounded-lg" />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
          transition={{ delay: 0.2 }}
          className="self-start bg-secondary/40 p-4 rounded-2xl rounded-tl-sm border border-border/50 w-3/4"
        >
          <div className="h-2 w-full bg-muted rounded-full mb-2" />
          <div className="h-2 w-5/6 bg-muted rounded-full" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
          transition={{ delay: 0.5 }}
          className="self-end bg-primary/20 p-4 rounded-2xl rounded-tr-sm border border-primary/30 w-3/4"
        >
          <div className="h-2 w-full bg-primary/60 rounded-full mb-2" />
          <div className="h-2 w-4/6 bg-primary/60 rounded-full mb-4" />
          <div className="h-16 w-full bg-foreground/5 rounded-lg border border-primary/20" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function SceneCashFlow({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 w-full max-w-lg flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center border border-success/30">
            <DollarSign className="w-8 h-8 text-success" />
          </div>
          <div className="h-3 w-20 bg-success/50 rounded-full" />
        </motion.div>

        <div className="flex-1 px-8 relative h-32 flex items-center">
          <div className="absolute inset-x-8 h-1 bg-border rounded-full" />
          <motion.div
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: isActive ? "50%" : "0%", opacity: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
            className="absolute w-3 h-3 bg-success rounded-full -mt-1 shadow-[0_0_10px_hsl(var(--success))]"
            style={{ top: "50%" }}
          />
          <motion.div
            initial={{ right: "0%", opacity: 0 }}
            animate={{ right: isActive ? "50%" : "0%", opacity: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 0.75 }}
            className="absolute w-3 h-3 bg-destructive rounded-full -mt-1 shadow-[0_0_10px_hsl(var(--destructive))]"
            style={{ top: "50%" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center border border-destructive/30">
            <DollarSign className="w-8 h-8 text-destructive" />
          </div>
          <div className="h-3 w-20 bg-destructive/50 rounded-full" />
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
        transition={{ delay: 0.3 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-secondary border-4 border-border flex items-center justify-center shadow-xl"
      >
        <div className="h-4 w-12 bg-muted/60 rounded-full" />
      </motion.div>
    </div>
  );
}

export function SceneScenarioBuilder({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">
        <div className="flex items-center gap-4 justify-center mb-4">
          <Sliders className="w-10 h-10 text-cyan" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="w-20 h-2 bg-muted rounded-full" />
            <div className="flex-1 h-3 bg-secondary rounded-full relative">
              <motion.div
                initial={{ left: "10%" }}
                animate={{ left: isActive ? ["10%", "80%", "40%"][i] : "10%" }}
                transition={{ duration: 1.5, type: "spring" as const, bounce: 0.5, delay: i * 0.2 }}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-cyan rounded-full shadow-[0_0_10px_hsl(var(--cyan))]"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="w-12 h-6 bg-cyan/20 border border-cyan/30 rounded flex items-center justify-center"
            >
              <div className="w-6 h-1.5 bg-cyan/60 rounded-full" />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SceneFuturecast({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md h-48 flex items-end">
        <div className="absolute inset-0 border-l border-b border-border/50" />
        <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M 0 192 C 100 192, 150 100, 250 80 C 350 60, 400 40, 500 0"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <motion.circle
            initial={{ opacity: 0, cx: 0, cy: 192 }}
            animate={{ opacity: isActive ? 1 : 0, cx: 500, cy: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            r="6"
            fill="hsl(var(--primary))"
            className="drop-shadow-[0_0_10px_hsl(var(--primary))]"
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute top-[-20px] right-0 bg-primary/20 border border-primary/50 text-primary px-3 py-1.5 rounded-md font-bold text-sm flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Target Reached
        </motion.div>
      </div>
    </div>
  );
}

export function SceneCompliance({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isActive ? 1 : 0.8, opacity: isActive ? 1 : 0 }}
          transition={{ type: "spring" as const, bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-8 relative"
        >
          <ShieldCheck className="w-12 h-12 text-success relative z-10" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isActive ? [1, 1.2, 1] : 0.8, opacity: isActive ? [0, 0.5, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-success/20"
          />
        </motion.div>
        
        <div className="flex flex-col gap-3 w-64">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: isActive ? 0 : -20, opacity: isActive ? 1 : 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="bg-secondary/40 border border-border/50 p-3 rounded-lg flex items-center gap-3"
            >
              <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center border border-success/50">
                <div className="w-2 h-2 bg-success rounded-full" />
              </div>
              <div className="h-2 w-full bg-muted rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SceneAlerts({ isActive }: SceneProps) {
  return (
    <div className="w-full h-full bg-card rounded-xl overflow-hidden relative border border-border/50 flex items-center justify-center surface-gradient p-8">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: isActive ? 0 : -20, opacity: isActive ? 1 : 0 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-warning/20 border border-warning/30 flex items-center justify-center relative">
            <Bell className="w-8 h-8 text-warning" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isActive ? 1 : 0 }}
              transition={{ delay: 0.5, type: "spring" as const, bounce: 0.6 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white"
            >
              3
            </motion.div>
          </div>
        </motion.div>
        
        <div className="flex flex-col gap-3">
          {[
            { color: "warning", w: "3/4" },
            { color: "destructive", w: "full" },
            { color: "warning", w: "5/6" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="bg-secondary/40 border border-border/50 p-4 rounded-lg flex gap-4 items-center"
            >
              <div className={`w-3 h-3 rounded-full bg-${item.color} shadow-[0_0_8px_hsl(var(--${item.color}))]`} />
              <div className="flex-1">
                <div className={`h-2 w-${item.w} bg-muted rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function renderScene(id: string, isActive: boolean) {
  switch (id) {
    case "executive-overview": return <SceneExecutiveOverview isActive={isActive} key={id} />;
    case "copilot": return <SceneCopilot isActive={isActive} key={id} />;
    case "cash-flow": return <SceneCashFlow isActive={isActive} key={id} />;
    case "scenario-builder": return <SceneScenarioBuilder isActive={isActive} key={id} />;
    case "futurecast": return <SceneFuturecast isActive={isActive} key={id} />;
    case "compliance": return <SceneCompliance isActive={isActive} key={id} />;
    case "alerts": return <SceneAlerts isActive={isActive} key={id} />;
    default: return null;
  }
}
