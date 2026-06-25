# HealthCast OS — Build & Deploy Guide

This repo is a pnpm monorepo. The product app lives in `artifacts/healthcast`
(React + Vite + Tailwind v4, frontend-only, static output).

## Prerequisites
- **Node.js 24** (the repo's pnpm version requires `node:sqlite`; Node 20 will fail)
- pnpm (via corepack): `corepack enable && corepack prepare pnpm@11.9.0 --activate`

## Install
```bash
pnpm install
```

## Verify (use typecheck, NOT build, to validate code)
```bash
pnpm --filter @workspace/healthcast run typecheck
```

## Build the LIVE product (what runs at ccahealthcast.com)
```bash
cd artifacts/healthcast
PORT=19324 BASE_PATH=/ NODE_ENV=production pnpm run build
# Static output -> artifacts/healthcast/dist/public
```
Deploy the contents of `dist/public` as a static site (SPA — route all paths to
`/index.html`). This is what your employee pushes to AWS (S3 + CloudFront, or
the existing AWS hosting).

## Build the STANDALONE DEMO (for demo.ccahealthcast.com)
```bash
cd artifacts/healthcast
PORT=19324 BASE_PATH=/ NODE_ENV=production pnpm run build:demo
# Static output -> artifacts/healthcast/dist/demo
```
The demo bundle is the SAME app with `VITE_DEMO_MODE=1` baked in. Differences:
- A persistent teal "Interactive demo" ribbon with **Get started** + **Book a
  walkthrough** CTAs (links in `src/brand/demoMode.ts`).
- Lands directly in the fully clickable dashboard (interactive sandbox); the
  guided narrated tour is available from "Watch Demo" / "Welcome".
Deploy the contents of `dist/demo` to the `demo.` subdomain (same static/SPA
setup: route all paths to `/index.html`).

## Routes of note
- `/`            Executive Overview (interactive dashboard)
- `/?tour=1`     Launches the guided interactive product tour automatically
- `/settings`    White-label Settings (live logo / name / color theming)
- `/welcome`     Guided narrated onboarding tour
- `/demo`        6-scene animated walkthrough (video-style)
- `/landing`     Marketing / sales landing page (hero, features, pricing, CTAs)
- 18 domain pages: /cash-flow, /scenario-builder, /futurecast, /integrations, …

## Interactive product demo (the convincing one)
A guided, clickable tour runs OVER the real dashboard: it spotlights live
elements, auto-navigates between pages, and narrates the value for a prospect,
ending on a "Start free trial / Book a walkthrough" CTA.
- Tour script: `src/demo/tourSteps.ts` (edit copy/steps here)
- Tour engine: `src/demo/GuidedTour.tsx`
- Spotlight anchors: elements tagged with `data-tour="..."`
- Launch it from: the landing "Take the interactive tour" button, the in-app
  demo popup, `startGuidedTour()`, `?tour=1`, or automatically in the demo build.
The older video-style walkthrough still lives at `/demo`.

## White-label Settings (`/settings`)
Live, in-app re-skinning — change product name, company, tagline, owner, logo
(upload), and the color palette (with presets), and the whole app recolors
instantly via CSS variables. Runtime state lives in `src/brand/BrandProvider.tsx`
(in-memory; the sandbox blocks localStorage). To bake a customer's defaults
permanently, set them in `src/brand/brandConfig.ts`.

## White-labeling (sellable to other contractors)
All customer-facing identity is in **`src/brand/brandConfig.ts`**:
product name, company name, tagline, logo (`/public/brand/`), owner block,
sample-data note, website/support email. Change those values (and optionally the
brand colors in `src/index.css` `:root` tokens) to re-skin the entire app for a
new customer — no other code changes required.

Demo CTA links + ribbon copy live in **`src/brand/demoMode.ts`**.

## Pricing
The pricing tiers on `/landing` (`src/pages/Landing.tsx`, `PLANS`) are
**placeholders** — set real prices/plan names before selling.

## Theme
Light "Clear Command" theme derived from the shield logo (navy + teal +
growth-green). Token-driven in `src/index.css` (`:root` content tokens; the
`header, aside { … }` block scopes the light chrome). See `replit.md` and
`.agents/memory/healthcast.md` for the full set of conventions and gotchas
(recharts, framer-motion, Tailwind v4 @import rule, KpiCard, etc.).
