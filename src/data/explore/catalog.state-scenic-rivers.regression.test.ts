import { describe, expect, it } from "vitest";
import { exploreDestinations } from "./all-destinations";
import {
  stateScenicRiverDestinations,
  stateScenicRiverSlugs,
} from "./catalog.state-scenic-rivers.entities";

const scenicRiverSlugs = new Set(stateScenicRiverSlugs);
const retiredUmbrellaSlugs = [
  "brazos-river-scenic-corridor-north-texas",
  "pecos-river-scenic-corridor",
  "colorado-river-scenic-corridor-central-texas",
];

const requiredAuthoritativeSegments = [
  "brazos-river-scenic-segment-bosque-hood",
  "brazos-river-scenic-segment-parker-palo-pinto",
  "colorado-river-scenic-segment-upper-west-central",
  "colorado-river-scenic-segment-colorado-bend",
  "pecos-river-scenic-segment-trans-pecos",
  "pecos-river-scenic-segment-lower",
  "pedernales-river-scenic-segment-kimble",
  "devils-river-scenic-corridor",
  "frio-river-scenic-corridor",
  "guadalupe-river-scenic-corridor",
  "nueces-river-scenic-corridor",
  "sabinal-river-scenic-corridor",
  "big-sandy-creek-scenic-segment-east-texas",
  "neches-river-scenic-segment-middle",
  "sabine-river-scenic-segment-lower",
  "sabine-river-scenic-segment-upper-toledo-bend",
  "sabine-river-scenic-segment-harrison-rusk",
  "village-creek-scenic-segment",
];

describe("Explore Texas state scenic river catalog", () => {
  it("adds every authoritative scenic river segment exactly once to the unified catalog", () => {
    expect(stateScenicRiverDestinations).toHaveLength(18);
    expect(stateScenicRiverSlugs).toEqual(expect.arrayContaining(requiredAuthoritativeSegments));
    expect(new Set(stateScenicRiverSlugs).size).toBe(stateScenicRiverSlugs.length);

    for (const slug of stateScenicRiverSlugs) {
      expect(exploreDestinations.filter((destination) => destination.slug === slug)).toHaveLength(1);
    }
  });

  it("removes generalized umbrella records that crossed authoritative segment boundaries", () => {
    for (const slug of retiredUmbrellaSlugs) {
      expect(stateScenicRiverSlugs).not.toContain(slug);
      expect(exploreDestinations.some((destination) => destination.slug === slug)).toBe(false);
    }
  });

  it("normalizes scenic rivers as searchable river destinations with explicit boundaries", () => {
    const destinations = exploreDestinations.filter((destination) =>
      scenicRiverSlugs.has(destination.slug),
    );

    for (const destination of destinations) {
      expect(destination.entityType).toBe("river_access");
      expect(destination.categories).toEqual(
        expect.arrayContaining([
          "state scenic river",
          "ecologically significant stream segment",
          "river corridor",
          "freshwater",
        ]),
      );
      expect(destination.tags).toEqual(
        expect.arrayContaining(["river", "rivers", "scenic river", "stream segment", "waterway"]),
      );
      expect(destination.latitude).not.toBeNull();
      expect(destination.longitude).not.toBeNull();
      expect(destination.officialUrl).toMatch(/^https:\/\/tpwd\.texas\.gov\//);
      expect(destination.sourceName).toBe("Texas Parks and Wildlife Department");
      expect(destination.profile.segmentBoundary).toEqual(expect.any(String));
      expect(String(destination.profile.segmentBoundary).length).toBeGreaterThan(40);
      expect(destination.description).toContain("Segment boundaries:");
    }
  });

  it("keeps related parks, river access points, lakes, and natural areas as relationships rather than duplicates", () => {
    const devilsRiver = exploreDestinations.find(
      (destination) => destination.slug === "devils-river-scenic-corridor",
    );
    const frioRiver = exploreDestinations.find(
      (destination) => destination.slug === "frio-river-scenic-corridor",
    );
    const coloradoBend = exploreDestinations.find(
      (destination) => destination.slug === "colorado-river-scenic-segment-colorado-bend",
    );

    expect(devilsRiver?.profile.relatedDestinationSlugs).toEqual(
      expect.arrayContaining([
        "devils-river-state-natural-area",
        "devils-river-at-bakers-crossing",
        "lake-amistad",
      ]),
    );
    expect(frioRiver?.profile.relatedDestinationSlugs).toEqual(
      expect.arrayContaining(["garner-state-park", "frio-river-at-concan"]),
    );
    expect(coloradoBend?.profile.relatedDestinationSlugs).toEqual(
      expect.arrayContaining(["colorado-bend-state-park"]),
    );

    expect(
      exploreDestinations.filter((destination) => destination.slug === "garner-state-park"),
    ).toHaveLength(1);
    expect(
      exploreDestinations.filter(
        (destination) => destination.slug === "devils-river-state-natural-area",
      ),
    ).toHaveLength(1);
    expect(
      exploreDestinations.filter((destination) => destination.slug === "colorado-bend-state-park"),
    ).toHaveLength(1);
  });

  it("preserves river-access safety and private-property guidance", () => {
    for (const destination of stateScenicRiverDestinations) {
      expect(destination.regulations).toMatchObject({
        privateProperty: expect.stringContaining("private land"),
        safety: expect.stringContaining("streamflow"),
      });
      expect(destination.seasonalGuidance).toMatchObject({
        verificationStatus: "official-source-reviewed",
        conditionsVariable: true,
      });
    }
  });
});
