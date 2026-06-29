# Profit Pulse — Demo narration script

Executive product demo voiceover for the `/demo` walkthrough.  
**Tone:** Confident, peer-to-peer — speak to a contractor owner or CFO. Not a screen reader.  
**Data:** Illustrative sample data only. Do not imply live integrations or production guarantees.

---

## Audio files

Place finished MP3s in the app `public/demo/` folder before build:

| File | Purpose |
|------|---------|
| `public/demo/music.mp3` | Background music bed (loops, instrumental) |
| `public/demo/narration.mp3` | **Option A** — single master narration track (see timing below) |
| `public/demo/narration/{scene}.mp3` | **Option B** — per-scene files (preferred for sync) |

**Minimum for Rose:** `music.mp3` + either master `narration.mp3` or seven per-scene files.

If files are missing, the demo still runs with on-screen captions. Controls stay usable; mute shows a fallback state.

---

## Scene timing (master `narration.mp3`)

Use these start times when recording one continuous track:

| Scene | Key | Start | Duration |
|-------|-----|-------|----------|
| 1 | opening | 0:00 | ~11s |
| 2 | problem | 0:11 | ~12s |
| 3 | dashboard | 0:23 | ~13s |
| 4 | workflow | 0:36 | ~12s |
| 5 | insight | 0:48 | ~12s |
| 6 | outcome | 1:00 | ~11s |
| 7 | closing | 1:11 | ~10s |

Total runtime: **~81 seconds** (leave ~1s pause between scenes).

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

## Scene 6 — The outcome (`outcome`)

**On-screen label:** The outcome

> The practical payoff: sharper pricing, protected margin, and visibility leadership can trust.  
> Decisions get faster because everyone is looking at the same picture.

---

## Scene 7 — Rose closing (`closing`)

**On-screen label:** Rose demo

> ProfitPulse is ready for your Rose demo.  
> Sample data only — no login, no live integrations — executive clarity for contractor operators.

---

## Recording notes

- **Format:** MP3, 44.1 or 48 kHz, mono or stereo, normalized (~−16 LUFS).
- **Music:** Instrumental loop, no vocals; keep level low — the player ducks music under narration.
- **Pace:** Calm and assured; ~12–18 seconds of speech per scene.
- **After export:** `pnpm --filter @workspace/healthcast run build` then preview at `/#/demo`.
