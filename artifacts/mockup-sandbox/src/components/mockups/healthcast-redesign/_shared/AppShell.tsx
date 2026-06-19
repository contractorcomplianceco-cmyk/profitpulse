import { motion } from "framer-motion";
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
  Compass,
  BookOpen,
  BarChart2,
  Share2,
  Linkedin,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

const CURRENT_PATH = "/";

function Link({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a className={className} role="link" data-href={href}>
      {children}
    </a>
  );
}

function CcaLogo({ className }: { className?: string }) {
  return (
    <img
      src="/__mockup/images/cca-crest.png"
      alt="CCA HealthCast OS"
      className={`object-contain${className ? ` ${className}` : ""}`}
    />
  );
}

const INTEGRATIONS = [
  { id: "zoho-books", icon: BookOpen, active: true },
  { id: "zoho-crm", icon: Users, active: true },
  { id: "zoho-analytics", icon: BarChart2, active: true },
  { id: "google-ads", icon: Target, active: true },
  { id: "google-analytics", icon: LineChart, active: true },
  { id: "meta-ads", icon: Share2, active: true },
  { id: "linkedin", icon: Linkedin, active: false },
  { id: "phone", icon: Phone, active: true },
  { id: "email", icon: Mail, active: true },
];

function TopHeader() {
  return (
    <header className="h-[72px] flex-shrink-0 border-b border-border surface-gradient-accent flex items-center justify-between px-6 z-30 relative shadow-lg shadow-black/30 accent-topline">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"></div>
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        <CcaLogo className="w-10 h-10 flex-shrink-0 drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
        <div className="flex flex-col">
          <span className="font-extrabold text-[16px] tracking-tight leading-none">
            <span className="text-foreground">HealthCast</span><span className="text-cyan">OS</span>
          </span>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-relaxed mt-0.5">Financial Health, Growth Intelligence &amp; Futurecast Command Center</span>
        </div>
      </div>

      {/* Center/Right: Integrations */}
      <div className="hidden lg:flex items-center gap-4 mx-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrations</span>
        <div className="flex items-center gap-1.5">
          {INTEGRATIONS.map((integ) => {
            const Icon = integ.icon;
            return (
              <div key={integ.id} className="relative group cursor-pointer">
                <div className="w-7 h-7 rounded-md bg-secondary/30 border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/15 group-hover:border-primary/40 group-hover:shadow-[0_0_12px_-2px_hsl(var(--primary)/0.6)] transition-all duration-200">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {integ.active && (
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-success border-2 border-card shadow-[0_0_8px_hsl(var(--success))]"></div>
                )}
              </div>
            );
          })}
          <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-[11px] font-bold ml-1 shadow-[0_0_12px_-4px_hsl(var(--primary)/0.7)]">
            +5
          </div>
        </div>
      </div>

      {/* Far Right: User & Time */}
      <div className="flex items-center gap-6 text-sm">
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-foreground font-semibold text-[13px] tracking-wide">May 13, 2025</span>
          <span className="text-muted-foreground text-[11px] font-medium tracking-wide">Tuesday, 8:30 AM</span>
        </div>

        <div className="hidden md:block w-px h-10 bg-border"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary/40 p-2 rounded-xl transition-colors border border-transparent">
          <div className="flex flex-col items-end text-right hidden sm:flex">
            <span className="text-[13px] font-bold leading-none tracking-wide text-foreground">Rose / Owner</span>
            <span className="text-[11px] font-semibold text-primary uppercase tracking-widest mt-1">CEO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary border border-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30 text-lg">
              R
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}

function HealthScoreCard() {
  const score = 82;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 border-t border-border surface-gradient-accent relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/15 via-cyan/5 to-transparent opacity-70 z-0"></div>

      <div className="relative z-10">
        <h4 className="text-[10px] tracking-widest text-muted-foreground uppercase mb-4 font-extrabold">Financial Health Score</h4>

        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            {/* Background Track */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r={radius} stroke="hsl(var(--muted)/0.4)" strokeWidth="8" fill="none" />
              {/* Progress Ring */}
              <motion.circle
                cx="40"
                cy="40"
                r={radius}
                stroke="url(#health-gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
              <defs>
                <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--cyan))" />
                  <stop offset="50%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--success))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center justify-center bg-background rounded-full w-14 h-14 shadow-inner ring-1 ring-primary/20 shadow-[inset_0_0_12px_-2px_hsl(var(--primary)/0.4)]">
              <span className="text-xl font-black tracking-tighter text-gradient-primary">{score}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] font-bold text-foreground">Very Healthy</span>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="text-success flex items-center bg-success/15 px-1.5 py-0.5 rounded text-[10px]">
                +12 pts
              </span>
              <span className="text-muted-foreground uppercase tracking-widest text-[9px] ml-1">/ 30d</span>
            </div>
            {/* Tiny sparkline */}
            <svg width="48" height="12" viewBox="0 0 48 12" className="mt-1">
              <path d="M0 10 L10 8 L20 9 L30 5 L40 6 L48 2" fill="none" stroke="hsl(var(--success))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function SidebarNav() {
  const location = CURRENT_PATH;

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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen min-h-screen bg-background text-foreground overflow-hidden font-sans relative selection:bg-primary/30">
      {/* Layered ambient backdrop for depth */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.4] z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-background/0 to-background z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan/10 via-background/0 to-background/0 z-0"></div>
      <div className="absolute -top-24 left-1/3 w-[480px] h-[480px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Top Header */}
      <TopHeader />

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
