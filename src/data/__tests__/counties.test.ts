import { describe, expect, test } from "bun:test";
import {
  COUNTIES,
  MANUAL_ENTRY_COUNTIES,
  SEEDED_COUNTIES,
  TAX_RATE_DATASET,
} from "../counties";

describe("Texas property-tax dataset integrity", () => {
  test("contains every Texas county exactly once", () => {
    expect(COUNTIES).toHaveLength(254);
    expect(new Set(COUNTIES.map((county) => county.slug)).size).toBe(254);
    expect(new Set(COUNTIES.map((county) => county.name)).size).toBe(254);
  });

  test("uses the current statewide school homestead exemption baseline", () => {
    expect(TAX_RATE_DATASET.statewideSchoolHomesteadExemption).toBe(140000);
    for (const county of COUNTIES) {
      expect(county.homesteadExemption).toBe(140000);
    }
  });

  test("separates seeded counties from manual-entry counties", () => {
    expect(SEEDED_COUNTIES).toHaveLength(TAX_RATE_DATASET.seededCountyCount);
    expect(MANUAL_ENTRY_COUNTIES).toHaveLength(
      TAX_RATE_DATASET.countyCount - TAX_RATE_DATASET.seededCountyCount,
    );
    expect(SEEDED_COUNTIES.length + MANUAL_ENTRY_COUNTIES.length).toBe(254);
  });

  test("does not present zero placeholders as seeded rates", () => {
    for (const county of SEEDED_COUNTIES) {
      expect(county.dataStatus).toBe("seeded-local-rates");
      expect(county.countyRate).toBeGreaterThan(0);
      expect(county.schoolDistricts.length).toBeGreaterThan(0);
      expect(county.schoolDistricts.every((district) => district.rate > 0)).toBe(true);
    }
  });

  test("requires local entry when no rates are seeded", () => {
    for (const county of MANUAL_ENTRY_COUNTIES) {
      expect(county.dataStatus).toBe("manual-entry-required");
      expect(county.countyRate).toBe(0);
      expect(county.cityAvgRate).toBe(0);
      expect(county.schoolDistricts).toEqual([{ name: "Enter exact ISD rate", rate: 0 }]);
    }
  });

  test("records review and official-source metadata", () => {
    expect(TAX_RATE_DATASET.sourceUrl).toMatch(/^https:\/\/comptroller\.texas\.gov\//);
    expect(TAX_RATE_DATASET.exemptionSourceUrl).toMatch(/^https:\/\/comptroller\.texas\.gov\//);
    expect(Date.parse(TAX_RATE_DATASET.lastUpdated)).not.toBeNaN();
    expect(Date.parse(TAX_RATE_DATASET.nextReviewOn)).not.toBeNaN();
    expect(Date.parse(TAX_RATE_DATASET.nextReviewOn)).toBeGreaterThan(
      Date.parse(TAX_RATE_DATASET.lastUpdated),
    );
  });
});
