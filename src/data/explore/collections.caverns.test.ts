import { describe, expect, it } from "vitest";
import {
  cavernDiscoveryCollections,
  getCavernCollectionDestinations,
  getCavernDiscoveryCollection,
} from "./collections.caverns";

const expectedCollectionIds = [
  "texas-caverns",
  "hill-country-caverns",
  "family-cavern-adventures",
  "texas-state-park-caverns",
] as const;

describe("Explore Texas cavern discovery collections", () => {
  it("publishes each cavern collection exactly once", () => {
    expect(cavernDiscoveryCollections.map((collection) => collection.id)).toEqual(
      expectedCollectionIds,
    );
    expect(new Set(cavernDiscoveryCollections.map((collection) => collection.id)).size).toBe(
      cavernDiscoveryCollections.length,
    );
    expect(new Set(cavernDiscoveryCollections.map((collection) => collection.slug)).size).toBe(
      cavernDiscoveryCollections.length,
    );
  });

  it.each(expectedCollectionIds)("resolves %s by ID and slug", (collectionId) => {
    const collection = getCavernDiscoveryCollection(collectionId);

    expect(collection).not.toBeNull();
    expect(getCavernDiscoveryCollection(collection?.slug ?? "")).toEqual(collection);
    expect(collection?.title.trim().length).toBeGreaterThan(0);
    expect(collection?.description.trim().length).toBeGreaterThan(0);
    expect(collection?.searchTerms.length).toBeGreaterThan(0);
  });

  it.each(expectedCollectionIds)("contains only resolvable, unique destinations in %s", (collectionId) => {
    const collection = getCavernDiscoveryCollection(collectionId);
    const destinations = getCavernCollectionDestinations(collectionId);

    expect(collection).not.toBeNull();
    expect(destinations).toHaveLength(collection?.destinationSlugs.length ?? 0);
    expect(new Set(collection?.destinationSlugs).size).toBe(collection?.destinationSlugs.length);
    expect(new Set(destinations.map((destination) => destination.slug)).size).toBe(
      destinations.length,
    );
  });

  it("keeps the statewide collection complete", () => {
    const destinations = getCavernCollectionDestinations("texas-caverns");

    expect(destinations.map((destination) => destination.slug)).toEqual([
      "natural-bridge-caverns",
      "inner-space-cavern",
      "caverns-of-sonora",
      "cave-without-a-name",
      "cascade-caverns",
      "wonder-world-cave-adventure-park",
      "longhorn-cavern-state-park",
      "kickapoo-cavern-state-park",
    ]);
  });

  it("keeps the state-park collection limited to TPWD destinations", () => {
    const destinations = getCavernCollectionDestinations("texas-state-park-caverns");

    expect(destinations).toHaveLength(2);
    for (const destination of destinations) {
      expect(destination.sourceName).toBe("Texas Parks and Wildlife Department");
      expect(destination.officialUrl).toMatch(/^https:\/\/tpwd\.texas\.gov\/state-parks\//);
    }
  });

  it("returns an empty result for unknown collections", () => {
    expect(getCavernDiscoveryCollection("unknown-cavern-collection")).toBeNull();
    expect(getCavernCollectionDestinations("unknown-cavern-collection")).toEqual([]);
  });
});
