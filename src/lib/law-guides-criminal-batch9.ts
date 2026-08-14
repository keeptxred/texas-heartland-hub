import { CRIMINAL_BATCH9_GUIDES } from "@/data/laws-criminal-batch9-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/");

export const CRIMINAL_BATCH9_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(CRIMINAL_BATCH9_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "criminal",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Penal Code") ||
      source.label.includes("Texas Code of Criminal Procedure"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: guide.slug === "texas-theft-shoplifting-law"
    ? "September 1, 2025 (SB 1300 revised the separate organized retail theft offense in Penal Code § 31.16)"
    : guide.slug === "texas-assault-law"
      ? "September 1, 2025 (SB 482 utility-worker assault enhancement)"
      : guide.slug === "texas-harassment-law"
        ? "September 1, 2025 (SB 482 utility-worker harassment enhancement)"
        : guide.slug === "texas-failure-to-identify-law"
          ? "September 1, 2023 (SB 1551 motor-vehicle operator identification rule)"
          : undefined,
}));
