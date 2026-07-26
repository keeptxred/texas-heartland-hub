import { describe, expect, it } from "vitest";
import {
  getMajorSpringCollectionDestinations,
  getMajorSpringDiscoveryCollection,
  majorSpringDiscoveryCollections,
} from "./collections.major-springs";

const expectedCollectionIds = [
  "major-texas-springs",
  "spring-fed-swimming",
  "hill-country-springs",
  "spring-conservation-and-education",
] as const;

const expectedStatewideSlugs = [
  "balmorhea-state-park",
  "barton-springs-pool",
  "san-marcos-springs-spring-lake",
  "jacobs-well-natural-area",
  "hancock-springs-park",
] as const;

describe("Explore Texas major spring discovery collections", () => {
  it("publishes each spring collection exactly once", () => {
    expect(majorSpringDiscoveryCollections.map((collection) => collection.id)).toEqual(
      expectedCollectionIds,
    );
    expect(new Set(majorSpringDiscoveryCollections.map((collection) => collection.id)).size).toBe(
      majorSpringDiscoveryCollections.length,
    );
    expect(new Set(majorSpringDiscoveryCollections.map((collection) => collection.slug)).size).toBe(
      majorSpringDiscoveryCollections.length,
    );
  });

  it.each(expectedCollectionIds)("resolves %s by ID and slug", (collectionId) => {
    const collection = getMajorSpringDiscoveryCollection(collectionId);

    expect(collection).not.toBeNull();
    expect(getMajorSpringDiscoveryCollection(collection?.slug ?? "")).toEqual(collection);
    expect(collection?.title.trim().length).toBeGreaterThan(0);
    expect(collection?.description.trim().length).toBeGreaterThan(0);
    expect(collection?.searchTerms.length).toBeGreaterThan(0);
  });

  it.each(expectedCollectionIds)("contains only resolvable, unique destinations in %s", (collectionId) => {
    const collection = getMajorSpringDiscoveryCollection(collectionId);
    const destinations = getMajorSpringCollectionDestinations(collectionId);

    expect(collection).not.toBeNull();
    expect(destinations).toHaveLength(collection?.destinationSlugs.length ?? 0);
    expect(new Set(collection?.destinationSlugs).size).toBe(collection?.destinationSlugs.length);
    expect(new Set(destinations.map((destination) => destination.slug)).size).toBe(
      destinations.length,
    );
  });

  it("keeps the statewide collection complete and duplicate-free", () => {
    const destinations = getMajorSpringCollectionDestinations("major-texas-springs");

    expect(destinations.map((destination) => destination.slug)).toEqual(expectedStatewideSlugs);
    expect(destinations.some((destination) => destination.slug === "san-solomon-springs")).toBe(false);
  });

  it("limits the swimming collection to destinations with permitted public swimming", () => {
    const destinations = getMajorSpringCollectionDestinations("spring-fed-swimming");

    expect(destinations.map((destination) => destination.slug)).toEqual([
      "balmorhea-state-park",
      "barton-springs-pool",
      "hancock-springs-park",
    ]);

    for (const destination of destinations) {
      expect(destination.regulations.swimmingStatus).toBe("permitted");
    }
  });

  it("excludes restricted in-water destinations from public swimming discovery", () => {
    const swimmingSlugs = getMajorSpringCollectionDestinations("spring-fed-swimming").map(
      (destination) => destination.slug,
    );

    expect(swimmingSlugs).not.toContain("san-marcos-springs-spring-lake");
    expect(swimmingSlugs).not.toContain("jacobs-well-natural-area");
  });

  it("returns an empty result for unknown collections", () => {
    expect(getMajorSpringDiscoveryCollection("unknown-spring-collection")).toBeNull();
    expect(getMajorSpringCollectionDestinations("unknown-spring-collection")).toEqual([]);
  });
});
