"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createMovementLog,
  deleteMovementLog,
  updateMovementLog,
  useMovement,
} from "@/lib/db/health";
import type { MovementLog } from "@/lib/db/schema";

const MovementChart = dynamic(
  () => import("@/components/health/MovementChart").then((m) => ({ default: m.MovementChart })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" /> }
);

export default function MovementPage() {
  const movement = useMovement();
  const [date, setDate] = useState("");
  const [type, setType] = useState<MovementLog["type"]>("walk");
  const [minutes, setMinutes] = useState(30);
  const [intensity, setIntensity] = useState<MovementLog["intensity"]>("med");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState<MovementLog["type"]>("walk");
  const [editMinutes, setEditMinutes] = useState(0);
  const [editIntensity, setEditIntensity] = useState<MovementLog["intensity"]>("med");
  const [editNotes, setEditNotes] = useState("");

  const recent = useMemo(
    () => (movement ?? []).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
    [movement]
  );
  const chartData = useMemo(
    () =>
      (movement ?? [])
        .map((m) => ({ date: m.date, minutes: m.minutes }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14),
    [movement]
  );

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!date) return;
    await createMovementLog({
      date,
      type,
      minutes,
      intensity,
      notes,
    });
    setDate("");
    setNotes("");
  }

  function startEdit(id: string) {
    const entry = (movement ?? []).find((m) => m.id === id);
    if (!entry) return;
    setEditingId(id);
    setEditDate(entry.date);
    setEditType(entry.type);
    setEditMinutes(entry.minutes);
    setEditIntensity(entry.intensity);
    setEditNotes(entry.notes ?? "");
  }

  async function saveEdit() {
    if (!editingId || !editDate) return;
    await updateMovementLog(editingId, {
      date: editDate,
      type: editType,
      minutes: editMinutes,
      intensity: editIntensity,
      notes: editNotes,
    });
    setEditingId(null);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this movement entry?")) return;
    await deleteMovementLog(id);
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Health</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Movement</h1>
        <p className="text-neutral-600">Log sessions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onAdd}>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MovementLog["type"])}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="walk">Walk</option>
              <option value="ride">Ride</option>
              <option value="strength">Strength</option>
              <option value="mobility">Mobility</option>
              <option value="other">Other</option>
            </select>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value || 0))}
              placeholder="Minutes"
            />
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as MovementLog["intensity"])}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
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
          <CardTitle>Movement trend (minutes)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {chartData.length === 0 ? (
            <p className="text-sm text-neutral-600">No data to chart yet.</p>
          ) : (
            <MovementChart data={chartData} />
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
                    <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as MovementLog["type"])}
                      className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
                    >
                      <option value="walk">Walk</option>
                      <option value="ride">Ride</option>
                      <option value="strength">Strength</option>
                      <option value="mobility">Mobility</option>
                      <option value="other">Other</option>
                    </select>
                    <Input
                      type="number"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(Number(e.target.value || 0))}
                      placeholder="Minutes"
                    />
                    <select
                      value={editIntensity}
                      onChange={(e) => setEditIntensity(e.target.value as MovementLog["intensity"])}
                      className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="med">Medium</option>
                      <option value="high">High</option>
                    </select>
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
                        {m.date} - {m.type} ({m.minutes}m, {m.intensity})
                      </p>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => startEdit(m.id)}>Edit</Button>
                        <Button type="button" variant="outline" onClick={() => onDelete(m.id)}>Delete</Button>
                      </div>
                    </div>
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
