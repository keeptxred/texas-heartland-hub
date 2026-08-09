import { describe, expect, it } from "vitest";
import { classifyContentPillar, resolveContentPillarSlug } from "@/lib/content-pillars";
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
});
