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
    <div className="flex flex-col items-start gap-5 p-6 rounded-xl bg-primary/10 border-2 border-primary/30 shadow-lg shadow-primary/10">
      <div className="min-w-0">
        <h4 className="font-extrabold text-[14px] text-foreground tracking-wide">{title}</h4>
        <p className="text-[13px] text-muted-foreground mt-1.5 font-medium">{description}</p>
      </div>
      <Button onClick={onAction} className="shrink-0 self-start font-bold tracking-wide shadow-md shadow-primary/30">
        {actionText}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}