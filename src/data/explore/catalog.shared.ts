import type { ExploreEntity } from "@/types/explore/public";

export type CatalogSeed = {
  name: string;
  entityType: string;
  collection: string;
  sourceUrl: string;
  sourceName: string;
  categories: string[];
};

type CatalogOverride = Partial<ExploreEntity>;

const TPWD_CAVERN_OVERRIDES: Record<string, CatalogOverride> = {
  "Longhorn Cavern State Park": {
    entityType: "cavern",
    summary:
      "Explore a water-carved Hill Country cavern on paid guided tours, then visit the free day-use grounds for CCC architecture, short trails, picnicking, exhibits, and scenic overlooks.",
    description:
      "Longhorn Cavern State Park protects a distinctive limestone cavern shaped by an ancient underground river. The Civilian Conservation Corps cleared and improved the cavern and built the park's stone structures in the 1930s. Cavern entry is available only through paid guided tours operated on site; park grounds are free and day-use only, with no overnight camping.",
    city: "Burnet",
    county: "Burnet County",
    region: "Hill Country",
    latitude: 30.684441,
    longitude: -98.35097,
    heroImageUrl:
      "https://tpwd.texas.gov/state-parks/longhorn-cavern/gallery/longhorn-caverns_1.jpg",
    heroImageAlt: "Visitors exploring the limestone passages inside Longhorn Cavern State Park.",
    amenities: [
      "visitor center",
      "guided tours",
      "gift shop",
      "snacks",
      "restrooms",
      "trails",
      "picnic areas",
      "parking",
      "interpretive exhibits",
    ],
    activities: [
      "guided cavern tours",
      "wild cave tours",
      "hiking",
      "picnicking",
      "history",
      "geology interpretation",
      "scenic viewpoints",
      "special events",
    ],
    isFamilyFriendly: true,
    isPetFriendly: false,
    isAccessible: false,
    feeRequired: true,
    alternateNames: ["Longhorn Cavern", "Longhorn Cave"],
    officialUrl: "https://tpwd.texas.gov/state-parks/longhorn-cavern",
    phone: "512-715-9000",
    address: {
      street: "6211 Park Road 4 S",
      city: "Burnet",
      state: "TX",
      postalCode: "78611",
      country: "US",
    },
    profile: {
      collection: "Texas state parks and natural areas",
      ownership: "State",
      managingOrganization: "Texas Parks and Wildlife Department",
      operator: "Longhorn Cavern State Park concession operator",
      designation: "State Park",
      publicAccess: true,
      accessNotes:
        "Park grounds are free and open for day use. Cavern access requires a paid guided tour; schedules, capacity, and tour availability must be confirmed before travel. The park has no overnight camping.",
      cavernAccess: "Guided tours only",
      campingAvailable: false,
    },
    hours: {
      operatingSeason: "Grounds and facilities are open daily except December 25; cavern tour schedules vary.",
      dayUseOnly: true,
    },
    fees: {
      groundsAdmission: "Free",
      cavernTours: "Paid admission required",
    },
    regulations: {
      cavernEntry: "Guided tour ticket required",
      camping: "No overnight camping",
      pets: "Confirm current pet rules before visiting; pets are not permitted on cavern tours.",
    },
    seasonalGuidance: {
      reservationsRecommended: true,
      verificationStatus: "official-source-reviewed",
      lastReviewed: "2026-07-26",
    },
    categories: [
      "state park",
      "cavern",
      "guided underground tour",
      "geological attraction",
      "family attraction",
      "hill country",
      "ccc history",
    ],
    tags: [
      "cave",
      "cavern",
      "guided tours",
      "limestone",
      "underground",
      "civilian conservation corps",
      "day use",
      "burnet",
      "hill country",
    ],
    sourceUrl: "https://tpwd.texas.gov/state-parks/longhorn-cavern",
    sourceName: "Texas Parks and Wildlife Department",
    sourceUpdatedAt: "2026-07-26",
    updatedAt: "2026-07-26T00:00:00.000Z",
  },
  "Kickapoo Cavern State Park": {
    entityType: "cavern",
    summary:
      "Explore a lightly developed West Texas park with 20 known caves, reservation-required Saturday cavern tours, seasonal bat flights, rugged trails, mountain biking, birding, and camping.",
    description:
      "Kickapoo Cavern State Park protects a remote limestone landscape with 20 known caves, including 1,400-foot Kickapoo Cavern and Stuart Bat Cave. Unauthorized cave entry is prohibited. Guided Kickapoo Cavern tours are normally offered on Saturdays with advance reservations, while seasonal evening programs interpret the Mexican free-tailed bat colony at Stuart Bat Cave. The park also supports hiking, mountain biking, birding, geocaching, and developed camping.",
    city: "Brackettville",
    county: "Kinney County",
    region: "West Texas",
    latitude: 29.610016,
    longitude: -100.452465,
    heroImageUrl:
      "https://tpwd.texas.gov/state-parks/kickapoo-cavern/gallery/kickapoo-cavern",
    heroImageAlt: "The limestone interior of Kickapoo Cavern State Park near Brackettville, Texas.",
    amenities: [
      "headquarters",
      "guided tours",
      "camping",
      "full hookup campsites",
      "water campsites",
      "group camp",
      "restrooms",
      "trails",
      "bird blind",
      "parking",
    ],
    activities: [
      "guided cavern tours",
      "bat viewing",
      "hiking",
      "mountain biking",
      "camping",
      "birding",
      "wildlife",
      "geocaching",
      "scenic viewpoints",
    ],
    isFamilyFriendly: true,
    isPetFriendly: true,
    isAccessible: false,
    feeRequired: true,
    alternateNames: ["Kickapoo Cavern", "Kickapoo Caverns State Park"],
    officialUrl: "https://tpwd.texas.gov/state-parks/kickapoo-cavern",
    phone: "830-563-2342",
    email: "KickapooCavernSP@tpwd.texas.gov",
    address: {
      street: "20939 RR 674",
      city: "Brackettville",
      state: "TX",
      postalCode: "78832",
      country: "US",
    },
    profile: {
      collection: "Texas state parks and natural areas",
      ownership: "State",
      managingOrganization: "Texas Parks and Wildlife Department",
      designation: "State Park",
      publicAccess: true,
      accessNotes:
        "The park is normally open Friday through Monday and closed Tuesday through Thursday. Guided Kickapoo Cavern tours require reservations. Unauthorized cave entry is prohibited, and trails, tours, and bat-viewing programs may close because of weather, flooding, wildlife conditions, or capacity.",
      cavernAccess: "Reservation-required guided tours only",
      knownCaves: 20,
      campingAvailable: true,
    },
    hours: {
      gateHours: "Friday through Sunday 7 a.m.-10 p.m.; Monday 7 a.m.-4:30 p.m.",
      headquartersHours: "Friday through Monday 8:30 a.m.-4:30 p.m.",
      closedDays: "Tuesday through Thursday",
    },
    fees: {
      adultDayUse: "$3",
      childrenTwelveAndUnder: "Free",
      cavernTours: "Separate reservation and tour fee may apply",
    },
    regulations: {
      cavernEntry: "Unauthorized entry prohibited; guided-tour reservation required",
      trash: "Pack out all trash",
      rvLength: "RVs over 36 feet cannot be accommodated",
    },
    seasonalGuidance: {
      batSeason: "Typically mid-March through late October",
      reservationsRecommended: true,
      verificationStatus: "official-source-reviewed",
      lastReviewed: "2026-07-26",
    },
    categories: [
      "state park",
      "cavern",
      "guided underground tour",
      "bat viewing",
      "camping",
      "birding",
      "west texas",
    ],
    tags: [
      "cave",
      "cavern",
      "guided tours",
      "mexican free-tailed bats",
      "stuart bat cave",
      "camping",
      "mountain biking",
      "brackettville",
      "west texas",
    ],
    sourceUrl: "https://tpwd.texas.gov/state-parks/kickapoo-cavern",
    sourceName: "Texas Parks and Wildlife Department",
    sourceUpdatedAt: "2026-07-26",
    updatedAt: "2026-07-26T00:00:00.000Z",
  },
};

