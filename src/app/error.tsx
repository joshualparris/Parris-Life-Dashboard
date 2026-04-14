"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("JoshHub error boundary:", error);
  }, [error]);

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="text-sm text-neutral-600 dark:text-slate-300">
        Try again, or refresh the page if the issue persists.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        Retry
      </button>
    </div>
  );
}
