"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { AppWindow, Calendar, CheckCircle2, FileText, Home, Layers, Link as LinkIcon, Plus, Search, Timer } from "lucide-react";

import type { CatalogItem } from "@/data/apps";
import { apps } from "@/data/apps";
import type { LifeArea } from "@/data/life";
import { lifeAreas } from "@/data/life";
import { addPin, createBookmark, createNote, createTask, removePin } from "@/lib/db/actions";
import { loadPinnedLife } from "@/lib/pins";
import { useBookmarks, useNotes, useRoutines, useTasks, useActivities, useDailyMetrics } from "@/lib/db/hooks";
import { useMetrics } from "@/lib/db/health";
import { useEvents } from "@/lib/db/events";

type Result =
  | { type: "app"; item: CatalogItem }
  | { type: "life"; item: LifeArea }
  | { type: "route"; label: string; href: string }
  | { type: "note"; id: string; title: string; snippet: string }
  | { type: "task"; id: string; title: string }
  | { type: "routine"; id: string; title: string }
  | { type: "bookmark"; id: string; title: string; url: string }
  | { type: "event"; id: string; title: string; when: string }
  | { type: "map"; id: string; title: string; section: string }
  | { type: "metric"; id: string; label: string; value: string }
  | { type: "daily"; date: string; summary: string }
  | { type: "activity"; id: string; sport: string; summary: string }
  | { type: "action"; label: string; run: () => Promise<void> | void };

