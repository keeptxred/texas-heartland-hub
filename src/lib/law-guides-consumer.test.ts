import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-debt-collection-law",
  "debt-validation-dispute-law-texas",
  "texas-credit-freeze-law",
  "texas-consumer-data-privacy-law",
  "texas-deceptive-trade-practices-law",
  "texas-price-gouging-law",
  "texas-door-to-door-cancellation-law",
  "texas-gift-card-law",
  "texas-lemon-law-guide",
  "texas-towing-consumer-rights-law",
  "texas-time-barred-debt-law",
  "texas-wage-garnishment-law",
  "texas-judgment-exempt-property-law",
  "texas-judgment-lien-homestead-law",
  "texas-vehicle-repossession-law",
  "texas-repossession-sale-deficiency-law",
  "texas-mortgage-foreclosure-notice-law",
  "texas-foreclosure-deficiency-law",
  "texas-credit-repair-organization-law",
  "texas-payday-title-loan-law",
];

describe("Consumer & Everyday Money evergreen guide registry", () => {
  it("registers exactly twenty verified consumer-law guides", () => {
    const verified = lawGuidesForTopic("consumer").filter((guide) => guide.status === "verified");

    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(20);

    for (const meta of verified) {
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-13");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps consumer registry and public guide content aligned", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-08-13");
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("locks high-intent consumer deadlines and thresholds", () => {
    const debtValidation = ALL_GUIDES["debt-validation-dispute-law-texas"];
    const privacy = ALL_GUIDES["texas-consumer-data-privacy-law"];
    const dtpa = ALL_GUIDES["texas-deceptive-trade-practices-law"];
    const giftCard = ALL_GUIDES["texas-gift-card-law"];
    const lemon = ALL_GUIDES["texas-lemon-law-guide"];
    const towing = ALL_GUIDES["texas-towing-consumer-rights-law"];
    const priceGouging = ALL_GUIDES["texas-price-gouging-law"];
    const doorToDoor = ALL_GUIDES["texas-door-to-door-cancellation-law"];

    const text = (guide: typeof debtValidation) => [
      ...guide.keyTakeaways,
      ...guide.sections.flatMap((section) => section.paragraphs ?? []),
    ].join(" ");

    expect(text(debtValidation)).toContain("30 days");
    expect(text(privacy)).toContain("45 days");
    expect(text(dtpa)).toContain("60 days");
    expect(text(giftCard)).toContain("less than $2.50");
    expect(text(lemon)).toContain("24,000 miles");
    expect(text(lemon)).toContain("six months");
    expect(text(towing)).toContain("14th day");
    expect(text(priceGouging)).toContain("President");
    expect(text(doorToDoor)).toContain("three business days");
  });

  it("locks Batch 15 debt, judgment, repossession, foreclosure, and credit-service protections", () => {
    const timeBarred = ALL_GUIDES["texas-time-barred-debt-law"];
    const wages = ALL_GUIDES["texas-wage-garnishment-law"];
    const exemptions = ALL_GUIDES["texas-judgment-exempt-property-law"];
    const lien = ALL_GUIDES["texas-judgment-lien-homestead-law"];
    const repossession = ALL_GUIDES["texas-vehicle-repossession-law"];
    const repoSale = ALL_GUIDES["texas-repossession-sale-deficiency-law"];
    const foreclosure = ALL_GUIDES["texas-mortgage-foreclosure-notice-law"];
    const foreclosureDeficiency = ALL_GUIDES["texas-foreclosure-deficiency-law"];
    const creditRepair = ALL_GUIDES["texas-credit-repair-organization-law"];
    const paydayTitle = ALL_GUIDES["texas-payday-title-loan-law"];

    const text = (guide: typeof timeBarred) => [
      ...guide.keyTakeaways,
      ...guide.sections.flatMap((section) => section.paragraphs ?? []),
    ].join(" ");

    expect(text(timeBarred)).toContain("does not revive");
    expect(text(timeBarred)).toContain("392.307");
    expect(text(wages)).toContain("current wages");
    expect(text(exemptions)).toContain("$100,000");
    expect(text(exemptions)).toContain("$50,000");
    expect(text(lien)).toContain("10 years");
    expect(text(lien)).toContain("52.0012");
    expect(text(repossession)).toContain("breach of the peace");
    expect(text(repoSale)).toContain("commercially reasonable");
    expect(text(foreclosure)).toContain("20 days");
    expect(text(foreclosure)).toContain("21 days");
    expect(text(foreclosureDeficiency)).toContain("two years");
    expect(text(foreclosureDeficiency)).toContain("fair market value");
    expect(text(creditRepair)).toContain("180 days");
    expect(text(creditRepair)).toContain("third day");
    expect(text(paydayTitle)).toContain("no prepayment penalty");
    expect(text(paydayTitle)).toContain("fee may not be charged unless it is disclosed");
  });

  it("records the Texas Data Privacy and Security Act effective date", () => {
    const privacy = lawGuidesForTopic("consumer").find((guide) => guide.slug === "texas-consumer-data-privacy-law");
    expect(privacy?.effectiveDate).toContain("July 1, 2024");
    expect(privacy?.effectiveDate).toContain("Texas Data Privacy and Security Act");
  });
});
