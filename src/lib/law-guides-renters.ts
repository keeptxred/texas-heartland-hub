import { RENTER_GUIDES } from "@/data/supporting-guides-renters";
import { RENTER_GUIDES_B } from "@/data/supporting-guides-renters-b";
import { LANDLORD_SMOKE_ALARM_GUIDES } from "@/data/laws-landlord-smoke-alarm";
import type { LawGuideMeta } from "@/lib/law-guides";

const guides = {
  ...RENTER_GUIDES,
  ...RENTER_GUIDES_B,
  ...LANDLORD_SMOKE_ALARM_GUIDES,
};

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") || url.includes("capitol.texas.gov/tlodocs/");

export const RENTER_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(guides).map((guide) => ({
  slug: guide.slug,
  topic: "landlord-tenant",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) => source.label.includes("Texas Property Code") || source.label.includes("Texas Legislature"))
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: guide.slug === "texas-repair-and-deduct-law"
    ? "September 1, 2025 (HB 2037; leases entered into or renewed on or after that date)"
    : undefined,
}));
