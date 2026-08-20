import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import {
  isLawGuideIndexable,
  lawGuidesForTopic,
  validateLawGuideMeta,
} from "@/lib/law-guides";

const EXPECTED = [
  "texas-speeding-laws-guide",
  "texas-seat-belt-child-safety-seat-laws",
  "texas-texting-driving-phone-laws",
  "texas-move-over-slow-down-law",
  "texas-auto-insurance-requirements",
  "texas-expired-registration-law",
  "texas-front-license-plate-law",
  "texas-left-lane-passing-law",
  "texas-school-bus-stop-law",
  "texas-dwi-law-guide",
];

describe("verified Texas driving law guides", () => {
  it("registers the first ten guides as verified and indexable", () => {
    const guides = lawGuidesForTopic("driving");
    expect(guides.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(guides).toHaveLength(10);

    for (const meta of guides) {
      expect(meta.status).toBe("verified");
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-13");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps registry metadata and public guide content in sync", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-08-13");
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });
});
