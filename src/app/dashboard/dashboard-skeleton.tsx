import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonRow({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={`line-${idx}`}
          className="h-3 w-full animate-pulse rounded bg-neutral-200 dark:bg-slate-700"
        />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r from-white via-sky-50 to-emerald-50 p-6 shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
            <div className="h-8 w-56 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
            <div className="h-4 w-64 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
            <div className="flex flex-wrap gap-2">
              <div className="h-9 w-28 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
              <div className="h-9 w-24 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
              <div className="h-9 w-24 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`stat-${idx}`}
                className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200 dark:bg-slate-700" />
                <SkeletonRow lines={2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-white/70 bg-white/90 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <CardHeader>
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`ql-${idx}`}
                className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <SkeletonRow lines={3} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/90 shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <CardHeader>
            <div className="h-4 w-40 animate-pulse rounded bg-neutral-200 dark:bg-slate-700" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`broken-${idx}`}
                className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <SkeletonRow lines={2} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
