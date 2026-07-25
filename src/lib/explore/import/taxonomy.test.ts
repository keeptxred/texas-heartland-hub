import { describe, expect, it } from "vitest";
import { assignImportTaxonomy } from "./taxonomy";

const baseDraft = {
  externalId: "park-1",
  entityType: "park",
  name: "River Bend Park",
  description: "Accessible hiking, fishing, and birding along the river.",
  taxonomy: ["Family Friendly", "parks"],
  relationships: [],
  media: [],
  metadata: {},
  raw: {},
};

describe("assignImportTaxonomy", () => {
  it("combines supplied, source, entity, and content-derived taxonomy", () => {
    expect(assignImportTaxonomy(baseDraft, "tpwd")).toEqual([
      "accessible",
      "birding",
      "family-friendly",
      "fishing",
      "hiking",
      "outdoors",
      "parks",
      "texas-parks-wildlife",
    ]);
  });

  it("deduplicates and normalizes taxonomy values", () => {
    expect(assignImportTaxonomy({
      ...baseDraft,
      taxonomy: ["Parks", "parks", "Water Recreation"],
      description: null,
    }, "custom")).toEqual(["outdoors", "parks", "water-recreation"]);
  });
});
