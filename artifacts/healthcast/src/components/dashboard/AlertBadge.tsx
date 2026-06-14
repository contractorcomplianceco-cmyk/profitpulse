import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertBadgeProps {
  severity: "critical" | "warning" | "info";
  className?: string;
}

export function AlertBadge({ severity, className }: AlertBadgeProps) {
  const variants = {
    critical: "bg-gradient-to-br from-destructive to-[hsl(360_80%_45%)] text-destructive-foreground border-destructive/50 shadow-md shadow-destructive/30 font-bold",
    warning: "bg-gradient-warning text-background border-warning/50 shadow-md shadow-warning/30 font-bold",
    info: "bg-gradient-primary text-primary-foreground border-primary/50 shadow-md shadow-primary/30 font-bold",
  };

  const labels = {
    critical: "Critical",
    warning: "Warning",
    info: "Info",
  };

  return (
    <Badge variant="outline" className={cn("uppercase tracking-widest text-[10px] px-2 py-0.5 rounded-sm", variants[severity], className)}>
      {labels[severity]}
    </Badge>
  );
}