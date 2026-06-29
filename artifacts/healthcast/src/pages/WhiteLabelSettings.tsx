import { useRef, useState, useEffect } from "react";
import {
  Palette,
  Check,
  RotateCcw,
  Upload,
  Building2,
  User,
  Type,
  Image as ImageIcon,
  Eye,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useBrand, useProductFullName } from "@/brand/BrandProvider";
import { BRAND_PRESETS } from "@/brand/brandConfig";
import { resolveAsset } from "@/lib/asset";
import { isDemoMode } from "@/brand/demoMode";
import { useProfitPulse } from "@/context/ProfitPulseProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocation } from "wouter";
import { formatCompactCurrency } from "@/lib/format";

function Field({
  label,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11.5px] text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-border shadow-soft shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer"
            aria-label={`${label} color picker`}
          />
        </div>
        <Input
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-[13px] uppercase"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function WhiteLabelSettings() {
  const { canAccessSettings } = useAuth();
  const [, navigate] = useLocation();
  const { brand, updateBrand, updateTheme, reset } = useBrand();
  const { state, metrics, updateOrganization, resetDemoData, exportJson, readOnly } = useProfitPulse();
  const productFullName = useProductFullName();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [activePreset, setActivePreset] = useState<string>("");

  useEffect(() => {
    if (!canAccessSettings) navigate("/");
  }, [canAccessSettings, navigate]);

  if (!canAccessSettings) {
    return null;
  }

  const onLogoUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please choose an image file (PNG, JPG, or SVG).", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateBrand({ logoSrc: String(reader.result) });
      toast({ title: "Logo updated", description: "Your logo is now applied across the app." });
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (id: string) => {
    const preset = BRAND_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    updateTheme(preset.theme);
    setActivePreset(id);
  };

  const handleReset = () => {
    reset();
    setActivePreset("");
    toast({ title: "Reset to defaults", description: "Branding restored to the ProfitPulse defaults." });
  };

  return (
    <div className="max-w-[1100px] mx-auto px-1 py-1">
      {isDemoMode && (
        <div className="mb-4 rounded-lg border border-primary/25 bg-accent/50 px-4 py-2.5 text-[12.5px] text-foreground">
          <span className="font-bold text-primary">Demo sandbox.</span> Try the white-label theming live — changes preview instantly and reset when you reload. Nothing is saved.
        </div>
      )}
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent border border-primary/20 flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">White-Label Settings</h1>
            <p className="text-[13.5px] text-muted-foreground mt-0.5">
              Re-skin the entire app for your business — or for a customer you resell to. Changes apply live.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleReset} className="gap-1.5 shrink-0">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Editor */}
        <div className="space-y-6">
          {/* Identity */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-foreground mb-5">
              <Type className="w-4 h-4 text-primary" /> Brand Identity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Product name" icon={Sparkles} hint="The bold part of the wordmark.">
                <Input value={brand.productName} onChange={(e) => updateBrand({ productName: e.target.value })} />
              </Field>
              <Field label="Product suffix" hint="Shown in the accent color (e.g. 'OS').">
                <Input value={brand.productSuffix} onChange={(e) => updateBrand({ productSuffix: e.target.value })} />
              </Field>
              <Field label="Company name" icon={Building2}>
                <Input value={brand.companyName} onChange={(e) => updateBrand({ companyName: e.target.value })} />
              </Field>
              <Field label="Short name / abbrev.">
                <Input value={brand.companyShort} onChange={(e) => updateBrand({ companyShort: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Tagline" hint="The small line under the wordmark in the header.">
                  <Input value={brand.tagline} onChange={(e) => updateBrand({ tagline: e.target.value })} />
                </Field>
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-foreground mb-5">
              <ImageIcon className="w-4 h-4 text-primary" /> Logo
            </h2>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-xl border border-border bg-secondary/40 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={resolveAsset(brand.logoSrc)} alt="Current logo" className="w-16 h-16 object-contain" />
              </div>
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onLogoUpload(e.target.files?.[0])}
                />
                <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-1.5">
                  <Upload className="w-4 h-4" /> Upload logo
                </Button>
                <p className="text-[11.5px] text-muted-foreground mt-2">
                  Square PNG or SVG with a transparent background works best. Applies instantly to the header, sidebar, landing page, and favicon.
                </p>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-foreground mb-5">
              <Palette className="w-4 h-4 text-primary" /> Color Palette
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              <ColorField label="Brand (navy)" value={brand.theme.navy} onChange={(v) => { updateTheme({ navy: v }); setActivePreset(""); }} />
              <ColorField label="Accent (teal)" value={brand.theme.teal} onChange={(v) => { updateTheme({ teal: v }); setActivePreset(""); }} />
              <ColorField label="Positive (green)" value={brand.theme.green} onChange={(v) => { updateTheme({ green: v }); setActivePreset(""); }} />
            </div>
            <Label className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Presets</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
              {BRAND_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`group flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                    activePreset === p.id ? "border-primary ring-2 ring-primary/30 bg-accent/50" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex -space-x-1 shrink-0">
                    <span className="w-5 h-5 rounded-full border-2 border-card" style={{ background: p.theme.navy }} />
                    <span className="w-5 h-5 rounded-full border-2 border-card" style={{ background: p.theme.teal }} />
                    <span className="w-5 h-5 rounded-full border-2 border-card" style={{ background: p.theme.green }} />
                  </div>
                  <span className="text-[12.5px] font-semibold text-foreground truncate">{p.label}</span>
                  {activePreset === p.id && <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </section>

          {/* Account / chrome */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-foreground mb-5">
              <User className="w-4 h-4 text-primary" /> Account & Chrome
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field label="Owner name">
                <Input
                  value={brand.owner.name}
                  onChange={(e) =>
                    updateBrand({
                      owner: {
                        ...brand.owner,
                        name: e.target.value,
                        initials: e.target.value.trim().charAt(0).toUpperCase() || brand.owner.initials,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Owner role">
                <Input value={brand.owner.role} onChange={(e) => updateBrand({ owner: { ...brand.owner, role: e.target.value } })} />
              </Field>
              <Field label="Initials">
                <Input maxLength={2} value={brand.owner.initials} onChange={(e) => updateBrand({ owner: { ...brand.owner, initials: e.target.value.toUpperCase() } })} />
              </Field>
              <Field label="Website">
                <Input value={brand.website} onChange={(e) => updateBrand({ website: e.target.value })} />
              </Field>
              <Field label="Support email">
                <Input value={brand.supportEmail} onChange={(e) => updateBrand({ supportEmail: e.target.value })} />
              </Field>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 sm:col-span-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Show sample-data note</p>
                  <p className="text-[11.5px] text-muted-foreground">The neutral banner under the header.</p>
                </div>
                <Switch checked={brand.showSampleDataNote} onCheckedChange={(v) => updateBrand({ showSampleDataNote: v })} />
              </div>
            </div>
          </section>
        </div>

        {/* Live preview rail */}
        <aside className="lg:sticky lg:top-2 self-start space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground mb-4">
              <Eye className="w-4 h-4 text-primary" /> Live Preview
            </h2>

            {/* Mini header */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-card border-b border-border">
                <img src={resolveAsset(brand.logoSrc)} alt="logo" className="w-8 h-8 object-contain" />
                <div className="leading-tight">
                  <div className="font-extrabold text-[14px]">
                    <span className="text-brand-navy">{brand.productName}</span>
                    <span className="text-brand-teal">{brand.productSuffix}</span>
                  </div>
                  <div className="text-[8.5px] uppercase tracking-wide text-muted-foreground truncate max-w-[200px]">{brand.tagline}</div>
                </div>
              </div>
              {/* Mini KPI + chart */}
              <div className="p-3 space-y-2.5 bg-background">
                <div className="rounded-md border border-border bg-card p-2.5 accent-topline relative overflow-hidden">
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Monthly Revenue</div>
                  <div className="text-lg font-extrabold text-foreground">{formatCompactCurrency(metrics.monthlyRevenue)}</div>
                  <div className="text-[10px] font-bold" style={{ color: brand.theme.green }}>+18.6% vs last month</div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-md bg-gradient-primary text-primary-foreground text-[11px] font-bold py-1.5">Primary action</button>
                  <button className="rounded-md border border-border text-[11px] font-semibold py-1.5 px-3 text-foreground">Outline</button>
                </div>
                {/* mini sidebar item */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 rounded-md bg-gradient-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> Executive Overview
                  </div>
                  <div className="flex items-center gap-2 rounded-md text-muted-foreground text-[11px] font-semibold px-2.5 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" /> Cash Flow
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
              This preview reflects your live settings. The whole app — all 20+ screens, the landing page, and the demo — uses the same theme.
            </p>
          </div>

          <div className="bg-accent/50 border border-primary/20 rounded-xl p-4">
            <p className="text-[12px] text-foreground leading-relaxed">
              <span className="font-bold">Reselling {productFullName}?</span> Set a customer's logo, name, and colors here to white-label their instance in seconds.
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-8 bg-card border border-border rounded-xl p-6 shadow-soft space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">Organization Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Organization name">
            <Input value={state.organization.name} onChange={(e) => updateOrganization({ name: e.target.value })} />
          </Field>
          <Field label="Cash on hand">
            <Input type="number" value={state.organization.cashOnHand} onChange={(e) => updateOrganization({ cashOnHand: Number(e.target.value) })} />
          </Field>
          <Field label="Margin threshold (%)">
            <Input type="number" value={state.organization.marginThresholdPct} onChange={(e) => updateOrganization({ marginThresholdPct: Number(e.target.value) })} />
          </Field>
          <Field label="Runway threshold (months)">
            <Input type="number" value={state.organization.runwayThresholdMonths} onChange={(e) => updateOrganization({ runwayThresholdMonths: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" onClick={() => {
            const blob = new Blob([exportJson()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "profit-pulse-export.json";
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Exported", description: "JSON downloaded." });
          }}>Export Data</Button>
          <Button variant="outline" onClick={() => { resetDemoData(); toast({ title: "Demo data restored" }); }}>Reset Demo Data</Button>
        </div>
      </section>
    </div>
  );
}
