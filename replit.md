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

## Architecture decisions

- Frontend-only by design. Mock data is split per-domain under `data/` so each can later be swapped for a real integration without touching pages.
- Pages are decoupled: each page owns its data module and never imports another page. Shared logic lives in `lib/` and shared UI in `components/dashboard/`.
- `calculateScenario(baseline, adjustments)` in `lib/calculations.ts` models the P&L impact ONCE (revenue/cost/payroll), then derives profit, cash, runway, break-even from it — avoid adding the same effect to both profit and cash (double-counting).
- `KpiCard` accepts a display string for `value` (e.g. `"$1.3M"`) plus a numeric `priorValue`; it reconstructs magnitude from compact suffixes (K/M/B/T) to compute the delta. Pass the formatted string for display and the raw number as `priorValue`.

## Product

18 sections: Executive Overview, Cash Flow, Revenue Intelligence, Profitability, AR/AP & Collections, Marketing ROI, Sales Pipeline, Staffing & Payroll, Department Performance, Client Profitability, Historical Trends, Market & Economy, Futurecast, Scenario Builder, Alerts, Daily Briefing, Reports, Integrations. Every page carries KPI cards (with trend vs prior), a trend/historical chart, an insight card, a risk warning, and a recommended executive action, plus Drilldown + Export Report actions. Scenario Builder recomputes live as levers move; Alerts are derived from the data.

## User preferences

- No emojis anywhere in the product UI.
- Aesthetic: deep navy / electric blue / silver / white, teal-green for positive, amber/red for risk. Cinematic, dense, high-trust "CFO terminal" vibe.

## Gotchas

- framer-motion variants: a `transition.type: "spring"` literal must be `type: "spring" as const` (or typed `Variants`) or `tsc` rejects it.
- Verify with `typecheck`, not `build` (build needs workflow-provided `PORT`/`BASE_PATH`).
- All frontend work goes through DESIGN subagents per the react-vite skill; do not hand-edit pages without that workflow unless it's a tiny shared fix.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `react-vite` and `design` skills for the frontend build workflow
