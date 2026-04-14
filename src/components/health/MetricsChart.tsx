"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface MetricsChartDatum {
  date: string;
  value: number;
  metricType: string;
}

interface Props {
  data: MetricsChartDatum[];
}

export function MetricsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={(v) => v.slice(5, 16)} fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
