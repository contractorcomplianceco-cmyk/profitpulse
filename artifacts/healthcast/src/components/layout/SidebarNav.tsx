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
  Building2,
  Plug,
  Compass,
  PlayCircle,
  Megaphone,
  Palette
} from "lucide-react";
import { HealthScoreCard } from "./HealthScoreCard";
import { isNavActive } from "@/lib/profit-pulse/nav";
import { useAuth } from "@/context/AuthProvider";
import { useBilling } from "@/context/BillingProvider";
import { roleLabel } from "@/auth/permissions";
import { TenantSwitcher } from "@/components/auth/TenantSwitcher";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { demoConfig } from "@/brand/demoMode";
import { LogOut, User, UserPlus, ScrollText, CreditCard } from "lucide-react";
import { isPreviewModuleRoute } from "@/lib/profit-pulse/previewModules";
import { PreviewNavBadge } from "@/components/profit-pulse/PreviewNavBadge";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { href: "/welcome", label: "Welcome", icon: Compass },
      { href: "/", label: "Executive Overview", icon: LayoutDashboard },
      { href: "/copilot", label: "AI CFO Copilot", icon: Sparkles },
      { href: "/demo/", label: demoConfig.enterDemoLabel, icon: PlayCircle },
      { href: "/landing", label: "Marketing Site", icon: Megaphone },
      { href: "/settings", label: "White-Label Settings", icon: Palette },
      { href: "/team", label: "Team & Invites", icon: UserPlus, adminOnly: true },
      { href: "/audit", label: "Audit Log", icon: ScrollText, adminOnly: true },
      { href: "/billing", label: "Plans & Billing", icon: CreditCard, adminOnly: true },
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
      { href: "/scenario-builder", label: "Scenario Modeler", icon: SlidersHorizontal },
      { href: "/goals", label: "Goals & OKRs", icon: Trophy },
    ],
  },
  {
    title: "Governance",
    items: [
      { href: "/facility-intelligence", label: "Facility Intelligence", icon: Building2 },
      { href: "/compliance", label: "Compliance & Risk", icon: ShieldCheck },
      { href: "/alerts", label: "Alerts", icon: BellRing },
      { href: "/daily-briefing", label: "Daily Briefing", icon: Newspaper },
      { href: "/reports", label: "Reports & Exports", icon: FileText },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
];

export function SidebarNav() {
  const [location] = useLocation();
  const { session, user, tenant, canAccessSettings } = useAuth();
  const { canAccessRoute } = useBilling();

  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.href === "/settings" && !canAccessSettings) return false;
      if ("adminOnly" in item && item.adminOnly && !canAccessSettings) return false;
      const access = canAccessRoute(item.href);
      if ("allowed" in access && !access.allowed) return false;
      return true;
    }),
  }));

  return (
    <aside className="w-[260px] flex-shrink-0 border-r border-border surface-gradient flex flex-col relative z-20 shadow-[0_8px_24px_-18px_hsl(217_60%_20%_/_0.35)]">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none"></div>
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {sections.map((section, sectionIdx) => (
          <div key={section.title} className={cn(sectionIdx > 0 && "mt-6")}>
            <div className="px-4 mb-2">
              <h2 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">{section.title}</h2>
            </div>
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const isExternal = "external" in item && item.external;
                const isActive = !isExternal && isNavActive(location, item.href);
                const Icon = item.icon;
                const isPreview = isPreviewModuleRoute(item.href);

                const inner = (
                  <div
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-[13px] font-semibold relative overflow-hidden",
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-md shadow-primary/25 border border-primary/30"
                        : "text-muted-foreground hover:bg-accent/70 hover:text-foreground border border-transparent hover:border-primary/15 hover:translate-x-0.5"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-cyan shadow-[0_0_10px_hsl(var(--cyan))]" />
                    )}
                    <Icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                    <span className="truncate tracking-wide flex-1 min-w-0">{item.label}</span>
                    {isPreview && !isActive && <PreviewNavBadge />}
                  </div>
                );

                if (isExternal) {
                  return (
                    <a key={item.href} href={item.href}>
                      {inner}
                    </a>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}>
                    {inner}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {session && <TenantSwitcher />}

      {session && <PlanBadge />}

      {session && (
        <div className="border-t border-border px-4 py-3 space-y-2 bg-secondary/10">
          <div className="flex items-start gap-2 text-xs">
            <User className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold truncate">{user?.email ?? session.email}</p>
              <p className="text-muted-foreground truncate">{tenant?.name ?? "Workspace"}</p>
              <p className="text-[10px] uppercase tracking-wide text-primary font-bold mt-0.5">
                {roleLabel(session.role)}
              </p>
            </div>
          </div>
          <Link href="/auth/logout">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </div>
          </Link>
        </div>
      )}
      
      <HealthScoreCard />
    </aside>
  );
}
