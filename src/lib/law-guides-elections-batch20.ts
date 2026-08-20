import { ELECTIONS_BATCH20_GUIDES } from "@/data/laws-elections-batch20";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/tlodocs/") ||
  url.includes("sos.state.tx.us");

const effectiveDateFor = (slug: string): string | undefined => {
  if ([
    "texas-electioneering-polling-place-law",
    "texas-voter-assistance-law",
    "texas-curbside-voting-law",
  ].includes(slug)) {
    return "September 1, 2025 (HB 521 curbside voting and assistance changes)";
  }
  if (slug === "texas-mail-ballot-application-return-law") {
    return "September 1, 2025 (HB 3697 ABBM form requirements)";
  }
  return undefined;
};

export const ELECTIONS_BATCH20_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(ELECTIONS_BATCH20_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "elections",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) => source.label.includes("Texas Election Code") || source.label.includes("Texas Legislature"))
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDateFor(guide.slug),
}));
