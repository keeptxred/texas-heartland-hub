import { LANDLORD_BATCH4_GUIDES } from "@/data/laws-landlord-batch4-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") || url.includes("capitol.texas.gov/tlodocs/");

const effectiveDateFor = (slug: string) => {
  if (slug === "texas-rental-flood-disclosure-law") {
    return "September 1, 2025 (SB 2349; leases entered into or renewed on or after that date)";
  }
  if (slug === "texas-sex-offense-stalking-lease-termination-law") {
    return "September 1, 2025 (HB 47 amendment to Property Code § 92.0161(c))";
  }
  return undefined;
};

export const RENTER_BATCH4_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(LANDLORD_BATCH4_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "landlord-tenant",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) => source.label.includes("Texas Property Code") || source.label.includes("Texas Legislature") || source.label.includes("Texas Local Government Code"))
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDateFor(guide.slug),
}));
