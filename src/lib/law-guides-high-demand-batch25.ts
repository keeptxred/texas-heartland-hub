import { HIGH_DEMAND_BATCH25_GUIDES } from "@/data/laws-high-demand-batch25";
import type { LawGuideMeta, LawTopic } from "@/lib/law-guides-core";

const topicFor = (slug: string): LawTopic => {
  switch (slug) {
    case "texas-window-tint-law":
      return "driving";
    case "texas-squatter-adverse-possession-law":
      return "hoa-property";
    case "texas-hidden-camera-privacy-law":
    case "texas-knife-carry-law":
    default:
      return "criminal";
  }
};

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") ||
  url.includes("capitol.texas.gov/billlookup/") ||
  url.includes("dps.texas.gov/");

const statuteLabels = (slug: string): string[] => {
  switch (slug) {
    case "texas-hidden-camera-privacy-law":
      return ["Tex. Penal Code § 21.15", "HB 1465, 89th Legislature (2025)"];
    case "texas-window-tint-law":
      return ["Tex. Transp. Code §§ 547.609, 547.613", "37 Tex. Admin. Code § 21.3"];
    case "texas-knife-carry-law":
      return ["Tex. Penal Code §§ 46.01, 46.02, 46.03"];
    case "texas-squatter-adverse-possession-law":
      return ["Tex. Prop. Code ch. 24", "Tex. Civ. Prac. & Rem. Code §§ 16.021–16.030", "SB 38, 89th Legislature (2025)"];
    default:
      return [];
  }
};

const effectiveDate = (slug: string): string | undefined => {
  if (slug === "texas-hidden-camera-privacy-law") return "September 1, 2025 (HB 1465 expansion)";
  if (slug === "texas-squatter-adverse-possession-law") return "January 1, 2026 for SB 38 eviction-procedure changes";
  return undefined;
};

export const HIGH_DEMAND_BATCH25_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(HIGH_DEMAND_BATCH25_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: topicFor(guide.slug),
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: statuteLabels(guide.slug),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: effectiveDate(guide.slug),
  related: guide.related.filter((item) => item.href.startsWith("/guides/")).map((item) => item.href.replace("/guides/", "")),
}));
