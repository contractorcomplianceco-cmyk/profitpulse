import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  children: ReactNode;
}

export function InsightCard({ title, children }: InsightCardProps) {
  return (
    <Card className="surface-gradient-accent border-primary/30 shadow-lg shadow-primary/10 relative overflow-hidden hover:border-primary/50 transition-colors">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan via-primary to-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]" />
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <CardContent className="p-6 relative">
        <div className="flex gap-4">
          <div className="mt-0.5 bg-gradient-primary p-2.5 rounded-lg text-primary-foreground h-fit border border-primary/30 shadow-md shadow-primary/30">
            <Lightbulb className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-[13px] tracking-widest text-foreground uppercase">{title}</h4>
            <div className="text-[13px] font-medium text-muted-foreground leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}