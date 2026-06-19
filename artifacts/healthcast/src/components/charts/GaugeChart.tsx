import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function GaugeChart({ value, label }: { value: number, label: string }) {
  // Gauge goes from 0 to 5 for ROI
  const normalizedValue = Math.min(Math.max(value, 0), 5);
  const percentage = (normalizedValue / 5) * 100;
  
  const data = [
    { name: "Value", value: percentage, fill: "hsl(var(--primary))" },
    { name: "Remainder", value: 100 - percentage, fill: "hsl(var(--border))" }
  ];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="90%"
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 pointer-events-none">
        <span className="text-4xl font-bold tracking-tight text-foreground drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]">{value.toFixed(2)}x</span>
        <span className="text-xs tracking-wider text-muted-foreground uppercase mt-1">{label}</span>
      </div>
    </div>
  );
}
