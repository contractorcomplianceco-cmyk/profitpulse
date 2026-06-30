import { Info } from "lucide-react";

export function PreviewModuleBanner({ detail }: { detail?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-[12px]">
      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide text-[10px]">
          Preview module · sample data
        </p>
        <p className="text-muted-foreground mt-0.5 leading-relaxed">
          {detail ??
            "Illustrative UI only — not connected to live AI, accounting systems, or a production backend."}
        </p>
      </div>
    </div>
  );
}
