import type { ExploreEntity } from "@/types/explore/public";

type FederalTrailSeed = {
  slug: string;
  name: string;
  parentSlug: string;
  parentName: string;
  city: string;
  county: string;
  distance: string;
  summary: string;
  accessNotes: string;
  sourceUrl: string;
};

const reviewedAt = "2026-07-26";

export const federalHikingTrailSeeds: readonly FederalTrailSeed[] = [
  {
    slug: "sawmill-hiking-trail",
    name: "Sawmill Hiking Trail",
    parentSlug: "angelina-national-forest",
    parentName: "Angelina National Forest",
    city: "Zavalla",
    county: "Angelina County",
    distance: "Approximately 5.5 miles",
    summary:
      "Follow an East Texas forest route between Boykin Springs and Bouton Lake, passing the Old Aldridge Sawmill ruins and stretches of Neches River bottomland.",
    accessNotes:
      "The trail is primitive and current conditions can change after storms, flooding, prescribed fire, or forest operations. Confirm trail and recreation-area status before travel.",
    sourceUrl:
      "https://www.fs.usda.gov/visit/destinations?field_fs_states_tid_selective=All&field_rec_activities_target_id=All&field_rec_activities_tid_selective=11937&field_rec_forest_target_id=All&field_rec_forest_tid_selective=12019&page=549",
  },
  {
    slug: "four-c-national-recreation-trail",
    name: "Four C National Recreation Trail",
    parentSlug: "davy-crockett-national-forest",
    parentName: "Davy Crockett National Forest",
    city: "Kennard",
    county: "Houston County",
    distance: "Approximately 20 miles",
    summary:
      "Hike or backpack a foot-travel route from Ratcliff Lake Recreation Area to Neches Bluff Overlook through pine-hardwood forest and Neches River bottomlands.",
    accessNotes:
      "This primitive National Recreation Trail is restricted to foot travel. Water, trailhead services, and camping facilities vary by access point; verify forest alerts before setting out.",
    sourceUrl: "https://www.fs.usda.gov/r08/texas/recreation/ratcliff-lake-936-655-2299",
  },
  {
    slug: "lone-star-hiking-trail",
    name: "Lone Star Hiking Trail",
    parentSlug: "sam-houston-national-forest",
    parentName: "Sam Houston National Forest",
    city: "New Waverly",
    county: "Walker, Montgomery, and San Jacinto Counties",
    distance: "Approximately 128 miles",
    summary:
      "Explore Texas' longest continuous hiking trail across Sam Houston National Forest, including pine woods, creek crossings, wilderness, and multiple trailhead access points.",
    accessNotes:
      "Sections may close because of storms, wildfire, prescribed burns, wet conditions, bridge damage, or forest operations. Backcountry users should confirm current orders, water conditions, and camping rules.",
    sourceUrl: "https://www.fs.usda.gov/activity/texas",
  },
  {
    slug: "trail-between-the-lakes",
    name: "Trail Between the Lakes",
    parentSlug: "sabine-national-forest",
    parentName: "Sabine National Forest",
    city: "Hemphill",
    county: "Sabine County",
    distance: "Approximately 28 miles",
    summary:
      "Traverse the Sabine National Forest on a long-distance hiking route connecting the Lakeview Recreation Area at Toledo Bend Reservoir with the eastern side of Sam Rayburn Reservoir.",
    accessNotes:
      "The route is a primitive point-to-point forest trail. Confirm trailhead access, water availability, hunting seasons, storm damage, and current Forest Service closure orders before hiking.",
    sourceUrl: "https://www.fs.usda.gov/activity/texas",
  },
] as const;

export const federalHikingTrailDestinations: ExploreEntity[] = federalHikingTrailSeeds.map(
  (trail) => ({
    id: trail.slug,
    entityType: "trail",
    name: trail.name,
    slug: trail.slug,
    summary: trail.summary,
    city: trail.city,
    county: trail.county,
    region: "East Texas",
    latitude: null,
    longitude: null,
    heroImageUrl: null,
    heroImageAlt: `${trail.name} in ${trail.parentName}, Texas`,
    amenities: ["trailheads"],
    activities: ["hiking", "backpacking", "wildlife", "nature study"],
    isFamilyFriendly: null,
    isPetFriendly: true,
    isAccessible: false,
    feeRequired: null,
    alternateNames: [],
    description: `${trail.summary} ${trail.accessNotes}`,
    officialUrl: trail.sourceUrl,
    phone: null,
    email: null,
    address: null,
    profile: {
      ownership: "Federal",
      managingOrganization: "U.S. Forest Service",
      parentDestination: trail.parentName,
      parentDestinationSlug: trail.parentSlug,
      trailType: "Primitive forest hiking trail",
      distance: trail.distance,
      accessNotes: trail.accessNotes,
    },
    hours: null,
    fees: null,
    regulations: {
      currentConditionsRequired: true,
      leaveNoTrace: true,
      accessNotes: trail.accessNotes,
    },
    seasonalGuidance: {
      verifyBeforeTravel: true,
      checkHuntingSeasons: true,
      checkWeatherAndClosureOrders: true,
      lastReviewed: reviewedAt,
    },
    categories: ["hiking area", "hiking trail", "national forest trail", "federal public land"],
    tags: [
      "hiking",
      "backpacking",
      "trail",
      "national forest",
      "east texas",
      trail.parentName.toLowerCase(),
    ],
    sourceUrl: trail.sourceUrl,
    sourceName: "U.S. Forest Service",
    sourceUpdatedAt: reviewedAt,
    updatedAt: `${reviewedAt}T00:00:00.000Z`,
    observations: [],
    related: [],
    nearby: [],
  }),
);
