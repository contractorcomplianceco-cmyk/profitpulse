import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative">
      <div className="relative pl-4">
        <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-gradient-to-b from-cyan via-primary to-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)]" />
        <h1 className="text-3xl font-black tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-[14px] font-medium text-muted-foreground mt-2 max-w-2xl">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 font-bold tracking-wide transition-colors" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}