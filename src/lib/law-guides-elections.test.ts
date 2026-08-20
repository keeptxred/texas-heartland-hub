import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-voter-registration-law",
  "texas-voter-id-law",
  "texas-early-voting-law",
  "texas-vote-by-mail-eligibility-law",
  "texas-mail-ballot-application-return-law",
  "texas-polling-place-hours-law",
  "texas-electioneering-polling-place-law",
  "texas-voter-assistance-law",
  "texas-curbside-voting-law",
  "texas-provisional-ballot-law",
];

describe("Elections and voting evergreen guide registry", () => {
  it("registers exactly ten verified election-law guides", () => {
    const verified = lawGuidesForTopic("elections").filter((guide) => guide.status === "verified");
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

  it("keeps election registry and public guide content aligned", () => {
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

  it("locks voter registration, ID, early voting and mail-ballot rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-voter-registration-law")).toContain("30th day");
    expect(text("texas-voter-registration-law")).toContain("United States citizen");
    expect(text("texas-voter-id-law")).toContain("seven");
    expect(text("texas-voter-id-law")).toContain("Reasonable Impediment Declaration");
    expect(text("texas-early-voting-law")).toContain("no special excuse");
    expect(text("texas-vote-by-mail-eligibility-law")).toContain("65");
    expect(text("texas-mail-ballot-application-return-law")).toContain("11th day");
    expect(text("texas-mail-ballot-application-return-law")).toContain("Section 86.007");
  });

  it("locks polling-place access, electioneering, assistance and provisional-ballot rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-polling-place-hours-law")).toContain("7 a.m. to 7 p.m.");
    expect(text("texas-electioneering-polling-place-law")).toContain("100 feet");
    expect(text("texas-electioneering-polling-place-law")).toContain("20 feet");
    expect(text("texas-voter-assistance-law")).toContain("HB 521");
    expect(text("texas-curbside-voting-law")).toContain("physically unable to enter");
    expect(text("texas-curbside-voting-law")).toContain("seven or more curbside voters");
    expect(text("texas-provisional-ballot-law")).toContain("six calendar days");
    expect(text("texas-provisional-ballot-law")).toContain("Section 63.011");
  });

  it("marks enacted 2025 election-law changes with effective dates", () => {
    const metadata = Object.fromEntries(lawGuidesForTopic("elections").map((guide) => [guide.slug, guide]));
    for (const slug of ["texas-electioneering-polling-place-law", "texas-voter-assistance-law", "texas-curbside-voting-law"]) {
      expect(metadata[slug]?.effectiveDate).toContain("September 1, 2025");
      expect(metadata[slug]?.effectiveDate).toContain("HB 521");
    }
    expect(metadata["texas-mail-ballot-application-return-law"]?.effectiveDate).toContain("September 1, 2025");
    expect(metadata["texas-mail-ballot-application-return-law"]?.effectiveDate).toContain("HB 3697");
  });
});
