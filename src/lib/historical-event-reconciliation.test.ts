import { describe, expect, it } from "vitest";
import { planHistoricalReconciliation, type HistoricalFeedItem } from "./historical-event-reconciliation";

function row(overrides: Partial<HistoricalFeedItem> & Pick<HistoricalFeedItem, "id" | "title" | "link" | "source">): HistoricalFeedItem {
  return {
    description: "Texas officials announced a new grid rule for large data centers after ERCOT review.",
    pub_date: "2026-08-10T12:00:00Z",
    created_at: "2026-08-10T12:05:00Z",
    internal_slug: null,
    event_cluster_id: null,
    target_site: "keeptxred",
    ...overrides,
  };
}

describe("historical event reconciliation", () => {
  it("backfills a matched legacy event when all reports point to one canonical slug", () => {
    const rows = [
      row({ id: 1, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-data-center-grid-rule" }),
      row({ id: 2, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily" }),
    ];
    const plans = planHistoricalReconciliation(rows);
    expect(plans).toHaveLength(1);
    expect(plans[0].kind).toBe("safe");
    expect(plans[0].canonicalSlug).toBe("ercot-data-center-grid-rule");
    expect(plans[0].publishedSlugs).toEqual(["ercot-data-center-grid-rule"]);
    expect(plans[0].sourceFamilies).toHaveLength(2);
  });

  it("holds an event when matched reports already point to different published URLs", () => {
    const rows = [
      row({ id: 10, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-grid-rule" }),
      row({ id: 11, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily", internal_slug: "texas-data-center-rule" }),
    ];
    const plans = planHistoricalReconciliation(rows);
    expect(plans).toHaveLength(1);
    expect(plans[0].kind).toBe("hold");
    expect(plans[0].canonicalSlug).toBeNull();
    expect(plans[0].publishedSlugs).toEqual(["ercot-grid-rule", "texas-data-center-rule"]);
  });

  it("never steals rows already owned by the modern event cluster system", () => {
    const rows = [
      row({ id: 20, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-grid-rule", event_cluster_id: "modern-cluster" }),
      row({ id: 21, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily" }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });

  it("does not reconcile weak or unrelated historical matches", () => {
    const rows = [
      row({ id: 30, title: "Houston council approves park renovation", link: "https://city.gov/park", source: "City of Houston", internal_slug: "houston-park-renovation", description: "Houston City Council approved a neighborhood park renovation project." }),
      row({ id: 31, title: "Dallas school district announces calendar", link: "https://district.edu/calendar", source: "Dallas ISD", description: "Dallas ISD announced its school calendar for the coming year." }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });

  it("does not treat same-lineage copies as independent historical support", () => {
    const rows = [
      row({ id: 35, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://example.com/original", source: "Texas Daily", internal_slug: "ercot-grid-rule" }),
      row({ id: 36, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/copy", source: "Texas Daily" }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });

  it("ignores non-KeepTXRed target rows", () => {
    const rows = [
      row({ id: 40, title: "ERCOT announces new rule for Texas data center grid connections", link: "https://ercot.com/rule", source: "ERCOT", internal_slug: "ercot-grid-rule" }),
      row({ id: 41, title: "Texas data centers face new ERCOT grid connection rule", link: "https://example.com/ercot-rule", source: "Texas Daily", target_site: "texasdefined" }),
    ];
    expect(planHistoricalReconciliation(rows)).toEqual([]);
  });
});
