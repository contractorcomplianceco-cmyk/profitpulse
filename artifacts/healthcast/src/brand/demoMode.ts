// ────────────────────────────────────────────────────────────────────────────
// Demo mode — drives the standalone, sellable demo deployable.
// ────────────────────────────────────────────────────────────────────────────
// Build the SAME app with VITE_DEMO_MODE=1 to produce the public, interactive
// product demo (the bundle your team hosts on demo.profitpulse.com). In demo
// mode the app:
//   • auto-launches the guided tour on first load
//   • shows a persistent "Interactive demo" ribbon + a prospect CTA
//   • keeps every page fully clickable (real interactive sandbox)
// In normal mode none of this shows and the app behaves as the live product.

export const isDemoMode: boolean =
  String(import.meta.env.VITE_DEMO_MODE ?? "").trim() === "1" ||
  String(import.meta.env.VITE_DEMO_MODE ?? "").toLowerCase() === "true";

export const demoConfig = {
  /** Headline shown in the demo ribbon. */
  ribbonText: "Interactive demo — click through every screen with sample data.",
  /** Primary prospect call-to-action. */
  ctaLabel: "Get started",
  ctaHref: "https://profitpulse.com",
  /** Secondary CTA. */
  secondaryLabel: "Book a walkthrough",
  secondaryHref: "https://profitpulse.com",
};
