// Video player hook - handles recording lifecycle, scene advancement, and looping

import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    startRecording?: () => Promise<void>;
    stopRecording?: () => void;
  }
}

export interface SceneDurations {
  [key: string]: number;
}

/** Extra headroom when scenes wait for narration `ended` before advancing. */
export const NARRATION_SYNC_FALLBACK_MS = 4_500;

export interface UseVideoPlayerOptions {
  durations: SceneDurations;
  onVideoEnd?: () => void;
  loop?: boolean;
  /** When true, scene advancement is frozen (play/pause). */
  isPaused?: boolean;
  /** When true, timer is a safety cap; prefer advanceScene() after narration ends. */
  narrationSync?: boolean;
}

export interface UseVideoPlayerReturn {
  currentScene: number;
  totalScenes: number;
  currentSceneKey: string;
  hasEnded: boolean;
  advanceScene: () => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const { durations, onVideoEnd, loop = true, isPaused = false, narrationSync = false } = options;

  // Captured once on mount -- durations must be a static object
  const sceneKeys = useRef(Object.keys(durations)).current;
  const totalScenes = sceneKeys.length;
  const durationsArray = useRef(Object.values(durations)).current;

  const [currentScene, setCurrentScene] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  const advanceScene = useCallback(() => {
    if (isPaused) return;

    setCurrentScene((prev) => {
      if (prev >= totalScenes - 1) {
        setHasEnded((ended) => {
          if (!ended) {
            window.stopRecording?.();
            onVideoEnd?.();
          }
          return true;
        });
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [isPaused, totalScenes, loop, onVideoEnd]);

  // Start recording on mount
  useEffect(() => {
    window.startRecording?.();
  }, []);

  // Scene advancement — timer fallback; narration-synced demos advance via advanceScene()
  useEffect(() => {
    if (hasEnded && !loop) return;
    if (isPaused) return;

    const baseDuration = durationsArray[currentScene] ?? 10_000;
    const currentDuration = narrationSync
      ? baseDuration + NARRATION_SYNC_FALLBACK_MS
      : baseDuration;

    const timer = setTimeout(advanceScene, currentDuration);

    return () => clearTimeout(timer);
  }, [currentScene, durationsArray, hasEnded, loop, isPaused, narrationSync, advanceScene]);

  return {
    currentScene,
    totalScenes,
    currentSceneKey: sceneKeys[currentScene],
    hasEnded,
    advanceScene,
  };
}

export function useSceneTimer(events: Array<{ time: number; callback: () => void }>) {
  const firedRef = useRef<Set<number>>(new Set());
  const callbacksRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    callbacksRef.current = events.map(e => e.callback);
  }, [events]);

  const scheduleKey = events.map((event, i) => `${i}:${event.time}`).join('|');

  useEffect(() => {
    firedRef.current = new Set();

    const timers = events.map(({ time }, index) => {
      return setTimeout(() => {
        if (!firedRef.current.has(index)) {
          firedRef.current.add(index);
          callbacksRef.current[index]?.();
        }
      }, time);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [scheduleKey]);
}
