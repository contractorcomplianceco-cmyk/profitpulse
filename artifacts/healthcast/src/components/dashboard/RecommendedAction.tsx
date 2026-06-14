import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RecommendedActionProps {
  title: string;
  description: string;
  actionText: string;
  onAction?: () => void;
}

export function RecommendedAction({ title, description, actionText, onAction }: RecommendedActionProps) {
  return (
    <div className="flex flex-col items-start gap-5 p-6 rounded-xl surface-gradient-accent border-2 border-primary/30 shadow-lg shadow-primary/15 relative overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors" />
      <div className="min-w-0 relative">
        <h4 className="font-extrabold text-[14px] text-foreground tracking-wide">{title}</h4>
        <p className="text-[13px] text-muted-foreground mt-1.5 font-medium">{description}</p>
      </div>
      <Button onClick={onAction} className="shrink-0 self-start font-bold tracking-wide bg-gradient-primary shadow-md shadow-primary/40 relative">
        {actionText}
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}