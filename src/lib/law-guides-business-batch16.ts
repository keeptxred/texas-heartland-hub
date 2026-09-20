import { BUSINESS_BATCH16_GUIDES } from "@/data/laws-business-batch16";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("sos.state.tx.us") ||
  url.includes("comptroller.texas.gov");

export const BUSINESS_BATCH16_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(BUSINESS_BATCH16_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "business",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Business Organizations Code") ||
      source.label.includes("Texas Business & Commerce Code") ||
      source.label.includes("Texas Tax Code"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
}));
