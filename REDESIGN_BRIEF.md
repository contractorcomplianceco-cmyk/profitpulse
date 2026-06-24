# HealthCast OS — Sellable Redesign Brief

## Goal
Transform CCA HealthCast OS from an internal CFO dashboard into a **sellable, white-label financial command center for contractors**. Keep ALL existing data engines, scenario math, alert engine, charts, and the 18 page domains. This is a BRAND + UI/UX + SELLABILITY redesign, not a rewrite.

## Source of truth
- Repo: `artifacts/healthcast` (React + Vite + Tailwind v4 + shadcn/ui + wouter + recharts + framer-motion). Frontend-only, mock data per-domain under `src/data/`.
- New logo: `public/brand/healthcast-logo.jpg` (shield: navy→teal gradient, medical cross + wifi signal + green upward bar/trend; wordmark "HealthCast" navy + "OS" teal).
- Redesign mockup: `public/brand/redesign-mockup.jpg` — the TARGET layout for Executive Overview.

## Brand system (NEW — white-label ready)
Create `src/brand/brandConfig.ts` exporting a single `brand` object so any contractor business can be dropped in:
- `productName: "HealthCast"`, `productSuffix: "OS"`
- `companyName: "Contractor Compliance Authority"`, `companyShort: "CCA"`
- `tagline: "Financial Health, Growth Intelligence & Futurecast Command Center"`
- `logoSrc: "/brand/healthcast-logo.jpg"`
- `owner: { name: "Rose", role: "Owner / CEO", initials: "R" }`
- `colors` (the brand palette below) — but colors live in index.css tokens; brandConfig holds the swappable text/logo/owner identity.
All chrome (logo, header text, owner block, footer) must read from `brand`, never hard-code "CCA"/"Rose"/"HealthCast" again.

## Brand palette (from the logo)
- Navy (primary brand / headings): `#001E4D` ~ hsl(217 100% 15%)
- Navy-2 (deep): `#000C3C`
- Teal (primary action / accent): `#0FA3A3` ~ hsl(180 83% 35%); brighter teal `#16B7C2`
- Green (positive / growth): `#22C55E`-ish emerald, matches the logo's rising bars
- Amber (warning) / Crimson (risk) — keep existing.

## Theme direction (IMPORTANT change from current build)
The current app uses NAVY chrome (dark header + sidebar) with light content. The mockup uses a **LIGHT, airy** feel overall: white/very-light canvas, white cards, a LIGHT header with navy text + the logo, and a LIGHT sidebar with navy text and a teal active state (numbered items). Move to that.
- Header: white/near-white background, subtle bottom border + soft shadow, navy wordmark, teal "OS", integration logos row, date, owner avatar.
- Sidebar: light (white/very light slate), navy/slate text, **teal pill** active state, optional small number badges per item per the mockup. Keep the Financial Health Score card pinned at the bottom (light treatment).
- Content: white cards, soft slate borders, subtle shadows. Teal/emerald/amber/crimson semantic accents. Dense but breathable.
- Remove the heavy dark ambient backdrop glows; replace with a very subtle light grid / faint tint.

## Executive Overview layout (match mockup as closely as practical)
Single-pane, information-dense. Zones (left→right, top→bottom):
1. Top KPI strip: 6 compact KPI cards w/ sparkline (Monthly Revenue, Collected Revenue, Cash on Hand, Net Profit, Gross Margin, Runway).
2. Executive Insights panel + secondary financial KPI grid + a Recommended Action bar.
3. Grid of mini-panels each linking to its full page: Cash Flow Forecast, Revenue Breakdown (donut), Sales Pipeline→Cash (funnel), Marketing ROI (gauge), Top Services by Profit Margin (bars), AR Aging Summary (donut), Futurecast (line), Market & Economy Impact (indicator list).
4. RIGHT RAIL: Alerts list (with counts), full Daily Executive Briefing (What Improved / What Got Worse / Needs Action Today / At Risk / Opportunity to Push / Decision Should Wait / Top 5 Actions Today), each section styled distinctly.
5. Bottom: Integration Status row (named connectors w/ last-sync) + Quick Reports row.
Reuse existing data modules (overviewData, cashFlowData, revenueData, pipelineData, marketingData, profitabilityData, arApData, scenariosData, economyData, briefingData, alertsData, integrationsData, reportsData).

## Sellability layer (NEW)
- Replace the "Internal demo — sample financial data only" amber banner with a tasteful, dismissible "Sample data — live integrations available" note (neutral, not alarming). Controlled by brandConfig flag `showSampleDataNote`.
- Keep owner identity swappable via brandConfig.

## Rules / gotchas (from replit.md + .agents/memory/healthcast.md — MUST follow)
- Tailwind v4: NO `@import url(...)` inside component CSS. Load fonts via `<link>` in index.html only.
- recharts: set `isAnimationActive={false}` on every series; give chart wrappers explicit pixel heights; unique gradient ids via useId.
- framer-motion: `type: "spring" as const`.
- KpiCard: pass formatted display string as `value` + raw number as `priorValue` in SAME base-unit scale.
- Verify with `pnpm --filter @workspace/healthcast run typecheck`, NOT build.
- Theme is token-driven in `index.css` (`:root`). Since we're going light-everywhere, the `header, aside { ... }` navy override block must be REWORKED to light (or removed) — update tokens, don't fight them with per-element classes. Keep the semantic `<header>`/`<aside>` discipline.
- Equal-height KPI tiles: `auto-rows-fr` + `h-full`.
- No emojis anywhere in the UI.

## Out of scope for THIS pass (separate task)
- The standalone interactive demo deployable (built separately after the app redesign).
