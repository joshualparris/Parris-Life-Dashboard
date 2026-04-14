"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

type Spell = {
  id: string;
  name: string;
  level: number;
  school: string;
  prepared: boolean;
  notes: string;
};

const STORAGE_KEY = "joshhub:dnd-spells";

export default function SpellbookPage() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);
  const [school, setSchool] = useState("");
  const [notes, setNotes] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterPrepared, setFilterPrepared] = useState<string>("all");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setSpells(JSON.parse(raw));
    } catch {
      setSpells([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spells));
  }, [spells]);

  const filtered = useMemo(() => {
    return spells.filter((spell) => {
      const matchesLevel = filterLevel === "all" || String(spell.level) === filterLevel;
      const matchesPrepared =
        filterPrepared === "all" ||
        (filterPrepared === "prepared" && spell.prepared) ||
        (filterPrepared === "unprepared" && !spell.prepared);
      return matchesLevel && matchesPrepared;
    });
  }, [spells, filterLevel, filterPrepared]);

  function addSpell() {
    if (!name.trim()) return;
    setSpells((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        level,
        school,
        prepared: false,
        notes,
      },
    ]);
    setName("");
    setLevel(0);
    setSchool("");
    setNotes("");
  }

  function togglePrepared(id: string) {
    setSpells((prev) =>
      prev.map((spell) => (spell.id === id ? { ...spell, prepared: !spell.prepared } : spell))
    );
  }

  function deleteSpell(id: string) {
    if (!confirm("Delete this spell?")) return;
    setSpells((prev) => prev.filter((spell) => spell.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="D&D 5e"
        title="Spellbook"
        subtitle="Track spells, levels, schools, and prepared status."
        tone="onDark"
      />

      <Card>
        <CardHeader>
          <CardTitle>Add spell</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Spell name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              type="number"
              placeholder="Level"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value || 0))}
            />
            <Input
              placeholder="School"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            <Input
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={addSpell}>Add spell</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spell list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="all">All levels</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={String(i)}>
                  Level {i}
                </option>
              ))}
            </select>
            <select
              value={filterPrepared}
              onChange={(e) => setFilterPrepared(e.target.value)}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="all">All</option>
              <option value="prepared">Prepared</option>
              <option value="unprepared">Unprepared</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-neutral-600">No spells yet.</p>
          ) : (
            filtered.map((spell) => (
              <div
                key={spell.id}
                className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {spell.name} (Lv {spell.level || 0})
                    </p>
                    <p className="text-xs text-neutral-500">
                      {spell.school || "Unknown school"} {spell.notes ? `· ${spell.notes}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => togglePrepared(spell.id)}>
                      {spell.prepared ? "Prepared" : "Prepare"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteSpell(spell.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