function slugify(value: string): string {
  return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function catalogDestination(seed: CatalogSeed): ExploreEntity {
  const slug = slugify(seed.name);
  const override = TPWD_CAVERN_OVERRIDES[seed.name];

  return {
    id: `catalog-${slug}`,
    entityType: seed.entityType,
    name: seed.name,
    slug,
    summary: `${seed.name} is part of the ${seed.collection} directory.`,
    description: `Use this Explore Texas page to discover ${seed.name}, plan a visit, and verify current hours, access, fees, reservations, conditions, and regulations with the official source before traveling.`,
    city: null,
    county: null,
    region: null,
    latitude: null,
    longitude: null,
    heroImageUrl: null,
    heroImageAlt: null,
    amenities: [],
    activities: seed.categories,
    isFamilyFriendly: null,
    isPetFriendly: null,
    isAccessible: null,
    feeRequired: null,
    alternateNames: [],
    officialUrl: seed.sourceUrl,
    phone: null,
    email: null,
    address: null,
    profile: { collection: seed.collection },
    hours: null,
    fees: null,
    regulations: null,
    seasonalGuidance: null,
    categories: seed.categories,
    tags: seed.categories,
    sourceUrl: seed.sourceUrl,
    sourceName: seed.sourceName,
    sourceUpdatedAt: null,
    updatedAt: "2026-07-25T00:00:00.000Z",
    observations: [],
    related: [],
    nearby: [],
    ...override,
  };
}