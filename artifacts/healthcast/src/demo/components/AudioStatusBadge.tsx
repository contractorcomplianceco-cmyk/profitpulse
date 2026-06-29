import { VolumeX } from "lucide-react";
import type { DemoAudioStatus } from "../audioPaths";

/** Shown only when demo audio files are missing — walkthrough still runs. */
export function AudioStatusBadge({ status }: { status: DemoAudioStatus }) {
  if (status !== "unavailable") return null;

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm pointer-events-none max-w-[min(100%,20rem)]"
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
