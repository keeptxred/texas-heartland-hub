import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-final-paycheck-law",
  "texas-payday-schedule-law",
  "texas-wage-deduction-law",
  "texas-wage-claim-law",
  "texas-minimum-wage-law",
  "texas-overtime-law",
  "texas-meal-rest-break-law",
  "texas-employment-at-will-law",
  "texas-workplace-discrimination-law",
  "texas-workers-compensation-coverage-law",
];

describe("Employment evergreen guide registry", () => {
  it("registers exactly ten verified employment-law guides", () => {
    const verified = lawGuidesForTopic("employment").filter((guide) => guide.status === "verified");

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

  it("keeps employment registry and public guide content aligned", () => {
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

  it("preserves high-intent Texas wage and coverage rules", () => {
    const finalPay = ALL_GUIDES["texas-final-paycheck-law"];
    const wageClaim = ALL_GUIDES["texas-wage-claim-law"];
    const discrimination = ALL_GUIDES["texas-workplace-discrimination-law"];
    const workersComp = ALL_GUIDES["texas-workers-compensation-coverage-law"];

    const finalPayText = [...finalPay.keyTakeaways, ...finalPay.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    const wageClaimText = [...wageClaim.keyTakeaways, ...wageClaim.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    const discriminationText = [...discrimination.keyTakeaways, ...discrimination.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    const workersCompText = [...workersComp.keyTakeaways, ...workersComp.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");

    expect(finalPayText).toContain("sixth day");
    expect(finalPayText).toContain("next regularly scheduled payday");
    expect(wageClaimText).toContain("180 days");
    expect(discriminationText).toContain("15-employee");
    expect(discriminationText).toContain("one or more employees");
    expect(workersCompText).toContain("non-subscriber");
  });
});
