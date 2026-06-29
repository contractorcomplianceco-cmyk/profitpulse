import { VolumeX, Music2 } from "lucide-react";
import type { DemoAudioAvailability } from "../audioPaths";

export function AudioStatusBadge({ availability }: { availability: DemoAudioAvailability }) {
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
