const BASE = import.meta.env.BASE_URL;

/** Canonical Rose demo audio paths (see docs/DEMO-AUDIO.md). */
export const EXPECTED_AUDIO = {
  music: `${BASE}demo/music.mp3`,
  narrationFallback: `${BASE}demo/narration.mp3`,
  narrationDir: `${BASE}demo/narration/`,
  perScene: (sceneKey: string) => `${BASE}demo/narration/${sceneKey}.mp3`,
} as const;

export const MUSIC_PATHS = [
  EXPECTED_AUDIO.music,
  `${BASE}demo/audio/bg_music.mp3`,
] as const;

export const NARRATION_FALLBACK = EXPECTED_AUDIO.narrationFallback;

/** Alternate filenames if Rose scene keys were renamed. */
const NARRATION_ALIASES: Partial<Record<string, string[]>> = {
  dashboard: ["insight"],
  insight: ["alert"],
};

const LEGACY_NARRATION: Partial<Record<string, string>> = {
  opening: "intro",
  problem: "navigation",
  dashboard: "dashboard",
  workflow: "action",
  insight: "connected",
  outcome: "outro",
  closing: "outro",
};

export const SCENE_KEYS = [
  "opening",
  "problem",
  "dashboard",
  "workflow",
  "insight",
  "outcome",
  "closing",
] as const;

export function narrationCandidates(sceneKey: string): string[] {
  const aliases = NARRATION_ALIASES[sceneKey] ?? [];
  const candidates = [
    EXPECTED_AUDIO.perScene(sceneKey),
    ...aliases.map((a) => EXPECTED_AUDIO.perScene(a)),
    LEGACY_NARRATION[sceneKey]
      ? `${BASE}demo/audio/narration/${LEGACY_NARRATION[sceneKey]}.mp3`
      : null,
    NARRATION_FALLBACK,
  ].filter((x): x is string => Boolean(x));
  return [...new Set(candidates)];
}

export type DemoAudioStatus = "loading" | "available" | "unavailable";

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

export async function probeDemoAudio(): Promise<DemoAudioStatus> {
  const music = await resolveAudioUrl(MUSIC_PATHS);
  if (music) return "available";

  for (const key of SCENE_KEYS) {
    const narration = await resolveAudioUrl(narrationCandidates(key));
    if (narration) return "available";
  }

  return "unavailable";
}
