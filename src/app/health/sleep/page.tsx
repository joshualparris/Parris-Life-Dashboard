"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSleepLog, deleteSleepLog, updateSleepLog, useSleep } from "@/lib/db/health";

const SleepChart = dynamic(
  () => import("@/components/health/SleepChart").then((m) => ({ default: m.SleepChart })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" /> }
);

export default function SleepPage() {
  const sleeps = useSleep();
  const [date, setDate] = useState("");
  const [bed, setBed] = useState("");
  const [wake, setWake] = useState("");
  const [quality, setQuality] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editBed, setEditBed] = useState("");
  const [editWake, setEditWake] = useState("");
  const [editQuality, setEditQuality] = useState<number | undefined>(undefined);
  const [editNotes, setEditNotes] = useState("");

  const recent = useMemo(
    () => (sleeps ?? []).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7),
    [sleeps]
  );
  const chartData = useMemo(
    () =>
      (sleeps ?? [])
        .map((s) => ({
          date: s.date,
          duration:
            s.durationMinutes ?? durationFromTimes(s.bedtimeIso, s.wakeIso) ?? 0,
        }))
        .filter((d) => d.duration > 0)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14),
    [sleeps]
  );

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!date) return;
    await createSleepLog({
      date,
      bedtimeIso: bed || undefined,
      wakeIso: wake || undefined,
      quality,
      notes,
      tags: [],
    });
    setDate("");
    setBed("");
    setWake("");
    setQuality(undefined);
    setNotes("");
  }

  function startEdit(id: string) {
    const entry = (sleeps ?? []).find((s) => s.id === id);
    if (!entry) return;
    setEditingId(id);
    setEditDate(entry.date);
    setEditBed(entry.bedtimeIso ?? "");
    setEditWake(entry.wakeIso ?? "");
    setEditQuality(entry.quality ?? undefined);
    setEditNotes(entry.notes ?? "");
  }

  async function saveEdit() {
    if (!editingId || !editDate) return;
    await updateSleepLog(editingId, {
      date: editDate,
      bedtimeIso: editBed || null,
      wakeIso: editWake || null,
      quality: editQuality ?? null,
      notes: editNotes,
    });
    setEditingId(null);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this sleep entry?")) return;
    await deleteSleepLog(id);
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Health</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Sleep</h1>
        <p className="text-neutral-600">Log sleep and quality.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onAdd}>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input
              type="datetime-local"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
              placeholder="Bedtime"
            />
            <Input
              type="datetime-local"
              value={wake}
              onChange={(e) => setWake(e.target.value)}
              placeholder="Wake time"
            />
            <Input
              type="number"
              placeholder="Quality 1-5"
              value={quality ?? ""}
              onChange={(e) => setQuality(e.target.value ? Number(e.target.value) : undefined)}
            />
            <Textarea
              className="md:col-span-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
            />
            <div className="md:col-span-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep trend (hours)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {chartData.length === 0 ? (
            <p className="text-sm text-neutral-600">No data to chart yet.</p>
          ) : (
            <SleepChart data={chartData} />
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
            recent.map((s) => (
              <div
                key={s.id}
                className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                {editingId === s.id ? (
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    <Input type="datetime-local" value={editBed} onChange={(e) => setEditBed(e.target.value)} />
                    <Input type="datetime-local" value={editWake} onChange={(e) => setEditWake(e.target.value)} />
                    <Input
                      type="number"
                      placeholder="Quality 1-5"
                      value={editQuality ?? ""}
                      onChange={(e) => setEditQuality(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <Textarea
                      className="md:col-span-2"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes"
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="button" onClick={saveEdit}>Save</Button>
                      <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button type="button" variant="outline" onClick={() => onDelete(s.id)}>Delete</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-neutral-900">{s.date}</p>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => startEdit(s.id)}>Edit</Button>
                        <Button type="button" variant="outline" onClick={() => onDelete(s.id)}>Delete</Button>
                      </div>
                    </div>
                    <p className="text-neutral-600">
                      Bed: {s.bedtimeIso || "-"} | Wake: {s.wakeIso || "-"}
                    </p>
                    {s.quality && <p className="text-neutral-600">Quality: {s.quality}/5</p>}
                    {s.notes && <p className="text-neutral-600">{s.notes}</p>}
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

function durationFromTimes(start?: string | null, end?: string | null) {
  if (!start || !end) return null;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return null;
  const diff = (e - s) / 60000;
  return diff > 0 ? diff : null;
}
