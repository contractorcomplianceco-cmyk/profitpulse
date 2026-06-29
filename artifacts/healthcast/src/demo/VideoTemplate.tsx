import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoPlayer } from "./lib/hooks";
import { SCENE_DURATIONS, sceneMetaFor } from "./sceneMeta";
import {
  MUSIC_PATHS,
  resolveNarrationPlayback,
  resolveAudioUrl,
  type NarrationPlayback,
} from "./audioPaths";
import { SceneOpening } from "./scenes/SceneOpening";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneDashboard } from "./scenes/SceneDashboard";
import { SceneWorkflow } from "./scenes/SceneWorkflow";
import { SceneInsight } from "./scenes/SceneInsight";
import { SceneOutcome } from "./scenes/SceneOutcome";
import { SceneClosing } from "./scenes/SceneClosing";

export { SCENE_DURATIONS };

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  opening: SceneOpening,
  problem: SceneProblem,
  dashboard: SceneDashboard,
  workflow: SceneWorkflow,
  insight: SceneInsight,
  outcome: SceneOutcome,
  closing: SceneClosing,
};

const MUSIC_BASE_VOLUME = 0.22;
const MUSIC_DUCKED_VOLUME = 0.07;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  isPaused = false,
  fill = false,
  onSceneChange,
  onVideoEnd,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  isPaused?: boolean;
  fill?: boolean;
  onSceneChange?: (sceneKey: string) => void;
  onVideoEnd?: () => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop, isPaused, onVideoEnd });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, "");
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const meta = sceneMetaFor(baseSceneKey);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const narrationModeRef = useRef<NarrationPlayback["kind"]>("none");

  const [musicSrc, setMusicSrc] = useState<string | null>(null);
  const [narrationPlayback, setNarrationPlayback] = useState<NarrationPlayback>({ kind: "none" });
  const musicIndexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = await resolveAudioUrl(MUSIC_PATHS);
      if (!cancelled) setMusicSrc(url);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tryNextMusic = useCallback(() => {
    musicIndexRef.current += 1;
    if (musicIndexRef.current < MUSIC_PATHS.length) {
      setMusicSrc(MUSIC_PATHS[musicIndexRef.current]);
    } else {
      setMusicSrc(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const playback = await resolveNarrationPlayback(baseSceneKey);
      if (!cancelled) setNarrationPlayback(playback);
    })();
    return () => {
      cancelled = true;
    };
  }, [baseSceneKey]);

  const restoreMusic = useCallback(() => {
    const music = musicRef.current;
    if (music) music.volume = MUSIC_BASE_VOLUME;
  }, []);

  useEffect(() => {
    const music = musicRef.current;
    if (!music || !musicSrc || muted) return;
    music.volume = MUSIC_BASE_VOLUME;
    music.play().catch(() => {});
  }, [musicSrc, muted]);

  useEffect(() => {
    const music = musicRef.current;
    const narration = narrationRef.current;
    if (isPaused) {
      music?.pause();
      narration?.pause();
      return;
    }
    if (music && musicSrc) music.play().catch(() => {});
    if (narration && narrationPlayback.kind !== "none" && !muted) {
      narration.play().catch(restoreMusic);
    }
  }, [isPaused, muted, musicSrc, narrationPlayback.kind, restoreMusic]);

  useEffect(() => {
    const narration = narrationRef.current;
    const music = musicRef.current;
    if (!narration || narrationPlayback.kind === "none") {
      narrationModeRef.current = "none";
      restoreMusic();
      return;
    }

    narrationModeRef.current = narrationPlayback.kind;

    if (narrationPlayback.kind === "per-scene") {
      narration.src = narrationPlayback.url;
      narration.currentTime = 0;
    } else {
      if (narration.src !== narrationPlayback.url) {
        narration.src = narrationPlayback.url;
      }
      narration.currentTime = narrationPlayback.seekSec;
    }

    if (muted || isPaused) {
      restoreMusic();
      return;
    }

    if (music) music.volume = MUSIC_DUCKED_VOLUME;

    const onEnd = () => restoreMusic();
    const onErr = () => restoreMusic();

    narration.play().catch(restoreMusic);
    narration.addEventListener("ended", onEnd);
    narration.addEventListener("error", onErr);

    return () => {
      narration.removeEventListener("ended", onEnd);
      narration.removeEventListener("error", onErr);
      restoreMusic();
    };
  }, [baseSceneKey, narrationPlayback, muted, isPaused, restoreMusic]);

  return (
    <div
      className={`w-full ${fill ? "h-full" : "h-screen min-h-[100dvh]"} overflow-hidden relative`}
      style={{ backgroundColor: "var(--color-bg-dark)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-[0.15] blur-[100px]"
          style={{ background: "var(--color-secondary)" }}
          animate={{
            x: ["-20%", "30%", "-10%", "-20%"],
            y: ["-10%", "20%", "40%", "-10%"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full opacity-[0.1] blur-[100px]"
          style={{ background: "var(--color-accent)" }}
          animate={{
            x: ["40%", "-10%", "50%", "40%"],
            y: ["50%", "10%", "-20%", "50%"],
            scale: [1, 1.5, 1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {meta && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-30 flex flex-col gap-1">
          <div className="px-2.5 py-1 rounded-full bg-black/45 border border-white/10 text-[10px] md:text-xs font-mono text-white/70">
            Scene {meta.index} · {meta.label}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {musicSrc && (
        <audio
          ref={musicRef}
          src={musicSrc}
          preload="auto"
          autoPlay
          loop
          muted={muted}
          onError={tryNextMusic}
        />
      )}
      <audio ref={narrationRef} preload="auto" muted={muted} />
    </div>
  );
}
