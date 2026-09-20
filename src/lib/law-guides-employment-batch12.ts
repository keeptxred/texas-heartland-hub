import { EMPLOYMENT_BATCH12_GUIDES } from "@/data/laws-employment-batch12-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("govinfo.gov") ||
  url.includes("ecfr.gov") ||
  url.includes("dol.gov") ||
  url.includes("twc.texas.gov") ||
  url.includes("tdi.texas.gov");

export const EMPLOYMENT_BATCH12_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(EMPLOYMENT_BATCH12_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "employment",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Labor Code") ||
      source.label.includes("Fair Labor Standards Act") ||
      source.label.includes("29 C.F.R."),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
}));
