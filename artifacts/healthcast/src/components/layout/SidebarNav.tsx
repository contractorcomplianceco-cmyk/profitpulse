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
  FileText,
  Sparkles,
  Trophy,
  CalendarClock,
  ShieldCheck,
  Compass
} from "lucide-react";
import { HealthScoreCard } from "./HealthScoreCard";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { href: "/welcome", label: "Welcome", icon: Compass },
      { href: "/", label: "Executive Overview", icon: LayoutDashboard },
      { href: "/copilot", label: "AI CFO Copilot", icon: Sparkles },
    ],
  },
  {
    title: "Financials",
    items: [
      { href: "/cash-flow", label: "Cash Flow", icon: DollarSign },
      { href: "/cash-calendar", label: "Cash Calendar", icon: CalendarClock },
      { href: "/revenue-intelligence", label: "Revenue Intelligence", icon: LineChart },
      { href: "/profitability", label: "Profitability", icon: PieChart },
      { href: "/ar-ap-collections", label: "AR/AP & Collections", icon: Wallet },
    ],
  },
  {
    title: "Growth & Sales",
    items: [
      { href: "/marketing-roi", label: "Marketing ROI", icon: Target },
      { href: "/sales-pipeline", label: "Sales Pipeline", icon: BarChart3 },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/staffing-payroll", label: "Staffing & Payroll", icon: Users },
      { href: "/department-performance", label: "Department Performance", icon: Activity },
      { href: "/client-profitability", label: "Client Profitability", icon: Briefcase },
    ],
  },
  {
    title: "Intelligence & Planning",
    items: [
      { href: "/historical-trends", label: "Historical Trends", icon: History },
      { href: "/market-economy", label: "Market & Economy", icon: Globe2 },
      { href: "/futurecast", label: "Futurecast", icon: FastForward },
      { href: "/scenario-builder", label: "Scenario Builder", icon: SlidersHorizontal },
      { href: "/goals", label: "Goals & OKRs", icon: Trophy },
    ],
  },
  {
    title: "Governance",
    items: [
      { href: "/compliance", label: "Compliance & Risk", icon: ShieldCheck },
      { href: "/alerts", label: "Alerts", icon: BellRing },
      { href: "/daily-briefing", label: "Daily Briefing", icon: Newspaper },
      { href: "/reports", label: "Reports & Exports", icon: FileText },
    ],
  },
];

export function SidebarNav() {
  const [location] = useLocation();

  return (
    <aside className="w-[260px] flex-shrink-0 border-r border-border surface-gradient flex flex-col relative z-20 shadow-xl shadow-black/30">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none"></div>
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.title} className={cn(sectionIdx > 0 && "mt-6")}>
            <div className="px-4 mb-2">
              <h2 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">{section.title}</h2>
            </div>
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-[13px] font-semibold relative overflow-hidden",
                        isActive
                          ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/30 border border-primary/40"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent hover:border-primary/20 hover:translate-x-0.5"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-cyan shadow-[0_0_10px_hsl(var(--cyan))]" />
                      )}
                      <Icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                      <span className="truncate tracking-wide">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      <HealthScoreCard />
    </aside>
  );
}
