import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertBadgeProps {
  severity: "critical" | "warning" | "info";
  className?: string;
}

export function AlertBadge({ severity, className }: AlertBadgeProps) {
  const variants = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };

  const labels = {
    critical: "Critical",
    warning: "Warning",
    info: "Info",
  };

  return (
    <Badge variant="outline" className={cn("font-medium uppercase tracking-wider text-[10px]", variants[severity], className)}>
      {labels[severity]}
    </Badge>
  );
}