import { useId } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

export function Sparkline({
  data,
  color = "hsl(var(--primary))",
  type = "line",
}: {
  data: number[];
  color?: string;
  type?: "line" | "area";
}) {
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
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} isAnimationActive={false} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, centerText, centerSubtext, palette }: { data: any[]; centerText?: string; centerSubtext?: string; palette?: string[] }) {
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
              <Cell key={`cell-${index}`} fill={palette ? palette[index % palette.length] : entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight text-foreground">{centerText}</span>
          {centerSubtext && <span className="text-xs text-muted-foreground">{centerSubtext}</span>}
        </div>
      )}
    </div>
  );
}

export function GaugeChart({ value, label }: { value: number; label: string }) {
  const normalizedValue = Math.min(Math.max(value, 0), 5);
  const percentage = (normalizedValue / 5) * 100;

  const data = [
    { name: "Value", value: percentage, fill: "hsl(var(--primary))" },
    { name: "Remainder", value: 100 - percentage, fill: "hsl(var(--border))" },
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
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          width={100}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            offset={8}
            fill="hsl(var(--foreground))"
            fontSize={11}
            formatter={(v: number) => v.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface TrendLineProps {
  data: any[];
  lines: { key: string; color: string; name: string }[];
  xAxisKey: string;
  type?: "line" | "area";
}

const compactTick = (value: number) => {
  if (typeof value !== "number" || !isFinite(value)) return `${value}`;
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}K`;
  return `${value}`;
};

export function TrendLine({ data, lines, xAxisKey, type = "line" }: TrendLineProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "line" ? (
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={compactTick} width={44} />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          {lines.map((line, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      ) : (
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            {lines.map((line, i) => (
              <linearGradient key={i} id={`color-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={compactTick} width={44} />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          {lines.map((line, i) => (
            <Area
              key={i}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              fill={`url(#color-${line.key})`}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
