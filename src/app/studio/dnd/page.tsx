"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { createNote } from "@/lib/db/actions";

const hooks = [
  "A noble hires the party to recover a stolen signet ring from a ruined keep.",
  "A village wakes to find every door painted with the same rune.",
  "A caravan disappears on the old forest road, leaving only hoofprints.",
  "A priest asks the party to escort a relic to a distant shrine.",
  "A storm reveals a buried tower with an active light at the top.",
];

const npcs = [
  "A retired adventurer who owes a debt to a thieves' guild.",
  "A scholar obsessed with a missing page from an ancient text.",
  "A ranger tracking a corrupted beast.",
  "A merchant with a map to a sunken vault.",
  "A young acolyte hiding a forbidden spellbook.",
];

const encounters = [
  "2d4 goblins and a hobgoblin scout",
  "1d6 wolves led by a dire wolf",
  "2d6 skeletons in a crumbling chapel",
  "1d4 bandits with a veteran captain",
  "A mimic disguised as a treasure chest",
];

const treasures = [
  "A pouch of 75 gp and a silver dagger",
  "A potion of healing and a scroll of protection",
  "A ring etched with the party's initials",
  "A map fragment pointing to a hidden shrine",
  "A cloak that warms in cold air",
];

const taverns = [
  "The Cinder Cat - smoky, loud, and full of bard gossip",
  "The Verdant Mug - quiet, with a greenhouse in back",
  "The Brass Lantern - dockside, full of sailors and rumors",
  "The Hollow Stag - rural, with a suspicious locked cellar",
  "The Inked Anchor - cheap ale, excellent stew, secret meetings",
];

const rewards = [
  "50 gp and a potion of healing",
  "A +1 weapon (minor) and 25 gp",
  "A scroll of protection and 40 gp",
  "A charm with one-time advantage",
  "A map fragment to a hidden shrine",
];

const levelTable = [
  { level: 1, xp: 0 },
  { level: 2, xp: 300 },
  { level: 3, xp: 900 },
  { level: 4, xp: 2700 },
  { level: 5, xp: 6500 },
  { level: 6, xp: 14000 },
  { level: 7, xp: 23000 },
  { level: 8, xp: 34000 },
  { level: 9, xp: 48000 },
  { level: 10, xp: 64000 },
  { level: 11, xp: 85000 },
  { level: 12, xp: 100000 },
  { level: 13, xp: 120000 },
  { level: 14, xp: 140000 },
  { level: 15, xp: 165000 },
  { level: 16, xp: 195000 },
  { level: 17, xp: 225000 },
  { level: 18, xp: 265000 },
  { level: 19, xp: 305000 },
  { level: 20, xp: 355000 },
];

