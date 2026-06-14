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
    <Card className={cn("bg-card border-border rounded-xl shadow-lg shadow-black/20", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-extrabold tracking-widest uppercase text-foreground">{title}</CardTitle>
        {description && <CardDescription className="font-medium">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}