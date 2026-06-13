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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-card/80 border border-border">
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Button onClick={onAction} className="shrink-0">
        {actionText}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}