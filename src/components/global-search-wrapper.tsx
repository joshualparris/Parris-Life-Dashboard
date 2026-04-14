"use client";

import dynamic from "next/dynamic";

const GlobalSearch = dynamic(
  () => import("@/components/global-search").then((mod) => ({ default: mod.GlobalSearch })),
  {
    ssr: false,
    loading: () => (
      <span
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        aria-hidden
      >
        Search ⌘K
      </span>
    ),
  }
);

export function GlobalSearchWrapper() {
  return <GlobalSearch />;
}
