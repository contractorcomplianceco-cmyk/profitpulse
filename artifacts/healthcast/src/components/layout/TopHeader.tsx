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
    <header className="h-[64px] flex-shrink-0 border-b border-border/50 bg-card/60 backdrop-blur-2xl flex items-center justify-between px-4 z-30 relative shadow-sm">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <CcaLogo className="w-8 h-8 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="font-bold text-[15px] tracking-tight text-foreground leading-tight">CCA HealthCast OS</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-tight">Financial Health, Growth Intelligence & Futurecast Command Center</span>
        </div>
      </div>

      {/* Center/Right: Integrations */}
      <div className="hidden lg:flex items-center gap-3 mx-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Integrations Status</span>
        <div className="flex items-center gap-1">
          {INTEGRATIONS.map((integ) => {
            const Icon = integ.icon;
            return (
              <div key={integ.id} className="relative group">
                <div className="w-6 h-6 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors group-hover:border-border">
                  <Icon className="w-3 h-3" />
                </div>
                {integ.active && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border border-background shadow-[0_0_6px_hsl(var(--success)/0.5)]"></div>
                )}
              </div>
            );
          })}
          <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold ml-1">
            +5
          </div>
        </div>
      </div>

      {/* Far Right: User & Time */}
      <div className="flex items-center gap-4 text-sm">
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-foreground font-medium text-[13px]">May 13, 2025</span>
          <span className="text-muted-foreground text-[11px]">Tuesday, 8:30 AM</span>
        </div>
        
        <div className="hidden md:block w-px h-8 bg-border/50"></div>
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors border border-transparent hover:border-border/30">
          <div className="flex flex-col items-end text-right hidden sm:flex">
            <span className="text-[13px] font-semibold leading-tight">Rose / Owner</span>
            <span className="text-[11px] text-muted-foreground">CEO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-[0_0_10px_-2px_hsl(var(--primary)/0.3)]">
              R
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
