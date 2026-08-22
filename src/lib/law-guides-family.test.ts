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
  "texas-adoption-law-guide",
  "texas-parental-rights-termination-law",
  "texas-grandparent-visitation-law",
  "texas-emancipation-law",
  "texas-child-name-change-law",
  "texas-adult-name-change-law",
  "texas-child-support-modification-law",
  "texas-custody-modification-law",
  "texas-child-support-enforcement-law",
  "texas-custody-order-enforcement-law",
];

const FAMILY_GUIDE_BASELINE = "2026-08-13";

describe("Marriage & Family evergreen guide registry", () => {
  it("registers exactly twenty verified family-law guides", () => {
    const verified = lawGuidesForTopic("family").filter((guide) => guide.status === "verified");

    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(20);

    for (const meta of verified) {
      const guide = ALL_GUIDES[meta.slug];
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(guide).toBeDefined();
      if (!guide) throw new Error(`Missing public family-law guide for ${meta.slug}`);
      expect(meta.lastVerified).toBe(guide.updated);
      expect(meta.lastVerified >= FAMILY_GUIDE_BASELINE).toBe(true);
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps family-law registry and public guide content aligned", () => {
    const registry = new Map(lawGuidesForTopic("family").map((meta) => [meta.slug, meta] as const));

    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      const meta = registry.get(slug);
      expect(guide).toBeDefined();
      expect(meta).toBeDefined();
      if (!guide || !meta) throw new Error(`Missing family-law registry/content pair for ${slug}`);
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe(meta.lastVerified);
      expect(guide.updated >= FAMILY_GUIDE_BASELINE).toBe(true);
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(1);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("records the 2025 family-law updates carried by the verified guides", () => {
    const verified = lawGuidesForTopic("family").filter((guide) => guide.status === "verified");
    const informal = verified.find((item) => item.slug === "texas-common-law-marriage-law");
    const protective = verified.find((item) => item.slug === "texas-family-violence-protective-order-law");
    const custodyModification = verified.find((item) => item.slug === "texas-custody-modification-law");
    const custodyEnforcement = verified.find((item) => item.slug === "texas-custody-order-enforcement-law");

    expect(informal?.effectiveDate).toContain("September 1, 2025");
    expect(informal?.effectiveDate).toContain("HB 1193");
    expect(protective?.effectiveDate).toContain("September 1, 2025");
    expect(protective?.effectiveDate).toContain("SB 1559");
    expect(custodyModification?.effectiveDate).toContain("September 1, 2025");
    expect(custodyModification?.effectiveDate).toContain("HB 3181");
    expect(custodyEnforcement?.effectiveDate).toContain("September 1, 2025");
    expect(custodyEnforcement?.effectiveDate).toContain("HB 3181");

    const informalGuide = ALL_GUIDES["texas-common-law-marriage-law"];
    const protectiveGuide = ALL_GUIDES["texas-family-violence-protective-order-law"];
    const custodyModificationGuide = ALL_GUIDES["texas-custody-modification-law"];
    const custodyEnforcementGuide = ALL_GUIDES["texas-custody-order-enforcement-law"];
    const informalText = informalGuide.sections.flatMap((section) => section.paragraphs ?? []).join(" ");
    const protectiveText = protectiveGuide.sections.flatMap((section) => section.paragraphs ?? []).join(" ");
    const custodyModificationText = custodyModificationGuide.sections.flatMap((section) => section.paragraphs ?? []).join(" ");
    const custodyEnforcementText = custodyEnforcementGuide.sections.flatMap((section) => section.paragraphs ?? []).join(" ");

    expect(informalText).toContain("Section 2.401(b)");
    expect(informalText).toContain("rebuttably presumed");
    expect(informalText).toContain("HB 1193");
    expect(protectiveText).toContain("Section 81.012");
    expect(protectiveText).toContain("SB 1559");
    expect(custodyModificationText).toContain("Section 156.107");
    expect(custodyModificationText).toContain("HB 3181");
    expect(custodyEnforcementText).toContain("Section 156.107");
    expect(custodyEnforcementText).toContain("HB 3181");
  });
});
