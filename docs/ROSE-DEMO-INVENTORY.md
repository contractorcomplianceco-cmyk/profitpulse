# Rose Demo Walkthrough — Profit Pulse Inventory

**Date:** 2026-06-29  
**Scope:** Profit Pulse repo only (`/home/ubuntu/projects/profitpulse`)  
**Action taken:** Inventory only — no deploy, no DNS changes, no other apps touched.

---

## 1. Is this repo empty or does it have app code?

**It has substantial real app code.** This is not an empty or scaffold-only repo.

| Signal | Detail |
|--------|--------|
| Primary app | `artifacts/healthcast/` (`@workspace/healthcast`) |
| Source volume | ~195 TypeScript/TSX files under `artifacts/healthcast/src/` (~1.5 MB) |
| Last pushed commit | `7230de0` — *Build real Profit Pulse MVP* |
| Local-only work | SaaS auth, billing/monetization, nginx deploy docs (uncommitted on disk) |
| Data layer | Local-first mock/seed data in `src/lib/profit-pulse/` (no live DB wired) |

The app is a full React SPA with 20+ dashboard pages, auth, billing tiers, and an existing cinematic demo subsystem.

---

## 2. Stack and package manager

| Layer | Technology |
|-------|------------|
| **Package manager** | **pnpm** (workspace monorepo; `pnpm-workspace.yaml`) |
| **Runtime** | Node.js (server uses PM2 + vite preview) |
| **Framework** | React 19 + Vite 7 |
| **Routing** | wouter (hash-based via `useHashLocation`) |
| **UI** | Tailwind CSS v4, shadcn/Radix, lucide-react |
| **Animation** | framer-motion |
| **Charts** | recharts |
| **State** | React context (`ProfitPulseProvider`, `AuthProvider`, `BillingProvider`) |
| **API / DB** | Not connected for MVP — structure stubs in `database/`, `artifacts/api-server/` |

**Correct GitHub repo (canonical):**

```
origin → git@github.com:contractorcomplianceco-cmyk/profitpulse.git
```

Legacy upstream remote (HealthCast origin, do not confuse):

```
healthcast-source → git@github.com:contractorcomplianceco-cmyk/healthcast.git
```

---

## 3. What routes already exist?

### Public / marketing (no auth gate)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/demo`, `/demo/` | `DemoWalkthrough` | **Cinematic 6-scene demo** (fullscreen, outside app chrome) |
| `/landing`, `/landing/` | `Landing` | Marketing site |
| `/request-demo` | `RequestDemo` | Lead capture |
| `/buy` | `BuyNow` | Purchase CTA |
| `/signup` | `SignUp` | Sign-up CTA |
| `/auth/login` | `Login` | Mock auth |
| `/auth/logout` | `Logout` | Session clear |
| `/auth/session` | `Session` | Session debug |

### Authenticated app (inside `AppLayout`)

| Route | Page |
|-------|------|
| `/welcome` | Welcome (narrated onboarding — separate from `/demo`) |
| `/` | Executive Overview |
| `/cash-flow` | Cash Flow |
| `/revenue-intelligence` | Revenue Intelligence |
| `/profitability` | Profitability |
| `/ar-ap-collections` | AR/AP & Collections |
| `/marketing-roi` | Marketing ROI |
| `/sales-pipeline` | Sales Pipeline |
| `/staffing-payroll` | Staffing & Payroll |
| `/department-performance` | Department Performance |
| `/client-profitability` | Client Profitability |
| `/historical-trends` | Historical Trends |
| `/market-economy` | Market & Economy |
| `/futurecast` | Futurecast |
| `/scenario-builder` | Scenario Modeler |
| `/alerts` | Alerts |
| `/daily-briefing` | Daily Briefing |
| `/reports` | Reports & Exports |
| `/integrations` | Integrations |
| `/copilot` | AI CFO Copilot |
| `/goals` | Goals & OKRs |
| `/cash-calendar` | Cash Calendar |
| `/compliance` | Compliance & Risk |
| `/facility-intelligence` | Facility Intelligence |
| `/settings` | White-Label Settings |
| `/team` | Team & Invites |
| `/audit` | Audit Log |
| `/billing` | Plans & Billing |

**Note:** Hash routing — URLs appear as `/#/demo`, `/#/`, etc.

---

## 4. Is there already a demo/walkthrough route?

**Yes — `/demo` and `/demo/` already exist** and are the intended standalone cinematic demo.

