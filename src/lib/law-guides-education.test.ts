import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-compulsory-school-attendance-law",
  "texas-homeschool-law",
  "texas-public-school-enrollment-residency-law",
  "texas-parent-access-student-records-law",
  "texas-parent-access-instructional-materials-law",
  "texas-public-school-parental-rights-law",
  "texas-school-transfer-law",
  "texas-school-suspension-law",
  "texas-daep-placement-law",
  "texas-school-expulsion-law",
];

describe("Schools and parental rights evergreen guide registry", () => {
  it("registers exactly ten verified education-law guides", () => {
    const verified = lawGuidesForTopic("education").filter((guide) => guide.status === "verified");
    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(10);

    for (const meta of verified) {
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-14");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps education registry and public guide content aligned", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-08-14");
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("locks attendance, parent-access, transfer, and HB 6 discipline rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-compulsory-school-attendance-law")).toContain("19th birthday");
    expect(text("texas-homeschool-law")).toContain("does not regulate, index, monitor, approve, register, or accredit");
    expect(text("texas-parent-access-student-records-law")).toContain("FERPA");
    expect(text("texas-parent-access-instructional-materials-law")).toContain("HB 1605");
    expect(text("texas-school-transfer-law")).toContain("Section 25.036");
    expect(text("texas-school-suspension-law")).toContain("three school days");
    expect(text("texas-school-suspension-law")).toContain("10 school days");
    expect(text("texas-daep-placement-law")).toContain("60 days");
    expect(text("texas-daep-placement-law")).toContain("HB 6");
    expect(text("texas-school-expulsion-law")).toContain("trial de novo");
    expect(text("texas-school-expulsion-law")).toContain("HB 6");
  });

  it("marks the three HB 6 discipline guides with the 2025-26 effective school year", () => {
    const metadata = Object.fromEntries(lawGuidesForTopic("education").map((guide) => [guide.slug, guide]));
    for (const slug of ["texas-school-suspension-law", "texas-daep-placement-law", "texas-school-expulsion-law"]) {
      expect(metadata[slug]?.effectiveDate).toContain("2025–2026 school year");
      expect(metadata[slug]?.effectiveDate).toContain("HB 6");
    }
  });
});
