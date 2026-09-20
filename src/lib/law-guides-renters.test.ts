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
  "texas-eviction-notice-law",
  "texas-eviction-process-timeline",
  "texas-landlord-lockout-law",
  "texas-month-to-month-lease-termination",
  "texas-military-lease-termination",
  "texas-rental-security-device-law",
  "texas-rental-flood-disclosure-law",
  "texas-rental-occupancy-limits",
  "texas-rental-casualty-loss-law",
  "texas-rental-notice-address-law",
  "texas-breaking-lease-law",
  "texas-lease-renewal-law",
  "texas-landlord-utility-shutoff-law",
  "texas-tenant-property-left-behind-law",
  "texas-rental-pets-assistance-animals-law",
  "texas-rent-control-law",
  "texas-family-violence-lease-termination-law",
  "texas-sex-offense-stalking-lease-termination-law",
  "texas-tenant-emergency-assistance-law",
  "texas-landlord-emergency-phone-law",
];

describe("renter evergreen guide registry", () => {
  it("registers thirty verified guides", () => {
    const guides = lawGuidesForTopic("landlord-tenant");
    expect(guides.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(guides).toHaveLength(30);
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

  it("records current effective-date metadata", () => {
    const guides = lawGuidesForTopic("landlord-tenant");
    expect(guides.find((item) => item.slug === "texas-repair-and-deduct-law")?.effectiveDate).toContain("September 1, 2025");
    expect(guides.find((item) => item.slug === "texas-rental-flood-disclosure-law")?.effectiveDate).toContain("September 1, 2025");
    expect(guides.find((item) => item.slug === "texas-sex-offense-stalking-lease-termination-law")?.effectiveDate).toContain("September 1, 2025");
  });
});
