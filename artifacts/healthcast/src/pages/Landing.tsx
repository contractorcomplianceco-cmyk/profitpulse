import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { startGuidedTour } from "@/demo/GuidedTour";
import { isDemoMode, demoConfig } from "@/brand/demoMode";
import { X, Rocket } from "lucide-react";
import DemoPlayer from "@/demo/DemoPlayer";
import "@/demo/demo.css";
import {
  ArrowRight,
  Check,
  LineChart,
  ShieldCheck,
  Wallet,
  Target,
  Gauge,
  Bell,
  Sparkles,
  PlayCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand, useProductFullName } from "@/brand/BrandProvider";
import { useDemoFunnel } from "@/demo/DemoFunnel";
import { asset, resolveAsset } from "@/lib/asset";

// The interactive app/dashboard lives at the root path in both the live product
// and the standalone demo build (the demo ribbon frames it as a demo).
const APP_HREF = "/";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: "spring" as const, stiffness: 80, damping: 16 },
  }),
};

const FEATURES = [
  {
    icon: Wallet,
    title: "Cash Flow & Runway",
    desc: "See your 90-day cash projection, runway, and the exact day a pinch could hit — before it does.",
  },
  {
    icon: LineChart,
    title: "Revenue Intelligence",
    desc: "Collected vs. booked revenue, recurring coverage, and margin trends across every service line.",
  },
  {
    icon: Target,
    title: "Marketing & Pipeline ROI",
    desc: "True ROI by channel and a pipeline-to-cash view that ties every lead back to collected profit.",
  },
  {
    icon: Gauge,
    title: "Live Scenario Modeling",
    desc: "Move the levers — hires, pricing, ad spend — and watch profit, cash, and risk recompute instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Risk",
    desc: "Built by compliance experts. Track exposure, licensing, and client risk in one governed view.",
  },
  {
    icon: Bell,
    title: "Alerts & Daily Briefing",
    desc: "An executive briefing every morning: what improved, what got worse, and the 5 actions that matter today.",
  },
];

const AUDIENCE = [
  "General contractors & specialty trades",
  "Multi-crew and multi-location operators",
  "Compliance and licensing-driven businesses",
  "Owners who want a CFO view without a CFO salary",
];

