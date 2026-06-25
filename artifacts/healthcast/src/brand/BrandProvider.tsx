import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { brand as defaultBrand, type BrandConfig, type BrandTheme } from "./brandConfig";

// ────────────────────────────────────────────────────────────────────────────
// BrandProvider — runtime, in-memory white-label state + live theming.
// ────────────────────────────────────────────────────────────────────────────
// All chrome reads the ACTIVE brand from this context (not the static import),
// so the white-label Settings screen can swap the logo, names, owner, and color
// palette and have the entire app re-skin instantly. Theme colors are applied as
// CSS variables on <html> so token-driven components recolor with zero churn.
//
// State is in-memory only (the sandboxed iframe blocks localStorage). A re-skin
// persists for the session; the deployer bakes a customer's defaults into
// brandConfig.ts.

interface BrandContextValue {
  brand: BrandConfig;
  /** Patch any top-level brand fields (name, owner, logo, etc.). */
  updateBrand: (patch: Partial<BrandConfig>) => void;
  /** Patch the color palette. */
  updateTheme: (patch: Partial<BrandTheme>) => void;
  /** Reset everything to the baked-in defaults. */
  reset: () => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

// ── hex → HSL "H S% L%" (the format the app's CSS variables expect) ──────────
function hexToHslParts(hex: string): { h: number; s: number; l: number } {
  let c = hex.trim().replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hsl(h: number, s: number, l: number) {
  return `${h} ${s}% ${l}%`;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** Apply a BrandTheme to the document as CSS variables. */
export function applyThemeVars(theme: BrandTheme, root: HTMLElement = document.documentElement) {
  const navy = hexToHslParts(theme.navy);
  const teal = hexToHslParts(theme.teal);
  const green = hexToHslParts(theme.green);

  // Brand anchors
  root.style.setProperty("--brand-navy", hsl(navy.h, navy.s, navy.l));
  root.style.setProperty("--brand-navy-2", hsl(navy.h, clamp(navy.s + 5), clamp(navy.l - 4)));
  root.style.setProperty("--brand-teal", hsl(teal.h, teal.s, teal.l));

  // Primary action / accent (teal-driven)
  root.style.setProperty("--primary", hsl(teal.h, clamp(teal.s), clamp(teal.l)));
  root.style.setProperty("--ring", hsl(teal.h, clamp(teal.s), clamp(teal.l + 5)));
  root.style.setProperty("--electric", hsl(teal.h, clamp(teal.s - 6), clamp(teal.l + 3)));
  root.style.setProperty("--cyan", hsl(teal.h, clamp(teal.s + 2), clamp(teal.l + 7)));

  // Chart palette: keep teal + green from brand, leave the rest
  root.style.setProperty("--chart-1", hsl(teal.h, teal.s, teal.l));
  root.style.setProperty("--chart-2", hsl(green.h, green.s, green.l));

  // Success / positive
  root.style.setProperty("--success", hsl(green.h, clamp(green.s), clamp(green.l - 4)));

  // Sidebar accents track the teal
  root.style.setProperty("--sidebar-primary", hsl(teal.h, teal.s, teal.l));
  root.style.setProperty("--sidebar-accent", hsl(teal.h, clamp(teal.s - 22), 95));
  root.style.setProperty("--sidebar-accent-foreground", hsl(teal.h, clamp(teal.s), clamp(teal.l - 9)));
  root.style.setProperty("--sidebar-ring", hsl(teal.h, teal.s, clamp(teal.l + 5)));

  // Gradients (teal → green)
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${hsl(teal.h, teal.s, teal.l)}), hsl(${hsl(green.h, clamp(green.s - 6), clamp(green.l + 4))}))`,
  );
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(() => ({
    ...defaultBrand,
    owner: { ...defaultBrand.owner },
    theme: { ...defaultBrand.theme },
  }));

  // Apply theme vars whenever the palette changes.
  useEffect(() => {
    applyThemeVars(brand.theme);
  }, [brand.theme]);

  // Keep the document title in sync with the product name.
  useEffect(() => {
    const full = `${brand.productName}${brand.productSuffix ? " " + brand.productSuffix : ""}`;
    document.title = `${full} — Financial Command Center for Contractors`;
  }, [brand.productName, brand.productSuffix]);

  const updateBrand = useCallback((patch: Partial<BrandConfig>) => {
    setBrand((b) => ({ ...b, ...patch }));
  }, []);

  const updateTheme = useCallback((patch: Partial<BrandTheme>) => {
    setBrand((b) => ({ ...b, theme: { ...b.theme, ...patch } }));
  }, []);

  const reset = useCallback(() => {
    setBrand({
      ...defaultBrand,
      owner: { ...defaultBrand.owner },
      theme: { ...defaultBrand.theme },
    });
  }, []);

  const value = useMemo(
    () => ({ brand, updateBrand, updateTheme, reset }),
    [brand, updateBrand, updateTheme, reset],
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

/** Access the active (live) brand + mutators. */
export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    // Safe fallback so components used outside the provider still render.
    return {
      brand: defaultBrand,
      updateBrand: () => {},
      updateTheme: () => {},
      reset: () => {},
    };
  }
  return ctx;
}

/** Convenience selector for the full product name from live brand. */
export function useProductFullName(): string {
  const { brand } = useBrand();
  return `${brand.productName}${brand.productSuffix ? " " + brand.productSuffix : ""}`;
}
