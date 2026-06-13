import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
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
  FileText
} from "lucide-react";
import { HealthScoreCard } from "./HealthScoreCard";

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
  { href: "/alerts", label: "Alerts", icon: BellRing },
  { href: "/daily-briefing", label: "Daily Briefing", icon: Newspaper },
  { href: "/reports", label: "Reports & Exports", icon: FileText },
];

export function SidebarNav() {
  const [location] = useLocation();

  return (
    <aside className="w-[230px] flex-shrink-0 border-r border-border/50 bg-card/40 flex flex-col backdrop-blur-xl relative z-20">
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-2">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
            const Icon = item.icon;
            const indexStr = (idx + 1).toString().padStart(2, "0");
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-all duration-200 cursor-pointer text-[13px] font-medium relative",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.2)]"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full shadow-[0_0_8px_1px_hsl(var(--primary))]"></div>
                  )}
                  <span className={cn("text-[10px] w-4 opacity-50 font-mono tracking-tighter", isActive ? "text-primary" : "")}>{indexStr}</span>
                  <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="truncate">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <HealthScoreCard />
    </aside>
  );
}
