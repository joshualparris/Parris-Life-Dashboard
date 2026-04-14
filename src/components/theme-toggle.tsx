"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "ember" | "forest" | "dungeon";
const STORAGE_KEY = "joshhub-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const darkLike = theme !== "light";
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", darkLike);
  document.body.classList.toggle("dark", darkLike);
}

export function ThemeInitializer() {
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || "light";
    applyTheme(stored);
  }, []);
  return null;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || "light";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function toggle() {
    const order: Theme[] = ["light", "dark", "ember", "forest", "dungeon"];
    const index = order.indexOf(theme);
    const next = order[(index + 1) % order.length];
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={theme}
        onChange={(e) => {
          const next = e.target.value as Theme;
          setTheme(next);
          localStorage.setItem(STORAGE_KEY, next);
          applyTheme(next);
        }}
        className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 shadow-sm hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
        aria-label="Theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="ember">Ember</option>
        <option value="forest">Forest</option>
        <option value="dungeon">Dungeon</option>
      </select>
      <button
        type="button"
        onClick={toggle}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
      >
        Next theme
      </button>
    </div>
  );
}
