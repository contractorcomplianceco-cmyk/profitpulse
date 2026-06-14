import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn("surface-gradient border-border rounded-xl shadow-lg shadow-black/20 hover:border-primary/40 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden accent-topline", className)}>
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none"></div>
      <CardHeader className="pb-4 relative">
        <CardTitle className="text-sm font-extrabold tracking-widest uppercase text-foreground flex items-center gap-2.5">
          <span className="h-3.5 w-1 rounded-full bg-gradient-to-b from-cyan to-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
          {title}
        </CardTitle>
        {description && <CardDescription className="font-medium">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="relative">
        {children}
      </CardContent>
    </Card>
  );
}