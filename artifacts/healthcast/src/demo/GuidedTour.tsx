import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Pause,
  Sparkles,
  CalendarCheck,
  Rocket,
} from "lucide-react";
import { TOUR_STEPS, type TourStep } from "./tourSteps";
import { isDemoMode, demoConfig } from "@/brand/demoMode";
import { useProductFullName } from "@/brand/BrandProvider";

const AUTOPLAY_MS = 7000;
const SETTLE_MS = 650; // wait for route change + layout before measuring target

interface Rect { top: number; left: number; width: number; height: number; }

function shouldAutostart(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("tour") === "1") return true;
  // In the standalone demo build, offer the guided tour on first load.
  return isDemoMode;
}

export function GuidedTour() {
  const [, navigate] = useLocation();
  const productFullName = useProductFullName();

  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);

  const step: TourStep | undefined = TOUR_STEPS[index];

  // ── auto-start (demo build / ?tour=1) ──────────────────────────────────────
  useEffect(() => {
    if (!shouldAutostart()) return;
    const t = setTimeout(() => setActive(true), 900);
    return () => clearTimeout(t);
  }, []);

  // ── listen for a manual launch event (from Welcome / buttons) ──────────────
  useEffect(() => {
    const launch = () => { setIndex(0); setPlaying(true); setActive(true); };
    window.addEventListener("healthcast:start-tour", launch);
    return () => window.removeEventListener("healthcast:start-tour", launch);
  }, []);

  // ── navigate to the step's route, then measure the target ──────────────────
  useEffect(() => {
    if (!active || !step) return;
    setReady(false);
    navigate(step.route);
    const t = setTimeout(() => {
      measure();
      setReady(true);
    }, SETTLE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index]);

  const measure = useCallback(() => {
    if (!step?.target) { setRect(null); return; }
    const el = document.querySelector(step.target) as HTMLElement | null;
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // measure after scroll settles
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }, 300);
  }, [step]);

  // keep the spotlight aligned on resize/scroll
  useEffect(() => {
    if (!active) return;
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [active, measure]);

  // ── autoplay ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!active || !playing || !ready) return;
    if (index >= TOUR_STEPS.length - 1) return; // pause on finale
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, TOUR_STEPS.length - 1)), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, playing, ready, index]);

  const close = () => { setActive(false); setPlaying(false); };
  const next = () => setIndex((i) => Math.min(i + 1, TOUR_STEPS.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  if (!active || !step) return null;

  const isFinale = !!step.isFinale;
  const total = TOUR_STEPS.length;

  // ── callout positioning ────────────────────────────────────────────────────
  const calloutStyle = computeCalloutStyle(step, rect);

  return (
    <div className="fixed inset-0 z-[9999] hc-tour" aria-live="polite">
      {/* Spotlight overlay: 4 dim panels around the target, or full dim if centered */}
      {rect && step.target ? (
        <SpotlightMask rect={rect} />
      ) : (
        <div className="absolute inset-0 bg-[#06122a]/70 backdrop-blur-[2px]" onClick={() => setPlaying(false)} />
      )}

      {/* Highlight ring around the target */}
      {rect && step.target && (
        <motion.div
          layout
          className="absolute rounded-xl pointer-events-none"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 9999px rgba(6,18,42,0.70)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      )}

      {/* Callout card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="absolute w-[min(92vw,420px)] pointer-events-auto"
          style={calloutStyle}
        >
          <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
            {/* accent header */}
            <div className="bg-gradient-primary px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-foreground">
                {isFinale ? <Rocket className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span className="text-[12px] font-bold uppercase tracking-wide">
                  {isFinale ? "Get started" : `Guided tour · ${index + 1} of ${total}`}
                </span>
              </div>
              <button onClick={close} aria-label="Close tour" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-[17px] font-extrabold tracking-tight text-brand-navy mb-2">{step.title}</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">{step.body}</p>

              {isFinale && (
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <a
                    href={demoConfig.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-[13px] font-bold py-2.5 hover:opacity-90 transition-opacity"
                  >
                    <Rocket className="w-4 h-4" /> Start free trial
                  </a>
                  <a
                    href={demoConfig.secondaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border text-foreground text-[13px] font-semibold py-2.5 hover:bg-secondary/50 transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book a walkthrough
                  </a>
                </div>
              )}

              {/* progress dots */}
              <div className="flex items-center gap-1.5 mt-4 mb-3">
                {TOUR_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/40"}`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              {/* controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prev}
                  disabled={index === 0}
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <div className="flex items-center gap-2">
                  {!isFinale && (
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {playing ? "Pause" : "Play"}
                    </button>
                  )}
                  {index < total - 1 ? (
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-[12.5px] font-bold px-3.5 py-2 hover:opacity-90 transition-opacity"
                    >
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={close}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border text-foreground text-[12.5px] font-bold px-3.5 py-2 hover:bg-secondary/50 transition-colors"
                    >
                      Explore on my own
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Four dim panels surrounding the spotlight (keeps the target fully bright). */
function SpotlightMask({ rect }: { rect: Rect }) {
  const pad = 8;
  const t = rect.top - pad;
  const l = rect.left - pad;
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;
  const dim = "bg-[#06122a]/70 backdrop-blur-[1px]";
  return (
    <>
      <div className={`absolute left-0 right-0 top-0 ${dim}`} style={{ height: Math.max(0, t) }} />
      <div className={`absolute left-0 bottom-0 ${dim}`} style={{ top: t + h, right: 0 }} />
      <div className={`absolute left-0 ${dim}`} style={{ top: t, height: h, width: Math.max(0, l) }} />
      <div className={`absolute ${dim}`} style={{ top: t, height: h, left: l + w, right: 0 }} />
    </>
  );
}

/** Position the callout near the target, or centered when there's no target. */
function computeCalloutStyle(step: TourStep, rect: Rect | null): React.CSSProperties {
  if (!rect || !step.target || step.placement === "center") {
    return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }
  const gap = 22;
  const cardW = Math.min(420, window.innerWidth * 0.92);
  const place = step.placement ?? "bottom";

  if (place === "right") {
    const left = Math.min(rect.left + rect.width + gap, window.innerWidth - cardW - 16);
    return { top: clampTop(rect.top), left };
  }
  if (place === "left") {
    const left = Math.max(16, rect.left - cardW - gap);
    return { top: clampTop(rect.top), left };
  }
  if (place === "top") {
    return { top: Math.max(16, rect.top - gap), left: clampLeft(rect.left, cardW), transform: "translateY(-100%)" };
  }
  // bottom
  return { top: rect.top + rect.height + gap, left: clampLeft(rect.left, cardW) };
}

function clampTop(top: number) {
  return Math.max(16, Math.min(top, window.innerHeight - 360));
}
function clampLeft(left: number, cardW: number) {
  return Math.max(16, Math.min(left, window.innerWidth - cardW - 16));
}

/** Programmatic launch helper for buttons elsewhere in the app. */
export function startGuidedTour() {
  window.dispatchEvent(new Event("healthcast:start-tour"));
}