const PLANS = [
  {
    name: "Foundation",
    price: "$199",
    cadence: "/mo",
    tagline: "For owner-operators getting a grip on the numbers.",
    features: [
      "Executive Overview & Cash Flow",
      "Revenue, Profitability & AR/AP",
      "Daily briefing + alerts",
      "1 connected accounting source",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Command",
    price: "$449",
    cadence: "/mo",
    tagline: "The full command center for growing contractors.",
    features: [
      "Everything in Foundation",
      "Scenario Builder & Futurecast",
      "Marketing & Pipeline ROI",
      "Accounting + CRM + ad platform sync",
      "AI CFO Copilot",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    tagline: "Multi-entity, white-label, and reseller options.",
    features: [
      "Everything in Command",
      "Multi-company rollups",
      "White-label branding",
      "Priority onboarding & support",
      "Custom integrations",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export default function Landing() {
  const { brand } = useBrand();
  const productFullName = useProductFullName();
  const { submitLead } = useDemoFunnel();
  const [, navigate] = useLocation();
  const [startPopup, setStartPopup] = useState(false);

  // Bypass the lead gate and go straight into the live dashboard.
  const skipToDashboard = () => {
    submitLead({ name: "Guest", email: "", company: "", phone: "" });
    setStartPopup(false);
    navigate("/");
  };

  // In the demo build, pop up the video walkthrough on load.
  useEffect(() => {
    if (!isDemoMode) return;
    const t = setTimeout(() => setStartPopup(true), 1100);
    return () => clearTimeout(t);
  }, []);

  // Video-first client demo at /demo (public, no login).
  const enterVideoDemo = () => navigate("/demo/");

  // Interactive sandbox with sample data (lead gate in demo build).
  const startInteractiveSandbox = () => {
    if (isDemoMode) {
      navigate("/request-demo");
      return;
    }
    navigate("/");
    setTimeout(() => startGuidedTour(), 400);
  };
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased relative overflow-x-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.5] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.07] via-background/0 to-background/0 z-0" />

      {/* Nav */}
      <header className="relative z-10 max-w-[1200px] mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src={resolveAsset(brand.logoSrc)} alt={productFullName} className="w-10 h-10 object-contain" />
          <span className="font-extrabold text-[18px] tracking-tight">
            <span className="text-brand-navy">{brand.productName}</span>
            <span className="text-brand-teal">{brand.productSuffix}</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#who" className="hover:text-foreground transition-colors">Who it's for</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/demo/">
            <Button size="sm" className="gap-1.5">
              <PlayCircle className="w-4 h-4" /> {demoConfig.enterDemoLabel}
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={skipToDashboard}>
            Open app <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 pt-12 pb-16 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/60 px-4 py-1.5 text-[12px] font-bold text-primary mb-7"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Built for contractors, by compliance experts
        </motion.div>
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={1}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-[1.05] max-w-4xl mx-auto"
        >
          The financial command center
          <br className="hidden md:block" /> built for{" "}
          <span className="text-gradient-primary">contractors</span>.
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={2}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Cash flow, profit, pipeline, and risk in one live executive view. {productFullName} turns
          your accounting, CRM, and ad platforms into the kind of insight that used to take a CFO.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={3}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/demo/">
            <Button size="lg" className="gap-2 text-[15px] px-7 h-12">
              <PlayCircle className="w-4.5 h-4.5" /> {demoConfig.enterDemoLabel}
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={startInteractiveSandbox} className="gap-2 text-[15px] px-7 h-12">
            <Sparkles className="w-4.5 h-4.5" /> Try interactive sandbox
          </Button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 60, damping: 18 }}
          className="mt-14 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/15 to-cyan/10 blur-3xl rounded-3xl pointer-events-none" />
          <div className="relative rounded-2xl border border-border shadow-soft-lg overflow-hidden bg-card">
            <img
              src={asset("brand/redesign-mockup.jpg")}
              alt={`${productFullName} executive dashboard`}
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-navy">
            Everything you need to run the numbers
          </h2>
          <p className="mt-4 text-muted-foreground font-medium">
            Eighteen connected views, one source of truth — from daily cash to long-range futurecast.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.05 }}
                variants={fadeUp}
                custom={i}
                className="bg-card border border-border rounded-xl p-6 shadow-soft hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 accent-topline relative overflow-hidden"
              >
                <div className="w-11 h-11 rounded-lg bg-accent border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-[16px] text-foreground mb-2">{f.title}</h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Who it's for */}
      <section id="who" className="relative z-10 max-w-[1200px] mx-auto px-6 py-16">
        <div className="bg-primary rounded-2xl p-10 md:p-14 relative overflow-hidden shadow-soft-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-bold text-primary-foreground mb-5">
                <Building2 className="w-3.5 h-3.5" /> Who it's for
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                Made for the way contractors actually run their business.
              </h2>
              <p className="mt-4 text-primary-foreground/80 font-medium leading-relaxed">
                {productFullName} was built inside a real contractor-compliance operation — so the
                metrics, alerts, and language fit your world out of the box.
              </p>
            </div>
            <ul className="space-y-3.5">
              {AUDIENCE.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </span>
                  <span className="text-primary-foreground font-semibold text-[15px]">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-navy">
            Simple pricing that scales with you
          </h2>
          <p className="mt-4 text-muted-foreground font-medium">
            Start with a 14-day free trial. No card required. Cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              variants={fadeUp}
              custom={i}
              className={`rounded-2xl p-7 flex flex-col relative ${
                p.highlighted
                  ? "bg-card border-2 border-primary shadow-soft-lg"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most popular
                </span>
              )}
              <h3 className="font-extrabold text-[18px] text-brand-navy">{p.name}</h3>
              <p className="text-[13px] text-muted-foreground mt-1.5 mb-5 leading-snug min-h-[40px]">
                {p.tagline}
              </p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-extrabold text-foreground">{p.price}</span>
                <span className="text-muted-foreground font-semibold mb-1.5">{p.cadence}</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={APP_HREF}>
                <Button
                  className="w-full gap-1.5"
                  variant={p.highlighted ? "default" : "outline"}
                >
                  {p.cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-navy max-w-2xl mx-auto">
          Stop guessing. Start running your business from the numbers.
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/demo/">
            <Button size="lg" className="gap-2 text-[15px] px-8 h-12">
              <PlayCircle className="w-4.5 h-4.5" /> {demoConfig.enterDemoLabel}
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={startInteractiveSandbox} className="gap-2 text-[15px] px-8 h-12">
            <Sparkles className="w-4.5 h-4.5" /> Try interactive sandbox
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={resolveAsset(brand.logoSrc)} alt={productFullName} className="w-7 h-7 object-contain" />
            <span className="font-bold text-[14px]">
              <span className="text-brand-navy">{brand.productName}</span>
              <span className="text-brand-teal">{brand.productSuffix}</span>
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground font-medium">
            © {new Date().getFullYear()} {brand.companyName}. {brand.website}
          </p>
        </div>
      </footer>

      {/* Demo build: video walkthrough popup on load */}
      <AnimatePresence>
        {startPopup && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6 bg-[#06122a]/80 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStartPopup(false)}
          >
            <motion.div
              className="w-full max-w-[860px] max-h-[92vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-primary px-5 py-2.5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Rocket className="w-4 h-4" />
                  <span className="text-[12px] font-bold uppercase tracking-wide">See {productFullName} in action</span>
                </div>
                <button onClick={() => setStartPopup(false)} aria-label="Close video" className="text-primary-foreground/80 hover:text-primary-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video walkthrough: 16:9 video with controls BELOW (never overlapping) */}
              <div className="hc-demo w-full bg-[#06366B] flex-shrink-0 overflow-y-auto">
                <DemoPlayer controlsBelow loop={false} alwaysShowControls />
              </div>

              {/* Footer CTA — flow into the live demo */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 bg-background border-t border-border">
                <p className="text-[12.5px] text-muted-foreground">
                  Want to click around yourself? Jump into the live demo with sample data.
                </p>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button onClick={skipToDashboard} className="text-[12.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2">
                    Skip to dashboard
                  </button>
                  <Button className="gap-2 flex-1 sm:flex-none" onClick={() => { setStartPopup(false); enterVideoDemo(); }}>
                    <PlayCircle className="w-4 h-4" /> {demoConfig.enterDemoLabel}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
