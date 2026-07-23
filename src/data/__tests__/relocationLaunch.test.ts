import { describe, expect, test } from "bun:test";
import { calculators } from "../calculators";
import {
  LAUNCH_CALCULATOR_PATHS,
  LAUNCH_COUNTIES,
  LAUNCH_GUIDES,
  RELOCATION_LAUNCH_PATH,
} from "../relocationLaunch";

const calculatorPaths = new Set(calculators.map((calculator) => calculator.slug));

describe("Milestone 2 relocation launch registry", () => {
  test("defines the public relocation landing path", () => {
    expect(RELOCATION_LAUNCH_PATH).toBe("/texas-relocation");
  });

  test("includes ten unique launch counties", () => {
    expect(LAUNCH_COUNTIES).toHaveLength(10);
    expect(new Set(LAUNCH_COUNTIES.map((county) => county.slug)).size).toBe(10);
    expect(new Set(LAUNCH_COUNTIES.map((county) => county.name)).size).toBe(10);
  });

  test("uses secure official county and appraisal-district sources", () => {
    for (const county of LAUNCH_COUNTIES) {
      expect(county.officialCountyUrl).toMatch(/^https:\/\//);
      expect(county.appraisalDistrictUrl).toMatch(/^https:\/\//);
      expect(county.countySeat.length).toBeGreaterThan(0);
      expect(county.metro.length).toBeGreaterThan(0);
    }
  });

  test("links every county to registered calculators", () => {
    for (const county of LAUNCH_COUNTIES) {
      expect(county.calculatorPaths.length).toBeGreaterThanOrEqual(3);
      for (const path of county.calculatorPaths) {
        if (path === "/tax-calculator") continue;
        expect(calculatorPaths.has(path)).toBe(true);
      }
    }
  });

  test("registers the four launch calculators", () => {
    expect(LAUNCH_CALCULATOR_PATHS).toHaveLength(4);
    for (const path of LAUNCH_CALCULATOR_PATHS) {
      if (path === "/tax-calculator") continue;
      expect(calculatorPaths.has(path)).toBe(true);
    }
  });

  test("defines unique launch guides with calculator relationships", () => {
    expect(LAUNCH_GUIDES).toHaveLength(4);
    expect(new Set(LAUNCH_GUIDES.map((guide) => guide.slug)).size).toBe(4);
    for (const guide of LAUNCH_GUIDES) {
      expect(guide.description.length).toBeGreaterThan(40);
      expect(guide.relatedCalculatorPaths.length).toBeGreaterThan(0);
      for (const path of guide.relatedCalculatorPaths) {
        if (path === "/tax-calculator") continue;
        expect(calculatorPaths.has(path)).toBe(true);
      }
    }
  });
});
