import { describe, expect, it } from "vitest";
import {
  CONTENT_PILLARS,
  classifyContentPillar,
  classifyContentPillars,
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
    ["Texas Homestead Exemption Explained for Homeowners", "texas-economy-small-business"],
    ["How to File a Property Tax Appraisal Protest in Texas", "texas-economy-small-business"],
    ["What Your County Appraisal District Does", "texas-economy-small-business"],
    ["Texas Property Taxes and Taxable Value Explained", "texas-economy-small-business"],
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

  it("does not let generic government language override a prominent property-tax topic", () => {
    expect(
      classifyContentPillar({
        title: "Texas Homestead Exemption Explained",
        description: "A homeowner guide to exemptions, taxable value, and appraisal districts.",
        body: "The governor and Legislature have debated tax policy for years.",
      }),
    ).toBe("texas-economy-small-business");
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
    ).toEqual([
      "texas-energy-oil",
      "texas-laws-legislature",
      "texas-economy-small-business",
    ]);
  });

  it("resolves canonical hub ownership by href", () => {
    expect(getContentPillarByHref("/texas-border-security")?.slug).toBe("texas-border-immigration");
    expect(getContentPillarByHref("/not-a-pillar")).toBeNull();
  });

  it("defines intentional internal-link neighbors for every pillar", () => {
    for (const pillar of CONTENT_PILLARS) {
      expect(pillar.subtopics.length).toBeGreaterThanOrEqual(5);
      const related = getRelatedContentPillars(pillar.slug);
      expect(related.length).toBeGreaterThanOrEqual(2);
      expect(related.every((item) => item.slug !== pillar.slug)).toBe(true);
    }
  });
});