### A. Cinematic demo (Rose target) — `/demo`

| File | Role |
|------|------|
| `src/demo/DemoWalkthrough.tsx` | Fullscreen page shell + back link |
| `src/demo/DemoPlayer.tsx` | Play/pause, mute, scene jump, progress bar |
| `src/demo/VideoTemplate.tsx` | Scene engine, bg music, per-scene narration |
| `src/demo/useSceneControls.ts` | Scene lock/jump logic |
| `src/demo/scenes/Scene1–6.tsx` | Animated scenes (intro → dashboard → nav → action → connected → outro) |
| `src/demo/demo.css` | Isolated `.hc-demo` theme (does not bleed into main app) |

Wired in `App.tsx` **outside** `AppLayout` and **outside** `AuthGate` — opens directly without login.

Sidebar link: **Watch Demo** → `/demo/`

### B. In-app guided tour (NOT the Rose standard)

| File | Role |
|------|------|
| `src/demo/GuidedTour.tsx` | Overlay tour on real app pages via `data-tour` selectors |
| `src/demo/tourSteps.ts` | Step copy; navigates live routes |

Triggered by `?tour=1` or buttons — **reads/highlight real screen elements**. This is the wrong pattern for a polished narrated “presentation movie.”

### C. Welcome narrated onboarding — `/welcome`

Separate 7-section narrated flow using `public/onboarding/*.mp3` — also not the standalone `/demo` experience.

### D. Legacy separate artifact

`artifacts/healthcast-demo/` — older 3D/video prototype; repointed to `/demo-preview/` in dev. **Do not use for Rose** — production demo lives inside `healthcast` at `/demo`.

---

## 5. Existing audio, video, and walkthrough assets?

### Cinematic `/demo` assets (tracked in git)

**Background music:**

- `artifacts/healthcast/public/demo/audio/bg_music.mp3`

**Per-scene narration (6 files):**

- `public/demo/audio/narration/intro.mp3`
- `public/demo/audio/narration/dashboard.mp3`
- `public/demo/audio/narration/navigation.mp3`
- `public/demo/audio/narration/action.mp3`
- `public/demo/audio/narration/connected.mp3`
- `public/demo/audio/narration/outro.mp3`

**Scene stills (used in `ScreenFrame`):**

- `public/demo/images/dashboard.jpg`
- `public/demo/images/cashflow.jpg`
- `public/demo/images/scenario.jpg`
- `public/demo/images/alerts.jpg`
- `public/demo/images/futurecast.jpg`
- `public/demo/images/integrations.jpg`

**Brand:**

- `public/brand/profitpulse-shield.png` (Scene 1 logo)

### Onboarding assets (Welcome page, not `/demo`)

- `public/onboarding/music-bed.mp3`
- `public/onboarding/narration-1.mp3` … `narration-7.mp3`

### Video files

**No `.mp4` / `.webm` video files** — the demo is **code-driven animation + stills + audio**, not a pre-rendered video (matches HealthCast/BuildConnect pattern).

### Rose gap assessment

| Asset type | Status |
|------------|--------|
| Scene framework | ✅ Built |
| Music bed | ✅ Present (may need Rose-specific track) |
| Narration | ✅ Present (HealthCast-era scripts — **needs Rose rewrite + re-record**) |
| Screenshots in scenes | ✅ Present (may need Profit Pulse–specific captures) |
| Sample data in scenes | ✅ Simulated/mock in scene components (not live app data) |

---

## 6. Safest route: `/demo` or `/walkthrough`?

### **Recommendation: `/demo` (keep and extend)**

| Factor | `/demo` | `/walkthrough` |
|--------|---------|----------------|
| Already implemented | ✅ Yes | ❌ No route exists |
| Fullscreen outside app chrome | ✅ Yes | Would need new wiring |
| Public / no auth | ✅ Yes | Would need new wiring |
| Sidebar + marketing links | ✅ Already point here | Would break links |
| Command Center deep link | ✅ `https://<host>/#/demo` | New convention |
| Documented in repo | ✅ `replit.md`, `DEPLOYMENT.md` | — |
| Collision risk | Low (`healthcast-demo` uses `/demo-preview/`) | None, but redundant |

**Do not add `/walkthrough` unless Command Center has a hard requirement for that path.** If needed later, add a redirect alias in `App.tsx`:

```tsx
<Route path="/walkthrough" component={DemoWalkthrough} />
```

**Command Center link target (when ready):**

```
https://demo.ccaprofitpulse.com/demo
```

