"use client";

import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, deleteEvent, updateEvent, useEvents } from "@/lib/db/events";

export default function CalendarPage() {
  const events = useEvents();
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");

  const upcoming = useMemo(
    () =>
      (events ?? [])
        .filter((e) => e.endIso >= new Date().toISOString())
        .sort((a, b) => a.startIso.localeCompare(b.startIso)),
    [events]
  );

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!title || !start || !end) return;
    await createEvent({
      title,
      startIso: toIsoFromLocalInput(start),
      endIso: toIsoFromLocalInput(end),
      location,
      notes,
      tags: parseTags(tags),
    });
    setTitle("");
    setStart("");
    setEnd("");
    setLocation("");
    setNotes("");
    setTags("");
  }

  function startEdit(ev: (typeof upcoming)[number]) {
    setEditingId(ev.id);
    setEditTitle(ev.title);
    setEditStart(toLocalInputValue(ev.startIso));
    setEditEnd(toLocalInputValue(ev.endIso));
    setEditLocation(ev.location ?? "");
    setEditNotes(ev.notes ?? "");
    setEditTags((ev.tags ?? []).join(", "));
  }

  async function onSaveEdit() {
    if (!editingId) return;
    if (!editTitle || !editStart || !editEnd) return;
    await updateEvent(editingId, {
      title: editTitle,
      startIso: toIsoFromLocalInput(editStart),
      endIso: toIsoFromLocalInput(editEnd),
      location: editLocation,
      notes: editNotes,
      tags: parseTags(editTags),
    });
    setEditingId(null);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await deleteEvent(id);
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Calendar</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Manual events</h1>
        <p className="text-neutral-600">Add local events and see upcoming agenda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onAdd}>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Textarea
              className="md:col-span-2"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="md:col-span-2">
              <Button type="submit">Add event</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcoming.length === 0 ? (
            <p className="text-sm text-neutral-600">No upcoming events.</p>
          ) : (
            upcoming.map((ev) => (
              <div
                key={ev.id}
                className="rounded-md border border-neutral-200 bg-white px-3 py-3 text-sm"
              >
                {editingId === ev.id ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <Input
                      type="datetime-local"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                    />
                    <Input
                      type="datetime-local"
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                    />
                    <Input
                      placeholder="Tags (comma-separated)"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                    />
                    <Textarea
                      className="md:col-span-2"
                      placeholder="Notes"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                    />
                    <div className="md:col-span-2 flex flex-wrap gap-2">
                      <Button type="button" onClick={onSaveEdit}>
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onDelete(ev.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-neutral-900">{ev.title}</p>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => startEdit(ev)}>
                          Edit
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onDelete(ev.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-neutral-600">
                      {new Date(ev.startIso).toLocaleString()} -{" "}
                      {new Date(ev.endIso).toLocaleString()}
                    </p>
                    {ev.location && <p className="text-neutral-600">Location: {ev.location}</p>}
                    {ev.tags?.length ? (
                      <p className="text-neutral-600">Tags: {ev.tags.join(", ")}</p>
                    ) : null}
                    {ev.notes && <p className="text-neutral-600">{ev.notes}</p>}
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

function parseTags(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toIsoFromLocalInput(value: string) {
  return new Date(value).toISOString();
}

function toLocalInputValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}
