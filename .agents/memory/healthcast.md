---
name: CCA HealthCast OS app
description: Conventions and gotchas for the frontend-only healthcast CFO dashboard artifact
---

# CCA HealthCast OS (artifact `healthcast`)

Frontend-only React+Vite executive CFO dashboard, 18 nav sections, realistic mock data, no backend/db.

## Build approach that worked
- Build the SHARED FOUNDATION first (one design subagent): `components/dashboard/*` reusable cards, `lib/format.ts`, `lib/calculations.ts`, `lib/alertEngine.ts`, plus `ExecutiveOverview.tsx` as the reference page. Then fan out the remaining pages across ~4 parallel DESIGN subagents.
- **To avoid merge conflicts when parallelizing pages:** subagents create page files (default export) + their own per-domain `data/*.ts` with PRE-ASSIGNED unique filenames, and must NOT edit `App.tsx`. The main agent wires all routes into `App.tsx` at the end.

## Recurring bugs to expect from subagents here
- framer-motion `transition: { type: "spring" }` fails `tsc` — needs `type: "spring" as const`. Every page copied the same pattern, so fix is a repo-wide sed.
- `KpiCard` originally `parseFloat`'d its display string for the delta; with compact currency (`"$1.3M"` -> 1.3) the delta was garbage (~-100%). Fix: parse the numeric part AND honor K/M/B/T suffix to reconstruct magnitude. Callers pass formatted string as `value` + raw number as `priorValue`.

## recharts on this dashboard (charts render axes but NO data marks)
- Symptom: lines/bars/donut-arcs/gauge/sparklines invisible while axes + tick labels still show.
- Cause 1 (the main one): `isAnimationActive` with a long `animationDuration` on a heavy page. Charts mount LATE (after the framer-motion entrance + ResponsiveContainer's ResizeObserver measures), so marks are captured mid/pre-animation at zero size. Fix: set `isAnimationActive={false}` on every series — the framer-motion entrance already provides the animated feel.
- Cause 2: `ResponsiveContainer` collapses to 0 height when its parent's height is not DEFINITE. `h-full`/`min-h-*` inside a `flex items-center` parent does not give a percentage-resolvable height. Give the chart wrapper an explicit pixel height (e.g. `h-[180px]`, or a fixed-height parent + `h-full` child).
- Sparkline/Area gradient `id` must be unique per instance — derive from `useId()` (sanitized), not from the color string, or repeated instances collide on the SVG `url(#...)` reference.
- Funnel counts: recharts `<Bar>` shows values only via `<LabelList dataKey=... position="right">`, not by default.

## Scenario engine (`lib/calculations.ts`)
- Model P&L impact ONCE (revenue/cost/payroll), then derive profit = rev - cost - payroll, cash = profit + one-time collection boost. Do not add the same lever to both profit and cash (the original double-counted).
- Decision string must have an explicit neutral branch ("Baseline — No Change Modeled") or zero-adjustment state wrongly reads "High Risk / Cash Burn".
- Implement effects for ALL exposed sliders/toggles (retainer, cut-low-margin, new channel, referrals, refund-rate, collection-speed) or the UI shows dead controls.
