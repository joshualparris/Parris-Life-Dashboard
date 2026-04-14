"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createMetricLog,
  deleteMetricLog,
  updateMetricLog,
  useMetrics,
} from "@/lib/db/health";
import type { MetricLog } from "@/lib/db/schema";

const MetricsChart = dynamic(
  () => import("@/components/health/MetricsChart").then((m) => ({ default: m.MetricsChart })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" /> }
);

export default function MetricsPage() {
  const metrics = useMetrics();
  const [dateTime, setDateTime] = useState("");
  const [metricType, setMetricType] = useState<MetricLog["metricType"]>("weight");
  const [value, setValue] = useState<number | undefined>(undefined);
  const [unit, setUnit] = useState("kg");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDateTime, setEditDateTime] = useState("");
  const [editMetricType, setEditMetricType] = useState<MetricLog["metricType"]>("weight");
  const [editValue, setEditValue] = useState<number | undefined>(undefined);
  const [editUnit, setEditUnit] = useState("kg");
  const [editNotes, setEditNotes] = useState("");

  const recent = useMemo(
    () => (metrics ?? []).sort((a, b) => b.dateTimeIso.localeCompare(a.dateTimeIso)).slice(0, 10),
    [metrics]
  );
  const chartData = useMemo(
    () =>
      (metrics ?? [])
        .map((m) => ({
          date: m.dateTimeIso,
          value: m.value,
          metricType: m.metricType,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-20),
    [metrics]
  );

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!dateTime || value == null) return;
    await createMetricLog({
      dateTimeIso: dateTime,
      metricType,
      value,
      unit,
      notes,
    });
    setDateTime("");
    setValue(undefined);
    setNotes("");
  }

  function startEdit(id: string) {
    const entry = (metrics ?? []).find((m) => m.id === id);
    if (!entry) return;
    setEditingId(id);
    setEditDateTime(entry.dateTimeIso);
    setEditMetricType(entry.metricType);
    setEditValue(entry.value);
    setEditUnit(entry.unit);
    setEditNotes(entry.notes ?? "");
  }

  async function saveEdit() {
    if (!editingId || !editDateTime || editValue == null) return;
    await updateMetricLog(editingId, {
      dateTimeIso: editDateTime,
      metricType: editMetricType,
      value: editValue,
      unit: editUnit,
      notes: editNotes,
    });
    setEditingId(null);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this metric entry?")) return;
    await deleteMetricLog(id);
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Health</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Metrics</h1>
        <p className="text-neutral-600">Log weight, HRV, and other metrics.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onAdd}>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <select
              value={metricType}
              onChange={(e) => setMetricType(e.target.value as MetricLog["metricType"])}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="weight">Weight</option>
              <option value="hrv">HRV</option>
              <option value="restingHR">Resting HR</option>
              <option value="bp">Blood pressure</option>
              <option value="other">Other</option>
            </select>
            <Input
              type="number"
              value={value ?? ""}
              onChange={(e) => setValue(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Value"
            />
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" />
            <Input
              className="md:col-span-2"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="md:col-span-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metrics trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {chartData.length === 0 ? (
            <p className="text-sm text-neutral-600">No data to chart yet.</p>
          ) : (
            <MetricsChart data={chartData} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recent.length === 0 ? (
            <p className="text-sm text-neutral-600">No entries yet.</p>
          ) : (
            recent.map((m) => (
              <div
                key={m.id}
                className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                {editingId === m.id ? (
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      type="datetime-local"
                      value={editDateTime}
                      onChange={(e) => setEditDateTime(e.target.value)}
                    />
                    <select
                      value={editMetricType}
                      onChange={(e) => setEditMetricType(e.target.value as MetricLog["metricType"])}
                      className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
                    >
                      <option value="weight">Weight</option>
                      <option value="hrv">HRV</option>
                      <option value="restingHR">Resting HR</option>
                      <option value="bp">Blood pressure</option>
                      <option value="other">Other</option>
                    </select>
                    <Input
                      type="number"
                      value={editValue ?? ""}
                      onChange={(e) => setEditValue(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Value"
                    />
                    <Input value={editUnit} onChange={(e) => setEditUnit(e.target.value)} placeholder="Unit" />
                    <Input
                      className="md:col-span-2"
                      placeholder="Notes"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="button" onClick={saveEdit}>Save</Button>
                      <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button type="button" variant="outline" onClick={() => onDelete(m.id)}>Delete</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-neutral-900">
                        {m.metricType} - {m.value} {m.unit}
                      </p>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => startEdit(m.id)}>Edit</Button>
                        <Button type="button" variant="outline" onClick={() => onDelete(m.id)}>Delete</Button>
                      </div>
                    </div>
                    <p className="text-neutral-600">{new Date(m.dateTimeIso).toLocaleString()}</p>
                    {m.notes && <p className="text-neutral-600">{m.notes}</p>}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
