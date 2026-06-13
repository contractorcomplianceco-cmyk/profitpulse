import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  children: ReactNode;
}

export function InsightCard({ title, children }: InsightCardProps) {
  return (
    <Card className="bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className="mt-0.5 bg-primary/10 p-2 rounded-md text-primary h-fit">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}