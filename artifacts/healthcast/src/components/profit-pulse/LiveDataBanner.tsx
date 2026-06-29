import { Database } from "lucide-react";

interface LiveDataBannerProps {
  source?: string;
  detail?: string;
}

export function LiveDataBanner({ source = "Local data store", detail }: LiveDataBannerProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-2.5 text-[12px]">
      <Database className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="font-bold text-primary uppercase tracking-wide text-[10px]">Live metrics</span>
        <p className="text-muted-foreground mt-0.5 leading-relaxed">
          {source}
          {detail ? ` — ${detail}` : ""}
        </p>
      </div>
    </div>
  );
}
