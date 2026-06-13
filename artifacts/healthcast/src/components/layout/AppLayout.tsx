import { TopHeader } from "./TopHeader";
import { SidebarNav } from "./SidebarNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans relative">
      {/* Global Background Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0"></div>
      
      {/* Top Header */}
      <TopHeader />

      {/* Bottom Area: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <SidebarNav />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-4 w-full min-h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
