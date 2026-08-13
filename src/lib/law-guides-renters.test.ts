import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-security-deposit-law",
  "texas-rent-late-fee-law",
  "texas-landlord-repair-law",
  "texas-repair-and-deduct-law",
  "texas-rental-application-fee-law",
  "texas-rent-increase-law",
  "texas-landlord-entry-privacy-law",
  "texas-right-to-copy-of-lease",
  "texas-rental-smoke-alarm-law",
  "texas-landlord-owner-management-disclosure-law",
];

describe("renter evergreen guide registry", () => {
  it("registers exactly ten verified guides", () => {
    const guides = lawGuidesForTopic("landlord-tenant");
    expect(guides.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(guides).toHaveLength(10);
    for (const meta of guides) {
      expect(meta.status).toBe("verified");
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-13");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps registry and guide content aligned", () => {
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

  it("records the 2025 repair workflow update", () => {
    const guide = lawGuidesForTopic("landlord-tenant").find((item) => item.slug === "texas-repair-and-deduct-law");
    expect(guide?.effectiveDate).toContain("September 1, 2025");
  });
});
