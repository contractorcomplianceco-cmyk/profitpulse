import { AlertTriangle } from "lucide-react";

interface RiskWarningProps {
  title: string;
  message: string;
}

export function RiskWarning({ title, message }: RiskWarningProps) {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-warning/15 via-warning/5 to-transparent border-l-4 border-l-warning border-y border-r border-warning/20 text-warning-foreground shadow-lg shadow-warning/10 relative overflow-hidden">
      <div className="absolute -left-8 -top-8 w-28 h-28 bg-warning/10 rounded-full blur-2xl pointer-events-none" />
      <div className="bg-warning/20 p-2 rounded-lg h-fit border border-warning/30 shadow-[0_0_12px_-2px_hsl(var(--warning)/0.6)] relative">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
      </div>
      <div className="relative">
        <h4 className="font-extrabold text-[13px] text-warning uppercase tracking-widest">{title}</h4>
        <p className="text-[13px] mt-1.5 text-foreground font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
}