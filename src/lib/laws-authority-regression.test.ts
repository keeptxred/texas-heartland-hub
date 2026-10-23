import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const hub = readFileSync(new URL("../routes/laws.index.tsx", import.meta.url), "utf8");
const articles = readFileSync(new URL("../data/articles.ts", import.meta.url), "utf8");
const topics = readFileSync(new URL("../data/law-topics.ts", import.meta.url), "utf8");

describe("Texas laws authority accuracy and discoverability regressions", () => {
  it("does not reinstate the unsupported 2026 amendment ballot or permanent-income-tax claims", () => {
    expect(hub).not.toMatch(/constitutional amendments Texans will vote on in November/i);
    expect(hub).not.toMatch(/made permanent by a 2019 constitutional amendment/i);
    expect(hub).toContain("official election process");
    expect(hub).toContain("subject to a constitutional prohibition");
  });
  it("keeps current legal navigation and the source-backed guide system discoverable", () => {
    expect(hub).toContain('to="/laws/topics"');
    expect(hub).toContain("/laws/topic/driving-traffic-insurance-law");
    expect(hub).toContain("/laws/topic/landlord-tenant-rentals-law");
    expect(hub).toContain("/laws/topic/employment-wages-workplace-rights-law");
    expect(hub).toContain("/laws/topic/consumer-protection-deceptive-trade-law");
    expect(hub).toContain("/laws/topic/family-custody-child-support-law");
    expect(hub).toContain("/laws/topic/wills-probate-inheritance-law");
    expect(hub).toContain("/laws/topic/criminal-offenses-penalties-law");
    expect(hub).toContain("https://statutes.capitol.texas.gov/");
    expect(topics).toContain("DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC");
    expect(topics).toContain("LANDLORD_TENANT_RENTALS_LAW_TOPIC");
    expect(topics).toContain("EMPLOYMENT_WORKPLACE_LAW_TOPIC");
    expect(topics).toContain("CONSUMER_PROTECTION_LAW_TOPIC");
    expect(topics).toContain("FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC");
    expect(topics).toContain("WILLS_PROBATE_INHERITANCE_LAW_TOPIC");
  });
  it("does not relabel an evergreen legislative article as limited to the 88th Legislature", () => {
    const entry = articles.slice(articles.indexOf('slug: "how-a-bill-becomes-texas-law"'));
    expect(entry.slice(0, 500)).toContain("How a Bill Becomes Texas Law: The Texas Legislative Process");
    expect(entry.slice(0, 500)).not.toContain("88th Legislature");
  });
});
