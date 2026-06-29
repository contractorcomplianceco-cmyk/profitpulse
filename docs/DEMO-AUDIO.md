# Profit Pulse demo — audio file paths

Place MP3 files under `artifacts/healthcast/public/demo/`. They are copied into the build at `dist/public/demo/` and served at runtime.

## Required paths (Rose spec)

| File | URL at runtime | Purpose |
|------|----------------|---------|
| `music.mp3` | `/demo/music.mp3` | Background music bed (loops) |
| `narration.mp3` | `/demo/narration.mp3` | Optional single-track narration fallback |

## Recommended — per-scene narration

One file per scene (preferred for sync and music ducking):

| Scene | File path | Runtime URL |
|-------|-----------|-------------|
| 1 Command view | `narration/opening.mp3` | `/demo/narration/opening.mp3` |
| 2 Profit leakage | `narration/problem.mp3` | `/demo/narration/problem.mp3` |
| 3 Live insight | `narration/insight.mp3` | `/demo/narration/insight.mp3` |
| 4 Team workflow | `narration/workflow.mp3` | `/demo/narration/workflow.mp3` |
| 5 Smart alert | `narration/alert.mp3` | `/demo/narration/alert.mp3` |
| 6 Protected profit | `narration/outcome.mp3` | `/demo/narration/outcome.mp3` |
| 7 Rose closing | `narration/closing.mp3` | `/demo/narration/closing.mp3` |

## Legacy fallbacks (optional)

If Rose files are missing, the player tries:

- `audio/bg_music.mp3` → music
- `audio/narration/{intro,dashboard,...}.mp3` → mapped legacy scene names

## If files are missing

The walkthrough **still runs**:

- Scenes advance on timed durations (see `src/demo/sceneMeta.ts`)
- On-screen captions carry the message
- A small **“Audio unavailable”** badge appears (not an error)
- Mute/unmute controls remain usable when audio is added later

No login, API, or live data is required.

## Recording checklist for Rose

1. Review script: `docs/ROSE-NARRATION-SCRIPT.md`
2. Export MP3: 44.1 kHz or 48 kHz, mono or stereo, normalized (~−16 LUFS)
3. Drop files into paths above
4. Rebuild: `pnpm --filter @workspace/healthcast run build`
5. Preview: `/#/demo` — unmute and step through all 7 scenes

## Music bed tips

- Instrumental only; no vocals competing with narration
- Seamless loop; target 60–120 seconds
- Keep level low; player ducks music during narration automatically
