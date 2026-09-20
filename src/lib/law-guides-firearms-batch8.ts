import { FIREARMS_BATCH8_GUIDES } from "@/data/laws-firearms-batch8-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("dps.texas.gov/");

export const FIREARMS_BATCH8_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(FIREARMS_BATCH8_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "self-defense-firearms",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Penal Code") ||
      source.label.includes("Texas Government Code") ||
      source.label.includes("Texas Education Code"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: guide.slug === "texas-permitless-carry-law"
    ? "September 1, 2021 (HB 1927 Firearm Carry Act)"
    : guide.slug === "texas-30-05-30-06-30-07-signs-guide"
      ? "September 1, 2025 (HB 4995 added narrow tactical-medical defenses to Sections 30.06 and 30.07)"
      : undefined,
}));
