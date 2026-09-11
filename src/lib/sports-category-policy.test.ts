import { describe, expect, it } from "vitest";
import { resolveSportsCategory, sportsCategoryFor } from "@/lib/sports-category-policy";

describe("sports category policy", () => {
  it("maps strong sports classifications to the sports taxonomy", () => {
    expect(sportsCategoryFor("sports-cfb", ["cfb"])).toBe("College Sports");
    expect(sportsCategoryFor("sports-nfl", ["nfl"])).toBe("NFL");
    expect(sportsCategoryFor("sports-policy", [])).toBe("Sports Business & Policy");
    expect(sportsCategoryFor("sports-motorsports", [])).toBe("Motorsports");
    expect(sportsCategoryFor("sports-general", [])).toBe("Sports");
  });

  it("repairs stale non-sports categories once a row is strongly classified as sports", () => {
    expect(resolveSportsCategory("Elections", "sports-cfb", ["cfb"])).toBe("College Sports");
    expect(resolveSportsCategory("Texas News", "sports-general", [])).toBe("Sports");
    expect(resolveSportsCategory("Politics", "sports-policy", [])).toBe("Sports Business & Policy");
  });

  it("preserves an intentional non-sports category only when taxonomy is locked", () => {
    expect(resolveSportsCategory("Politics", "sports-cfb", ["cfb"], true)).toBe("Politics");
  });
});
