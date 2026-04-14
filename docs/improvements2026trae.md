# JoshHub Improvements (2026)

1. Add root layout with metadata and global styles.
2. Create a useful home page with navigation.
3. Add status page showing runtime info.
4. Provide API ping endpoint returning JSON.
5. Add health page with simple OK message.
6. Add not-found page for better 404 UX.
7. Add typecheck and lint:fix scripts to package.json.
8. Add a tiny util with unit test to validate test setup.
9. Wire global stylesheet and base theme tokens.
10. Show quick links to Docs and Games in the UI.

## Impact Roadmap: Top 5 Improvements

1. Unified search and indexing across Notes, Tasks, Bookmarks, Routines, Health, and Apps with fast fuzzy matching, keyboard actions, and deep linking.
2. Design system and theme tokens with accessible contrast, componentized inputs/cards/buttons, and removal of inline styles for UI consistency.
3. Offline-first with optional cloud sync: background sync, export/import, and conflict-safe merges using a simple Supabase adapter.
4. Health dashboard and analytics: charts, weekly snapshot on Home, wearable imports, and per-category filters for Meals/Metrics.
5. Quality gates: project-scoped typecheck/lint/tests, minimal unit tests for utilities and snapshots, and error monitoring for production.

## JoshHub Review

What works well
- Offline Dexie data stores with live hooks enable fast CRUD for Notes/Tasks/Routines.
- Global search palette with routes, apps, life areas, and quick actions is a strong navigation layer.
- Health feature foundation with logs and 7‑day snapshot provides a clear path for insights.
- Docs index and viewer make the documentation explorable from inside the app.
- New DnD modules (dice roller, character creator) add playful, high‑engagement features.

What needs improving
- UI consistency: migrate inline styles to shared components and theme tokens; ensure accessible contrast across all pages.
- Type safety: reduce noisy type errors in legacy folders and fix path imports to stabilize project‑scope checks.
- Testing discipline: expand beyond a single unit test and cover calculation logic and critical flows.
- Documentation structure: centralize roadmap, outstanding tasks, and feature status in one place.
- Performance and telemetry: add basic error tracking and route-level code splitting for smoother navigation.

Suggestions
- Implement the design system and expand the theme tokens to cover common components.
- Integrate the health snapshot into the Home dashboard and add charts for movement/sleep trends.
- Extend global search indexing to include Events and Telemetry with more actions.
- Add a lightweight sync layer behind a feature flag and keep offline-first as the default.
- Establish a minimal test suite for snapshot calculations, ID generation, and Dexie adapters.

## Competitor Gap‑Closing Tasks (to surpass market apps)

### Notion‑class capabilities
- Add relational databases with properties, formulas, and rollups.
- Provide table/board/calendar views with per‑view filters and sorts.
- Implement templates for entities (Task/Note/Project/Routine) with default fields.
- Add backlinks and per‑entity "references" panel across notes and projects.
- Inline edit tables and quick create in any view; multi‑select tags with color chips.

### Tana/Capacities/Anytype‑style knowledge graph
- Typed entities with property schemas and inheritance across templates.
- Graph view (nodes + edges) for backlinks and typed relationships.
- “Super tags” equivalent: attach behaviors and default views to a tag/type.
- Quick capture with type detection and property prompts.

### Obsidian‑level local knowledge
- Markdown vault import/export with safe rendering for code, tables, embeds.
- Daily/weekly notes and backlinks sidebar; graph overlay for links.
- Plugin‑like extensions: small adapters for parsers, UI panels, commands.

### Heptabase visual knowledge
- Whiteboard canvases: drag cards (notes/tasks) with links and clusters.
- Map views: group by tag/area; draw shapes/arrows and add screenshots.
- Presentation mode; export boards as image/PDF.

### Quantified Self (Gyroscope/Exist/Fit/Withings/Strava/Cronometer)
- Unified timeline across sleep, movement, and biometrics with filters.
- Import connectors: Apple Health/Google Fit/Withings CSV/JSON; Strava activities.
- Nutrition tracker: macros, targets, daily summary; Cronometer‑style quick add.
- Goals and trends: streaks, anomalies, and weekly insights.

### Tasks & Routines (Todoist/Things/Habitica)
- Natural language input: “Tomorrow 3pm #home @high” parsing to fields.
- Recurring schedules; reminders; snooze; priorities and tags.
- Gamification: streaks, XP, badges for routines and task completion.
- “Next tiny step” helper; break down tasks into small actionable steps.

### Knowledge & Command (Raycast/Alfred)
- Command actions for internal entities and external apps (open URL, run macro).
- Macros/automations: multi‑step flows (create + link + schedule).
- File system search and quick actions, respecting privacy and sandboxing.

### DnD 5e (D&D Beyond/Roll20/Foundry)
- Full character builder: class/level rules (proficiencies, slots, features).
- Spell slots calculator; prepared toggles; conditions; equipment and encumbrance.
- Encounters: initiative tracker, HP changes, conditions, round timer.
- Campaigns: party, session notes, loot, NPCs; export/import campaign data.

### Platform foundations
- Offline‑first with optional Supabase sync behind feature flags.
- Error monitoring and performance metrics with lightweight client hooks.
- Route‑level code splitting and prefetch tuning.
- Accessibility: keyboard navigation, focus rings, aria labels across forms.
