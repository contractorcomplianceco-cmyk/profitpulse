import { CcaLogo } from "./CcaLogo";
import { 
  BookOpen, 
  Users, 
  BarChart2, 
  Target, 
  LineChart, 
  Share2, 
  Linkedin, 
  Phone, 
  Mail, 
  ChevronDown 
} from "lucide-react";

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

export function TopHeader() {
  return (
    <header className="h-[72px] flex-shrink-0 border-b border-border surface-gradient-accent flex items-center justify-between px-6 z-30 relative shadow-lg shadow-black/30 accent-topline">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"></div>
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        <CcaLogo className="w-10 h-10 flex-shrink-0 drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
        <div className="flex flex-col">
          <span className="font-extrabold text-[16px] tracking-tight leading-none">
            <span className="text-white">HealthCast</span><span className="text-cyan">OS</span>
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
