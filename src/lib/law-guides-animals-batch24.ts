import { ANIMALS_BATCH24_GUIDES } from "@/data/laws-animals-batch24";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("dshs.texas.gov") ||
  url.includes("ada.gov");

const effectiveDateFor = (slug: string): string | undefined => {
  if (slug === "texas-dog-tether-restraint-law") {
    return "January 18, 2022 (SB 5, 87th Legislature 3rd Called Session)";
  }
  if (slug === "texas-service-animal-access-law") {
    return "September 1, 2023 (HB 4164 service-animal misrepresentation penalty update)";
  }
  return undefined;
};

export const ANIMALS_BATCH24_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(ANIMALS_BATCH24_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "animals",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Health and Safety Code") ||
      source.label.includes("Penal Code") ||
      source.label.includes("Human Resources Code") ||
      source.label.includes("Texas Legislature"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDateFor(guide.slug),
}));
