import type { ExploreEntity } from "@/types/explore/public";

export const gormanCaveDestination: ExploreEntity = {
  id: "gorman-cave",
  entityType: "cavern",
  name: "Gorman Cave",
  slug: "gorman-cave",
  summary:
    "View a sensitive travertine cave and spring feature from the River Trail at Colorado Bend State Park; cave entry is restricted, while reservable guided wild-cave tours explore other park caves.",
  city: "Bend",
  county: "San Saba County",
  region: "Hill Country",
  latitude: 31.0497,
  longitude: -98.4696,
  heroImageUrl: null,
  heroImageAlt:
    "The protected entrance and travertine formations of Gorman Cave at Colorado Bend State Park near Bend, Texas",
  amenities: ["Parking", "Restrooms", "Trails", "Camping", "Visitor center"],
  activities: [
    "Cave viewing",
    "Guided wild-cave tours elsewhere in the park",
    "Hiking",
    "Geology interpretation",
    "Nature photography",
  ],
  isFamilyFriendly: true,
  isPetFriendly: true,
  isAccessible: false,
  feeRequired: true,
  alternateNames: ["Gorman Spring Cave", "Colorado Bend cave"],
  description:
    "Gorman Cave is a protected limestone and travertine feature in Colorado Bend State Park. Mineral-rich spring water deposits calcite that builds fragile travertine formations around the cave and nearby Gorman Creek. Visitors may see part of the cave from the River Trail but must remain at a distance. Entry is closed except under authorized management or permit; the park separately offers reservation-only guided wild-cave tours in other caves.",
  officialUrl: "https://tpwd.texas.gov/state-parks/colorado-bend/trails-info",
  phone: "(325) 628-3240",
  email: "ColoradoBendSP@tpwd.texas.gov",
  address: {
    line1: "1201 Colorado Park Road",
    city: "Bend",
    county: "San Saba County",
    stateCode: "TX",
    postalCode: "76824",
  },
  profile: {
    ownership: "State of Texas",
    operator: "Texas Parks and Wildlife Department",
    parentDestination: "Colorado Bend State Park",
    accessType: "Public trail viewpoint; no public cave entry",
    destinationClass: "Protected cave viewpoint",
    cavernType: "Spring-associated limestone and travertine cave",
    tourInformation: {
      guidedToursAtGormanCave: false,
      parkWildCaveToursAvailable: true,
      parkWildCaveTourReservationsRequired: true,
    },
    visitorAccess: {
      publicViewpointAccess: true,
      caveEntryPermitted: false,
      viewingRoute: "River Trail",
      accessibility:
        "The natural trail and rugged park terrain are not represented as wheelchair accessible; contact the park about current conditions and accommodations.",
      petPolicy:
        "Leashed pets are allowed on eligible park trails under Texas State Parks rules but may not enter caves or buildings.",
    },
    geology: {
      setting: "Limestone karst and spring-fed travertine",
      formation:
        "Mineral-rich spring water deposits calcite, gradually building fragile travertine formations.",
    },
  },
  hours: {
    parkHours: "Daily, 6 a.m. to 10 p.m.",
    headquartersHours: "Daily, 8:45 a.m. to 4:15 p.m.",
    caveViewing: "Subject to trail, weather, and resource closures",
  },
  fees: {
    parkEntranceRequired: true,
    adultDailyEntrance: "$5",
    child12AndUnder: "Free",
    wildCaveToursElsewhereInPark: "Separate reservation and fee may apply",
  },
  regulations: {
    caveAccess: "Caves are closed except by guided tour or special permit.",
    gormanCaveEntry: "Public entry is not permitted; view the feature from a distance.",
    resourceProtection:
      "Do not enter, climb on, touch, or disturb the cave, spring, travertine, plants, or wildlife.",
    weather:
      "Do not enter any cave in rainy weather; check current park alerts and trail conditions.",
  },
  seasonalGuidance: {
    reservationsRecommended: true,
    note: "Colorado Bend often reaches capacity. Reserve day-use entry in advance and separately book any available wild-cave tour.",
    verifyBeforeTravel: true,
    lastReviewed: "2026-07-26",
  },
  categories: [
    "Cavern",
    "Protected cave",
    "Geological attraction",
    "State park cave",
    "Cave viewpoint",
  ],
  tags: [
    "cave",
    "cavern",
    "Gorman Cave",
    "Colorado Bend State Park",
    "travertine",
    "spring",
    "karst",
    "River Trail",
    "cave viewing",
    "Hill Country",
  ],
  sourceUrl: "https://tpwd.texas.gov/state-parks/colorado-bend/trails-info",
  sourceName: "Texas Parks and Wildlife Department",
  sourceUpdatedAt: "2026-07-26",
  updatedAt: "2026-07-26T00:00:00.000Z",
  observations: [],
  related: [],
  nearby: [],
};
