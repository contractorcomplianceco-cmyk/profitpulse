import { ROSE_SCENES } from "./sceneMeta";

const BASE = import.meta.env.BASE_URL;

/**
 * Canonical Profit Pulse demo audio (see docs/PROFITPULSE_DEMO_NARRATION.md).
 * Place files at:
 *   artifacts/healthcast/public/demo/music.mp3
 *   artifacts/healthcast/public/demo/narration.mp3
 */
export const EXPECTED_AUDIO = {
  music: `${BASE}demo/music.mp3`,
  narration: `${BASE}demo/narration.mp3`,
  perScene: (sceneKey: string) => `${BASE}demo/narration/${sceneKey}.mp3`,
} as const;

export const MUSIC_PATHS = [
  EXPECTED_AUDIO.music,
  `${BASE}demo/audio/bg_music.mp3`,
] as const;

export const NARRATION_MASTER_PATHS = [EXPECTED_AUDIO.narration] as const;

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

/** Per-scene file candidates (excludes master narration.mp3). */
export function perSceneNarrationCandidates(sceneKey: string): string[] {
  const aliases = NARRATION_ALIASES[sceneKey] ?? [];
  return [
    EXPECTED_AUDIO.perScene(sceneKey),
    ...aliases.map((a) => EXPECTED_AUDIO.perScene(a)),
    LEGACY_NARRATION[sceneKey]
      ? `${BASE}demo/audio/narration/${LEGACY_NARRATION[sceneKey]}.mp3`
      : null,
  ].filter((x): x is string => Boolean(x));
}

export type NarrationPlayback =
  | { kind: "none" }
  | { kind: "per-scene"; url: string }
  | { kind: "master"; url: string; seekSec: number };

export function sceneNarrationSeekSec(sceneKey: string): number {
  let ms = 0;
  for (const scene of ROSE_SCENES) {
    if (scene.key === sceneKey) return ms / 1000;
    ms += scene.durationMs;
  }
  return 0;
}

/** Pause after narration before crossfade to the next scene. */
export const NARRATION_POST_ROLL_MS = 750;

export async function preloadPerSceneNarrations(): Promise<{
  byScene: Map<string, NarrationPlayback>;
  mode: DemoAudioAvailability["narrationMode"];
}> {
  const byScene = new Map<string, NarrationPlayback>();
  let mode: DemoAudioAvailability["narrationMode"] = "none";

  for (const key of SCENE_KEYS) {
    const perScene = await resolveAudioUrl(perSceneNarrationCandidates(key));
    if (perScene) {
      byScene.set(key, { kind: "per-scene", url: perScene });
      mode = "per-scene";
    }
  }

  if (mode === "per-scene") {
    for (const key of SCENE_KEYS) {
      if (!byScene.has(key)) byScene.set(key, { kind: "none" });
    }
    return { byScene, mode };
  }

  const master = await resolveAudioUrl(NARRATION_MASTER_PATHS);
  if (master) {
    for (const key of SCENE_KEYS) {
      byScene.set(key, { kind: "master", url: master, seekSec: sceneNarrationSeekSec(key) });
    }
    return { byScene, mode: "master" };
  }

  for (const key of SCENE_KEYS) {
    byScene.set(key, { kind: "none" });
  }
  return { byScene, mode: "none" };
}

export async function resolveNarrationPlayback(sceneKey: string): Promise<NarrationPlayback> {
  const perScene = await resolveAudioUrl(perSceneNarrationCandidates(sceneKey));
  if (perScene) return { kind: "per-scene", url: perScene };

  const master = await resolveAudioUrl(NARRATION_MASTER_PATHS);
  if (master) {
    return { kind: "master", url: master, seekSec: sceneNarrationSeekSec(sceneKey) };
  }

  return { kind: "none" };
}

export type DemoAudioStatus = "loading" | "available" | "unavailable";

export interface DemoAudioAvailability {
  status: DemoAudioStatus;
  music: boolean;
  narration: boolean;
  narrationMode: "per-scene" | "master" | "none";
}

export async function resolveAudioUrl(candidates: readonly string[]): Promise<string | null> {
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) continue;
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("audio/")) continue;
      return url;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function probeDemoAudioDetailed(): Promise<DemoAudioAvailability> {
  const music = Boolean(await resolveAudioUrl(MUSIC_PATHS));

  let narration = false;
  let narrationMode: DemoAudioAvailability["narrationMode"] = "none";

  for (const key of SCENE_KEYS) {
    const perScene = await resolveAudioUrl(perSceneNarrationCandidates(key));
    if (perScene) {
      narration = true;
      narrationMode = "per-scene";
      break;
    }
  }

  if (!narration) {
    const master = await resolveAudioUrl(NARRATION_MASTER_PATHS);
    if (master) {
      narration = true;
      narrationMode = "master";
    }
  }

  const status: DemoAudioStatus =
    music || narration ? "available" : "unavailable";

  return { status, music, narration, narrationMode };
}

/** @deprecated use probeDemoAudioDetailed */
export async function probeDemoAudio(): Promise<DemoAudioStatus> {
  const d = await probeDemoAudioDetailed();
  return d.status;
}
