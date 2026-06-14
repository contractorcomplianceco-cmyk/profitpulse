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
    <aside className="w-[260px] flex-shrink-0 border-r border-border bg-card/80 flex flex-col relative z-20 shadow-xl shadow-black/20">
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <div className="px-4 mb-4">
          <h2 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Modules</h2>
        </div>
        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-[13px] font-semibold relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="truncate tracking-wide">{item.label}</span>
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
