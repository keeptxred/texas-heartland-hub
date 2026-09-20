import { describe, expect, it } from "vitest";
import {
  ERCOT_2025_CAPACITY,
  ERCOT_2025_ENERGY_USE,
  ERCOT_2025_TOTAL_CAPACITY_MW,
  ERCOT_GENERATION_DATA_URL,
  ERCOT_HELPFUL_RESOURCES_URL,
  ERCOT_YEARLY_PEAK_DEMAND,
  ERCOT_YEARLY_PEAK_SOURCE_URL,
  ercotPeakDemandCsv,
  peakDemandGrowthSince2000,
} from "@/data/ercot-energy-metrics";

describe("ERCOT Data Center metrics", () => {
  it("keeps yearly peak demand history from 2000 through current 2026", () => {
    expect(ERCOT_YEARLY_PEAK_DEMAND).toHaveLength(27);
    expect(ERCOT_YEARLY_PEAK_DEMAND[0]).toEqual({ year: 2026, demandMw: 91_089, provisional: true });
    expect(ERCOT_YEARLY_PEAK_DEMAND.at(-1)).toEqual({ year: 2000, demandMw: 57_606 });
  });

  it("preserves the 2025 annual-report installed-capacity total", () => {
    expect(ERCOT_2025_TOTAL_CAPACITY_MW).toBe(184_904);
    expect(ERCOT_2025_CAPACITY.reduce((sum, row) => sum + row.capacityMw, 0)).toBe(ERCOT_2025_TOTAL_CAPACITY_MW);
  });

  it("preserves the published 2025 energy-use shares including net other adjustment", () => {
    expect(ERCOT_2025_ENERGY_USE.find((row) => row.fuel === "Natural gas")?.percent).toBe(41.1);
    expect(ERCOT_2025_ENERGY_USE.find((row) => row.fuel === "Wind")?.percent).toBe(23.6);
    expect(ERCOT_2025_ENERGY_USE.find((row) => row.fuel === "Solar")?.percent).toBe(13.9);
    expect(ERCOT_2025_ENERGY_USE.reduce((sum, row) => sum + row.percent, 0)).toBeCloseTo(100, 5);
  });

  it("calculates long-run peak-demand growth from source values", () => {
    expect(peakDemandGrowthSince2000()).toBeCloseTo(58.12, 1);
  });

  it("exports peak-demand records with provisional status intact", () => {
    const csv = ercotPeakDemandCsv();
    expect(csv.split("\n")).toHaveLength(28);
    expect(csv).toContain("2026,91089,provisional");
    expect(csv).toContain("2025,80560,historical");
  });

  it("keeps core links on the official ERCOT domain", () => {
    for (const url of [ERCOT_YEARLY_PEAK_SOURCE_URL, ERCOT_GENERATION_DATA_URL, ERCOT_HELPFUL_RESOURCES_URL]) {
      expect(url).toMatch(/^https:\/\/www\.ercot\.com\//);
    }
  });
});
