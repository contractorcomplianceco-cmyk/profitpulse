import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrand, useProductFullName } from "@/brand/BrandProvider";
import { useDemoFunnel } from "@/demo/DemoFunnel";
import { startGuidedTour } from "@/demo/GuidedTour";
import { resolveAsset } from "@/lib/asset";

const PERKS = [
  "Full access to the live command center with sample contractor data",
  "A guided, self-paced walkthrough of every key screen",
  "See cash flow, profit, pipeline, and risk exactly as you would live",
];

export default function RequestDemo() {
  const { brand } = useBrand();
  const productFullName = useProductFullName();
  const { submitLead } = useDemoFunnel();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.company.trim()) e.company = "Please enter your company.";
    if (!form.phone.trim()) e.phone = "Please enter your phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    submitLead(form);
    // Enter the live guided sandbox.
    navigate("/");
    setTimeout(() => startGuidedTour(), 450);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.5] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.08] via-background/0 to-background/0 z-0" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[940px] grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-soft-lg bg-card">
          {/* Left: value panel */}
          <div className="hidden md:flex flex-col justify-between bg-primary p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-8">
                <img src={resolveAsset(brand.logoSrc)} alt={productFullName} className="w-9 h-9 object-contain" />
                <span className="font-extrabold text-[17px] text-primary-foreground">
                  {brand.productName}<span className="opacity-80">{brand.productSuffix}</span>
                </span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                See your business the way the best contractors do.
              </h2>
              <p className="mt-3 text-[14px] text-primary-foreground/80 leading-relaxed">
                Get instant access to the {productFullName} guided demo — loaded with realistic sample data so you can explore every screen.
              </p>
              <ul className="mt-7 space-y-3">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </span>
                    <span className="text-[13.5px] text-primary-foreground font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex items-center gap-2 text-primary-foreground/70 text-[12px] mt-8">
              <ShieldCheck className="w-3.5 h-3.5" />
              We use your info only to follow up about {brand.productName}.
            </div>
          </div>

          {/* Right: form */}
          <div className="p-8">
            <div className="md:hidden flex items-center gap-2.5 mb-6">
              <img src={resolveAsset(brand.logoSrc)} alt={productFullName} className="w-9 h-9 object-contain" />
              <span className="font-extrabold text-[17px]">
                <span className="text-brand-navy">{brand.productName}</span>
                <span className="text-brand-teal">{brand.productSuffix}</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent/60 px-3 py-1 text-[11.5px] font-bold text-primary mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Request your walkthrough
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">Start your guided demo</h1>
            <p className="text-[13.5px] text-muted-foreground mt-1.5 mb-6">
              Tell us a little about you and we'll drop you straight into the live demo.
            </p>

            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              noValidate
            >
              <Field label="Full name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jordan Rivera" data-testid="input-name" />
              </Field>
              <Field label="Work email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jordan@company.com" data-testid="input-email" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company" error={errors.company}>
                  <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Rivera Builders" data-testid="input-company" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 123-4567" data-testid="input-phone" />
                </Field>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 mt-1" data-testid="button-enter-demo">
                Enter the live demo <ArrowRight className="w-4.5 h-4.5" />
              </Button>
              <p className="text-[11.5px] text-muted-foreground text-center">
                No credit card. Sample data only — nothing you change is saved.
              </p>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-semibold text-foreground">{label}</Label>
      {children}
      {error && <p className="text-[11.5px] text-destructive font-medium">{error}</p>}
    </div>
  );
}
