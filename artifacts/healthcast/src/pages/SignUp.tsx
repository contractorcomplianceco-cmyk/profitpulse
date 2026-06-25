import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrand, useProductFullName } from "@/brand/BrandProvider";
import { useDemoFunnel } from "@/demo/DemoFunnel";
import { resolveAsset } from "@/lib/asset";

export default function SignUp() {
  const { brand } = useBrand();
  const productFullName = useProductFullName();
  const { lead } = useDemoFunnel();

  const [form, setForm] = useState({
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    company: lead?.company ?? "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.company.trim()) e.company = "Required";
    if (form.password.length < 8) e.password = "At least 8 characters";
    setErrors(e);
    if (Object.keys(e).length === 0) setDone(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-[0.5] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.08] via-background/0 to-background/0 z-0" />

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

      <main className="relative z-10 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px]">
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-soft-lg text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">You're all set</h1>
              <p className="text-[13.5px] text-muted-foreground mt-2">
                Welcome aboard, {form.name.split(" ")[0] || "there"}. Your {productFullName} workspace is being prepared — check {form.email} for next steps.
              </p>
              <Link href="/">
                <Button size="lg" className="w-full gap-2 mt-6">Go to the dashboard <ArrowRight className="w-4.5 h-4.5" /></Button>
              </Link>
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft-lg">
              <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">Create your account</h1>
              <p className="text-[13.5px] text-muted-foreground mt-1.5 mb-6">
                Start free. No credit card required.
              </p>
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <Field label="Full name" error={errors.name}>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jordan Rivera" />
                </Field>
                <Field label="Work email" error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jordan@company.com" />
                </Field>
                <Field label="Company" error={errors.company}>
                  <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Rivera Builders" />
                </Field>
                <Field label="Password" error={errors.password}>
                  <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 8 characters" />
                </Field>
                <Button type="submit" size="lg" className="w-full gap-2 mt-1">Create account <ArrowRight className="w-4.5 h-4.5" /></Button>
                <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Your data stays private and secure
                </div>
              </form>
              <p className="text-center text-[12px] text-muted-foreground mt-5">
                Want to pay now instead? <Link href="/buy"><span className="text-primary font-semibold cursor-pointer">See plans</span></Link>
              </p>
            </div>
          )}
        </div>
      </main>
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
