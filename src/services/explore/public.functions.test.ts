import { describe, expect, it } from "vitest";
import { recommendationReasons } from "./public.functions";
import type { ExploreEntityCard, TripPreferences } from "@/types/explore/public";

const entity: ExploreEntityCard = {
  id: "1",
  entityType: "campground",
  name: "Published place",
  slug: "published-place",
  summary: null,
  city: null,
  county: null,
  region: "Hill Country",
  latitude: null,
  longitude: null,
  heroImageUrl: null,
  heroImageAlt: null,
  amenities: ["RV hookups"],
  activities: ["fishing", "hiking"],
  isFamilyFriendly: true,
  isPetFriendly: true,
  isAccessible: true,
  feeRequired: true,
};

const preferences: TripPreferences = {
  title: "Trip",
  days: 2,
  adults: 2,
  children: 1,
  pets: true,
  rv: true,
  accessible: true,
  region: "Hill Country",
  interests: ["fishing"],
  maxDrivingKm: 200,
};

describe("Explore recommendations", () => {
  it("returns deterministic explanations from structured fields", () => {
    expect(recommendationReasons(entity, preferences)).toEqual([
      "Matches your interest in fishing",
      "Suitable for families",
      "Welcomes pets",
      "Includes accessibility features",
      "Offers RV-compatible amenities",
      "Located in Hill Country",
    ]);
  });
});
