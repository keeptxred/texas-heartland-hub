import { HOA_BATCH6_GUIDES } from "@/data/laws-hoa-batch6-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("ethics.state.tx.us/statutes/");

export const HOA_BATCH6_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(HOA_BATCH6_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "hoa-property",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) => source.label.includes("Texas Property Code") || source.label.includes("Texas Election Code"))
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: guide.slug === "texas-hoa-election-law"
    ? "September 1, 2025 (SB 2629 updated association voting procedure)"
    : undefined,
}));
