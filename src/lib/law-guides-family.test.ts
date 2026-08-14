import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-marriage-license-law",
  "texas-common-law-marriage-law",
  "texas-divorce-law-guide",
  "texas-divorce-waiting-period-law",
  "texas-divorce-name-change-law",
  "texas-child-custody-conservatorship-law",
  "texas-standard-possession-order-law",
  "texas-child-support-guidelines-law",
  "texas-paternity-law-guide",
  "texas-family-violence-protective-order-law",
];

describe("Marriage & Family evergreen guide registry", () => {
  it("registers exactly ten newly verified family-law guides", () => {
    const verified = lawGuidesForTopic("family").filter((guide) => guide.status === "verified");

    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(10);

    for (const meta of verified) {
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-13");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps family-law registry and public guide content aligned", () => {
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

  it("records the 2025 informal-marriage and protective-order updates", () => {
    const verified = lawGuidesForTopic("family").filter((guide) => guide.status === "verified");
    const informal = verified.find((item) => item.slug === "texas-common-law-marriage-law");
    const protective = verified.find((item) => item.slug === "texas-family-violence-protective-order-law");

    expect(informal?.effectiveDate).toContain("September 1, 2025");
    expect(informal?.effectiveDate).toContain("HB 1193");
    expect(protective?.effectiveDate).toContain("September 1, 2025");
    expect(protective?.effectiveDate).toContain("SB 1559");

    const informalGuide = ALL_GUIDES["texas-common-law-marriage-law"];
    const protectiveGuide = ALL_GUIDES["texas-family-violence-protective-order-law"];
    const informalText = informalGuide.sections.flatMap((section) => section.paragraphs ?? []).join(" ");
    const protectiveText = protectiveGuide.sections.flatMap((section) => section.paragraphs ?? []).join(" ");

    expect(informalText).toContain("Section 2.401(b)");
    expect(informalText).toContain("rebuttably presumed");
    expect(informalText).toContain("HB 1193");
    expect(protectiveText).toContain("Section 81.012");
    expect(protectiveText).toContain("SB 1559");
  });
});
