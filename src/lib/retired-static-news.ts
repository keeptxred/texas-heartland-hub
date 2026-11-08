const RETIRED_STATIC_SLUGS = new Set([
  "moving-to-texas-guide",
  "2026-07-06-rangers-texas-rangers-prospect-guide-the-next-stars-of-arlington",
  "property-tax-relief-package",
  "operation-lone-star",
  "voter-id-surge",
  "school-board-elections",
  "speaker-special-session",
  "isd-tax-burdens",
  "permian-energy",
  "texas-constitutional-amendments-guide",
]);

// Retired static articles that have an explicit permanent route-level redirect
// must be allowed through request middleware so the 301 can execute instead of
// being intercepted by the generic retired-news 404 guard.
// Legacy static inventory stays retired, but dedicated authority routes and
// permanent redirects must bypass the old middleware 404 guard.
const RETIRED_STATIC_ROUTE_EXCEPTIONS = new Set([
  "texas-constitutional-amendments-guide",
  "moving-to-texas-guide",
  "isd-tax-burdens", // Rebuilt, source-backed 2026 school-tax authority route.
]);

export function isExplicitlyRetiredStaticSlug(slug: string): boolean {
  return slug.startsWith("live-") || RETIRED_STATIC_SLUGS.has(slug);
}

export function isExplicitlyRetiredStaticNewsPath(path: string): boolean {
  const match = path.match(/^\/news\/([^/?#]+)$/);
  if (!match) return false;
  const slug = decodeURIComponent(match[1]);
  return RETIRED_STATIC_SLUGS.has(slug) && !RETIRED_STATIC_ROUTE_EXCEPTIONS.has(slug);
}
