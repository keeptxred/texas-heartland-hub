import { CONSUMER_BATCH14_GUIDES } from "@/data/laws-consumer-batch14-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("consumerfinance.gov") ||
  url.includes("ftc.gov") ||
  url.includes("texasattorneygeneral.gov") ||
  url.includes("txdmv.gov") ||
  url.includes("tdlr.texas.gov");

export const CONSUMER_BATCH14_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(CONSUMER_BATCH14_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "consumer",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Finance Code") ||
      source.label.includes("Texas Business & Commerce Code") ||
      source.label.includes("Texas Occupations Code") ||
      source.label.includes("12 C.F.R."),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: guide.slug === "texas-consumer-data-privacy-law"
    ? "July 1, 2024 (Texas Data Privacy and Security Act)"
    : undefined,
}));
