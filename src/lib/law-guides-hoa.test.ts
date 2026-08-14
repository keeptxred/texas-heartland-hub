import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-hoa-laws-guide",
  "texas-hoa-powers-guide",
  "texas-hoa-fines-law",
  "texas-hoa-foreclosure-law",
  "texas-hoa-lien-law",
  "texas-hoa-board-meetings-law",
  "texas-hoa-records-law",
  "texas-hoa-election-law",
  "texas-hoa-political-signs-law",
  "texas-hoa-flag-display-law",
];

describe("HOA and property evergreen guide registry", () => {
  it("registers exactly ten verified HOA guides", () => {
    const guides = lawGuidesForTopic("hoa-property");
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

  it("keeps HOA registry and guide content aligned", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-08-13");
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(1);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("records the 2025 HOA voting-procedure update", () => {
    const guide = lawGuidesForTopic("hoa-property").find((item) => item.slug === "texas-hoa-election-law");
    expect(guide?.effectiveDate).toContain("September 1, 2025");
  });
});
