import { describe, expect, it } from "vitest";
import {
  applySportsTaxonomyAutoLock,
  clearSportsTaxonomyAutoLock,
  resolveSportsCategory,
  sportsCategoryFor,
} from "@/lib/sports-category-policy";

describe("sports category policy", () => {
  it("maps strong sports classifications to the sports taxonomy", () => {
    expect(sportsCategoryFor("sports-cfb", ["cfb"])).toBe("College Sports");
    expect(sportsCategoryFor("sports-nfl", ["nfl"])).toBe("NFL");
    expect(sportsCategoryFor("sports-policy", [])).toBe("Sports Business & Policy");
    expect(sportsCategoryFor("sports-motorsports", [])).toBe("Motorsports");
    expect(sportsCategoryFor("sports-general", [])).toBe("Sports");
  });

  it("repairs stale non-sports categories when the article's primary identity is sports", () => {
    expect(resolveSportsCategory("Elections", "sports-cfb", ["cfb"], false, "Texas A&M dominates Missouri State in season opener")).toBe("College Sports");
    expect(resolveSportsCategory("Texas News", "sports-general", [], false, "Texas colleges announce cross country schedules")).toBe("Sports");
  });

  it("preserves civic categorization when politics or elections are genuinely the primary angle", () => {
    expect(resolveSportsCategory("Elections", "sports-nba", ["nba"], false, "San Antonio council pushes back on mayor bid to revisit Spurs arena funding and ballot questions")).toBe("Elections");
    expect(resolveSportsCategory("Politics", "sports-policy", [], false, "Ted Cruz college sports bill moves to the September Senate calendar")).toBe("Politics");
  });

  it("preserves an intentional non-sports category when taxonomy is locked", () => {
    expect(resolveSportsCategory("Politics", "sports-cfb", ["cfb"], true, "Texas A&M football season opener")).toBe("Politics");
  });

  it("auto-locks resolved sports categories against the legacy pillar bridge", () => {
    expect(applySportsTaxonomyAutoLock(["weak_dek"], "College Sports")).toEqual([
      "weak_dek",
      "taxonomy_locked",
      "sports_taxonomy_auto_locked",
    ]);
    expect(applySportsTaxonomyAutoLock([], "Elections")).toEqual([]);
  });

  it("removes only an auto-created taxonomy lock during sports cleanup", () => {
    expect(clearSportsTaxonomyAutoLock([
      "weak_dek",
      "taxonomy_locked",
      "sports_taxonomy_auto_locked",
    ])).toEqual(["weak_dek"]);
    expect(clearSportsTaxonomyAutoLock(["taxonomy_locked", "editor_reviewed"]))
      .toEqual(["taxonomy_locked", "editor_reviewed"]);
  });
});
