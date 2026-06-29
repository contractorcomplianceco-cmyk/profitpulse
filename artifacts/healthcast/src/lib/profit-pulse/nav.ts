/** Match wouter hash routes for sidebar active state. */
export function isNavActive(location: string, href: string): boolean {
  const loc = normalizePath(location);
  const target = normalizePath(href);

  if (target === "/") {
    return loc === "/" || loc === "";
  }

  if (loc === target) return true;

  // Trailing-slash routes like /demo/
  if (href.endsWith("/") && href.length > 1) {
    const base = target.replace(/\/$/, "");
    return loc === base || loc.startsWith(`${base}/`);
  }

  return loc.startsWith(`${target}/`);
}

function normalizePath(path: string): string {
  if (!path) return "/";
  const trimmed = path.replace(/\/+$/, "") || "/";
  return trimmed;
}
