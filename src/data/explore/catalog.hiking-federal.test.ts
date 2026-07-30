import { describe, expect, it } from "vitest";
import { exploreDestinations } from "./all-destinations";
import { federalHikingTrailDestinations, federalHikingTrailSeeds } from "./catalog.hiking-federal";
import {
  federalHikingParentSlugs,
  hikingRelationships,
  stateParkHikingSlugs,
} from "./relationships.hiking";

describe("federal hiking trail catalog", () => {
  it("publishes every reviewed trail exactly once", () => {
    expect(federalHikingTrailDestinations).toHaveLength(federalHikingTrailSeeds.length);

    for (const trail of federalHikingTrailSeeds) {
      expect(
        exploreDestinations.filter((destination) => destination.slug === trail.slug),
      ).toHaveLength(1);
    }
  });

  it("keeps authoritative source and safety metadata complete", () => {
    for (const trail of federalHikingTrailDestinations) {
      expect(trail.sourceName).toBe("U.S. Forest Service");
      expect(trail.sourceUrl).toMatch(/^https:\/\/www\.fs\.usda\.gov\//);
      expect(trail.activities).toContain("hiking");
      expect(trail.profile.parentDestinationSlug).toBeTruthy();
      expect(trail.seasonalGuidance).toMatchObject({ verifyBeforeTravel: true });
    }
  });

  it("creates verified bidirectional parent relationships", () => {
    expect(hikingRelationships.length).toBeGreaterThanOrEqual(federalHikingTrailSeeds.length * 2);

    for (const trail of federalHikingTrailSeeds) {
      const child = exploreDestinations.find((destination) => destination.slug === trail.slug);
      const parent = exploreDestinations.find(
        (destination) => destination.slug === trail.parentSlug,
      );

      expect(child?.related.map((related) => related.slug)).toContain(trail.parentSlug);
      expect(parent?.related.map((related) => related.slug)).toContain(trail.slug);
    }
  });

  it("enriches every federal hiking parent without duplicating it", () => {
    for (const slug of federalHikingParentSlugs) {
      const matches = exploreDestinations.filter((candidate) => candidate.slug === slug);

      expect(matches, `${slug} must resolve once`).toHaveLength(1);
      expect(matches[0].activities).toContain("hiking");
      expect(matches[0].categories).toContain("hiking area");
      expect(matches[0].profile.hikingDiscovery).toMatchObject({
        isHikingDestination: true,
        verifyCurrentConditions: true,
      });
    }
  });

  it("enriches the existing TPWD hiking destinations without creating park duplicates", () => {
    for (const slug of stateParkHikingSlugs) {
      const matches = exploreDestinations.filter((candidate) => candidate.slug === slug);

      expect(matches, `${slug} must resolve once`).toHaveLength(1);
      expect(matches[0].activities).toContain("hiking");
      expect(matches[0].categories).toContain("hiking area");
    }
  });

  it("links Cooper Lake's two visitor units back to the parent park in both directions", () => {
    const parent = exploreDestinations.find(
      (destination) => destination.slug === "cooper-lake-state-park",
    );

    for (const unitSlug of ["cooper-lake-doctors-creek-unit", "cooper-lake-south-sulphur-unit"]) {
      const unit = exploreDestinations.find((destination) => destination.slug === unitSlug);
      expect(unit?.related.map((related) => related.slug)).toContain("cooper-lake-state-park");
      expect(parent?.related.map((related) => related.slug)).toContain(unitSlug);
    }
  });
});
