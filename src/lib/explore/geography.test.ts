import { describe, expect, it } from "vitest";
import { haversineKm, orderStopsForRoute } from "./geography";
import type { ExploreEntityCard } from "@/types/explore/public";

const entity = (id: string, latitude: number, longitude: number): ExploreEntityCard => ({
  id,
  name: id,
  slug: id,
  entityType: "park",
  summary: null,
  city: null,
  county: null,
  region: null,
  latitude,
  longitude,
  heroImageUrl: null,
  heroImageAlt: null,
  amenities: [],
  activities: [],
  isFamilyFriendly: null,
  isPetFriendly: null,
  isAccessible: null,
  feeRequired: null,
});

describe("Explore geography", () => {
  it("calculates plausible Texas distances", () => {
    const distance = haversineKm(
      { latitude: 30.2672, longitude: -97.7431 },
      { latitude: 29.7604, longitude: -95.3698 },
    );
    expect(distance).toBeGreaterThan(230);
    expect(distance).toBeLessThan(250);
  });

  it("orders a small itinerary by nearest next stop", () => {
    const ordered = orderStopsForRoute([
      entity("start", 30, -98),
      entity("far", 32, -98),
      entity("near", 30.1, -98),
    ]);
    expect(ordered.map((item) => item.id)).toEqual(["start", "near", "far"]);
  });
});
