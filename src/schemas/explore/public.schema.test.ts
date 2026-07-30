import { describe, expect, it } from "vitest";
import { exploreSearchSchema, tripPreferencesSchema } from "./public.schema";

describe("Explore public validation", () => {
  it("normalizes shareable comma-separated filters", () => {
    const parsed = exploreSearchSchema.parse({ types: "park,lake", page: "2", pageSize: "12" });
    expect(parsed.types).toEqual(["park", "lake"]);
    expect(parsed.page).toBe(2);
  });

  it("requires complete Texas coordinates", () => {
    expect(() => exploreSearchSchema.parse({ lat: 30.2 })).toThrow();
    expect(() => exploreSearchSchema.parse({ lat: 40, lng: -97 })).toThrow();
  });

  it("constrains trip inputs", () => {
    expect(() =>
      tripPreferencesSchema.parse({
        title: "Trip",
        days: 0,
        adults: 1,
        children: 0,
        pets: false,
        rv: false,
        accessible: false,
        interests: ["hiking"],
        maxDrivingKm: 100,
      }),
    ).toThrow();
  });
});
