import type { ExploreEntity } from "@/types/explore/public";

const sourceUrl = "https://tpwd.texas.gov/state-parks/cooper-lake";
const reviewedAt = "2026-07-26";

type CooperLakeUnit = {
  slug: string;
  name: string;
  city: string;
  county: string;
  summary: string;
};

export const cooperLakeHikingUnits: readonly CooperLakeUnit[] = [
  {
    slug: "cooper-lake-doctors-creek-unit",
    name: "Cooper Lake State Park — Doctors Creek Unit",
    city: "Cooper",
    county: "Delta County",
    summary:
      "Explore the north side of Cooper Lake from the Doctors Creek Unit, with lakeside hiking, camping, fishing, birding, paddling access, and prairie-and-woodland scenery.",
  },
  {
    slug: "cooper-lake-south-sulphur-unit",
    name: "Cooper Lake State Park — South Sulphur Unit",
    city: "Sulphur Springs",
    county: "Hopkins County",
    summary:
      "Visit the larger South Sulphur Unit of Cooper Lake State Park for hiking and equestrian trails, camping, lake recreation, wildlife watching, and family day use.",
  },
] as const;

export const stateParkHikingUnitDestinations: ExploreEntity[] = cooperLakeHikingUnits.map(
  (unit) => ({
    id: unit.slug,
    entityType: "park",
    name: unit.name,
    slug: unit.slug,
    summary: unit.summary,
    city: unit.city,
    county: unit.county,
    region: "North Texas",
    latitude: null,
    longitude: null,
    heroImageUrl: null,
    heroImageAlt: `${unit.name} at Cooper Lake in North Texas`,
    amenities: ["camping", "parking", "restrooms", "trails", "picnic areas"],
    activities: ["hiking", "camping", "fishing", "birding", "wildlife", "paddling"],
    isFamilyFriendly: true,
    isPetFriendly: true,
    isAccessible: null,
    feeRequired: true,
    alternateNames: [],
    description:
      `${unit.summary} The two Cooper Lake units have separate entrances and facilities. ` +
      "Confirm unit-specific hours, reservations, trail status, lake conditions, fees, and closures with Texas Parks and Wildlife Department before travel.",
    officialUrl: sourceUrl,
    phone: null,
    email: null,
    address: null,
    profile: {
      ownership: "State of Texas",
      managingOrganization: "Texas Parks and Wildlife Department",
      parentDestination: "Cooper Lake State Park",
      parentDestinationSlug: "cooper-lake-state-park",
      hikingDiscovery: {
        isHikingDestination: true,
        verifyCurrentConditions: true,
        lastReviewed: reviewedAt,
      },
    },
    hours: null,
    fees: { parkEntranceRequired: true },
    regulations: {
      currentConditionsRequired: true,
      followTexasStateParkRules: true,
    },
    seasonalGuidance: {
      verifyBeforeTravel: true,
      reserveDayUseAndCamping: true,
      lastReviewed: reviewedAt,
    },
    categories: ["state park", "hiking area", "lake recreation"],
    tags: ["hiking", "trails", "cooper lake", "texas state parks", "north texas"],
    sourceUrl,
    sourceName: "Texas Parks and Wildlife Department",
    sourceUpdatedAt: reviewedAt,
    updatedAt: `${reviewedAt}T00:00:00.000Z`,
    observations: [],
    related: [],
    nearby: [],
  }),
);
