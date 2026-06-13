import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  DollarSign, 
  LineChart, 
  PieChart, 
  Wallet, 
  Target, 
  BarChart3, 
  Users, 
  Activity, 
  Briefcase, 
  History, 
  Globe2, 
  FastForward, 
  SlidersHorizontal, 
  BellRing, 
  Newspaper, 
  FileText,
  Plug
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Executive Overview", icon: LayoutDashboard },
  { href: "/cash-flow", label: "Cash Flow", icon: DollarSign },
  { href: "/revenue-intelligence", label: "Revenue Intelligence", icon: LineChart },
  { href: "/profitability", label: "Profitability", icon: PieChart },
  { href: "/ar-ap-collections", label: "AR/AP & Collections", icon: Wallet },
  { href: "/marketing-roi", label: "Marketing ROI", icon: Target },
  { href: "/sales-pipeline", label: "Sales Pipeline", icon: BarChart3 },
  { href: "/staffing-payroll", label: "Staffing & Payroll", icon: Users },
  { href: "/department-performance", label: "Department Performance", icon: Activity },
  { href: "/client-profitability", label: "Client Profitability", icon: Briefcase },
  { href: "/historical-trends", label: "Historical Trends", icon: History },
  { href: "/market-economy", label: "Market & Economy", icon: Globe2 },
  { href: "/futurecast", label: "Futurecast", icon: FastForward },
  { href: "/scenario-builder", label: "Scenario Builder", icon: SlidersHorizontal },
  { href: "/alerts", label: "Alerts Engine", icon: BellRing },
  { href: "/daily-briefing", label: "Daily Briefing", icon: Newspaper },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/integrations", label: "Integrations", icon: Plug },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-card/50 flex flex-col backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary font-bold text-lg leading-none tracking-tighter">OS</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">CCA HealthCast</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold border border-border">
              CEO
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">CFO Terminal</span>
              <span className="text-xs text-success mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span> All systems operational
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0"></div>
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="p-8 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}