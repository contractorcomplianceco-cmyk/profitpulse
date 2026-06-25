// ────────────────────────────────────────────────────────────────────────────
// ProfitPulse OS — White-label brand configuration
// ────────────────────────────────────────────────────────────────────────────
// This is the single source of truth for the customer-facing identity of the
// product. To re-brand the entire app for a different contractor business,
// change the values here — every chrome surface (logo, header, sidebar footer,
// owner block, document title) reads from this object. Do NOT hard-code the
// company name, owner, or product name anywhere else.
//
// Visual colors live as CSS variables in `index.css` (token-driven theme). This
// file owns the swappable TEXT + LOGO + OWNER identity.

export interface BrandOwner {
  name: string;
  role: string;
  initials: string;
}

/**
 * Brand theme colors as hex strings (what the white-label Settings screen edits).
 * These are converted to the app's HSL CSS variables at runtime by BrandProvider.
 */
export interface BrandTheme {
  /** Deep brand color for headings + the first half of the wordmark. */
  navy: string;
  /** Accent color: primary actions, the wordmark suffix, active nav. */
  teal: string;
  /** Positive / growth color. */
  green: string;
}

export interface BrandConfig {
  /** Product brand, e.g. "ProfitPulse" */
  productName: string;
  /** Product suffix rendered in the accent color, e.g. "OS" */
  productSuffix: string;
  /** Full legal/company name */
  companyName: string;
  /** Short company name / abbreviation */
  companyShort: string;
  /** One-line descriptor under the wordmark */
  tagline: string;
  /** Short marketing line for the entry/landing surface */
  valueLine: string;
  /** Path to the compact shield mark (served from /public) */
  logoSrc: string;
  /** Path to the full horizontal lockup (served from /public) */
  lockupSrc: string;
  /** The signed-in account/owner identity shown in the header */
  owner: BrandOwner;
  /** Show the neutral "sample data" note in the chrome */
  showSampleDataNote: boolean;
  /** Copy for the sample-data note */
  sampleDataNote: string;
  /** Marketing site / contact */
  website: string;
  supportEmail: string;
  /** Editable brand color palette (drives live theming). */
  theme: BrandTheme;
}

export const brand: BrandConfig = {
  productName: "ProfitPulse",
  productSuffix: "OS",
  companyName: "Contractor Compliance Authority",
  companyShort: "CCA",
  tagline: "Financial Health, Growth Intelligence & Futurecast Command Center",
  valueLine:
    "The financial command center built for contractors — cash, profit, pipeline, and risk in one live view.",
  /** Compact shield mark (transparent PNG) for chrome + favicons. */
  logoSrc: "brand/profitpulse-shield.png",
  /** Full horizontal lockup (shield + wordmark) for landing / login. */
  lockupSrc: "brand/profitpulse-lockup.png",
  owner: {
    name: "Rose",
    role: "Owner / CEO",
    initials: "R",
  },
  showSampleDataNote: true,
  sampleDataNote:
    "Sample data shown — connect your accounting, CRM, and ad platforms to go live.",
  website: "ccaprofitpulse.com",
  supportEmail: "hello@ccaprofitpulse.com",
  theme: {
    navy: "#0A2A57",  /* Profit Ink */
    teal: "#17A8B8",  /* Pulse Teal */
    green: "#3FB257", /* Growth Green */
  },
};

/** Built-in palette presets offered in the white-label Settings screen. */
export interface BrandPreset {
  id: string;
  label: string;
  theme: BrandTheme;
}

export const BRAND_PRESETS: BrandPreset[] = [
  { id: "profitpulse", label: "ProfitPulse (default)", theme: { navy: "#0A2A57", teal: "#17A8B8", green: "#3FB257" } },
  { id: "slate-blue", label: "Slate Blue", theme: { navy: "#0B1F3A", teal: "#2563EB", green: "#16A34A" } },
  { id: "forest", label: "Forest", theme: { navy: "#14331F", teal: "#0E9F6E", green: "#65A30D" } },
  { id: "graphite-amber", label: "Graphite & Amber", theme: { navy: "#1F2430", teal: "#D97706", green: "#16A34A" } },
  { id: "crimson", label: "Crimson", theme: { navy: "#2B0B12", teal: "#E11D48", green: "#16A34A" } },
  { id: "royal-purple", label: "Royal Purple", theme: { navy: "#1E1043", teal: "#7C3AED", green: "#10B981" } },
];

/** Convenience: full product name, e.g. "ProfitPulse OS". */
export const productFullName = `${brand.productName}${brand.productSuffix ? " " + brand.productSuffix : ""}`;