(or current staging IP with Host header / hash path)

---

## 7. Build commands

### Profit Pulse app only (what Rose demo ships inside)

```bash
cd /home/ubuntu/projects/profitpulse

# Typecheck
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run typecheck

# Production build (outputs static bundle + copies public/demo assets)
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run build
# → artifacts/healthcast/dist/public/

# Local production preview (not for Rose inventory — do not deploy yet)
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run serve
```

### Optional demo-build variant (marketing funnel mode)

```bash
VITE_DEMO_MODE=1 pnpm --filter @workspace/healthcast run build:demo
# → artifacts/healthcast/dist/demo/
```

### Full monorepo (all packages)

```bash
pnpm run build    # typecheck + all artifact builds
pnpm run typecheck
```

---

## 8. What files will need to change? (Rose demo phases)

### Phase 1 — Polish existing `/demo` (preferred)

| Area | Files |
|------|-------|
| Scene copy & motion | `src/demo/scenes/Scene1.tsx` … `Scene6.tsx` |
| Scene timing | `src/demo/VideoTemplate.tsx` (`SCENE_DURATIONS`) |
| Player chrome | `src/demo/DemoPlayer.tsx`, `src/demo/DemoWalkthrough.tsx` |
| Demo styling | `src/demo/demo.css` |
| Screen frame mock | `src/demo/scenes/ScreenFrame.tsx` |
| Narration audio | `public/demo/audio/narration/*.mp3` (re-record) |
| Background music | `public/demo/audio/bg_music.mp3` (optional replace) |
| Screenshot stills | `public/demo/images/*.jpg` |
| Scene playback hook | `src/demo/lib/hooks.ts` (if timing logic changes) |

### Phase 2 — Entry points (light touch)

| Area | Files |
|------|-------|
| Route alias (only if required) | `src/App.tsx` |
| Sidebar / promo CTAs | `src/components/layout/SidebarNav.tsx`, `DemoPromo.tsx` |
| Command Center link doc | This file + Command Center config (out of repo) |

### Do NOT change for Rose cinematic demo

| Area | Why |
|------|-----|
| Main dashboard pages (`src/pages/*`) | Preserve existing app |
| `GuidedTour.tsx` / `tourSteps.ts` | Different product (reads live UI) |
| Auth / billing / real integrations | Rose demo uses sample data only |
| DNS / nginx / PM2 | Out of scope until explicit deploy phase |
| Other apps on server | Do not touch |

---

## Server presence (Command Center host)

Profit Pulse **is already on this server** (inventory only — not modified):

| Item | Status |
|------|--------|
| PM2 process | `profitpulse` — **online** |
| Command | `PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run serve` |
| Bind | `127.0.0.1:3010` (internal only) |
| Nginx vhost | `profitpulse.yourdomain.com` → proxy to `:3010` |
| Public IP | `3.129.68.79` |

Direct demo URL on server today (hash route):

```
http://127.0.0.1:3010/#/demo
```

---

## Rose demo standard — fit check

| Requirement | Current state |
|-------------|---------------|
| Separate route | ✅ `/demo` |
| Guided presentation movie feel | ✅ Scene-based player exists |
| Cinematic progression | ✅ 6 scenes + framer-motion |
| Captions | ⚠️ Headlines in scenes; narration is audio-only — may add on-screen captions |
| Voice narration | ✅ Wired (`VideoTemplate` ducks music per scene) |
| Background music | ✅ `bg_music.mp3` |
| Does not read visible screen text | ✅ Scenes use authored copy + stills, not live DOM |
| Sample/demo data only | ✅ Mock screenshots + scene content |
| No secrets / real client data | ✅ Compliant |
| Preserve existing app | ✅ Demo is isolated route + `.hc-demo` CSS scope |
| Command Center can open directly | ✅ `/#/demo` — wire when deploying |

---

## Next phase (not started)

1. Rose script + scene copy pass (`Scene1–6`)
2. Re-record narration MP3s per scene key
3. Refresh `public/demo/images/*` from current Profit Pulse UI
4. QA audio ducking / autoplay / mute on `/demo`
5. Build + deploy (separate explicit approval)
6. Command Center tile → `/#/demo`

---

## Related docs

- `replit.md` — demo architecture and `/demo` ownership
- `DEPLOYMENT.md` — route map
- `PRODUCTION-SNAPSHOT.md` — server/PM2 state
- `docs/PRICING.md` — billing tiers (orthogonal to Rose demo)
