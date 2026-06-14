import { AlertTriangle } from "lucide-react";

interface RiskWarningProps {
  title: string;
  message: string;
}

export function RiskWarning({ title, message }: RiskWarningProps) {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-warning/10 border-l-4 border-l-warning border-y border-r border-border text-warning-foreground shadow-lg shadow-black/20">
      <div className="bg-warning/20 p-2 rounded-lg h-fit">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
      </div>
      <div>
        <h4 className="font-extrabold text-[13px] text-warning uppercase tracking-widest">{title}</h4>
        <p className="text-[13px] mt-1.5 text-foreground font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
}