export default function DndToolkitPage() {
  const [prompt, setPrompt] = useState("");
  const [roll, setRoll] = useState("1d20+3");
  const [result, setResult] = useState("");

  const [hook, setHook] = useState("");
  const [npc, setNpc] = useState("");
  const [encounter, setEncounter] = useState("");
  const [treasure, setTreasure] = useState("");
  const [tavern, setTavern] = useState("");
  const [seedHook, setSeedHook] = useState("");
  const [seedNpc, setSeedNpc] = useState("");
  const [seedTwist, setSeedTwist] = useState("");
  const [seedReward, setSeedReward] = useState("");

  const [xpLevel, setXpLevel] = useState(1);
  const [xpValue, setXpValue] = useState(0);

  function rollDice() {
    const output = rollExpression(roll);
    setResult(output);
  }

  function generateAll() {
    setHook(pick(hooks));
    setNpc(pick(npcs));
    setEncounter(pick(encounters));
    setTreasure(pick(treasures));
    setTavern(pick(taverns));
  }

  function generateSeed() {
    setSeedHook(pick(hooks));
    setSeedNpc(pick(npcs));
    setSeedTwist(pick(dndTwists));
    setSeedReward(pick(rewards));
  }

  async function saveSeed() {
    const content = `Hook: ${seedHook}\nNPC: ${seedNpc}\nTwist: ${seedTwist}\nReward: ${seedReward}`;
    await createNote({ title: "D&D session seed", body: content, tags: ["studio", "dnd"] });
  }

  const nextLevel = levelTable.find((entry) => entry.level === Math.min(20, xpLevel + 1));
  const currentThreshold = levelTable.find((entry) => entry.level === xpLevel)?.xp ?? 0;
  const targetXp = nextLevel?.xp ?? currentThreshold;
  const remaining = Math.max(0, targetXp - xpValue);

  const promptIdeas = useMemo(
    () => [
      "Write a short scene that reveals a secret about the villain.",
      "Describe a dungeon entrance in 2 sentences.",
      "Give the party a moral dilemma in 3 choices.",
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Studio"
        title="D&D 5e Toolkit"
        subtitle="Quick prompts, encounters, characters, spells, and dice for tabletop nights."
        tone="onDark"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dice roller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="1d20+3" />
            <Button onClick={rollDice}>Roll</Button>
            <div className="rounded-md border border-neutral-200 bg-white/80 p-3 text-sm text-neutral-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100">
              {result || "Roll results appear here."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={generateAll}>Generate a session kit</Button>
            <div className="space-y-2 text-sm text-neutral-700 dark:text-slate-200">
              <div>Hook: {hook || "-"}</div>
              <div>NPC: {npc || "-"}</div>
              <div>Encounter: {encounter || "-"}</div>
              <div>Treasure: {treasure || "-"}</div>
              <div>Tavern: {tavern || "-"}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Character builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-neutral-700 dark:text-slate-200">
            <p>Create characters, track levels, and update stats.</p>
            <a
              href="/studio/dnd/character"
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
            >
              Open character builder
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spellbook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-neutral-700 dark:text-slate-200">
            <p>Track spells, levels, schools, and prepared status.</p>
            <a
              href="/studio/dnd/spells"
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
            >
              Open spellbook
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Encounter & initiative</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-neutral-700 dark:text-slate-200">
            <p>Build encounters, total XP, and manage initiative order.</p>
            <a
              href="/studio/dnd/encounter"
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
            >
              Open encounter tracker
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scene prompt scratchpad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {promptIdeas.map((idea) => (
              <Button key={idea} variant="outline" onClick={() => setPrompt(idea)}>
                {idea}
              </Button>
            ))}
          </div>
          <textarea
            className="min-h-[140px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
            placeholder="Write your scene, read-aloud text, or combat beats..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>D&D session seed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-700 dark:text-slate-200">
            <Button onClick={generateSeed}>Generate seed</Button>
            <div className="space-y-2">
              <div>Hook: {seedHook || "-"}</div>
              <div>NPC: {seedNpc || "-"}</div>
              <div>Twist: {seedTwist || "-"}</div>
              <div>Reward: {seedReward || "-"}</div>
            </div>
            <Button variant="outline" onClick={saveSeed} disabled={!seedHook}>
              Save to notes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>XP milestone helper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-700 dark:text-slate-200">
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                type="number"
                placeholder="Level"
                value={xpLevel}
                onChange={(e) => setXpLevel(Math.max(1, Math.min(20, Number(e.target.value || 1))))}
              />
              <Input
                type="number"
                placeholder="Current XP"
                value={xpValue}
                onChange={(e) => setXpValue(Math.max(0, Number(e.target.value || 0)))}
              />
            </div>
            <div>
              Level {xpLevel} threshold: {currentThreshold} XP
            </div>
            <div>
              Next level target: {targetXp} XP ({remaining} XP to go)
            </div>
            <div className="flex flex-wrap gap-2">
              {[25, 50, 100, 250].map((amt) => (
                <Button key={amt} variant="outline" onClick={() => setXpValue((v) => v + amt)}>
                  +{amt} XP
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollExpression(value: string) {
  const cleaned = value.replace(/\s/g, "").toLowerCase();
  const match = cleaned.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) return "Invalid roll. Try 1d20+3.";
  const count = Number(match[1] || "1");
  const sides = Number(match[2]);
  const mod = Number(match[3] || "0");
  const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides));
  const total = rolls.reduce((a, b) => a + b, 0) + mod;
  return `Rolls: ${rolls.join(", ")}${mod ? ` ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)}` : ""} = ${total}`;
}
