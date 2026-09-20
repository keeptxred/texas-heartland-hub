import { ALCOHOL_BATCH23_GUIDES } from "@/data/laws-alcohol-batch23";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("tabc.texas.gov") ||
  url.includes("txdot.gov");

export const ALCOHOL_BATCH23_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(ALCOHOL_BATCH23_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "alcohol",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Alcoholic Beverage Code") ||
      source.label.includes("Penal Code") ||
      source.label.includes("Election Code"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
}));
