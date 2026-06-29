import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { PlayCircle, ArrowRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { startGuidedTour } from "@/demo/GuidedTour";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isDemoMode, demoConfig } from "@/brand/demoMode";
import {
  dismissPopup,
  isPopupDismissed,
  isTourStarted,
  loadChecklist,
  markTourStarted,
  updateChecklistItem,
  type OnboardingChecklist,
} from "@/lib/profit-pulse/onboarding";

const BANNER_KEY = "pp_demo_banner_dismissed";

function tourWillAutostart(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("tour") === "1") return true;
  return isDemoMode;
}

function isBannerDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(BANNER_KEY) === "1";
  } catch {
    return false;
  }
}

function dismissBannerStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BANNER_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function DemoPromo() {
  const [, navigate] = useLocation();
  const [popupOpen, setPopupOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checklist, setChecklist] = useState<OnboardingChecklist>(() => loadChecklist());

  useEffect(() => {
    if (!isBannerDismissed()) setBannerVisible(true);
    if (!isPopupDismissed() && !tourWillAutostart()) {
      const t = setTimeout(() => setPopupOpen(true), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const handleDismissPopup = () => {
    setPopupOpen(false);
    dismissPopup();
  };

  const handleMaybeLater = () => {
    handleDismissPopup();
  };

  const handleTour = () => {
    handleDismissPopup();
    markTourStarted();
    setChecklist(updateChecklistItem("exploreDashboard", true));
    setChecklistOpen(true);
    startGuidedTour();
  };

  const dismissBanner = () => {
    setBannerVisible(false);
    dismissBannerStorage();
  };

  const checklistItems: { key: keyof OnboardingChecklist; label: string }[] = [
    { key: "exploreDashboard", label: "Explore the executive dashboard" },
    { key: "addRevenue", label: "Add or edit a revenue record" },
    { key: "reviewFacilities", label: "Review Facility Intelligence" },
    { key: "runScenario", label: "Run a scenario in the modeler" },
  ];

  const doneCount = checklistItems.filter((i) => checklist[i.key]).length;

  return (
    <>
      {bannerVisible && (
        <div className="relative z-20 flex items-center justify-center gap-3 px-10 py-2.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60 border-b border-primary/25 text-foreground">
          <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-[12.5px] font-semibold tracking-wide text-center">
            New — 90-second ProfitPulse video walkthrough. No login required.
          </span>
          <Link href="/demo/">
            <div className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-primary/15 hover:bg-primary/25 border border-primary/30 px-2.5 py-1 text-[12px] font-bold text-primary transition-colors cursor-pointer">
              {demoConfig.enterDemoLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss walkthrough banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <Dialog open={popupOpen} onOpenChange={(open) => { if (!open) handleDismissPopup(); }}>
        <DialogContent className="max-w-md overflow-hidden p-0 gap-0 [&>button]:text-white/60 [&>button]:hover:text-white [&>button]:z-10">
          <div className="bg-gradient-to-br from-[#071827] to-[#0c2740] px-6 pt-7 pb-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
              <PlayCircle className="w-6 h-6 text-cyan" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              ProfitPulse product demo
            </DialogTitle>
            <DialogDescription className="text-white/70 mt-2 text-sm leading-relaxed">
              Watch the video walkthrough first — cash, revenue, staffing, risk, and
              scenario modeling in under two minutes.
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-2.5 px-6 py-5 bg-background">
            <Button
              className="w-full gap-1.5"
              onClick={() => {
                handleDismissPopup();
                navigate("/demo/");
              }}
            >
              <PlayCircle className="w-4 h-4" />
              {demoConfig.enterDemoLabel}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleMaybeLater}>
                Maybe later
              </Button>
              <Button variant="outline" className="flex-1 gap-1.5" onClick={handleTour}>
                <Sparkles className="w-4 h-4" />
                Interactive tour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={checklistOpen} onOpenChange={setChecklistOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Onboarding Checklist</DialogTitle>
            <DialogDescription>
              {doneCount} of {checklistItems.length} complete — progress saved locally.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 py-2">
            {checklistItems.map((item) => (
              <li key={item.key} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className={`w-4 h-4 ${checklist[item.key] ? "text-success" : "text-muted-foreground"}`} />
                <span className={checklist[item.key] ? "line-through text-muted-foreground" : ""}>{item.label}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" onClick={() => setChecklistOpen(false)}>Continue</Button>
        </DialogContent>
      </Dialog>

      {isTourStarted() && doneCount < checklistItems.length && !checklistOpen && (
        <button
          type="button"
          onClick={() => setChecklistOpen(true)}
          className="fixed bottom-4 right-4 z-30 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-lg"
        >
          Checklist ({doneCount}/{checklistItems.length})
        </button>
      )}
    </>
  );
}
