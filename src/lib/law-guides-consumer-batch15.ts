import { CONSUMER_BATCH15_GUIDES } from "@/data/laws-consumer-batch15-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("consumerfinance.gov") ||
  url.includes("occc.texas.gov");

export const CONSUMER_BATCH15_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(CONSUMER_BATCH15_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "consumer",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Finance Code") ||
      source.label.includes("Texas Property Code") ||
      source.label.includes("Texas Civil Practice and Remedies Code") ||
      source.label.includes("Texas Business & Commerce Code") ||
      source.label.includes("Texas Family Code"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
}));
