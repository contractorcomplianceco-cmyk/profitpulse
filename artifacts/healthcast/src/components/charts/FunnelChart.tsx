import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts";

export function FunnelChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, left: 40, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          dataKey="stage"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          width={100}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#fff' }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            offset={8}
            fill="#fff"
            fontSize={11}
            formatter={(v: number) => v.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
