import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  children: ReactNode;
}

export function InsightCard({ title, children }: InsightCardProps) {
  return (
    <Card className="bg-primary/5 border-primary/30 shadow-lg shadow-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="mt-0.5 bg-primary/20 p-2.5 rounded-lg text-primary h-fit border border-primary/20 shadow-inner">
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