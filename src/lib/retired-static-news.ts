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
]);

export function isExplicitlyRetiredStaticSlug(slug: string): boolean {
  return slug.startsWith("live-") || RETIRED_STATIC_SLUGS.has(slug);
}

export function isExplicitlyRetiredStaticNewsPath(path: string): boolean {
  const match = path.match(/^\/news\/([^/?#]+)$/);
  if (!match) return false;
  return RETIRED_STATIC_SLUGS.has(decodeURIComponent(match[1]));
}
