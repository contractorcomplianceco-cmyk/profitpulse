import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export function DonutChart({ data, centerText, centerSubtext }: { data: any[], centerText?: string, centerSubtext?: string }) {
  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight text-white">{centerText}</span>
          {centerSubtext && <span className="text-xs text-muted-foreground">{centerSubtext}</span>}
        </div>
      )}
    </div>
  );
}
