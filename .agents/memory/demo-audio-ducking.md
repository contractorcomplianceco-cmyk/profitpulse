---
name: demo audio ducking
description: Pitfall when ducking background music under per-scene narration in the HealthCast /demo walkthrough (and similar HTML5 audio setups).
---

# Background-music ducking must always be un-ducked on every exit path

When narration ducks a continuously-looping background-music `<audio>` (lower its
volume while VO plays), do NOT restore music volume only on the narration
`ended` event. If `play()` rejects (autoplay policy, decode/load error) or the
scene changes mid-narration, `ended` never fires and the music stays stuck quiet
forever.

**Rule:** restore base music volume on `ended`, `error`, AND in the effect
cleanup. Only duck after deciding playback will actually start. Gate narration on
unmute (the demo player defaults `muted=true` per autoplay policy), and include
`muted` in the effect deps so toggling unmute restarts the current scene's
narration from the scene boundary.

**Why:** caught in architect review — original code ducked before `play()` and
restored only on `ended`, a real "music permanently quiet" bug.

**How to apply:** any HTML5-audio ducking setup keyed off scene/route changes —
see `artifacts/healthcast/src/demo/VideoTemplate.tsx`.
