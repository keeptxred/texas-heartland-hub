import { OUTDOORS_BATCH22_GUIDES } from "@/data/laws-outdoors-batch22";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") || url.includes("tpwd.texas.gov");

const effectiveDateFor = (slug: string): string | undefined => {
  if (["texas-fishing-license-law", "texas-hunting-license-law"].includes(slug)) {
    return "August 3, 2026 (TPWD recreational license purchase identity-validation requirements)";
  }
  return undefined;
};

export const OUTDOORS_BATCH22_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(OUTDOORS_BATCH22_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "outdoors",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Parks and Wildlife Code") ||
      source.label.includes("Penal Code"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDateFor(guide.slug),
}));
