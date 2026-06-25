// Resolve a public asset path against the app's build base so it works whether
// the app is served from the domain root or a deep proxy subpath (preview host).
// Pass paths WITHOUT a leading slash, e.g. asset("brand/logo.png").
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}

// Like asset(), but passes through absolute/external/data URLs untouched (e.g. a
// logo uploaded as a data: URL in the white-label Settings screen).
export function resolveAsset(src: string): string {
  if (/^(data:|https?:|blob:)/.test(src)) return src;
  return asset(src);
}
