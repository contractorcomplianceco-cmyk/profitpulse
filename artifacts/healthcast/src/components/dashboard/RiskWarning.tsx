import { AlertTriangle } from "lucide-react";

interface RiskWarningProps {
  title: string;
  message: string;
}

export function RiskWarning({ title, message }: RiskWarningProps) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20 text-warning-foreground">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-warning">{title}</h4>
        <p className="text-sm mt-1 text-warning/90">{message}</p>
      </div>
    </div>
  );
}