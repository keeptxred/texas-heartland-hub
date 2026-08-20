import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-dangerous-dog-law",
  "texas-dog-attack-serious-injury-law",
  "texas-dog-cat-rabies-vaccination-law",
  "texas-animal-bite-rabies-quarantine-law",
  "texas-dog-tether-restraint-law",
  "texas-animal-cruelty-law",
  "texas-cruelly-treated-animal-seizure-law",
  "texas-service-animal-access-law",
  "texas-dangerous-wild-animal-law",
  "texas-shelter-dog-cat-sterilization-law",
];

describe("Animals and pets evergreen guide registry", () => {
  it("registers exactly ten verified animal-law guides", () => {
    const verified = lawGuidesForTopic("animals").filter((guide) => guide.status === "verified");
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

  it("keeps animal metadata and public guide content aligned", () => {
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

  it("locks dangerous-dog, attack and rabies rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-dangerous-dog-law")).toContain("30 days");
    expect(text("texas-dangerous-dog-law")).toContain("$100,000");
    expect(text("texas-dangerous-dog-law")).toContain("$50");
    expect(text("texas-dog-attack-serious-injury-law")).toContain("10th day");
    expect(text("texas-dog-attack-serious-injury-law")).toContain("hospitalization");
    expect(text("texas-dog-cat-rabies-vaccination-law")).toContain("four months");
    expect(text("texas-animal-bite-rabies-quarantine-law")).toContain("10-day observation");
    expect(text("texas-animal-bite-rabies-quarantine-law")).toContain("dogs, cats and domestic ferrets");
  });

  it("locks restraint, cruelty and civil seizure distinctions", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-dog-tether-restraint-law")).toContain("five times");
    expect(text("texas-dog-tether-restraint-law")).toContain("10 feet");
    expect(text("texas-dog-tether-restraint-law")).toContain("chain");
    expect(text("texas-animal-cruelty-law")).toContain("food, water, care or shelter");
    expect(text("texas-animal-cruelty-law")).toContain("Class A misdemeanors");
    expect(text("texas-animal-cruelty-law")).toContain("felony");
    expect(text("texas-cruelly-treated-animal-seizure-law")).toContain("probable cause");
    expect(text("texas-cruelly-treated-animal-seizure-law")).toContain("10 calendar days");
    expect(text("texas-cruelly-treated-animal-seizure-law")).toContain("de novo");
  });

  it("locks service-animal, dangerous-wild-animal and shelter rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-service-animal-access-law")).toContain("what work or task");
    expect(text("texas-service-animal-access-law")).toContain("$1,000");
    expect(text("texas-service-animal-access-law")).toContain("30 hours");
    expect(text("texas-dangerous-wild-animal-law")).toContain("$100,000");
    expect(text("texas-dangerous-wild-animal-law")).toContain("48 hours");
    expect(text("texas-shelter-dog-cat-sterilization-law")).toContain("30th day after adoption");
    expect(text("texas-shelter-dog-cat-sterilization-law")).toContain("six months");
    expect(text("texas-shelter-dog-cat-sterilization-law")).toContain("eight months");
  });

  it("marks major modern animal-law effective dates", () => {
    const metadata = Object.fromEntries(lawGuidesForTopic("animals").map((guide) => [guide.slug, guide]));
    expect(metadata["texas-dog-tether-restraint-law"]?.effectiveDate).toContain("January 18, 2022");
    expect(metadata["texas-dog-tether-restraint-law"]?.effectiveDate).toContain("SB 5");
    expect(metadata["texas-service-animal-access-law"]?.effectiveDate).toContain("September 1, 2023");
    expect(metadata["texas-service-animal-access-law"]?.effectiveDate).toContain("HB 4164");
  });
});
