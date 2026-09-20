import { PROBATE_BATCH21_GUIDES } from "@/data/laws-probate-batch21";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) => url.includes("statutes.capitol.texas.gov");

export const PROBATE_BATCH21_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(PROBATE_BATCH21_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "probate",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) => source.label.includes("Texas Estates Code"))
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
}));
