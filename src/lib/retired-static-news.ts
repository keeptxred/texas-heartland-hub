const RETIRED_STATIC_SLUGS = new Set([
  "renting-vs-buying-in-texas",
  "texas-house-down-payment-guide",
  "true-cost-of-owning-a-home-in-texas",
  "should-you-refinance-texas-mortgage",
  "texas-home-equity-heloc-guide",
  "texas-mortgage-payment-guide",
  "texas-closing-costs-guide",
  "texas-utility-costs-guide",
  "texas-homeowners-insurance-guide",
  "salary-needed-to-buy-a-house-in-texas",
  "moving-to-houston-address-checklist",
  "moving-to-dallas-fort-worth-guide",
  "moving-to-san-antonio-guide",
  "moving-to-austin-guide",
  "moving-to-el-paso-guide",
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
