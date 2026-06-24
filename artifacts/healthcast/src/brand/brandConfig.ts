// ────────────────────────────────────────────────────────────────────────────
// HealthCast OS — White-label brand configuration
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

export interface BrandConfig {
  /** Product brand, e.g. "HealthCast" */
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
}

export const brand: BrandConfig = {
  productName: "HealthCast",
  productSuffix: "OS",
  companyName: "Contractor Compliance Authority",
  companyShort: "CCA",
  tagline: "Financial Health, Growth Intelligence & Futurecast Command Center",
  valueLine:
    "The financial command center built for contractors — cash, profit, pipeline, and risk in one live view.",
  /** Compact shield mark (transparent PNG) for chrome + favicons. */
  logoSrc: "/brand/healthcast-shield.png",
  /** Full horizontal lockup (shield + wordmark) for landing / login. */
  lockupSrc: "/brand/healthcast-lockup.png",
  owner: {
    name: "Rose",
    role: "Owner / CEO",
    initials: "R",
  },
  showSampleDataNote: true,
  sampleDataNote:
    "Sample data shown — connect your accounting, CRM, and ad platforms to go live.",
  website: "ccahealthcast.com",
  supportEmail: "hello@ccahealthcast.com",
};

/** Convenience: full product name, e.g. "HealthCast OS". */
export const productFullName = `${brand.productName}${brand.productSuffix ? " " + brand.productSuffix : ""}`;
