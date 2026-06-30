/** Routes that must load without login (Rose demo + marketing). */
export const PUBLIC_DEMO_ROUTES = [
  "/demo",
  "/demo/",
] as const;

/** Invariants enforced by scripts/verify-demo-routes.mjs — do not regress. */
export const DEMO_ROUTE_INVARIANTS = {
  publicPaths: PUBLIC_DEMO_ROUTES,
  requiresAuth: false,
  videoFirst: true,
} as const;

export const PUBLIC_MARKETING_ROUTES = [
  "/landing",
  "/landing/",
  "/request-demo",
  "/buy",
  "/signup",
] as const;

export const PUBLIC_AUTH_ROUTES = [
  "/auth/login",
  "/auth/logout",
  "/auth/session",
] as const;

export function isPublicDemoRoute(location: string): boolean {
  return (PUBLIC_DEMO_ROUTES as readonly string[]).includes(location);
}

export function isPublicMarketingRoute(location: string): boolean {
  return (PUBLIC_MARKETING_ROUTES as readonly string[]).includes(location);
}

export function isAuthPublicRoute(location: string): boolean {
  return PUBLIC_AUTH_ROUTES.some((p) => location === p || location.startsWith(`${p}/`));
}

/** Any route that bypasses AuthGate (demo + marketing in demo builds). */
export function bypassesAuthGate(location: string, demoMode: boolean): boolean {
  if (isPublicDemoRoute(location)) return true;
  if (demoMode && isPublicMarketingRoute(location)) return true;
  return false;
}
