import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-permitless-carry-law",
  "texas-license-to-carry-guide",
  "texas-open-carry-law",
  "texas-30-05-30-06-30-07-signs-guide",
  "texas-firearm-prohibited-places-law",
  "texas-vehicle-handgun-carry-law",
  "texas-campus-carry-law",
  "texas-ltc-reciprocity-guide",
  "texas-self-defense-law",
  "texas-castle-doctrine-stand-your-ground-law",
];

describe("self-defense and firearms evergreen guide registry", () => {
  it("registers exactly ten newly verified firearms guides while preserving legacy pages", () => {
    const topicGuides = lawGuidesForTopic("self-defense-firearms");
    const verified = topicGuides.filter((guide) => guide.status === "verified");

    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(10);
    expect(topicGuides.some((guide) => guide.slug === "texas-gun-laws-explained" && guide.status === "legacy")).toBe(true);
    expect(topicGuides.some((guide) => guide.slug === "constitutional-carry-one-year-later" && guide.status === "legacy")).toBe(true);

    for (const meta of verified) {
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-13");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps verified firearms registry and guide content aligned", () => {
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

  it("records the key carry-law effective dates and current age distinction", () => {
    const verified = lawGuidesForTopic("self-defense-firearms").filter((guide) => guide.status === "verified");
    expect(verified.find((item) => item.slug === "texas-permitless-carry-law")?.effectiveDate).toContain("September 1, 2021");
    expect(verified.find((item) => item.slug === "texas-30-05-30-06-30-07-signs-guide")?.effectiveDate).toContain("September 1, 2025");

    const permitless = ALL_GUIDES["texas-permitless-carry-law"];
    const ltc = ALL_GUIDES["texas-license-to-carry-guide"];
    expect(permitless.sections.some((section) => section.paragraphs.some((text) => text.includes("21-and-older")))).toBe(true);
    expect(ltc.sections.some((section) => section.paragraphs.some((text) => text.includes("18-to-20-year-olds")))).toBe(true);
  });
});
