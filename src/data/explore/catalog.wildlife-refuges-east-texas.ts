import { catalogDestination, type CatalogSeed } from "./catalog.shared";

type EastTexasRiverRefuge = {
  name: string;
  alternateNames: string[];
  officialUrl: string;
  city: string;
  county: string;
  latitude: number;
  longitude: number;
  summary: string;
  activities: string[];
  amenities: string[];
  accessNotes: string;
  parentUnit: string;
};

const eastTexasRiverRefuges: EastTexasRiverRefuge[] = [
  {
    name: "Trinity River National Wildlife Refuge",
    alternateNames: ["Trinity River NWR"],
    officialUrl: "https://www.fws.gov/refuge/trinity-river",
    city: "Liberty",
    county: "Liberty County",
    latitude: 30.0583,
    longitude: -94.7955,
    summary: "Explore one of the largest remaining bottomland hardwood forests in the lower Trinity River basin, with oxbow lakes, sloughs, bayous, wetlands, trails, boat ramps, and rich habitat for migratory birds, alligators, deer, and other East Texas wildlife.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "boating", "paddling", "hunting", "nature study", "environmental education"],
    amenities: ["headquarters", "trails", "boat ramps", "paddling access", "day-use areas", "observation areas", "restrooms", "parking"],
    accessNotes: "Refuge lands, roads, and trails are generally open from sunrise to sunset. Trails, day-use areas, and boat ramps are highly susceptible to Trinity River flooding, and several units close seasonally for regulated hunting.",
    parentUnit: "Trinity River National Wildlife Refuge",
  },
  {
    name: "Neches River National Wildlife Refuge",
    alternateNames: ["Neches River NWR"],
    officialUrl: "https://www.fws.gov/refuge/neches-river",
    city: "Jacksonville",
    county: "Anderson and Cherokee Counties",
    latitude: 31.9654,
    longitude: -95.4917,
    summary: "Discover bottomland hardwood forest, upland pine-hardwood habitat, wetlands, marshes, river corridors, and an expanding trail network protected for migratory birds, diverse native wildlife, water quality, and floodplain conservation along the Neches River.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "paddling", "hunting", "nature study", "environmental education"],
    amenities: ["visitor kiosk", "trails", "small-boat launch", "trail bridges", "vault toilet", "parking"],
    accessNotes: "The refuge is open daily from sunrise to sunset. The office is normally available by appointment, facilities remain limited, and hunting, roads, trails, and river access may be permit-controlled, seasonal, or affected by flooding and habitat-management work.",
    parentUnit: "Caddo Lake National Wildlife Refuge Complex",
  },
];

export const destinations = eastTexasRiverRefuges.map((refuge) => {
  const seed: CatalogSeed = {
    name: refuge.name,
    entityType: "wildlife_area",
    collection: "National Wildlife Refuges in Texas",
    sourceUrl: refuge.officialUrl,
    sourceName: "U.S. Fish and Wildlife Service",
    categories: ["national wildlife refuge", "federal public land", "wildlife", "birding", "East Texas"],
  };
  const destination = catalogDestination(seed);

  return {
    ...destination,
    alternateNames: refuge.alternateNames,
    officialUrl: refuge.officialUrl,
    sourceUrl: refuge.officialUrl,
    sourceName: "U.S. Fish and Wildlife Service",
    summary: refuge.summary,
    description: `${refuge.summary} ${refuge.accessNotes} Confirm current hours, flooding, road and trail conditions, hunting seasons, permits, and refuge-specific regulations with the U.S. Fish and Wildlife Service before traveling.`,
    city: refuge.city,
    county: refuge.county,
    region: "East Texas",
    latitude: refuge.latitude,
    longitude: refuge.longitude,
    activities: refuge.activities,
    amenities: refuge.amenities,
    isFamilyFriendly: true,
    isPetFriendly: false,
    isAccessible: null,
    feeRequired: false,
    profile: {
      collection: "National Wildlife Refuges in Texas",
      ownership: "Federal",
      managingOrganization: "U.S. Fish and Wildlife Service",
      parentUnit: refuge.parentUnit,
      designation: "National Wildlife Refuge",
      publicAccess: true,
      accessNotes: refuge.accessNotes,
    },
    categories: ["national wildlife refuge", "federal public land", "u.s. fish and wildlife service", "wildlife", "birding", "East Texas"],
    tags: [...refuge.activities, ...refuge.alternateNames.map((name) => name.toLowerCase()), "migratory birds", "wildlife refuge", "east texas", refuge.city.toLowerCase()],
  };
});
