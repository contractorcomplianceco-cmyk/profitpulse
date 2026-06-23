import { ShieldAlert } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { SidebarNav } from "./SidebarNav";
import { DemoPromo } from "./DemoPromo";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans relative selection:bg-primary/30">
      {/* Layered ambient backdrop for depth */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.4] z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-background/0 to-background z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan/10 via-background/0 to-background/0 z-0"></div>
      <div className="absolute -top-24 left-1/3 w-[480px] h-[480px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Top Header */}
      <TopHeader />

      {/* Walkthrough promo banner + first-visit popup */}
      <DemoPromo />

      {/* Internal demo disclosure banner */}
      <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-2 border-b border-amber-500/40 bg-amber-50 text-amber-900">
        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
        <span className="text-[12px] font-semibold tracking-wide text-center">
          Internal demo — fictional healthcare operations data only. Not connected to live systems.
        </span>
      </div>

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