const routes = [
  { label: "Home", href: "/" },
  { label: "Apps", href: "/apps" },
  { label: "Projects", href: "/projects" },
  { label: "Life", href: "/life" },
  { label: "Capture", href: "/capture" },
  { label: "Notes", href: "/notes" },
  { label: "Tasks", href: "/tasks" },
  { label: "Routines", href: "/routines" },
  { label: "Settings / Backups", href: "/settings/backups" },
  { label: "Corporate Game", href: "/games/corporate" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pinned, setPinned] = useState<string[]>([]);
  const notes = useNotes();
  const tasks = useTasks();
  const routines = useRoutines();
  const bookmarks = useBookmarks();
  const events = useEvents();
  const metrics = useMetrics();
  const activities = useActivities();
  const daily = useDailyMetrics();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNote({ title: "New note" });
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        createTask({ title: "New task" });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    loadPinnedLife().then(setPinned);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.toLowerCase();
    const appMatches = apps.filter((app) =>
      `${app.name} ${app.tags.join(" ")} ${app.notes ?? ""}`.toLowerCase().includes(q)
    );
    const lifeMatches = lifeAreas.filter((area) =>
      `${area.title} ${area.intro} ${area.sections.map((s) => `${s.heading} ${s.body}`).join(" ")}`.toLowerCase().includes(q)
    );
    const routeMatches = routes.filter((r) => r.label.toLowerCase().includes(q));
    const noteMatches = (notes ?? []).filter((n) =>
      `${n.title} ${n.body} ${n.tags.join(" ")} ${n.lifeAreaSlug ?? ""}`.toLowerCase().includes(q)
    );
    const taskMatches = (tasks ?? []).filter((t) =>
      `${t.title} ${t.tags.join(" ")}`.toLowerCase().includes(q)
    );
    const routineMatches = (routines ?? []).filter((r) =>
      `${r.name} ${r.tags.join(" ")}`.toLowerCase().includes(q)
    );
    const bookmarkMatches = (bookmarks ?? []).filter((b) =>
      `${b.title} ${b.url} ${b.tags.join(" ")}`.toLowerCase().includes(q)
    );
    const eventMatches = (events ?? []).filter((e) =>
      `${e.title} ${e.location ?? ""} ${e.notes ?? ""} ${(e.tags ?? []).join(" ")}`.toLowerCase().includes(q)
    );
    const mapMatches = (notes ?? []).filter(
      (n) => n.nodeId && `${n.title} ${n.body}`.toLowerCase().includes(q)
    );
    const metricMatches = (metrics ?? []).filter((m) =>
      `${m.metricType} ${m.value} ${m.unit} ${m.notes ?? ""}`.toLowerCase().includes(q)
    );
    const dailyMatches = (daily ?? []).filter((d) =>
      `${d.date} ${d.distanceM ?? 0} ${d.runDistanceM ?? 0} ${d.steps ?? ""}`.toString().toLowerCase().includes(q)
    );
    const activityMatches = (activities ?? []).filter((a) =>
      `${a.sport} ${a.distanceM ?? 0} ${a.durationSec ?? 0}`.toString().toLowerCase().includes(q)
    );

    const actionMatches: Result[] = [
      { type: "action", label: "New Note", run: async () => { await createNote({ title: "New note" }); } },
      { type: "action", label: "New Task", run: async () => { await createTask({ title: "New task" }); } },
      {
        type: "action",
        label: "Add Bookmark",
        run: async () => { await createBookmark({ title: "New link", url: "https://", tags: [] }); },
      },
      {
        type: "action",
        label: "Open Capture",
        run: async () => {
          window.location.href = "/capture";
        },
      },
      {
        type: "action",
        label: "Log Movement",
        run: async () => {
          window.location.href = "/health/movement";
        },
      },
      {
        type: "action",
        label: "Log Metric",
        run: async () => {
          window.location.href = "/health/metrics";
        },
      },
    ];

    return [
      ...routeMatches.map((r) => ({ type: "route" as const, label: r.label, href: r.href })),
      ...appMatches.map((item) => ({ type: "app" as const, item })),
      ...lifeMatches.map((item) => ({ type: "life" as const, item })),
      ...noteMatches.map((n) => ({
        type: "note" as const,
        id: n.id,
        title: n.title || "Untitled",
        snippet: n.body?.slice(0, 80) ?? "",
      })),
      ...mapMatches.map((n) => ({
        type: "map" as const,
        id: n.id,
        title: n.title || "Untitled",
        section: n.nodeId ?? "map",
      })),
      ...taskMatches.map((t) => ({ type: "task" as const, id: t.id, title: t.title })),
      ...routineMatches.map((r) => ({ type: "routine" as const, id: r.id, title: r.name })),
      ...bookmarkMatches.map((b) => ({
        type: "bookmark" as const,
        id: b.id,
        title: b.title || b.url,
        url: b.url,
      })),
      ...eventMatches.map((e) => ({
        type: "event" as const,
        id: e.id,
        title: e.title,
        when: new Date(e.startIso).toLocaleString(),
      })),
      ...metricMatches.map((m) => ({
        type: "metric" as const,
        id: m.id,
        label: `${m.metricType}`,
        value: `${m.value} ${m.unit}`,
      })),
      ...dailyMatches.map((d) => ({
        type: "daily" as const,
        date: d.date,
        summary: `runs: ${d.runsCount ?? 0}, distance: ${(d.distanceM ?? 0) / 1000} km, steps: ${d.steps ?? "-"}`,
      })),
      ...activityMatches.map((a) => ({
        type: "activity" as const,
        id: a.id,
        sport: a.sport,
        summary: `${(a.distanceM ?? 0) / 1000} km, ${(a.durationSec ?? 0) / 60} min`,
      })),
      ...actionMatches,
    ];
  }, [query, notes, tasks, routines, bookmarks, events, metrics, activities, daily]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search (Ctrl+K)"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          color: "var(--fg)",
          padding: "8px 12px",
        }}
      >
        <Search className="h-4 w-4" />
        <span style={{ display: "none" }} className="sm:inline">Search...</span>
        <kbd style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", borderRadius: 6, padding: "2px 6px", fontSize: 10, fontWeight: 600 }}>
          Ctrl+K
        </kbd>
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "48px 16px",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 720,
              borderRadius: 10,
              background: "var(--surface)",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <Command
              label="Global search"
              shouldFilter={false}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border)", padding: "12px 16px" }}>
                <Search className="h-4 w-4" />
                <CommandInput
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search apps, notes, tasks, life areas..."
                  className="w-full"
                  style={{ background: "transparent", color: "var(--fg)", fontSize: 14, outline: "none" }}
                  autoFocus
                />
              </div>
              <CommandList className="max-h-[420px] overflow-y-auto" style={{ color: "var(--fg)" }}>
                <CommandEmpty className="px-4 py-3 text-sm" style={{ color: "var(--muted-fg)" }}>
                  No results.
                </CommandEmpty>
                <CommandGroup heading="Routes">
                  {results
                    .filter((r): r is Extract<Result, { type: "route" }> => r.type === "route")
                    .map((r) => (
                      <CommandItem key={r.href} onSelect={() => setOpen(false)} asChild>
                        <Link href={r.href} className="flex items-center gap-2 px-4 py-2">
                          <Home className="h-4 w-4" />
                          <span>{r.label}</span>
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Apps & Games">
                  {results
                    .filter((r): r is Extract<Result, { type: "app" }> => r.type === "app")
                    .map((r) => (
                      <CommandItem key={r.item.id} onSelect={() => setOpen(false)} asChild>
                        <Link
                          href={`/apps/${r.item.id}`}
                          className="flex items-center gap-2 px-4 py-2"
                        >
                          <AppWindow className="h-4 w-4" />
                          <span>{r.item.name}</span>
                          <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.item.category}</span>
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Life Areas">
                  {results
                    .filter((r): r is Extract<Result, { type: "life" }> => r.type === "life")
                    .map((r) => (
                      <CommandItem key={r.item.slug} onSelect={() => setOpen(false)} className="px-0">
                        <div className="flex w-full items-center gap-2 px-4 py-2">
                          <Link
                            href={`/life/${r.item.slug}`}
                            className="flex flex-1 items-center gap-2 hover:underline rounded-sm"
                          >
                            <Layers className="h-4 w-4" />
                            <span>{r.item.title}</span>
                            <span className="text-xs" style={{ color: "var(--muted-fg)" }}>
                              {r.item.tags.slice(0, 2).join(", ")}
                            </span>
                          </Link>
                          <button
                            type="button"
                            className="text-xs underline"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (pinned.includes(r.item.slug)) {
                                await removePin(r.item.slug);
                              } else {
                                await addPin(r.item.slug);
                              }
                              setPinned(await loadPinnedLife());
                            }}
                          >
                            {pinned.includes(r.item.slug) ? "Unpin" : "Pin"}
                          </button>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Notes">
                  {results
                    .filter((r): r is Extract<Result, { type: "note" }> => r.type === "note")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} asChild>
                        <Link href={`/notes/${r.id}`} className="flex items-center gap-2 px-4 py-2">
                          <FileText className="h-4 w-4" />
                          <span>{r.title}</span>
                          {r.snippet ? <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.snippet}</span> : null}
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Map Notes">
                  {results
                    .filter((r): r is Extract<Result, { type: "map" }> => r.type === "map")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} asChild>
                        <Link href="/map" className="flex items-center gap-2 px-4 py-2">
                          <Layers className="h-4 w-4" />
                          <span>{r.title}</span>
                          <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.section}</span>
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Tasks">
                  {results
                    .filter((r): r is Extract<Result, { type: "task" }> => r.type === "task")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} asChild>
                        <Link href="/tasks" className="flex items-center gap-2 px-4 py-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{r.title}</span>
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Routines">
                  {results
                    .filter((r): r is Extract<Result, { type: "routine" }> => r.type === "routine")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} asChild>
                        <Link href="/routines" className="flex items-center gap-2 px-4 py-2">
                          <Timer className="h-4 w-4" />
                          <span>{r.title}</span>
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Bookmarks">
                  {results
                    .filter((r): r is Extract<Result, { type: "bookmark" }> => r.type === "bookmark")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} asChild>
                        <a href={r.url} className="flex items-center gap-2 px-4 py-2">
                          <LinkIcon className="h-4 w-4" />
                          <span>{r.title}</span>
                        </a>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Events">
                  {results
                    .filter((r): r is Extract<Result, { type: "event" }> => r.type === "event")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} asChild>
                        <Link href="/calendar" className="flex items-center gap-2 px-4 py-2">
                          <Calendar className="h-4 w-4" />
                          <span>{r.title}</span>
                          <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.when}</span>
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Telemetry">
                  {results
                    .filter((r): r is Extract<Result, { type: "metric" }> => r.type === "metric")
                    .slice(0, 10)
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span>{r.label}</span>
                          <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.value}</span>
                        </div>
                      </CommandItem>
                    ))}
                  {results
                    .filter((r): r is Extract<Result, { type: "daily" }> => r.type === "daily")
                    .slice(0, 5)
                    .map((r) => (
                      <CommandItem key={r.date} onSelect={() => setOpen(false)} className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span>{r.date}</span>
                          <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.summary}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Activities">
                  {results
                    .filter((r): r is Extract<Result, { type: "activity" }> => r.type === "activity")
                    .slice(0, 10)
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => setOpen(false)} className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span>{r.sport}</span>
                          <span className="text-xs" style={{ color: "var(--muted-fg)" }}>{r.summary}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Actions">
                  {results
                    .filter((r): r is Extract<Result, { type: "action" }> => r.type === "action")
                    .map((r) => (
                      <CommandItem
                        key={r.label}
                        onSelect={async () => {
                          await r.run();
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{r.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
