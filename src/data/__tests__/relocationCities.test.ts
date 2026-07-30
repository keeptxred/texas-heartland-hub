import { describe, expect, test } from "bun:test";
import { calculators } from "../calculators";
import { LAUNCH_COUNTIES } from "../relocationLaunch";
import {
  CITY_COMPARISON_PATH,
  CITY_RELOCATION_PATH,
  RELOCATION_CITIES,
} from "../relocationCities";

const countySlugs = new Set(LAUNCH_COUNTIES.map((county) => county.slug));
const calculatorPaths = new Set(calculators.map((calculator) => calculator.slug));

describe("Milestone 3 city relocation registry", () => {
  test("defines stable city and comparison paths", () => {
    expect(CITY_RELOCATION_PATH).toBe("/texas-relocation/cities");
    expect(CITY_COMPARISON_PATH).toBe("/texas-relocation/compare-cities");
  });

  test("includes ten unique launch cities", () => {
    expect(RELOCATION_CITIES).toHaveLength(10);
    expect(new Set(RELOCATION_CITIES.map((city) => city.slug)).size).toBe(10);
    expect(new Set(RELOCATION_CITIES.map((city) => city.name)).size).toBe(10);
  });

  test("links every city to a launch county and secure official source", () => {
    for (const city of RELOCATION_CITIES) {
      expect(countySlugs.has(city.parentCountySlug)).toBe(true);
      expect(city.officialCityUrl).toMatch(/^https:\/\//);
      expect(city.sourceStatus).toBe("official-links-and-planning-context");
    }
  });

  test("links every city to registered calculators", () => {
    for (const city of RELOCATION_CITIES) {
      expect(city.calculatorPaths.length).toBeGreaterThanOrEqual(3);
      for (const path of city.calculatorPaths) {
        expect(calculatorPaths.has(path)).toBe(true);
      }
    }
  });
});
