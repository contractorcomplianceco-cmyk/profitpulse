import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from './lib/hooks';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';
import { Scene6 } from './scenes/Scene6';

export const SCENE_DURATIONS = {
  intro: 8000,
  dashboard: 12500,
  navigation: 12500,
  action: 11500,
  connected: 9000,
  outro: 6000
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  dashboard: Scene2,
  navigation: Scene3,
  action: Scene4,
  connected: Scene5,
  outro: Scene6,
};

const MUSIC_BASE_VOLUME = 0.16;
const MUSIC_DUCKED_VOLUME = 0.05;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  // Continuous background music bed.
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    music.volume = MUSIC_BASE_VOLUME;
    music.play().catch(() => {});
  }, []);

  // Per-scene narration: restart from the top on each scene, duck the music
  // while it plays, then restore the music bed when it finishes. Narration only
  // starts once the player is unmuted (browser autoplay policy / UX), and the
  // music volume is always restored on end/error/cleanup so it can never get
  // stuck ducked if playback is interrupted.
  useEffect(() => {
    const narration = narrationRef.current;
    const music = musicRef.current;
    if (!narration) return;

    const restoreMusic = () => {
      if (music) music.volume = MUSIC_BASE_VOLUME;
    };

    narration.src = `${import.meta.env.BASE_URL}demo/audio/narration/${baseSceneKey}.mp3`;
    narration.currentTime = 0;
    narration.volume = 1;

    // While muted, keep the (silent) music bed at base volume and don't bother
    // ducking; restart narration from the scene boundary once unmuted.
    if (muted) {
      restoreMusic();
      return;
    }

    if (music) music.volume = MUSIC_DUCKED_VOLUME;
    narration.play().catch(restoreMusic);

    narration.addEventListener('ended', restoreMusic);
    narration.addEventListener('error', restoreMusic);
    narration.addEventListener('pause', restoreMusic);
    return () => {
      narration.removeEventListener('ended', restoreMusic);
      narration.removeEventListener('error', restoreMusic);
      narration.removeEventListener('pause', restoreMusic);
      restoreMusic();
    };
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      {/* Persistent background layer */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract blurred shapes that drift continuously */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-[0.15] blur-[100px]"
          style={{ background: 'var(--color-secondary)' }}
          animate={{
            x: ['-20%', '30%', '-10%', '-20%'],
            y: ['-10%', '20%', '40%', '-10%'],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full opacity-[0.1] blur-[80px]"
          style={{ background: 'var(--color-accent)' }}
          animate={{
            x: ['40%', '-10%', '50%', '40%'],
            y: ['50%', '10%', '-20%', '50%'],
            scale: [1, 1.5, 1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      <audio
        ref={musicRef}
        src={`${import.meta.env.BASE_URL}demo/audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        loop
        muted={muted}
      />
      <audio
        ref={narrationRef}
        preload="auto"
        muted={muted}
      />
    </div>
  );
}
