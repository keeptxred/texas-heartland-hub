import { describe, expect, it } from "vitest";
import { selectLegislativeLayers } from "./legislative-map-vintage";

const layers = [
  { id: 0, name: "120th Congressional Districts" },
  { id: 1, name: "2026 State Legislative Districts - Upper" },
  { id: 2, name: "2026 State Legislative Districts - Lower" },
  { id: 4, name: "119th Congressional Districts" },
  { id: 5, name: "2024 State Legislative Districts - Upper" },
  { id: 6, name: "2024 State Legislative Districts - Lower" },
];
describe("legislative district map vintage", () => {
  it("selects the seated 119th Congress even if the next Congress occupies layer zero", () => {
    expect(selectLegislativeLayers(layers, new Date("2026-11-24T18:00:00Z"))).toEqual({
      congressional: 4, congressField: "CD119", upper: 1, lower: 2,
    });
  });
  it("fails closed if the required layer is absent", () => {
    expect(() => selectLegislativeLayers(layers.filter(layer => layer.id !== 4), new Date("2026-11-24T18:00:00Z"))).toThrow("119th Congressional Districts");
  });
  it("selects the next Congress only after its constitutional start", () => {
    const next = [...layers, { id: 20, name: "2027 State Legislative Districts - Upper" }, { id: 21, name: "2027 State Legislative Districts - Lower" }];
    expect(selectLegislativeLayers(next, new Date("2027-01-03T16:59:59Z")).congressField).toBe("CD119");
    expect(selectLegislativeLayers(next, new Date("2027-01-03T17:00:00Z")).congressField).toBe("CD120");
  });
});
