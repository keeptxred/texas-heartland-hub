import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-criminal-trespass-law",
  "texas-criminal-mischief-law",
  "texas-theft-shoplifting-law",
  "texas-disorderly-conduct-law",
  "texas-public-intoxication-law",
  "texas-assault-law",
  "texas-harassment-law",
  "texas-stalking-law",
  "texas-evading-arrest-detention-law",
  "texas-failure-to-identify-law",
];

describe("Everyday Criminal Law evergreen guide registry", () => {
  it("registers exactly ten newly verified criminal-law guides", () => {
    const verified = lawGuidesForTopic("everyday-criminal").filter((guide) => guide.status === "verified");

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

  it("keeps criminal-law registry and public guide content aligned", () => {
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

  it("records current statutory-change dates and identification distinctions", () => {
    const verified = lawGuidesForTopic("everyday-criminal").filter((guide) => guide.status === "verified");

    expect(verified.find((item) => item.slug === "texas-theft-shoplifting-law")?.effectiveDate).toContain("September 1, 2025");
    expect(verified.find((item) => item.slug === "texas-assault-law")?.effectiveDate).toContain("September 1, 2025");
    expect(verified.find((item) => item.slug === "texas-harassment-law")?.effectiveDate).toContain("September 1, 2025");
    expect(verified.find((item) => item.slug === "texas-failure-to-identify-law")?.effectiveDate).toContain("September 1, 2023");

    const theft = ALL_GUIDES["texas-theft-shoplifting-law"];
    const failureToIdentify = ALL_GUIDES["texas-failure-to-identify-law"];
    const theftText = theft.sections.flatMap((section) => section.paragraphs ?? []).join(" ");
    const identificationText = failureToIdentify.sections.flatMap((section) => section.paragraphs ?? []).join(" ");

    expect(theftText).toContain("organized retail theft");
    expect(identificationText).toContain("lawfully arrested");
    expect(identificationText).toContain("motor-vehicle");
  });
});
