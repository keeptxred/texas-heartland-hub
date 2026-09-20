import { OPEN_GOVERNMENT_BATCH19_GUIDES } from "@/data/laws-open-government-batch19";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("texasattorneygeneral.gov");

const effectiveDateFor = (slug: string): string | undefined => {
  if (slug === "texas-public-information-act-request-guide") {
    return "June 20, 2025 (HB 4214 designated-address database requirements)";
  }
  return undefined;
};

export const OPEN_GOVERNMENT_BATCH19_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(OPEN_GOVERNMENT_BATCH19_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "open-government",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Government Code") ||
      source.label.includes("Texas Code of Criminal Procedure") ||
      source.label.includes("Texas Legislature"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDateFor(guide.slug),
}));
