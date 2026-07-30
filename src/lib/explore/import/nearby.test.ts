import { describe, expect, it } from "vitest";
import { findNearby, haversineMiles } from "./nearby";

describe("Explore import nearby utilities", () => {
  it("calculates a stable distance between Austin and San Antonio", () => {
    const distance = haversineMiles(
      { latitude: 30.2672, longitude: -97.7431 },
      { latitude: 29.4241, longitude: -98.4936 },
    );

    expect(distance).toBeGreaterThan(70);
    expect(distance).toBeLessThan(80);
  });

  it("filters, orders, and limits nearby candidates", () => {
    const results = findNearby(
      { latitude: 30.2672, longitude: -97.7431 },
      [
        { id: "san-antonio", latitude: 29.4241, longitude: -98.4936 },
        { id: "round-rock", latitude: 30.5083, longitude: -97.6789 },
        { id: "houston", latitude: 29.7604, longitude: -95.3698 },
      ],
      100,
      2,
    );

    expect(results.map((result) => result.id)).toEqual(["round-rock", "san-antonio"]);
  });

  it("rejects invalid coordinates", () => {
    expect(() => haversineMiles(
      { latitude: 100, longitude: -97 },
      { latitude: 30, longitude: -97 },
    )).toThrow("latitude");
  });
});
