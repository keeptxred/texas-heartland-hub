import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-underage-drinking-law",
  "texas-furnishing-alcohol-to-minor-law",
  "texas-fake-id-alcohol-law",
  "texas-alcohol-sale-hours-law",
  "texas-liquor-store-hours-sunday-law",
  "texas-open-container-vehicle-law",
  "texas-alcohol-to-go-law",
  "texas-alcohol-delivery-law",
  "texas-byob-law",
  "texas-wet-dry-local-option-law",
];

describe("Alcohol and everyday regulations evergreen guide registry", () => {
  it("registers exactly ten verified alcohol-law guides", () => {
    const verified = lawGuidesForTopic("alcohol").filter((guide) => guide.status === "verified");
    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(10);

    for (const meta of verified) {
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-15");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps alcohol metadata and public guide content aligned", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-08-15");
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("locks underage, furnishing and age-misrepresentation rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-underage-drinking-law")).toContain("under 21");
    expect(text("texas-underage-drinking-law")).toContain("visible presence");
    expect(text("texas-underage-drinking-law")).toContain("first person to request");
    expect(text("texas-furnishing-alcohol-to-minor-law")).toContain("Class A misdemeanor");
    expect(text("texas-furnishing-alcohol-to-minor-law")).toContain("state jail felony");
    expect(text("texas-fake-id-alcohol-law")).toContain("Section 106.07");
    expect(text("texas-fake-id-alcohol-law")).toContain("apparently valid government-issued identification");
  });

  it("locks hours, open-container and consumer transaction rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-alcohol-sale-hours-law")).toContain("10 a.m.–noon Sunday");
    expect(text("texas-alcohol-sale-hours-law")).toContain("2 a.m.");
    expect(text("texas-liquor-store-hours-sunday-law")).toContain("10 a.m.–9 p.m.");
    expect(text("texas-liquor-store-hours-sunday-law")).toContain("Thanksgiving Day");
    expect(text("texas-open-container-vehicle-law")).toContain("locked glove compartment");
    expect(text("texas-open-container-vehicle-law")).toContain("motorized house coach");
    expect(text("texas-alcohol-to-go-law")).toContain("food order");
    expect(text("texas-alcohol-to-go-law")).toContain("permit-specific");
    expect(text("texas-alcohol-delivery-law")).toContain("Chapter 57");
    expect(text("texas-alcohol-delivery-law")).toContain("retailer's county");
  });

  it("locks BYOB and local wet/dry distinctions", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-byob-law")).toContain("no single statewide BYOB law");
    expect(text("texas-byob-law")).toContain("Mixed Beverage Permit");
    expect(text("texas-byob-law")).toContain("corkage");
    expect(text("texas-wet-dry-local-option-law")).toContain("Section 251.71");
    expect(text("texas-wet-dry-local-option-law")).toContain("Chapter 501");
    expect(text("texas-wet-dry-local-option-law")).toContain("beverage specific");
  });
});
