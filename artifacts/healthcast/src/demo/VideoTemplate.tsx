import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoPlayer } from "./lib/hooks";
import { SCENE_DURATIONS, sceneMetaFor } from "./sceneMeta";
import {
  MUSIC_PATHS,
  NARRATION_POST_ROLL_MS,
  preloadPerSceneNarrations,
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
  onAudioBlocked,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  isPaused?: boolean;
  fill?: boolean;
  onSceneChange?: (sceneKey: string) => void;
  onVideoEnd?: () => void;
  /** Browser blocked unmuted autoplay — parent can show tap-to-unmute fallback. */
  onAudioBlocked?: () => void;
} = {}) {
  const [narrationCache, setNarrationCache] = useState<Map<string, NarrationPlayback> | null>(null);
  const [narrationMode, setNarrationMode] = useState<"per-scene" | "master" | "none">("none");

  const narrationSync = narrationMode === "per-scene" && !muted;

  const { currentSceneKey, advanceScene } = useVideoPlayer({
    durations,
    loop,
    isPaused,
    onVideoEnd,
    narrationSync,
  });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, "");
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const meta = sceneMetaFor(baseSceneKey);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const advanceAfterNarrationRef = useRef<number | null>(null);
  const musicIndexRef = useRef(0);

  const [musicSrc, setMusicSrc] = useState<string | null>(null);

  const narrationPlayback =
    narrationCache?.get(baseSceneKey) ?? ({ kind: "none" } satisfies NarrationPlayback);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [musicUrl, narrations] = await Promise.all([
        resolveAudioUrl(MUSIC_PATHS),
        preloadPerSceneNarrations(),
      ]);
      if (cancelled) return;
      setMusicSrc(musicUrl);
      setNarrationCache(narrations.byScene);
      setNarrationMode(narrations.mode);
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

  const restoreMusic = useCallback(() => {
    const music = musicRef.current;
    if (music) music.volume = MUSIC_BASE_VOLUME;
  }, []);

  const notifyIfAutoplayBlocked = useCallback(
    (err: unknown) => {
      const domErr = err as DOMException | undefined;
      if (domErr?.name === "NotAllowedError") {
        onAudioBlocked?.();
      }
    },
    [onAudioBlocked],
  );

  const clearAdvanceAfterNarration = useCallback(() => {
    if (advanceAfterNarrationRef.current != null) {
      window.clearTimeout(advanceAfterNarrationRef.current);
      advanceAfterNarrationRef.current = null;
    }
  }, []);

  const scheduleAdvanceAfterNarration = useCallback(() => {
    if (!narrationSync || isPaused) return;
    clearAdvanceAfterNarration();
    advanceAfterNarrationRef.current = window.setTimeout(() => {
      advanceAfterNarrationRef.current = null;
      advanceScene();
    }, NARRATION_POST_ROLL_MS);
  }, [advanceScene, clearAdvanceAfterNarration, isPaused, narrationSync]);

  useEffect(() => {
    clearAdvanceAfterNarration();
  }, [baseSceneKey, clearAdvanceAfterNarration]);

  useEffect(() => {
    const music = musicRef.current;
    if (!music || !musicSrc || muted) return;
    music.volume = MUSIC_BASE_VOLUME;
    music.play().catch(notifyIfAutoplayBlocked);
  }, [musicSrc, muted, notifyIfAutoplayBlocked]);

  useEffect(() => {
    const music = musicRef.current;
    const narration = narrationRef.current;
    if (isPaused) {
      music?.pause();
      narration?.pause();
      clearAdvanceAfterNarration();
      return;
    }
    if (music && musicSrc) music.play().catch(notifyIfAutoplayBlocked);
  }, [isPaused, musicSrc, clearAdvanceAfterNarration, notifyIfAutoplayBlocked]);

  useEffect(() => {
    const narration = narrationRef.current;
    const music = musicRef.current;
    if (!narration || narrationPlayback.kind === "none") {
      restoreMusic();
      return;
    }

    if (narrationPlayback.kind === "per-scene") {
      if (narration.src !== narrationPlayback.url) {
        narration.src = narrationPlayback.url;
      }
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

    const onEnd = () => {
      restoreMusic();
      if (narrationPlayback.kind === "per-scene") {
        scheduleAdvanceAfterNarration();
      }
    };
    const onErr = () => restoreMusic();

    narration.load();
    narration.play().catch((err) => {
      notifyIfAutoplayBlocked(err);
      restoreMusic();
    });
    narration.addEventListener("ended", onEnd);
    narration.addEventListener("error", onErr);

    return () => {
      narration.removeEventListener("ended", onEnd);
      narration.removeEventListener("error", onErr);
      clearAdvanceAfterNarration();
      restoreMusic();
    };
  }, [
    baseSceneKey,
    narrationPlayback,
    muted,
    isPaused,
    restoreMusic,
    scheduleAdvanceAfterNarration,
    clearAdvanceAfterNarration,
    notifyIfAutoplayBlocked,
  ]);

  return (
    <div
      className={`w-full ${fill ? "h-full" : "h-screen min-h-[100dvh]"} overflow-hidden relative hc-demo`}
      style={{ backgroundColor: "var(--color-bg-dark)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-[0.18] blur-[120px]"
          style={{ background: "var(--color-secondary)" }}
          animate={{
            x: ["-20%", "30%", "-10%", "-20%"],
            y: ["-10%", "20%", "40%", "-10%"],
            scale: [1, 1.25, 0.92, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: "var(--color-accent)" }}
          animate={{
            x: ["40%", "-10%", "50%", "40%"],
            y: ["50%", "10%", "-20%", "50%"],
            scale: [1, 1.55, 1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 demo-light-sweep opacity-[0.07]"
          animate={{ x: ["-120%", "220%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 demo-vignette pointer-events-none" aria-hidden />
        <div className="absolute inset-0 demo-film-grain pointer-events-none" aria-hidden />
      </div>

      {meta && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-30 flex flex-col gap-1">
          <motion.div
            className="px-2.5 py-1 rounded-full bg-black/50 border border-white/12 text-[10px] md:text-xs font-mono text-white/75 backdrop-blur-sm demo-scene-badge"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            key={meta.key}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            Scene {meta.index} · {meta.label}
          </motion.div>
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
