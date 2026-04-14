"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";

type Character = {
  id: string;
  name: string;
  className: string;
  race: string;
  level: number;
  xp: number;
  hp: number;
  ac: number;
  stats: Record<"str" | "dex" | "con" | "int" | "wis" | "cha", number>;
  notes: string;
  preparedOverride?: number | null;
};

const STORAGE_KEY = "joshhub:dnd-characters";

export default function CharacterBuilderPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Character>(() => emptyCharacter());

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setCharacters(JSON.parse(raw));
    } catch {
      setCharacters([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  const sorted = useMemo(
    () => [...characters].sort((a, b) => b.level - a.level || a.name.localeCompare(b.name)),
    [characters]
  );

  function updateField<K extends keyof Character>(key: K, value: Character[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateStat(stat: keyof Character["stats"], value: number) {
    setForm((prev) => ({ ...prev, stats: { ...prev.stats, [stat]: value } }));
  }

  function startEdit(character: Character) {
    setEditingId(character.id);
    setForm(character);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyCharacter());
  }

  function saveCharacter() {
    if (!form.name.trim()) return;
    if (editingId) {
      setCharacters((prev) => prev.map((c) => (c.id === editingId ? form : c)));
    } else {
      setCharacters((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    }
    resetForm();
  }

  function deleteCharacter(id: string) {
    if (!confirm("Delete this character?")) return;
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
  }

  function abilityMod(score: number) {
    return Math.floor((score - 10) / 2);
  }

  function autoPreparedPerDay(c: Character): number | null {
    const cls = c.className.toLowerCase();
    if (!c.level || c.level < 1) return null;
    // Prepared-style classes: Cleric/Druid/Ranger (WIS), Paladin (CHA), Wizard (INT)
    if (["cleric", "druid", "ranger"].some((k) => cls.includes(k))) {
      return c.level + abilityMod(c.stats.wis ?? 10);
    }
    if (cls.includes("paladin")) {
      return c.level + abilityMod(c.stats.cha ?? 10);
    }
    if (cls.includes("wizard")) {
      return c.level + abilityMod(c.stats.int ?? 10);
    }
    // Bard/Sorcerer/Warlock use known spells style, not prepared
    return null;
  }

  function exportMarkdown(c: Character) {
    const lines: string[] = [];
    const autoPrep = autoPreparedPerDay(c);
    const prepared = c.preparedOverride ?? autoPrep;
    lines.push(`# ${c.name || "Character"}`);
    lines.push(`Class: ${c.className || "Unknown"} · Race: ${c.race || "Unknown"} · Level: ${c.level}`);
    lines.push(`XP: ${c.xp} · HP: ${c.hp} · AC: ${c.ac}`);
    lines.push(
      `Stats: STR ${c.stats.str} DEX ${c.stats.dex} CON ${c.stats.con} INT ${c.stats.int} WIS ${c.stats.wis} CHA ${c.stats.cha}`
    );
    if (prepared !== null) {
      lines.push(`Prepared spells per day: ${prepared} ${c.preparedOverride != null ? "(override)" : "(auto)"}`);
    } else {
      lines.push(`Prepared spells per day: N/A (known-spells class)`);
    }
    if (c.notes?.trim()) {
      lines.push("");
      lines.push("## Notes");
      lines.push(c.notes.trim());
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.name || "character"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="D&D 5e"
        title="Character Builder"
        subtitle="Track characters, levels, and stats locally."
        tone="onDark"
      />

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit character" : "New character"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              placeholder="Class"
              value={form.className}
              onChange={(e) => updateField("className", e.target.value)}
            />
            <Input
              placeholder="Race"
              value={form.race}
              onChange={(e) => updateField("race", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Level"
              value={form.level}
              onChange={(e) => updateField("level", Number(e.target.value || 0))}
            />
            <Input
              type="number"
              placeholder="XP"
              value={form.xp}
              onChange={(e) => updateField("xp", Number(e.target.value || 0))}
            />
            <Input
              type="number"
              placeholder="HP"
              value={form.hp}
              onChange={(e) => updateField("hp", Number(e.target.value || 0))}
            />
            <Input
              type="number"
              placeholder="AC"
              value={form.ac}
              onChange={(e) => updateField("ac", Number(e.target.value || 0))}
            />
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            {(["str", "dex", "con", "int", "wis", "cha"] as const).map((stat) => (
              <Input
                key={stat}
                type="number"
                placeholder={stat.toUpperCase()}
                value={form.stats[stat]}
                onChange={(e) => updateStat(stat, Number(e.target.value || 0))}
              />
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <Input
              type="number"
              placeholder={`Prepared per day (auto: ${
                (function () {
                  const auto = autoPreparedPerDay(form);
                  return auto != null ? auto : "N/A";
                })()
              })`}
              value={form.preparedOverride ?? ""}
              onChange={(e) =>
                updateField(
                  "preparedOverride",
                  e.target.value === "" ? null : Number(e.target.value || 0)
                )
              }
            />
          </div>

          <Textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={saveCharacter}>{editingId ? "Save" : "Add character"}</Button>
            <Button variant="ghost" onClick={resetForm}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Party roster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.length === 0 ? (
            <p className="text-sm text-neutral-600">No characters yet.</p>
          ) : (
            sorted.map((character) => (
              <div
                key={character.id}
                className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {character.name} (Lv {character.level} {character.className || "Adventurer"})
                    </p>
                    <p className="text-xs text-neutral-500">
                      {character.race || "Unknown race"} · HP {character.hp} · AC {character.ac} · XP{" "}
                      {character.xp}
                    </p>
                    <p className="text-xs text-neutral-600">
                      Prepared/day:{" "}
                      {character.preparedOverride != null
                        ? `${character.preparedOverride} (override)`
                        : (autoPreparedPerDay(character) ?? "N/A")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(character)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteCharacter(character.id)}>
                      Delete
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportMarkdown(character)}>
                      Export MD
                    </Button>
                  </div>
                </div>
                {character.notes && <p className="text-xs text-neutral-600">{character.notes}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function emptyCharacter(): Character {
  return {
    id: "",
    name: "",
    className: "",
    race: "",
    level: 1,
    xp: 0,
    hp: 0,
    ac: 10,
    stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    notes: "",
    preparedOverride: null,
  };
}
