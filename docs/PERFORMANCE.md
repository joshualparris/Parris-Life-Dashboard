# JoshHub performance guide

Ways to keep the app fast as it grows.

## Done

- **Dashboard shell first** – Full-page skeleton in `loading.tsx`; dashboard renders layout immediately and streams in per-section loading states (stats, up next, health, notes, pinned, recent) so no single blank wait.
- **Route-level code splitting** – Next.js App Router automatically splits each `page.tsx` into its own chunk.

## High impact (recommended next)

### 1. Lazy-load Global Search

**Why:** The search component pulls in `cmdk`, the full `apps` array (~1400 lines), `lifeAreas`, and many Dexie hooks. It’s in the root layout, so it’s on every page and increases the main JS bundle.

**How:** Use `next/dynamic` to load `GlobalSearch` with `ssr: false` and a small placeholder (e.g. “⌘K” or a search icon) so the header doesn’t shift. The search chunk loads in parallel with the rest; first Cmd+K or click still works once the chunk is there.

**Files:** `src/app/layout.tsx` (dynamic import), optional `src/components/global-search-wrapper.tsx` (placeholder + dynamic).

### 2. Dynamic import Recharts on health pages

**Why:** Recharts is large and only used on `/health/sleep`, `/health/movement`, and `/health/metrics`. Including it in those route chunks is fine, but we can avoid pulling it into shared bundles by loading the chart UI only when needed.

**How:** Extract the chart into a small client component (e.g. `SleepChart`, `MovementChart`, `MetricsChart`) and load it with `dynamic(..., { ssr: false, loading: () => <ChartSkeleton /> })`. Recharts then lives only in those route chunks and doesn’t block first paint.

**Files:** e.g. `src/components/health/SleepChart.tsx`, same for movement/metrics; use `dynamic()` in the corresponding page.

### 3. Optimize font loading

**Why:** Custom fonts can delay first paint if the browser waits for them.

**How:** In `layout.tsx`, pass `display: 'swap'` (or `'optional'`) to `Geist` and `Geist_Mono` in `next/font/google`. Text appears immediately with system fallback; Geist swaps in when ready (or is skipped if `optional` and load is slow).

**Files:** `src/app/layout.tsx`.

## Medium impact

### 4. Keep apps data out of the critical path

**Why:** `src/data/apps.ts` is a large static array and is imported by the layout (via GlobalSearch), dashboard (quick launch, broken), apps page, projects, etc. Lazy-loading Global Search (above) already defers it for the layout; dashboard only needs a small slice.

**How:** Optionally export a minimal `getDashboardApps()` (e.g. first 6 + broken) from `apps.ts` and have the dashboard import only that, or a tiny module that re-exports that slice, so the full list isn’t parsed on dashboard load. Apps page can still import the full list.

### 5. Virtualize long lists

**Why:** Notes, tasks, and apps pages render the full list. With hundreds of items, DOM and scroll can get heavy.

**How:** Use a virtual list (e.g. `@tanstack/react-virtual` or `react-window`) so only visible rows are in the DOM. Apply first to the longest lists (e.g. apps grid, notes list).

### 6. Prefetch key routes

**Why:** Next.js `<Link>` prefetches by default; you can tune which routes prefetch so the next navigation is instant.

**How:** Use `prefetch={true}` on high-traffic links (e.g. Dashboard, Capture, Tasks). For rarely used links, `prefetch={false}` can reduce bandwidth.

## Lower impact / polish

### 7. Theme toggle in a single dynamic

**Why:** `ThemeInitializer` and `ThemeToggle` are in the layout; they’re small but could be grouped.

**How:** Wrap both in one client component and load it with `dynamic(..., { ssr: false })` so theme logic lives in a small chunk. Only do this if you’ve already done the items above.

### 8. Dexie / IndexedDB

**Why:** DB open and first query add a bit of latency.

**How:** Ensure the DB is opened once and reused. For very heavy reads, consider moving to a Web Worker later; for most cases, current setup is fine.

### 9. Images (if you add them later)

**Why:** Unoptimized images are a common performance cost.

**How:** Use Next.js `<Image>` (or the App Router image component) with sensible `sizes`; prefer modern formats (e.g. WebP/AVIF) and lazy loading for below-the-fold assets.

### 10. Bundle analysis

**Why:** See what’s actually in each chunk.

**How:** Run `npm run build` and use `@next/bundle-analyzer` (or the built-in Turbopack/Webpack stats) to inspect chunk sizes and find large dependencies to lazy-load or replace.

---

**Priority order:** Do (1) and (2) for the biggest win with little risk; then (3). After that, (4)–(6) as the app and data grow.
