import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-fishing-license-law",
  "texas-hunting-license-law",
  "texas-hunter-education-law",
  "texas-hunting-private-property-permission-law",
  "texas-public-road-hunting-law",
  "texas-boater-education-law",
  "texas-life-jacket-law",
  "texas-boating-while-intoxicated-law",
  "texas-personal-watercraft-law",
  "texas-boat-drain-invasive-species-law",
];

describe("Outdoors, hunting and fishing evergreen guide registry", () => {
  it("registers exactly ten verified outdoors-law guides", () => {
    const verified = lawGuidesForTopic("outdoors").filter((guide) => guide.status === "verified");
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

  it("keeps outdoors metadata and public guide content aligned", () => {
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

  it("locks hunting and fishing licensing/access rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-fishing-license-law")).toContain("public water");
    expect(text("texas-fishing-license-law")).toContain("August 3, 2026");
    expect(text("texas-hunting-license-law")).toContain("feral hogs");
    expect(text("texas-hunting-license-law")).toContain("landowner authorization");
    expect(text("texas-hunter-education-law")).toContain("September 2, 1971");
    expect(text("texas-hunter-education-law")).toContain("normal voice control");
    expect(text("texas-hunting-private-property-permission-law")).toContain("landowner consent");
    expect(text("texas-hunting-private-property-permission-law")).toContain("wounded game");
    expect(text("texas-public-road-hunting-law")).toContain("public road");
    expect(text("texas-public-road-hunting-law")).toContain("no set distance");
  });

  it("locks core Texas boating safety rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-boater-education-law")).toContain("September 1, 1993");
    expect(text("texas-boater-education-law")).toContain("more than 15 horsepower");
    expect(text("texas-life-jacket-law")).toContain("younger than 13");
    expect(text("texas-life-jacket-law")).toContain("16 feet");
    expect(text("texas-boating-while-intoxicated-law")).toContain("0.08");
    expect(text("texas-boating-while-intoxicated-law")).toContain("Section 49.06");
    expect(text("texas-personal-watercraft-law")).toContain("sunset to sunrise");
    expect(text("texas-personal-watercraft-law")).toContain("50 feet");
    expect(text("texas-boat-drain-invasive-species-law")).toContain("drain all water");
    expect(text("texas-boat-drain-invasive-species-law")).toContain("harmful or potentially harmful aquatic plants");
  });

  it("marks the August 2026 TPWD recreational-license purchase change", () => {
    const metadata = Object.fromEntries(lawGuidesForTopic("outdoors").map((guide) => [guide.slug, guide]));
    for (const slug of ["texas-fishing-license-law", "texas-hunting-license-law"]) {
      expect(metadata[slug]?.effectiveDate).toContain("August 3, 2026");
      expect(metadata[slug]?.effectiveDate).toContain("identity-validation");
    }
  });
});
