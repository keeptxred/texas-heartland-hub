import { describe, expect, it } from "vitest";
import { destinations } from "./catalog.additional";

type ExpectedLocation = {
  name: string;
  city: string;
  county: string;
  region: string;
  latitude: number;
  longitude: number;
};

const upperGulfCoastLocations: ExpectedLocation[] = [
  {
    name: "Jocelyn Nungaray National Wildlife Refuge",
    city: "Anahuac",
    county: "Chambers County",
    region: "Gulf Coast",
    latitude: 29.6119092,
    longitude: -94.5350045,
  },
  {
    name: "McFaddin National Wildlife Refuge",
    city: "Sabine Pass",
    county: "Jefferson County",
    region: "Gulf Coast",
    latitude: 29.668442,
    longitude: -94.073883,
  },
  {
    name: "Texas Point National Wildlife Refuge",
    city: "Sabine Pass",
    county: "Jefferson County",
    region: "Gulf Coast",
    latitude: 29.6897,
    longitude: -93.9568,
  },
  {
    name: "Moody National Wildlife Refuge",
    city: "Anahuac",
    county: "Chambers County",
    region: "Gulf Coast",
    latitude: 29.706,
    longitude: -94.714,
  },
];

describe("Explore Texas upper Gulf Coast refuge locations", () => {
  it.each(upperGulfCoastLocations)(
    "keeps verified location metadata for $name",
    ({ name, city, county, region, latitude, longitude }) => {
      const destination = destinations.find((item) => item.name === name);

      expect(destination, `${name} must exist in the structured catalog`).toBeDefined();
      expect(destination).toMatchObject({
        name,
        city,
        county,
        region,
        latitude,
        longitude,
      });
    },
  );

  it("contains each audited refuge exactly once", () => {
    for (const { name } of upperGulfCoastLocations) {
      expect(destinations.filter((item) => item.name === name)).toHaveLength(1);
    }
  });
});
