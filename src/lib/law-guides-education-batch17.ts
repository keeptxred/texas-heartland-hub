import { EDUCATION_BATCH17_GUIDES } from "@/data/laws-education-batch17";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("tea.texas.gov") ||
  url.includes("studentprivacy.ed.gov");

export const EDUCATION_BATCH17_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(EDUCATION_BATCH17_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "education",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) => source.label.includes("Texas Education Code") || source.label.includes("Texas Legislature — HB 6"))
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: ["texas-school-suspension-law", "texas-daep-placement-law", "texas-school-expulsion-law"].includes(guide.slug)
    ? "2025–2026 school year (HB 6, 89th Legislature)"
    : undefined,
}));
