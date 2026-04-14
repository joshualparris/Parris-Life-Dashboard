export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Hero: today + daily briefing + stats + focus anchors */}
      <section className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r from-white via-sky-50 to-emerald-50 p-6 shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200/80 dark:bg-slate-700" />
            <div className="h-8 w-56 animate-pulse rounded-xl bg-neutral-200/80 dark:bg-slate-700" />
            <div className="h-4 w-72 animate-pulse rounded-xl bg-neutral-200/80 dark:bg-slate-700" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200/80 dark:bg-slate-700" />
              ))}
            </div>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
                  <div className="h-5 w-12 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
                <div className="h-4 max-w-[80%] w-full animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick launch + Broken */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-2">
          <div className="mb-4 h-6 w-32 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-3xl border border-red-100 bg-red-50/80 p-6 shadow-md dark:border-red-900/50 dark:bg-red-900/30">
          <div className="mb-4 h-6 w-48 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="space-y-3">
            <div className="h-14 rounded-xl bg-neutral-200/80 dark:bg-slate-700" />
            <div className="h-14 rounded-xl bg-neutral-200/80 dark:bg-slate-700" />
          </div>
        </div>
      </section>

      {/* Up next + Health */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-2">
          <div className="mb-4 h-6 w-24 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-4 h-6 w-32 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      </section>

      {/* Recent notes + Pinned + Systems */}
      <section className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="mb-4 h-6 w-28 rounded bg-neutral-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-12 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
              <div className="h-12 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
              <div className="h-12 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </section>

      {/* Recent activity + Focus cues */}
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-4 h-6 w-36 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-4 h-6 w-24 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
            <div className="h-16 rounded-2xl bg-neutral-200 dark:bg-slate-700" />
          </div>
        </div>
      </section>

      {/* Coach */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-4 h-6 w-28 rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="h-4 w-full max-w-xs rounded bg-neutral-200 dark:bg-slate-700" />
          <div className="mt-4 h-10 w-36 rounded-lg bg-neutral-200 dark:bg-slate-700" />
        </div>
      </section>
    </div>
  );
}
