const BASE = import.meta.env.BASE_URL;

/** Primary music path per Rose demo spec. */
export const MUSIC_PATHS = [
  `${BASE}demo/music.mp3`,
  `${BASE}demo/audio/bg_music.mp3`,
] as const;

/** Fallback narration for entire walkthrough if per-scene files are missing. */
export const NARRATION_FALLBACK = `${BASE}demo/narration.mp3`;

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

/** Candidate narration URLs for a scene, in priority order. */
export function narrationCandidates(sceneKey: string): string[] {
  const candidates = [
    `${BASE}demo/narration/${sceneKey}.mp3`,
    LEGACY_NARRATION[sceneKey]
      ? `${BASE}demo/audio/narration/${LEGACY_NARRATION[sceneKey]}.mp3`
      : null,
    NARRATION_FALLBACK,
  ].filter((x): x is string => Boolean(x));
  return candidates;
}

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
