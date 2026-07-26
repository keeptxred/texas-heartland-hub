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

const centralGulfCoastLocations: ExpectedLocation[] = [
  {
    name: "Brazoria National Wildlife Refuge",
    city: "Freeport",
    county: "Brazoria County",
    region: "Gulf Coast",
    latitude: 29.0474,
    longitude: -95.3208,
  },
  {
    name: "San Bernard National Wildlife Refuge",
    city: "Brazoria",
    county: "Brazoria County",
    region: "Gulf Coast",
    latitude: 28.8669,
    longitude: -95.5705,
  },
  {
    name: "Big Boggy National Wildlife Refuge",
    city: "Wadsworth",
    county: "Matagorda County",
    region: "Gulf Coast",
    latitude: 28.7572,
    longitude: -95.8086,
  },
  {
    name: "Matagorda Island National Wildlife Refuge",
    city: "Port O'Connor",
    county: "Calhoun County",
    region: "Gulf Coast",
    latitude: 28.2255,
    longitude: -96.6417,
  },
];

const southTexasLocations: ExpectedLocation[] = [
  {
    name: "Laguna Atascosa National Wildlife Refuge",
    city: "Los Fresnos",
    county: "Cameron County",
    region: "South Texas",
    latitude: 26.2293,
    longitude: -97.3483,
  },
  {
    name: "Lower Rio Grande Valley National Wildlife Refuge",
    city: "Alamo",
    county: "Cameron, Hidalgo, Starr, and Willacy Counties",
    region: "South Texas",
    latitude: 26.1858,
    longitude: -98.1067,
  },
  {
    name: "Santa Ana National Wildlife Refuge",
    city: "Alamo",
    county: "Hidalgo County",
    region: "South Texas",
    latitude: 26.0858,
    longitude: -98.1346,
  },
  {
    name: "Aransas National Wildlife Refuge",
    city: "Austwell",
    county: "Aransas and Refugio Counties",
    region: "Gulf Coast",
    latitude: 28.3135,
    longitude: -96.8044,
  },
];

const assertAuditedLocations = (locations: ExpectedLocation[]) => {
  it.each(locations)(
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
    for (const { name } of locations) {
      expect(destinations.filter((item) => item.name === name)).toHaveLength(1);
    }
  });
};

describe("Explore Texas upper Gulf Coast refuge locations", () => {
  assertAuditedLocations(upperGulfCoastLocations);
});

describe("Explore Texas central Gulf Coast refuge locations", () => {
  assertAuditedLocations(centralGulfCoastLocations);
});

describe("Explore Texas South Texas refuge locations", () => {
  assertAuditedLocations(southTexasLocations);
});
