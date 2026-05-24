"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    fontSize: 12,
    padding: 8,
  },
  cursor: { fill: "hsl(var(--muted) / 0.4)" },
};

export function TrafficAreaChart({
  data,
}: {
  data: { date: string; visits: number; conversions: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="visits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(280 91% 65%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(280 91% 65%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="visits" stroke="hsl(217 91% 60%)" fill="url(#visits)" strokeWidth={2.5} />
        <Area type="monotone" dataKey="conversions" stroke="hsl(280 91% 65%)" fill="url(#conv)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ToolsBarChart({ data }: { data: { name: string; uses: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" />
            <stop offset="100%" stopColor="hsl(330 91% 65%)" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border) / 0.3)" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
        <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} width={120} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="uses" fill="url(#bar)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueLineChart({
  data,
}: {
  data: { date: string; adsense: number; affiliate: number; total: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="adsense" stroke="hsl(217 91% 60%)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="affiliate" stroke="hsl(280 91% 65%)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="total" stroke="hsl(160 60% 50%)" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
