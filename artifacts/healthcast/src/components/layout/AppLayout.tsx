import { Database } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { SidebarNav } from "./SidebarNav";
import { DemoPromo } from "./DemoPromo";
import { brand } from "@/brand/brandConfig";

const CAPTURE_MODE = false;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans relative selection:bg-primary/30">
      {/* Subtle light ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.5] z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.06] via-background/0 to-background/0 z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan/[0.05] via-background/0 to-background/0 z-0"></div>

      {/* Top Header */}
      <TopHeader />

      {/* Walkthrough promo banner + first-visit popup */}
      {!CAPTURE_MODE && <DemoPromo />}

      {/* Sample-data note (neutral, white-label) */}
      {!CAPTURE_MODE && brand.showSampleDataNote && (
        <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-1.5 border-b border-border bg-secondary/40 text-muted-foreground">
          <Database className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
          <span className="text-[12px] font-medium tracking-wide text-center">
            {brand.sampleDataNote}
          </span>
        </div>
      )}

      {/* Bottom Area: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <SidebarNav />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-6 md:p-8 w-full min-h-full flex flex-col max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
