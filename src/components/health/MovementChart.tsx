"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface MovementChartDatum {
  date: string;
  minutes: number;
}

interface Props {
  data: MovementChartDatum[];
}

export function MovementChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Bar dataKey="minutes" fill="#0f172a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
