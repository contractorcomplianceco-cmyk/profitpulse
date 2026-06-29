const BASE = import.meta.env.BASE_URL;

/** Canonical Rose demo audio paths (see docs/DEMO-AUDIO.md). */
export const EXPECTED_AUDIO = {
  music: `${BASE}demo/music.mp3`,
  narrationFallback: `${BASE}demo/narration.mp3`,
  narrationDir: `${BASE}demo/narration/`,
  perScene: (sceneKey: string) => `${BASE}demo/narration/${sceneKey}.mp3`,
} as const;

/** Primary music path per Rose demo spec. */
export const MUSIC_PATHS = [
  EXPECTED_AUDIO.music,
  `${BASE}demo/audio/bg_music.mp3`,
] as const;

/** Fallback narration for entire walkthrough if per-scene files are missing. */
export const NARRATION_FALLBACK = EXPECTED_AUDIO.narrationFallback;

/** Legacy per-scene filenames (HealthCast era) — used only as fallback. */
const LEGACY_NARRATION: Partial<Record<string, string>> = {
  opening: "intro",
  problem: "navigation",
  insight: "dashboard",
  workflow: "action",
  alert: "connected",
  outcome: "outro",
  closing: "outro",
};

export const SCENE_KEYS = [
  "opening",
  "problem",
  "insight",
  "workflow",
  "alert",
  "outcome",
  "closing",
] as const;

/** Candidate narration URLs for a scene, in priority order. */
export function narrationCandidates(sceneKey: string): string[] {
  const candidates = [
    EXPECTED_AUDIO.perScene(sceneKey),
    LEGACY_NARRATION[sceneKey]
      ? `${BASE}demo/audio/narration/${LEGACY_NARRATION[sceneKey]}.mp3`
      : null,
    NARRATION_FALLBACK,
  ].filter((x): x is string => Boolean(x));
  return candidates;
}

export type DemoAudioStatus = "loading" | "available" | "unavailable";

/** Load the first URL that exists (HEAD request). Returns null if all fail. */
export async function resolveAudioUrl(candidates: readonly string[]): Promise<string | null> {
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch {
      /* try next */
    }
  }
  return null;
}

/** Probe whether any demo audio is present (music or narration). */
export async function probeDemoAudio(): Promise<DemoAudioStatus> {
  const music = await resolveAudioUrl(MUSIC_PATHS);
  if (music) return "available";

  for (const key of SCENE_KEYS) {
    const narration = await resolveAudioUrl(narrationCandidates(key));
    if (narration) return "available";
  }

  return "unavailable";
}
