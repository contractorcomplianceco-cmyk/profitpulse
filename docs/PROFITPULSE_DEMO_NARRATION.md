# Profit Pulse — Demo narration script

Executive product demo voiceover for the `/demo` walkthrough.  
**Tone:** Confident, peer-to-peer — speak to a contractor owner or CFO. Not a screen reader.  
**Data:** Illustrative sample data only. Do not imply live integrations or production guarantees.

---

## Audio files

Place finished MP3s in the app `public/demo/` folder before build:

| File | Scene | Purpose |
|------|-------|---------|
| `public/demo/music.mp3` | — | Background music bed (loops, instrumental) |
| `public/demo/narration/opening.mp3` | 1 | Command view |
| `public/demo/narration/problem.mp3` | 2 | Profit leakage |
| `public/demo/narration/dashboard.mp3` | 3 | Live dashboard |
| `public/demo/narration/workflow.mp3` | 4 | Team workflow |
| `public/demo/narration/insight.mp3` | 5 | Margin insight |
| `public/demo/narration/outcome.mp3` | 6 | Business outcomes |
| `public/demo/narration/closing.mp3` | 7 | Demo sign-off (must differ from scene 6) |
| `public/demo/narration.mp3` | all | **Option B** — single master track (see timing) |

**Legacy fallbacks** (used only if per-scene file missing): `public/demo/audio/narration/*.mp3`

If files are missing, the demo still runs with on-screen captions. Controls stay usable; mute shows a fallback state.

### Current per-scene durations (2026-06-29)

Scene timers in `sceneMeta.ts` are set ~0.5s longer than narration so audio is not cut off.

| Scene | File | Narration ~duration | Scene timer |
|-------|------|---------------------|-------------|
| 1 | `opening.mp3` | 12.2s | 13.0s |
| 2 | `problem.mp3` | 12.0s | 12.5s |
| 3 | `dashboard.mp3` | 11.6s | 12.5s |
| 4 | `workflow.mp3` | 11.7s | 12.5s |
| 5 | `insight.mp3` | 16.7s | 17.5s |
| 6 | `outcome.mp3` | 10.6s | 11.5s |
| 7 | `closing.mp3` | 13.0s | 13.5s |

---

## Scene timing (master `narration.mp3`)

Use these start times when recording one continuous track:

| Scene | Key | Start | Duration |
|-------|-----|-------|----------|
| 1 | opening | 0:00 | ~13s |
| 2 | problem | 0:13 | ~13s |
| 3 | dashboard | 0:26 | ~13s |
| 4 | workflow | 0:39 | ~13s |
| 5 | insight | 0:52 | ~18s |
| 6 | outcome | 1:10 | ~12s |
| 7 | closing | 1:22 | ~14s |

Total runtime: **~96 seconds** (leave ~1s pause between scenes).

---

## Scene 1 — Command view (`opening`)

**On-screen label:** Command view

> This is ProfitPulse — your financial command center.  
> Revenue, cash, margin, and risk on one executive screen, built for operators who run real jobs — not another spreadsheet.

---

## Scene 2 — The problem (`problem`)

**On-screen label:** The problem

> Here is the pain most owners feel: profit leaks quietly.  
> Margins stay unclear, job costs sit in different systems, and the numbers you need often arrive weeks too late.

---

## Scene 3 — Live dashboard (`dashboard`)

**On-screen label:** Live dashboard

> ProfitPulse pulls it into one live dashboard.  
> Revenue, direct costs, net margin, and risk — with trend cards so you see movement, not just a static month-end printout.

**Note:** Scene 3 must use the **same narrator** as scenes 1, 2, 4, and 5. Do not swap in a different voice or a clip from another product.

---

## Scene 4 — Team workflow (`workflow`)

**On-screen label:** Team workflow

> Your team works from the same view.  
> Owners, ops, and finance review jobs, projects, and accounts in one workflow — so accountability is obvious, not debated in email.

---

## Scene 5 — Margin insight (`insight`)

**On-screen label:** Margin insight

> When margin comes under pressure, ProfitPulse surfaces it early — like a copilot for your P&L.  
> In this demo, a sample job is flagged for pricing review before costs run further. Illustrative only — not connected to live AI today.

---

## Scene 6 — The outcome (`outcome`) — **business results**

**On-screen label:** The outcome  
**Purpose:** Summarize the *business value* the operator gets. Do **not** repeat the sign-off or demo disclaimer here.

> The practical payoff is sharper pricing, protected margin, and visibility leadership can trust.  
> Decisions get faster because everyone is looking at the same picture.

---

## Scene 7 — Product demo sign-off (`closing`) — **must differ from scene 6**

**On-screen label:** Rose demo  
**Purpose:** Close the *demo experience* — disclaimer, sample data, next step. Do **not** repeat scene 6 outcome language.

> That concludes this ProfitPulse product demo.  
> Everything you saw used sample contractor data — no login, no live integrations.  
> Contact us when you are ready to explore a live rollout.

### Scene 6 vs 7 (Gregg review)

| | Scene 6 `outcome.mp3` | Scene 7 `closing.mp3` |
|--|----------------------|------------------------|
| **Topic** | Business results (pricing, margin, decisions) | Demo wrap-up (sample data, no login, next step) |
| **Audience moment** | “Why this matters operationally” | “What you just watched + what to do next” |
| **Must not say** | “This concludes the demo…” | “Sharper pricing, protected margin…” (outcome lines) |

---

## Files to replace when re-recording

Replace these exact paths under `artifacts/healthcast/public/demo/narration/`:

1. `dashboard.mp3` — if voice does not match scenes 1–2, or if clip is truncated  
2. `outcome.mp3` — scene 6 business-results script only  
3. `closing.mp3` — scene 7 sign-off script only (**must not be a copy of `outcome.mp3`**)  

After export, verify with:

```bash
for f in opening problem dashboard workflow insight outcome closing; do
  ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 \
    "artifacts/healthcast/public/demo/narration/$f.mp3"
done
md5sum artifacts/healthcast/public/demo/narration/outcome.mp3 \
        artifacts/healthcast/public/demo/narration/closing.mp3
# Hashes must differ.
```

Update `durationMs` in `src/demo/sceneMeta.ts` if any clip runs longer than the table above.

---

## Recording notes

- **Format:** MP3, 44.1 or 48 kHz (or 24 kHz mono), normalized (~−16 LUFS).
- **Voice:** One narrator for all seven scenes.
- **Music:** Instrumental loop, no vocals; keep level low — the player ducks music under narration.
- **Pace:** Calm and assured; match scene timer or adjust timers after export.
- **After export:** `pnpm --filter @workspace/healthcast run build` then preview at `/#/demo`.
