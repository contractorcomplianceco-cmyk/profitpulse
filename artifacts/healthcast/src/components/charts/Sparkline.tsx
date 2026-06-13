import { useId } from "react";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

export function Sparkline({ data, color = "hsl(var(--primary))", type = "line" }: { data: number[], color?: string, type?: "line" | "area" }) {
  const rawId = useId();
  const gradientId = `spark-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const chartData = data.map((d, i) => ({ value: d, index: i }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "line" ? (
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      ) : (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} isAnimationActive={false} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
