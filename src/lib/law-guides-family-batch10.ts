import { FAMILY_BATCH10_GUIDES } from "@/data/laws-family-batch10-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/");

export const FAMILY_BATCH10_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(FAMILY_BATCH10_GUIDES).map((guide) => ({
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
  effectiveDate: guide.slug === "texas-common-law-marriage-law"
    ? "September 1, 2025 (HB 1193 declaration-of-informal-marriage confidentiality update)"
    : guide.slug === "texas-family-violence-protective-order-law"
      ? "September 1, 2025 (SB 1559 protective-order conflict and transfer update)"
      : undefined,
}));
