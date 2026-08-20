import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-llc-formation-law",
  "texas-registered-agent-law",
  "texas-business-name-availability-law",
  "texas-assumed-name-dba-law",
  "texas-llc-management-company-agreement-law",
  "texas-business-ownership-change-law",
  "texas-sales-tax-permit-law",
  "texas-franchise-tax-filing-law",
  "texas-public-information-report-law",
  "texas-business-termination-law",
];

describe("Small Business evergreen guide registry", () => {
  it("registers exactly ten verified business-law guides", () => {
    const verified = lawGuidesForTopic("business").filter((guide) => guide.status === "verified");
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

  it("keeps business registry and public guide content aligned", () => {
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

  it("locks formation, sales-tax, and franchise-tax compliance rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-llc-formation-law")).toContain("manager-managed");
    expect(text("texas-registered-agent-law")).toContain("physical Texas street address");
    expect(text("texas-assumed-name-dba-law")).toContain("does not by itself establish priority");
    expect(text("texas-sales-tax-permit-law")).toContain("$500,000");
    expect(text("texas-sales-tax-permit-law")).toContain("no fee");
    expect(text("texas-franchise-tax-filing-law")).toContain("May 15");
    expect(text("texas-franchise-tax-filing-law")).toContain("$2.65 million");
    expect(text("texas-public-information-report-law")).toContain("below the no-tax-due threshold");
    expect(text("texas-business-ownership-change-law")).toContain("does not require a Secretary of State filing");
    expect(text("texas-business-termination-law")).toContain("winding-up process");
  });
});
