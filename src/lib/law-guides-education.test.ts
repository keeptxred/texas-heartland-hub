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
  "texas-school-bullying-cyberbullying-law",
  "texas-school-corporal-punishment-opt-out-law",
  "texas-special-education-evaluation-law",
  "texas-ard-iep-parent-rights-guide",
  "texas-special-education-discipline-manifestation-law",
  "texas-school-restraint-timeout-law",
  "texas-school-immunization-exemption-law",
  "texas-school-psychotropic-drug-law",
  "texas-school-library-parental-access-law",
  "texas-school-library-material-challenge-law",
];

describe("Schools and parental rights evergreen guide registry", () => {
  it("registers exactly twenty verified education-law guides", () => {
    const verified = lawGuidesForTopic("education").filter((guide) => guide.status === "verified");
    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(20);

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

  it("locks Batch 17 attendance, parent-access, transfer, and HB 6 discipline rules", () => {
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

  it("locks Batch 18 bullying, special-education, health, and library rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-school-bullying-cyberbullying-law")).toContain("third business day");
    expect(text("texas-school-bullying-cyberbullying-law")).toContain("off school property");
    expect(text("texas-school-corporal-punishment-opt-out-law")).toContain("each school year");
    expect(text("texas-special-education-evaluation-law")).toContain("15 school days");
    expect(text("texas-special-education-evaluation-law")).toContain("45 school days");
    expect(text("texas-special-education-evaluation-law")).toContain("30 calendar days");
    expect(text("texas-ard-iep-parent-rights-guide")).toContain("five school days");
    expect(text("texas-special-education-discipline-manifestation-law")).toContain("10 school days");
    expect(text("texas-special-education-discipline-manifestation-law")).toContain("direct and substantial relationship");
    expect(text("texas-school-restraint-timeout-law")).toContain("written documentation");
    expect(text("texas-school-immunization-exemption-law")).toContain("two years");
    expect(text("texas-school-immunization-exemption-law")).toContain("HB 1586");
    expect(text("texas-school-psychotropic-drug-law")).toContain("recommend that a student use a psychotropic drug");
    expect(text("texas-school-library-parental-access-law")).toContain("Section 33.023");
    expect(text("texas-school-library-material-challenge-law")).toContain("fifth day");
    expect(text("texas-school-library-material-challenge-law")).toContain("90 days");
    expect(text("texas-school-library-material-challenge-law")).toContain("second anniversary");
  });

  it("marks the current-law effective dates for HB 6, HB 1586, and SB 13", () => {
    const metadata = Object.fromEntries(lawGuidesForTopic("education").map((guide) => [guide.slug, guide]));

    for (const slug of ["texas-school-suspension-law", "texas-daep-placement-law", "texas-school-expulsion-law"]) {
      expect(metadata[slug]?.effectiveDate).toContain("2025–2026 school year");
      expect(metadata[slug]?.effectiveDate).toContain("HB 6");
    }

    expect(metadata["texas-school-immunization-exemption-law"]?.effectiveDate).toContain("September 1, 2025");
    expect(metadata["texas-school-immunization-exemption-law"]?.effectiveDate).toContain("HB 1586");

    for (const slug of ["texas-school-library-parental-access-law", "texas-school-library-material-challenge-law"]) {
      expect(metadata[slug]?.effectiveDate).toContain("2025–2026 school year");
      expect(metadata[slug]?.effectiveDate).toContain("SB 13");
    }
  });
});
