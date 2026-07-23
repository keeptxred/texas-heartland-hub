import { describe, expect, test } from "bun:test";
import {
  CITY_COMPARISON_PATH,
  CITY_RELOCATION_PATH,
  RELOCATION_CITIES,
} from "../relocationCities";
import { LAUNCH_COUNTIES } from "../relocationLaunch";

const countySlugs = new Set(LAUNCH_COUNTIES.map((county) => county.slug));

describe("Milestone 3 public city routes", () => {
  test("defines stable directory and comparison paths", () => {
    expect(CITY_RELOCATION_PATH).toBe("/texas-relocation/cities");
    expect(CITY_COMPARISON_PATH).toBe("/texas-relocation/compare-cities");
    expect(CITY_COMPARISON_PATH).not.toStartWith(`${CITY_RELOCATION_PATH}/`);
  });

  test("generates unique public city URLs", () => {
    const paths = RELOCATION_CITIES.map(
      (city) => `${CITY_RELOCATION_PATH}/${city.slug}`,
    );
    expect(new Set(paths).size).toBe(RELOCATION_CITIES.length);
    expect(paths).not.toContain(CITY_RELOCATION_PATH);
    expect(paths).not.toContain(CITY_COMPARISON_PATH);
  });

  test("keeps every city connected to a launch county", () => {
    for (const city of RELOCATION_CITIES) {
      expect(countySlugs.has(city.parentCountySlug)).toBe(true);
    }
  });

  test("keeps comparison inputs transparent and user controlled", () => {
    for (const city of RELOCATION_CITIES) {
      expect(city.sourceStatus).toBe("official-links-and-planning-context");
      expect(city.calculatorPaths).toContain(
        "/tools/texas-cost-of-living-comparison",
      );
    }
  });
});
