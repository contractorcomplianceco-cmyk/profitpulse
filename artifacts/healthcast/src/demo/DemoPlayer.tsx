import { useCallback, useEffect, useRef, useState } from 'react';
import { Repeat, Volume2, VolumeX, ChevronUp, ChevronDown, Play, Pause, RotateCcw } from 'lucide-react';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';
import { probeDemoAudio, type DemoAudioStatus } from './audioPaths';
import { AudioStatusBadge } from './components/AudioStatusBadge';
import { sceneMetaFor } from './sceneMeta';

const PROGRESS_TICK_MS = 60;

interface ControlBarProps {
  visible: boolean;
  collapsed: boolean;
  locked: boolean;
  muted: boolean;
  paused: boolean;
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  tick: number;
  onTogglePaused: () => void;
  onToggleLock: () => void;
  onToggleMuted: () => void;
  onRestart: () => void;
  onJumpTo: (index: number) => void;
  onToggleCollapsed: () => void;
}

function ProgressSegments({
  sceneKeys, activeIndex, activeDuration, tick, onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  tick: number;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const start = performance.now();
    const id = window.setInterval(() => {
      setElapsed(performance.now() - start);
    }, PROGRESS_TICK_MS);
    return () => window.clearInterval(id);
  }, [tick]);

  const progress = activeDuration > 0 ? Math.min(1, elapsed / activeDuration) : 0;

  return (
    <div className="flex-1 flex items-center gap-1.5">
      {sceneKeys.map((key, i) => {
        const isActive = i === activeIndex;
        const fill = isActive ? progress * 100 : 0;
        return (
          <button
            key={key}
            onClick={() => onJumpTo(i)}
            className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-4 hover:bg-white/25 transition-all relative min-h-[12px]"
            aria-label={`Jump to scene ${i + 1}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <div
              className="absolute inset-y-0 left-0 bg-white/90 rounded-full transition-[width] duration-100"
              style={{ width: `${fill}%` }}
            />
          </button>
        );
      })}
    </div>
  );
}

function ControlBar({
  visible, collapsed, locked, muted, paused, sceneKeys, activeIndex, activeDuration, tick,
  onTogglePaused, onToggleLock, onToggleMuted, onRestart, onJumpTo, onToggleCollapsed,
}: ControlBarProps) {
  return (
    <div
      className={`flex items-center gap-3 bg-black/55 backdrop-blur-sm px-5 py-4 transition-all duration-200 ease-out ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <button
        onClick={onTogglePaused}
        className="w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 text-white bg-white/15 hover:bg-white/25"
        title={paused ? 'Play' : 'Pause'}
        aria-label={paused ? 'Play' : 'Pause'}
      >
        {paused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
      </button>

      <button
        onClick={onToggleLock}
        className={`w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 ${
          locked
            ? 'text-white bg-white/15 hover:bg-white/25'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-label={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-pressed={locked}
      >
        <Repeat className="w-8 h-8" />
      </button>

      <button
        onClick={onToggleMuted}
        className={`w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 ${
          muted
            ? 'text-white/60 hover:text-white hover:bg-white/10'
            : 'text-white bg-white/15 hover:bg-white/25'
        }`}
        title={muted ? 'Unmute' : 'Mute'}
        aria-label={muted ? 'Unmute' : 'Mute'}
        aria-pressed={!muted}
      >
        {muted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
      </button>

      <button
        onClick={onRestart}
        className="w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 text-white/60 hover:text-white hover:bg-white/10"
        title="Restart walkthrough"
        aria-label="Restart walkthrough"
      >
        <RotateCcw className="w-7 h-7" />
      </button>

      <div className="w-px self-stretch bg-white/15" aria-hidden="true" />

      <ProgressSegments
        sceneKeys={sceneKeys}
        activeIndex={activeIndex}
        activeDuration={activeDuration}
        tick={tick}
        onJumpTo={onJumpTo}
      />

      <div className="text-sm md:text-base text-white/60 font-mono tabular-nums shrink-0 text-right leading-tight">
        <div>{activeIndex + 1}/{sceneKeys.length}</div>
        <div className="text-[10px] text-white/40 font-body normal-case truncate max-w-[5rem]">
          {sceneMetaFor(sceneKeys[activeIndex])?.label ?? ''}
        </div>
      </div>

      <button
        onClick={onToggleCollapsed}
        className="w-14 h-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg shrink-0"
        title={collapsed ? 'Show controls' : 'Hide controls'}
        aria-label={collapsed ? 'Show controls' : 'Hide controls'}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronUp className="w-10 h-10" /> : <ChevronDown className="w-10 h-10" />}
      </button>
    </div>
  );
}

export default function DemoPlayer({
  fill = false,
  alwaysShowControls = false,
  loop = true,
  controlsBelow = false,
  onEnded,
}: {
  /** Fill the parent container (h-full) instead of the viewport. */
  fill?: boolean;
  /** Keep the control bar permanently visible (e.g. in a popup). */
  alwaysShowControls?: boolean;
  /** Loop back to scene 1 at the end (default true). */
  loop?: boolean;
  /** Render the control bar BELOW the video instead of overlaid on top of it. */
  controlsBelow?: boolean;
  /** Called when the walkthrough reaches the end (only when loop is false). */
  onEnded?: () => void;
} = {}) {
  const {
    sceneKeys, activeIndex, locked, mountKey, tick,
    durations: rotatedDurations, activeDuration, onSceneChange, jumpTo, toggleLock, restart,
  } = useSceneControls(SCENE_DURATIONS);

  // When not looping (popup), always play scenes in natural order 1→6 and stop,
  // instead of the rotate-from-active order used for the looping full-screen player.
  const durations = loop ? rotatedDurations : SCENE_DURATIONS;

  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioStatus, setAudioStatus] = useState<DemoAudioStatus>('loading');
  const sensorRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') setHovering(true);
  }, []);
  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') setHovering(false);
  }, []);
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    if (collapsed) setTapPinned(true);
  }, [collapsed]);
  const handleToggleCollapsed = useCallback(() => {
    setCollapsed(c => {
      if (!c) { setHovering(false); setTapPinned(false); }
      return !c;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    probeDemoAudio().then((status) => {
      if (!cancelled) setAudioStatus(status);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const sensor = sensorRef.current;
      if (sensor && !sensor.contains(e.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [collapsed, tapPinned]);

  const barVisible = alwaysShowControls || !collapsed || hovering || tapPinned;

  const controlBar = (
    <ControlBar
      visible={barVisible}
      collapsed={collapsed}
      locked={locked}
      muted={muted}
      paused={paused}
      sceneKeys={sceneKeys}
      activeIndex={activeIndex}
      activeDuration={activeDuration}
      tick={tick}
      onTogglePaused={() => setPaused(p => !p)}
      onToggleLock={toggleLock}
      onToggleMuted={() => setMuted(m => !m)}
      onRestart={() => {
        restart();
        setPaused(false);
      }}
      onJumpTo={jumpTo}
      onToggleCollapsed={handleToggleCollapsed}
    />
  );

  // Layout B: controls rendered BELOW the video (popup) — never covers content.
  // The video keeps a true 16:9 area; the control bar adds its own height below.
  if (controlsBelow) {
    return (
      <div className="flex flex-col w-full">
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <AudioStatusBadge status={audioStatus} />
          <VideoTemplate
            key={mountKey}
            durations={durations}
            loop={loop}
            muted={muted}
            isPaused={paused}
            fill
            onSceneChange={onSceneChange}
            onVideoEnd={onEnded}
          />
        </div>
        <div className="flex-shrink-0">{controlBar}</div>
      </div>
    );
  }

  // Layout A: overlaid control bar (full-screen /demo page).
  return (
    <div className={`relative w-full ${fill ? 'h-full' : 'h-screen'}`}>
      <AudioStatusBadge status={audioStatus} />
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop={loop}
        muted={muted}
        isPaused={paused}
        fill={fill}
        onSceneChange={onSceneChange}
        onVideoEnd={onEnded}
      />
      <div
        ref={sensorRef}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end"
        style={{ height: '25%' }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <div className="flex-1 w-full" aria-hidden="true" />
        {controlBar}
      </div>
    </div>
  );
}
