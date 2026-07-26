import { describe, expect, it } from "vitest";
import {
  getPrivateNaturalLandmarkCollectionDestinations,
  getPrivateNaturalLandmarkDiscoveryCollection,
  privateNaturalLandmarkDiscoveryCollections,
} from "./collections.private-natural-landmarks";

const expectedCollectionIds = [
  "private-natural-landmarks",
  "hill-country-private-preserves",
  "guided-conservation-experiences",
  "private-river-recreation",
] as const;

const expectedStatewideSlugs = [
  "westcave-preserve",
  "chalk-bluff-river-resort",
  "selah-bamberger-ranch-preserve",
] as const;

describe("private natural landmark discovery collections", () => {
  it("publishes every collection exactly once", () => {
    expect(privateNaturalLandmarkDiscoveryCollections.map((collection) => collection.id)).toEqual(
      expectedCollectionIds,
    );
    expect(
      new Set(privateNaturalLandmarkDiscoveryCollections.map((collection) => collection.id)).size,
    ).toBe(privateNaturalLandmarkDiscoveryCollections.length);
    expect(
      new Set(privateNaturalLandmarkDiscoveryCollections.map((collection) => collection.slug)).size,
    ).toBe(privateNaturalLandmarkDiscoveryCollections.length);
  });

  it.each(expectedCollectionIds)("resolves %s by ID and slug", (collectionId) => {
    const collection = getPrivateNaturalLandmarkDiscoveryCollection(collectionId);

    expect(collection).not.toBeNull();
    expect(getPrivateNaturalLandmarkDiscoveryCollection(collection?.slug ?? "")).toEqual(collection);
    expect(collection?.title.trim().length).toBeGreaterThan(0);
    expect(collection?.description.trim().length).toBeGreaterThan(0);
    expect(collection?.searchTerms.length).toBeGreaterThan(0);
  });

  it.each(expectedCollectionIds)("contains only unique resolvable destinations in %s", (collectionId) => {
    const collection = getPrivateNaturalLandmarkDiscoveryCollection(collectionId);
    const destinations = getPrivateNaturalLandmarkCollectionDestinations(collectionId);

    expect(collection).not.toBeNull();
    expect(destinations).toHaveLength(collection?.destinationSlugs.length ?? 0);
    expect(new Set(collection?.destinationSlugs).size).toBe(collection?.destinationSlugs.length);
    expect(new Set(destinations.map((destination) => destination.slug)).size).toBe(
      destinations.length,
    );
  });

  it("keeps the statewide collection complete", () => {
    expect(
      getPrivateNaturalLandmarkCollectionDestinations("private-natural-landmarks").map(
        (destination) => destination.slug,
      ),
    ).toEqual(expectedStatewideSlugs);
  });

  it("limits guided conservation discovery to reservation or scheduled-program access", () => {
    const destinations = getPrivateNaturalLandmarkCollectionDestinations(
      "guided-conservation-experiences",
    );

    expect(destinations.map((destination) => destination.slug)).toEqual([
      "westcave-preserve",
      "selah-bamberger-ranch-preserve",
    ]);

    for (const destination of destinations) {
      expect(destination.regulations.swimmingStatus).toBe("not-permitted");
      expect(destination.regulations.overnightAccess).toBe(false);
    }
  });

  it("keeps private river recreation limited to swimming and overnight access", () => {
    const destinations = getPrivateNaturalLandmarkCollectionDestinations(
      "private-river-recreation",
    );

    expect(destinations.map((destination) => destination.slug)).toEqual([
      "chalk-bluff-river-resort",
    ]);
    expect(destinations[0]?.regulations.swimmingStatus).toBe("permitted");
    expect(destinations[0]?.regulations.overnightAccess).toBe(true);
  });

  it("returns empty results for unknown collections", () => {
    expect(getPrivateNaturalLandmarkDiscoveryCollection("unknown-private-landmarks")).toBeNull();
    expect(getPrivateNaturalLandmarkCollectionDestinations("unknown-private-landmarks")).toEqual([]);
  });
});
