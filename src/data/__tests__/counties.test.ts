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

  test("does not ship stale or averaged local rates", () => {
    expect(TAX_RATE_DATASET.seededCountyCount).toBe(0);
    expect(SEEDED_COUNTIES).toHaveLength(0);
    expect(MANUAL_ENTRY_COUNTIES).toHaveLength(254);
  });

  test("requires exact local entry or address-derived rates for every county", () => {
    for (const county of COUNTIES) {
      expect(county.dataStatus).toBe("manual-entry-required");
      expect(county.dataSource).toBe("manual-or-address-derived-local-rates");
      expect(county.countyRate).toBe(0);
      expect(county.cityAvgRate).toBe(0);
      expect(county.specialDistrictRate).toBe(0);
      expect(county.schoolDistricts).toEqual([{ name: "Enter exact ISD rate", rate: 0 }]);
      expect(county.specialDistricts).toEqual([]);
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
