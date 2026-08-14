import { FAMILY_BATCH11_GUIDES } from "@/data/laws-family-batch11-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/");

export const FAMILY_BATCH11_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(FAMILY_BATCH11_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "family",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Family Code") ||
      source.label.includes("Texas Legislature"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate:
    guide.slug === "texas-custody-modification-law" || guide.slug === "texas-custody-order-enforcement-law"
      ? "September 1, 2025 (HB 3181 repeated denial-of-possession contempt rule)"
      : undefined,
}));
