import { describe, expect, it } from "vitest";
import {
  classifyContentPillar,
  classifyContentPillars,
  getContentPillar,
  getContentPillarByHref,
  getRelatedContentPillars,
  resolveContentPillarSlug,
} from "@/lib/content-pillars";
import { classifyFeedItem } from "@/lib/feed-routing";

describe("content pillar classification", () => {
  it.each([
    ["Texas primary election early voting begins", "texas-elections"],
    ["Operation Lone Star expands border patrol support", "texas-border-immigration"],
    ["ERCOT issues new electric grid forecast", "texas-energy-oil"],
    ["Texas ranchers face cattle and drought pressures", "texas-agriculture-rural"],
    ["Fort Cavazos veterans benefits event opens", "texas-veterans-military"],
    ["Texas DPS trooper public safety operation announced", "texas-law-enforcement-public-safety"],
    ["Texas small business jobs report shows growth", "texas-economy-small-business"],
    ["Texas Senate committee hearing on new law", "texas-laws-legislature"],
    ["Governor announces state agency appointment", "texas-politics-government"],
  ])("classifies %s", (title, expected) => {
    expect(classifyContentPillar({ title })).toBe(expected);
  });

  it("leaves unrelated Texas lifestyle coverage in general news", () => {
    expect(classifyContentPillar({ title: "A weekend guide to swimming holes near Austin" })).toBeNull();
  });

  it("does not let body boilerplate override a clear headline and dek", () => {
    expect(
      classifyContentPillar({
        title: "Governor announces state agency appointment",
        description: "The governor named a new commissioner to lead a statewide agency.",
        body: "Related coverage: election results, candidates, voter registration, ballot rules, early voting and polling places.",
        category: "Legislature",
      }),
    ).toBe("texas-politics-government");
  });

  it("uses only the article lead when headline and dek are ambiguous", () => {
    expect(
      classifyContentPillar({
        title: "Texas officials issue new update",
        description: null,
        body: "ERCOT said the electric grid has sufficient reserves for the afternoon. Later in the article, related election coverage appears in a footer.",
      }),
    ).toBe("texas-energy-oil");
  });

  it("prefers a valid persisted decision over later keyword drift", () => {
    expect(
      resolveContentPillarSlug("texas-agriculture-rural", {
        title: "Governor discusses election policy with ranchers",
      }),
    ).toBe("texas-agriculture-rural");
  });

  it("falls back to deterministic classification for legacy rows", () => {
    expect(
      classifyFeedItem({
        title: "ERCOT updates summer power grid outlook",
        description: null,
        source: "Texas News",
      }),
    ).toBe("energy");
  });

  it("uses persisted pillar routing when present", () => {
    expect(
      classifyFeedItem({
        title: "Governor visits rural county",
        description: null,
        source: "Office of the Governor",
        pillar_slug: "texas-agriculture-rural",
      }),
    ).toBe("agriculture");
  });

  it("keeps a primary pillar first while exposing secondary topic relationships", () => {
    expect(
      classifyContentPillars({
        title: "ERCOT grid bill advances in Texas Senate",
        description: "Lawmakers are considering new energy regulation for the electric grid.",
      }),
    ).toEqual(["texas-energy-oil", "texas-laws-legislature"]);
  });

  it("resolves canonical hub ownership by href", () => {
    expect(getContentPillarByHref("/texas-border-security")?.slug).toBe("texas-border-immigration");
    expect(getContentPillarByHref("/not-a-pillar")).toBeNull();
  });

  it("defines intentional internal-link neighbors for every pillar", () => {
    for (const slug of [
      "texas-politics-government",
      "texas-elections",
      "texas-border-immigration",
      "texas-energy-oil",
      "texas-economy-small-business",
      "texas-agriculture-rural",
      "texas-veterans-military",
      "texas-law-enforcement-public-safety",
      "texas-laws-legislature",
    ] as const) {
      const pillar = getContentPillar(slug);
      expect(pillar.subtopics.length).toBeGreaterThanOrEqual(5);
      expect(getRelatedContentPillars(slug).length).toBeGreaterThanOrEqual(2);
      expect(getRelatedContentPillars(slug).some((related) => related.slug === slug)).toBe(false);
    }
  });
});
