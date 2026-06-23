# CCA HealthCast OS

A premium, frontend-only executive CFO command center for Contractor Compliance Authority (CCA) — a single-pane "CFO terminal" that turns financial, sales, marketing, staffing, and macroeconomic data into executive-grade insight, scenario modeling, and recommended actions. All data is realistic mock data; the architecture is modular so live integrations can replace the mock layer later.

## Run & Operate

- App: artifact `healthcast` (slug `healthcast`, previewPath `/`). Runs via its Replit workflow `artifacts/healthcast: web` — do not run `pnpm dev` at the repo root.
- `pnpm --filter @workspace/healthcast run typecheck` — typecheck the app (use this to verify, not `build`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (wouter for routing, base path from `import.meta.env.BASE_URL`)
- UI: Tailwind + shadcn/ui components, lucide-react icons
- Charts: recharts; Animation: framer-motion
- No backend, no database, no API codegen for this app — it is purely client-side with mock data.

## Where things live (artifacts/healthcast/src)

- `components/layout/AppLayout.tsx` — persistent sidebar with all 18 nav sections (source of truth for nav).
- `App.tsx` — all 18 routes wired to real page components.
- `pages/` — one file per nav section (default-exported component). `ExecutiveOverview.tsx` is the reference page for structure/density/animation.
- `components/dashboard/` — the reusable building blocks every page uses: `PageHeader` (title + Export toast), `KpiCard`, `ChartCard`, `InsightCard`, `RiskWarning`, `RecommendedAction`, `AlertBadge`, `ScenarioSlider`.
- `data/` — one mock-data module per domain (e.g. `cashFlowData.ts`, `marketingData.ts`, `clientsData.ts`, `scenariosData.ts`). `mockData.ts` holds shared company KPIs/AR-AP/historical.
- `lib/` — `format.ts` (currency/percent/number formatters), `calculations.ts` (live Scenario Builder engine), `alertEngine.ts` (derives alerts from data).
- `demo/` — the 6-scene animated product walkthrough, ported INTO this app as a normal route at `/demo` + `/demo/` (so it actually deploys). `DemoWalkthrough.tsx` (page, wraps in `.hc-demo`), `DemoPlayer.tsx` (always-on control bar), `VideoTemplate.tsx`, `useSceneControls.ts`, `lib/hooks.ts`, `scenes/Scene1-6.tsx`, `demo.css` (scoped theme). Audio is a real static file at `public/demo/audio/bg_music.mp3`, served at `/demo/audio/bg_music.mp3`.

## Architecture decisions

- Frontend-only by design. Mock data is split per-domain under `data/` so each can later be swapped for a real integration without touching pages.
- Pages are decoupled: each page owns its data module and never imports another page. Shared logic lives in `lib/` and shared UI in `components/dashboard/`.
- `calculateScenario(baseline, adjustments)` in `lib/calculations.ts` models the P&L impact ONCE (revenue/cost/payroll), then derives profit, cash, runway, break-even from it — avoid adding the same effect to both profit and cash (double-counting).
- `KpiCard` accepts a display string for `value` (e.g. `"$1.3M"`) plus a numeric `priorValue`; it reconstructs magnitude from compact suffixes (K/M/B/T) to compute the delta. Pass the formatted string for display and the raw number as `priorValue`.

## Product

18 sections: Executive Overview, Cash Flow, Revenue Intelligence, Profitability, AR/AP & Collections, Marketing ROI, Sales Pipeline, Staffing & Payroll, Department Performance, Client Profitability, Historical Trends, Market & Economy, Futurecast, Scenario Builder, Alerts, Daily Briefing, Reports, Integrations. Every page carries KPI cards (with trend vs prior), a trend/historical chart, an insight card, a risk warning, and a recommended executive action, plus Drilldown + Export Report actions. Scenario Builder recomputes live as levers move; Alerts are derived from the data.

## User preferences

- No emojis anywhere in the product UI.
- Aesthetic: "Executive Contrast" theme — LIGHT content (white / light-slate cards on a light canvas) inside DEEP-NAVY chrome (the top header bar + the sidebar stay dark navy). Teal primary, teal-green for positive, amber/red for risk; colorful per-KPI accents (teal/sky/violet/emerald/amber/indigo). Dense, high-trust "CFO terminal" vibe.

## Gotchas

- Theme = light content + navy chrome via CSS-variable scoping in `index.css`: `:root` holds LIGHT content tokens; a `header, aside { ... }` block re-declares background/foreground/card/muted/secondary/border/primary/cyan AND both surface gradients (`--gradient-surface`, `--gradient-surface-accent`) to navy so every chrome descendant resolves dark automatically. This works ONLY because just `TopHeader` renders `<header>` and just `SidebarNav` renders `<aside>` — do NOT use semantic `<header>`/`<aside>` in content (PageHeader uses `<div>`); use `<div>`/`<section>` or those content blocks will turn navy.
- Content surface gradients MUST stay light in `:root` (diverges from the navy mockup) because content components (KpiCard/ChartCard/InsightCard/RecommendedAction) consume `surface-gradient`/`surface-gradient-accent`. The chrome scope overrides them back to navy.
- Chrome accent rules need an extra class to outrank Tailwind utilities: `header.surface-gradient-accent` (teal underline) and `aside .bg-gradient-primary` (active-nav glow).
- framer-motion variants: a `transition.type: "spring"` literal must be `type: "spring" as const` (or typed `Variants`) or `tsc` rejects it.
- Verify with `typecheck`, not `build` (build needs workflow-provided `PORT`/`BASE_PATH`).
- All frontend work goes through DESIGN subagents per the react-vite skill; do not hand-edit pages without that workflow unless it's a tiny shared fix.
- `/demo` walkthrough lives INSIDE this app (not the separate `healthcast-demo` video artifact). Only healthcast's static handler is deployed, so a standalone artifact at `/demo/` never publishes — that's why the walkthrough was moved here. App.tsx wraps the demo in an outer `<Switch>` (`/demo`, `/demo/`, then catch-all `Router`) so it renders fullscreen OUTSIDE AppLayout. The `healthcast-demo` artifact was repointed off `/demo/` to `/demo-preview/` (its `artifact.toml`) so healthcast owns `/demo/` in dev too — keep it there or the SPA route is shadowed by the video artifact in dev. To re-export the video, edit/run `healthcast-demo` at `/demo-preview/`, then re-port changes here.
- Demo theme is isolated under a `.hc-demo` wrapper in `src/demo/demo.css` (color vars + `perspective-1000`/`font-display`/`font-body`, which are NOT defined globally in this Tailwind v4 app). Do not move these to `:root` — they would collide with the Executive-Contrast theme.
- NEVER put a CSS `@import url(...)` (e.g. Google Fonts) inside a component-imported stylesheet like `demo.css`. It works in `vite dev` but FAILS the production `vite build` — Tailwind v4's Lightning CSS bundles all CSS together and rejects any `@import` that isn't first (`@import rules must precede all other rules`), so the deploy build dies and the OLD bundle stays live (symptom: republish doesn't change the live JS hash). Load all web fonts via `<link>` tags in `index.html` instead (Inter + Space Grotesk / DM Sans / JetBrains Mono are all there). The only `@import`s allowed are the `@import "tailwindcss"` / `@import "tw-animate-css"` at the very top of `index.css`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `react-vite` and `design` skills for the frontend build workflow
