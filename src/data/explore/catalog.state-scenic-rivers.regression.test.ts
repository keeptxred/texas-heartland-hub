import { describe, expect, it } from "vitest";
import { exploreDestinations } from "./all-destinations";
import {
  stateScenicRiverDestinations,
  stateScenicRiverSlugs,
} from "./catalog.state-scenic-rivers.entities";

const scenicRiverSlugs = new Set(stateScenicRiverSlugs);

describe("Explore Texas state scenic river catalog", () => {
  it("adds every scenic river corridor exactly once to the unified catalog", () => {
    expect(stateScenicRiverDestinations).toHaveLength(8);
    expect(new Set(stateScenicRiverSlugs).size).toBe(stateScenicRiverSlugs.length);

    for (const slug of stateScenicRiverSlugs) {
      expect(exploreDestinations.filter((destination) => destination.slug === slug)).toHaveLength(1);
    }
  });

  it("normalizes scenic rivers as searchable river destinations", () => {
    const destinations = exploreDestinations.filter((destination) =>
      scenicRiverSlugs.has(destination.slug),
    );

    for (const destination of destinations) {
      expect(destination.entityType).toBe("river_access");
      expect(destination.categories).toEqual(
        expect.arrayContaining(["state scenic river", "river corridor", "freshwater"]),
      );
      expect(destination.tags).toEqual(
        expect.arrayContaining(["river", "rivers", "scenic river", "waterway"]),
      );
      expect(destination.latitude).not.toBeNull();
      expect(destination.longitude).not.toBeNull();
      expect(destination.officialUrl).toMatch(/^https:\/\/tpwd\.texas\.gov\//);
      expect(destination.sourceName).toBe("Texas Parks and Wildlife Department");
    }
  });

  it("keeps related parks, river access points, lakes, and natural areas as relationships rather than duplicates", () => {
    const devilsRiver = exploreDestinations.find(
      (destination) => destination.slug === "devils-river-scenic-corridor",
    );
    const frioRiver = exploreDestinations.find(
      (destination) => destination.slug === "frio-river-scenic-corridor",
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

    expect(
      exploreDestinations.filter((destination) => destination.slug === "garner-state-park"),
    ).toHaveLength(1);
    expect(
      exploreDestinations.filter(
        (destination) => destination.slug === "devils-river-state-natural-area",
      ),
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
