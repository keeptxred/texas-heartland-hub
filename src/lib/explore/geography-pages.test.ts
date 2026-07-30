import { describe, expect, it } from "vitest";
import { geographyPath, geographySlug } from "./geography-pages";

describe("Explore geography pages", () => {
  it("creates stable, readable geography slugs", () => {
    expect(geographySlug("Hill Country")).toBe("hill-country");
    expect(geographySlug("Brazos & Colorado")).toBe("brazos-and-colorado");
  });

  it("creates canonical county and region paths", () => {
    expect(geographyPath("county", "Travis")).toBe("/explore/county/travis");
    expect(geographyPath("region", "Piney Woods")).toBe("/explore/region/piney-woods");
  });
});
