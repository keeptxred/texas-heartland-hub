import { EDUCATION_BATCH18_GUIDES } from "@/data/laws-education-batch18";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("capitol.texas.gov/BillLookup/") ||
  url.includes("tea.texas.gov") ||
  url.includes("spedsupport.tea.texas.gov") ||
  url.includes("dshs.texas.gov") ||
  url.includes("sites.ed.gov/idea/");

const effectiveDateFor = (slug: string): string | undefined => {
  if (["texas-school-library-parental-access-law", "texas-school-library-material-challenge-law"].includes(slug)) {
    return "2025–2026 school year (SB 13, 89th Legislature)";
  }
  if (slug === "texas-school-immunization-exemption-law") {
    return "September 1, 2025 (HB 1586 downloadable affidavit change)";
  }
  return undefined;
};

export const EDUCATION_BATCH18_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(EDUCATION_BATCH18_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "education",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Education Code") ||
      source.label.includes("Texas Health and Safety Code") ||
      source.label.includes("Texas Legislature") ||
      source.label.includes("34 C.F.R."),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDateFor(guide.slug),
}));
