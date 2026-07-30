import { describe, expect, it } from "vitest";
import {
  getPrivateCulturalLandmarkCollectionById,
  getPrivateCulturalLandmarkCollectionBySlug,
  privateCulturalLandmarkCollections,
} from "./collections.private-cultural-landmarks";

describe("private cultural landmark collections", () => {
  it("publishes unique collection ids and slugs", () => {
    expect(new Set(privateCulturalLandmarkCollections.map(({ id }) => id)).size).toBe(
      privateCulturalLandmarkCollections.length,
    );
    expect(new Set(privateCulturalLandmarkCollections.map(({ slug }) => slug)).size).toBe(
      privateCulturalLandmarkCollections.length,
    );
  });

  it("resolves every collection destination exactly once", () => {
    for (const collection of privateCulturalLandmarkCollections) {
      expect(collection.destinations.map(({ slug }) => slug)).toEqual(
        collection.destinationSlugs,
      );
      expect(new Set(collection.destinationSlugs).size).toBe(
        collection.destinationSlugs.length,
      );
    }
  });

  it("separates free access from reservation experiences", () => {
    expect(getPrivateCulturalLandmarkCollectionBySlug("free-private-cultural-landmarks")?.destinationSlugs).toEqual([
      "cadillac-ranch",
    ]);
    expect(getPrivateCulturalLandmarkCollectionBySlug("reservation-cultural-experiences")?.destinationSlugs).toEqual([
      "newmans-castle",
    ]);
  });

  it("supports id and slug lookup", () => {
    expect(getPrivateCulturalLandmarkCollectionById("private-cultural-landmarks")?.slug).toBe(
      "private-cultural-landmarks",
    );
    expect(getPrivateCulturalLandmarkCollectionBySlug("texas-roadside-art-and-architecture")?.id).toBe(
      "texas-roadside-art-and-architecture",
    );
  });

  it("returns null for unknown collections", () => {
    expect(getPrivateCulturalLandmarkCollectionById("unknown")).toBeNull();
    expect(getPrivateCulturalLandmarkCollectionBySlug("unknown")).toBeNull();
  });
});
