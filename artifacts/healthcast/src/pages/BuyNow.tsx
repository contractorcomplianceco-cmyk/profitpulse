import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand, useProductFullName } from "@/brand/BrandProvider";
import { resolveAsset } from "@/lib/asset";

const PLANS = [
  {
    id: "foundation",
    name: "Foundation",
    price: 199,
    tagline: "For owner-operators getting a grip on the numbers.",
    features: ["Executive Overview & Cash Flow", "Revenue, Profitability & AR/AP", "Daily briefing + alerts", "1 connected accounting source"],
  },
  {
    id: "command",
    name: "Command",
    price: 449,
    tagline: "The full command center for growing contractors.",
    features: ["Everything in Foundation", "Scenario Builder & Futurecast", "Marketing & Pipeline ROI", "Accounting + CRM + ad sync", "AI CFO Copilot"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    tagline: "Multi-entity, white-label, and reseller options.",
    features: ["Everything in Command", "Multi-company rollups", "White-label branding", "Priority onboarding & support", "Custom integrations"],
  },
];

export default function BuyNow() {
  const { brand } = useBrand();
  const productFullName = useProductFullName();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [selected, setSelected] = useState("command");

  const price = (p: number | null) => {
    if (p === null) return "Custom";
    const v = billing === "annual" ? Math.round(p * 0.8) : p;
    return `$${v}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.5] z-0" />

      <header className="relative z-10 max-w-[1100px] mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/landing">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <img src={resolveAsset(brand.logoSrc)} alt={productFullName} className="w-9 h-9 object-contain" />
            <span className="font-extrabold text-[17px]">
              <span className="text-brand-navy">{brand.productName}</span><span className="text-brand-teal">{brand.productSuffix}</span>
            </span>
          </div>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="w-4 h-4" /> Back to demo</Button>
        </Link>
      </header>

      <main className="relative z-10 max-w-[1100px] mx-auto px-6 py-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-navy">Choose your plan</h1>
          <p className="mt-3 text-muted-foreground font-medium">Start today. Cancel anytime. 14-day money-back guarantee.</p>
          {/* billing toggle */}
          <div className="inline-flex items-center gap-1 mt-5 rounded-full border border-border bg-card p-1">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-4 py-1.5 rounded-full text-[12.5px] font-bold capitalize transition-colors ${billing === b ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {b}{b === "annual" ? " (-20%)" : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-8">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`text-left rounded-2xl p-6 flex flex-col relative transition-all ${
                selected === p.id ? "bg-card border-2 border-primary shadow-soft-lg" : "bg-card border border-border shadow-soft hover:border-primary/40"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full">Most popular</span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-[17px] text-brand-navy">{p.name}</h3>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === p.id ? "border-primary bg-primary" : "border-border"}`}>
                  {selected === p.id && <Check className="w-3 h-3 text-primary-foreground" />}
                </span>
              </div>
              <p className="text-[12.5px] text-muted-foreground mt-1.5 mb-4 min-h-[36px]">{p.tagline}</p>
              <div className="flex items-end gap-1 mb-5">
                <span className="text-3xl font-extrabold text-foreground">{price(p.price)}</span>
                {p.price !== null && <span className="text-muted-foreground font-semibold mb-1 text-[13px]">/mo</span>}
              </div>
              <ul className="space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12.5px]">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-[13px] font-bold uppercase tracking-wide text-foreground">Checkout</span>
          </div>
          <p className="text-[13px] text-muted-foreground mb-5">
            You selected <span className="font-bold text-foreground">{PLANS.find((p) => p.id === selected)?.name}</span>
            {selected !== "enterprise" ? <> — billed {billing}.</> : <> — our team will tailor a quote.</>}
          </p>
          {selected === "enterprise" ? (
            <Button size="lg" className="w-full gap-2">Talk to sales</Button>
          ) : (
            <Button size="lg" className="w-full gap-2"><CreditCard className="w-4.5 h-4.5" /> Continue to payment</Button>
          )}
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[11.5px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Secure checkout · cancel anytime
          </div>
          <p className="text-center text-[12px] text-muted-foreground mt-4">
            Prefer to start free? <Link href="/signup"><span className="text-primary font-semibold cursor-pointer">Create a free account</span></Link>
          </p>
        </div>
      </main>
    </div>
  );
}
