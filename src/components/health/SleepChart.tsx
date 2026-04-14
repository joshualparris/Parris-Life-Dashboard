"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface SleepChartDatum {
  date: string;
  duration: number;
}

interface Props {
  data: SleepChartDatum[];
}

export function SleepChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" fontSize={12} />
        <YAxis tickFormatter={(v) => (v / 60).toFixed(1)} fontSize={12} />
        <Tooltip formatter={(v: number) => `${(Number(v) / 60).toFixed(1)} hrs`} />
        <Line
          type="monotone"
          dataKey="duration"
          stroke="#0f172a"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
