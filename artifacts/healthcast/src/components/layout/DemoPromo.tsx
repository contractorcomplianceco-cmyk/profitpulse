import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { PlayCircle, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const POPUP_KEY = "hc_demo_popup_seen";
const BANNER_KEY = "hc_demo_banner_dismissed";

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function DemoPromo() {
  const [, navigate] = useLocation();
  const [popupOpen, setPopupOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!safeGet(BANNER_KEY)) setBannerVisible(true);
    if (!safeGet(POPUP_KEY)) {
      const t = setTimeout(() => setPopupOpen(true), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const dismissPopup = () => {
    setPopupOpen(false);
    safeSet(POPUP_KEY, "1");
  };

  const dismissBanner = () => {
    setBannerVisible(false);
    safeSet(BANNER_KEY, "1");
  };

  return (
    <>
      {bannerVisible && (
        <div className="relative z-20 flex items-center justify-center gap-3 px-10 py-2.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60 border-b border-primary/25 text-foreground">
          <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-[12.5px] font-semibold tracking-wide text-center">
            New — take the 90-second HealthCast walkthrough and see the full command center in action.
          </span>
          <Link href="/demo/">
            <div className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-primary/15 hover:bg-primary/25 border border-primary/30 px-2.5 py-1 text-[12px] font-bold text-primary transition-colors cursor-pointer">
              Watch now
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

      <Dialog
        open={popupOpen}
        onOpenChange={(open) => {
          if (!open) dismissPopup();
        }}
      >
        <DialogContent className="max-w-md overflow-hidden p-0 gap-0 [&>button]:text-white/60 [&>button]:hover:text-white [&>button]:z-10">
          <div className="bg-gradient-to-br from-[#071827] to-[#0c2740] px-6 pt-7 pb-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
              <PlayCircle className="w-6 h-6 text-cyan" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              See HealthCast in action
            </DialogTitle>
            <DialogDescription className="text-white/70 mt-2 text-sm leading-relaxed">
              Take a quick guided walkthrough of the command center — cash, revenue,
              staffing, risk, and live scenario modeling, all in one place.
            </DialogDescription>
          </div>
          <div className="flex gap-3 px-6 py-5 bg-background">
            <Button variant="outline" className="flex-1" onClick={dismissPopup}>
              Maybe later
            </Button>
            <Button
              className="flex-1 gap-1.5"
              onClick={() => {
                dismissPopup();
                navigate("/demo/");
              }}
            >
              Watch the walkthrough
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
