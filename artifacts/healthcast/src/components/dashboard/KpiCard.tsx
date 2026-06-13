import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface KpiCardProps {
  label: string;
  value: string | number;
  priorValue?: number;
  trend?: number[];
  inverseTrend?: boolean; // if true, down is good (e.g. AR Outstanding)
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  priorValue,
  trend,
  inverseTrend = false,
  prefix = "",
  suffix = "",
  className
}: KpiCardProps) {
  const parseDisplayValue = (raw: string): number => {
    const match = raw.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (!match) return 0;
    let parsed = parseFloat(match[0]);
    const suffix = raw.trim().slice(-1).toUpperCase();
    const multipliers: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
    if (multipliers[suffix]) parsed *= multipliers[suffix];
    return parsed;
  };

  const numericValue = typeof value === 'string' ? parseDisplayValue(value) : value;
  const hasPrior = priorValue !== undefined;
  const delta = hasPrior && priorValue !== 0 ? ((numericValue - priorValue) / priorValue) * 100 : 0;
  
  let isPositive = delta >= 0;
  if (inverseTrend) isPositive = !isPositive;

  const trendData = trend?.map((val, i) => ({ value: val, index: i })) || [];

  return (
    <Card className={cn("overflow-hidden bg-card/50 backdrop-blur-xl border-border/50", className)}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight">
                {prefix}{value}{suffix}
              </h3>
            </div>
            
            {hasPrior && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className={cn(
                  "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-sm",
                  isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                )}>
                  {delta >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {Math.abs(delta).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">vs prior</span>
              </div>
            )}
          </div>
          
          {trendData.length > 0 && (
            <div className="w-20 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}