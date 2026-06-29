import { Volume2, VolumeX, Music2 } from "lucide-react";
import type { DemoAudioAvailability } from "../audioPaths";

export function AudioStatusBadge({
  availability,
  muted = false,
  onUnmute,
}: {
  availability: DemoAudioAvailability;
  muted?: boolean;
  onUnmute?: () => void;
}) {
  if (availability.status === "loading") return null;

  if (availability.status === "unavailable") {
    return (
      <div
        className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm pointer-events-none max-w-[min(100%,22rem)]"
        role="status"
        aria-live="polite"
      >
        <VolumeX className="w-3.5 h-3.5 text-white/50 shrink-0" />
        <span className="text-[10px] md:text-xs text-white/60 font-body truncate">
          Audio unavailable · captions on
        </span>
      </div>
    );
  }

  if (muted && onUnmute) {
    return (
      <button
        type="button"
        onClick={onUnmute}
        className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 border border-[#49BFF2]/35 backdrop-blur-sm hover:bg-black/70 transition-colors max-w-[min(100%,24rem)]"
        aria-label="Unmute demo audio"
      >
        <Volume2 className="w-3.5 h-3.5 text-[#49BFF2] shrink-0" />
        <span className="text-[10px] md:text-xs text-white/80 font-body truncate">
          Preview muted · tap for narration
        </span>
      </button>
    );
  }

  if (!availability.narration && availability.music) {
    return (
      <div
        className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm pointer-events-none"
        role="status"
      >
        <Music2 className="w-3.5 h-3.5 text-[#49BFF2]/70 shrink-0" />
        <span className="text-[10px] md:text-xs text-white/50 font-body">Music only · add narration.mp3</span>
      </div>
    );
  }

  return null;
}
