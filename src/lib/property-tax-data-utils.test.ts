import { describe, expect, it } from "vitest";
import { COUNTIES, TAX_RATE_DATASET } from "@/data/counties";
import { PROPERTY_TAX_HISTORY_FILES, PROPERTY_TAX_OFFICIAL_FILES } from "@/data/property-tax-data";
import { buildCountyRateCsv, estimateTaxFromRate, summarizeCountyRates } from "@/lib/property-tax-data-utils";

describe("property tax Data Center dataset", () => {
  it("keeps a normalized row for every Texas county", () => {
    expect(COUNTIES).toHaveLength(254);
    expect(new Set(COUNTIES.map((county) => county.slug)).size).toBe(254);
    expect(new Set(COUNTIES.map((county) => county.taxYear))).toEqual(new Set([TAX_RATE_DATASET.taxYear]));
    expect(COUNTIES.every((county) => county.countyRate >= 0)).toBe(true);
  });

  it("calculates rates as dollars per $100 of taxable value", () => {
    expect(estimateTaxFromRate(100_000, 0.5)).toBe(500);
    expect(estimateTaxFromRate(250_000, 0.4)).toBe(1_000);
    expect(estimateTaxFromRate(-1, 0.5)).toBe(0);
  });

  it("summarizes the statewide county-rate table without dropping counties", () => {
    const summary = summarizeCountyRates(COUNTIES);
    expect(summary.countyCount).toBe(254);
    expect(summary.highestCountyRate).toBeGreaterThanOrEqual(summary.medianCountyRate);
    expect(summary.medianCountyRate).toBeGreaterThanOrEqual(summary.lowestCountyRate);
  });

  it("exports all county rows as downloadable CSV", () => {
    const csv = buildCountyRateCsv(COUNTIES);
    const lines = csv.trim().split("\n");
    expect(lines).toHaveLength(255);
    expect(lines[0]).toContain("County tax rate per $100");
    expect(lines[0]).toContain("Estimated county levy per $100,000 taxable value");
  });

  it("retains current and historical Comptroller workbooks", () => {
    expect(PROPERTY_TAX_OFFICIAL_FILES).toHaveLength(5);
    expect(PROPERTY_TAX_HISTORY_FILES.map((file) => file.year)).toEqual([2025, 2024, 2023, 2022, 2021]);
    expect(PROPERTY_TAX_HISTORY_FILES.every((file) => file.countyUrl.startsWith("https://comptroller.texas.gov/"))).toBe(true);
    expect(PROPERTY_TAX_HISTORY_FILES.every((file) => file.combinedUrl.startsWith("https://comptroller.texas.gov/"))).toBe(true);
  });
});
