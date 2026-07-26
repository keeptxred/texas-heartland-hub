import { describe, expect, it } from "vitest";
import { texasLighthouseCatalog } from "./catalog.lighthouses";
import { texasLighthouseDestinations } from "./catalog.lighthouses.entities";
import { exploreDestinations } from "./all-destinations";

describe("Texas lighthouse catalog", () => {
  it("contains unique canonical slugs", () => {
    const slugs = texasLighthouseCatalog.map((lighthouse) => lighthouse.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("provides valid Texas coordinates and official sources", () => {
    for (const lighthouse of texasLighthouseCatalog) {
      expect(lighthouse.latitude).toBeGreaterThanOrEqual(25);
      expect(lighthouse.latitude).toBeLessThanOrEqual(37);
      expect(lighthouse.longitude).toBeGreaterThanOrEqual(-107);
      expect(lighthouse.longitude).toBeLessThanOrEqual(-93);
      expect(lighthouse.officialUrl).toMatch(/^https:\/\//);
      expect(lighthouse.sourceName.length).toBeGreaterThan(0);
    }
  });

  it("normalizes every record into a lighthouse Explore entity", () => {
    expect(texasLighthouseDestinations).toHaveLength(texasLighthouseCatalog.length);
    for (const destination of texasLighthouseDestinations) {
      expect(destination.entityType).toBe("lighthouse");
      expect(destination.categories).toContain("lighthouse");
      expect(destination.tags).toContain("texas lighthouse");
      expect(destination.profile.collection).toBe("Texas lighthouses");
    }
  });

  it("integrates lighthouses into the unified catalog without duplicating Port Isabel", () => {
    const lighthouseSlugs = new Set(texasLighthouseCatalog.map((lighthouse) => lighthouse.slug));
    const integrated = exploreDestinations.filter((destination) => lighthouseSlugs.has(destination.slug));

    expect(integrated).toHaveLength(lighthouseSlugs.size);
    expect(
      exploreDestinations.filter(
        (destination) => destination.slug === "port-isabel-lighthouse-state-historic-site",
      ),
    ).toHaveLength(1);
    expect(
      integrated.find(
        (destination) => destination.slug === "port-isabel-lighthouse-state-historic-site",
      )?.entityType,
    ).toBe("lighthouse");
  });

  it("keeps private and remote access restrictions explicit", () => {
    const bolivar = texasLighthouseDestinations.find(
      (destination) => destination.slug === "bolivar-point-lighthouse",
    );
    const matagorda = texasLighthouseDestinations.find(
      (destination) => destination.slug === "matagorda-island-lighthouse",
    );

    expect(bolivar?.profile.accessModel).toBe("view-only");
    expect(bolivar?.profile.towerAccess).toBe(false);
    expect(matagorda?.profile.accessModel).toBe("remote-restricted");
    expect(matagorda?.seasonalGuidance?.confirmBeforeTravel).toBe(true);
  });
});
