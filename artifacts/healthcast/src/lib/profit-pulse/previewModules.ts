/** Routes whose primary UI is still mock/sample — show Preview in nav. */
export const PREVIEW_MODULE_ROUTES = new Set([
  "/copilot",
  "/daily-briefing",
  "/marketing-roi",
  "/reports",
  "/futurecast",
  "/market-economy",
  "/goals",
  "/compliance",
  "/department-performance",
  "/client-profitability",
  "/historical-trends",
]);

export function isPreviewModuleRoute(href: string): boolean {
  const path = href.replace(/\/$/, "") || "/";
  return PREVIEW_MODULE_ROUTES.has(path);
}
