import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-will-requirements-guide",
  "texas-holographic-will-law",
  "texas-intestate-succession-guide",
  "texas-probate-four-year-deadline",
  "texas-small-estate-affidavit-law",
  "texas-muniment-of-title-law",
  "texas-independent-administration-law",
  "texas-executor-duties-law",
  "texas-determination-of-heirship-law",
  "texas-transfer-on-death-deed-law",
];

describe("Wills, probate and inheritance evergreen guide registry", () => {
  it("registers exactly ten verified probate-law guides", () => {
    const verified = lawGuidesForTopic("probate").filter((guide) => guide.status === "verified");
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

  it("keeps probate metadata and public guide content aligned", () => {
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

  it("locks Texas will, intestacy and probate timing rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-will-requirements-guide")).toContain("two or more credible witnesses");
    expect(text("texas-will-requirements-guide")).toContain("14 years old");
    expect(text("texas-holographic-will-law")).toContain("wholly in the testator's handwriting");
    expect(text("texas-intestate-succession-guide")).toContain("community");
    expect(text("texas-intestate-succession-guide")).toContain("nonprobate");
    expect(text("texas-probate-four-year-deadline")).toContain("fourth anniversary");
    expect(text("texas-probate-four-year-deadline")).toContain("not in default");
  });

  it("locks streamlined probate and fiduciary distinctions", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-small-estate-affidavit-law")).toContain("$75,000");
    expect(text("texas-small-estate-affidavit-law")).toContain("30 days");
    expect(text("texas-small-estate-affidavit-law")).toContain("intestate");
    expect(text("texas-muniment-of-title-law")).toContain("no necessity for administration");
    expect(text("texas-muniment-of-title-law")).toContain("unpaid debt");
    expect(text("texas-independent-administration-law")).toContain("all distributees");
    expect(text("texas-executor-duties-law")).toContain("fiduciary");
    expect(text("texas-determination-of-heirship-law")).toContain("attorney ad litem");
  });

  it("locks transfer-on-death deed execution and revocation rules", () => {
    const guide = ALL_GUIDES["texas-transfer-on-death-deed-law"];
    const text = [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    expect(text).toContain("recorded before the transferor's death");
    expect(text).toContain("will may not revoke or supersede");
    expect(text).toContain("no present");
  });
});
