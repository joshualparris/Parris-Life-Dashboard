"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

type Monster = {
  id: string;
  name: string;
  count: number;
  xp: number;
};

type Combatant = {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  ac: number;
  notes: string;
};

const STORAGE_KEY = "joshhub:dnd-encounter";

export default function EncounterPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [xp, setXp] = useState(50);

  const [combatName, setCombatName] = useState("");
  const [combatInit, setCombatInit] = useState(10);
  const [combatHp, setCombatHp] = useState(10);
  const [combatAc, setCombatAc] = useState(10);
  const [combatNotes, setCombatNotes] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      setMonsters(data.monsters ?? []);
      setCombatants(data.combatants ?? []);
    } catch {
      setMonsters([]);
      setCombatants([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ monsters, combatants })
    );
  }, [monsters, combatants]);

  const totalXp = useMemo(
    () => monsters.reduce((sum, m) => sum + m.count * m.xp, 0),
    [monsters]
  );

  const initiativeOrder = useMemo(
    () => [...combatants].sort((a, b) => b.initiative - a.initiative),
    [combatants]
  );

  function addMonster() {
    if (!name.trim()) return;
    setMonsters((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), count, xp },
    ]);
    setName("");
    setCount(1);
    setXp(50);
  }

  function addCombatant() {
    if (!combatName.trim()) return;
    setCombatants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: combatName.trim(),
        initiative: combatInit,
        hp: combatHp,
        ac: combatAc,
        notes: combatNotes,
      },
    ]);
    setCombatName("");
    setCombatInit(10);
    setCombatHp(10);
    setCombatAc(10);
    setCombatNotes("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="D&D 5e"
        title="Encounter & Initiative"
        subtitle="Track encounter XP and combat order."
        tone="onDark"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Encounter builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
              <Input placeholder="Monster" value={name} onChange={(e) => setName(e.target.value)} />
              <Input
                type="number"
                placeholder="Count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value || 0))}
              />
              <Input
                type="number"
                placeholder="XP each"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value || 0))}
              />
            </div>
            <Button onClick={addMonster}>Add monster</Button>
            <div className="text-sm text-neutral-700 dark:text-slate-200">
              Total XP: <strong>{totalXp}</strong>
            </div>
            {monsters.length === 0 ? (
              <p className="text-sm text-neutral-600">No monsters added.</p>
            ) : (
              monsters.map((m) => (
                <div
                  key={m.id}
                  className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-neutral-900">
                      {m.name} x{m.count}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMonsters((prev) => prev.filter((x) => x.id !== m.id))}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500">XP each: {m.xp}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Initiative tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                placeholder="Combatant"
                value={combatName}
                onChange={(e) => setCombatName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Initiative"
                value={combatInit}
                onChange={(e) => setCombatInit(Number(e.target.value || 0))}
              />
              <Input
                type="number"
                placeholder="HP"
                value={combatHp}
                onChange={(e) => setCombatHp(Number(e.target.value || 0))}
              />
              <Input
                type="number"
                placeholder="AC"
                value={combatAc}
                onChange={(e) => setCombatAc(Number(e.target.value || 0))}
              />
              <Input
                className="md:col-span-2"
                placeholder="Notes"
                value={combatNotes}
                onChange={(e) => setCombatNotes(e.target.value)}
              />
            </div>
            <Button onClick={addCombatant}>Add combatant</Button>
            {initiativeOrder.length === 0 ? (
              <p className="text-sm text-neutral-600">No combatants yet.</p>
            ) : (
              initiativeOrder.map((c) => (
                <div
                  key={c.id}
                  className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-neutral-900">
                      {c.name} (Init {c.initiative})
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setCombatants((prev) => prev.filter((x) => x.id !== c.id))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    HP {c.hp} · AC {c.ac} {c.notes ? `· ${c.notes}` : ""}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
