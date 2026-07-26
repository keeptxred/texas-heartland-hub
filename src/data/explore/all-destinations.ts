import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations as curatedDestinations } from "./destinations";
import { destinations as coreDestinations } from "./catalog.core";
import { destinations as waterDestinations } from "./catalog.water";
import { destinations as additionalDestinations } from "./catalog.additional";
import { destinations as eastTexasRefugeDestinations } from "./catalog.wildlife-refuges-east-texas";
import { commercialCavernCatalog } from "./catalog.caverns";
import { gormanCaveDestination } from "./catalog.gorman-cave";
import { federalHikingTrailDestinations } from "./catalog.hiking-federal";
import { stateParkHikingUnitDestinations } from "./catalog.hiking-state-park-units";
import { applyHikingRelationships } from "./relationships.hiking";
import { getTpwdCavernDestinationEnrichment } from "./catalog.tpwd-caverns";
import {
  getMajorSpringDestinationEnrichment,
  majorSpringDestinations,
} from "./catalog.major-springs.entities";
import { texasLighthouseDestinations } from "./catalog.lighthouses.entities";
import { privateNaturalLandmarkDestinations } from "./catalog.private-natural-landmarks.entities";
import { privateCulturalLandmarkDestinations } from "./catalog.private-cultural-landmarks.entities";
import { destinations as thcDestinations } from "./catalog.thc";

const REGION_ALIASES: Record<string, string> = {
  central: "Central Texas",
  "central texas": "Central Texas",
  coast: "Gulf Coast",
  coastal: "Gulf Coast",
  "gulf coast": "Gulf Coast",
  east: "East Texas",
  "east texas": "East Texas",
  hill: "Hill Country",
  "hill country": "Hill Country",
  north: "North Texas",
  "north texas": "North Texas",
  panhandle: "Panhandle",
  south: "South Texas",
  "south texas": "South Texas",
  west: "West Texas",
  "west texas": "West Texas",
};

const ENTITY_TYPE_ALIASES: Record<string, string> = {
  campground: "park",
  cave: "cavern",
  cavern: "cavern",
  "commercial cave": "cavern",
  "show cave": "cavern",
  historic: "historic_site",
  "historic site": "historic_site",
  historic_site: "historic_site",
  lake: "lake",
  lighthouse: "lighthouse",
  natural_area: "natural_area",
  "natural area": "natural_area",
  park: "park",
  state_park: "park",
  trail: "park",
  wildlife_area: "natural_area",
};

const ACTIVITY_ALIASES: Record<string, string> = {
  "anti-gravity house experience": "family attractions",
  "bat-viewing": "bat viewing",
  bicycling: "biking",
  cycling: "biking",
  "formation photography": "photography",
  "fossil and prehistoric-life interpretation": "fossil interpretation",
  "gem and mineral mining": "gem mining",
  "geology and fossil interpretation": "geology interpretation",
  "guided cave tours": "caving",
  "guided cavern tours": "caving",
  horseback: "horseback riding",
  "horseback-riding": "horseback riding",
  kayaking: "paddling",
  nature: "nature study",
  "nature exploration": "nature study",
  "nature observation": "nature study",
  "observation-tower visit": "scenic viewpoints",
  "outdoor maze": "family attractions",
  scuba: "scuba diving",
  "scuba-diving": "scuba diving",
  "seasonal bat-viewing experiences": "bat viewing",
  "underground concerts and special events": "special events",
  "wildlife observation on the grounds": "wildlife",
  "wildlife-park train ride": "wildlife",
};

const AMENITY_ALIASES: Record<string, string> = {
  "boat ramps": "boat ramp",
  bathrooms: "restrooms",
  campground: "camping",
  campsites: "camping",
  "combination attraction tickets": "combination tickets",
  "on-site parking": "parking",
  "pet kennels": "pet kennels",
  restroom: "restrooms",
  "snack service": "food service",
  "tent and rv camping": "camping",
  "visitor centre": "visitor center",
};

const TPWD_COORDINATE_OVERRIDES: Record<string, readonly [number, number]> = {
  "balmorhea-state-park": [30.945036, -103.786663],
  "big-bend-ranch-state-park": [29.470458, -103.957922],
  "caprock-canyons-state-park": [34.410296, -101.053264],
  "choke-canyon-state-park": [28.465773, -98.354195],
  "devils-river-state-natural-area": [29.939694, -100.970206],
  "devils-sinkhole-state-natural-area": [30.015773, -100.208552],
  "enchanted-rock-state-natural-area": [30.496033, -98.819952],
  "fort-boggy-state-park": [31.187372, -95.976646],
  "franklin-mountains-state-park": [31.842388, -106.486444],
  "garner-state-park": [29.598887, -99.743981],
  "hueco-tanks-state-park": [31.926453, -106.042437],
  "lake-somerville-birch-creek-unit": [30.308582, -96.634692],
  "lake-somerville-nails-creek-unit": [30.290719, -96.667214],
  "lost-maples-state-natural-area": [29.807719, -99.570697],
  "mission-tejas-state-park": [31.542272, -95.232191],
  "mustang-island-state-park": [27.672162, -97.175309],
  "old-tunnel-state-park": [30.101079, -98.820704],
  "palmetto-state-park": [29.596906, -97.58514],
  "palo-duro-canyon-state-park": [34.984709, -101.701867],
  "palo-pinto-mountains-state-park": [32.535432, -98.556552],
  "pedernales-falls-state-park": [30.308054, -98.257649],
  "possum-kingdom-state-park": [32.873573, -98.559331],
  "powderhorn-state-park": [28.434172, -96.535221],
  "purtis-creek-state-park": [32.353794, -95.993554],
  "ray-roberts-lake-isle-du-bois-unit": [33.365671, -97.01215],
  "ray-roberts-lake-johnson-branch-unit": [33.429802, -97.056449],
  "resaca-de-la-palma-state-park": [25.996275, -97.5712694],
  "san-angelo-state-park": [31.463922, -100.508038],
  "sea-rim-state-park": [29.675539, -94.043525],
  "seminole-canyon-state-park": [29.700094, -101.312875],
  "sheldon-lake-state-park": [29.857461, -95.160029],
  "south-llano-river-state-park": [30.445396, -99.804102],
  "stephen-f-austin-state-park": [29.811982, -96.108059],
  "tyler-state-park": [32.48218, -95.283396],
  "village-creek-state-park": [30.250499, -94.1787],
};

const CANONICAL_SLUG_ALIASES: Record<string, string> = {
  "longhorn-cavern": "longhorn-cavern-state-park",
  "kickapoo-cavern": "kickapoo-cavern-state-park",
  "san-solomon-springs": "balmorhea-state-park",
  "wonder-world-cave-and-adventure-park": "wonder-world-cave-adventure-park",
};

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeSlug(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return CANONICAL_SLUG_ALIASES[slug] ?? slug;
}

function normalizeList(values: string[], aliases: Record<string, string>): string[] {
  return [
    ...new Set(
      values
        .map((value) => {
          const clean = normalizeWhitespace(value).toLowerCase();
          return aliases[clean] ?? aliases[clean.replaceAll(" ", "-")] ?? clean;
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

function validLatitude(value: number | null): value is number {
  return value != null && Number.isFinite(value) && value >= 25 && value <= 37;
}

function validLongitude(value: number | null): value is number {
  return value != null && Number.isFinite(value) && value >= -107 && value <= -93;
}

function cavernAlternateNames(name: string): string[] {
  const aliases = new Set(["Texas caves", "Texas caverns", "commercial cave", "show cave"]);
  if (/caverns/i.test(name)) aliases.add(name.replace(/caverns/i, "Caves"));
  if (/cavern/i.test(name)) aliases.add(name.replace(/cavern/i, "Cave"));
  return [...aliases];
}

const cavernDestinations: ExploreEntity[] = commercialCavernCatalog.map((cavern) => ({
  id: cavern.id,
  entityType: "cavern",
  name: cavern.name,
  slug: cavern.slug,
  summary: cavern.summary,
  city: cavern.city,
  county: cavern.county,
  region: cavern.region,
  latitude: cavern.latitude,
  longitude: cavern.longitude,
  heroImageUrl: cavern.image_url,
  heroImageAlt: cavern.image_alt,
  amenities: cavern.amenities,
  activities: cavern.activities,
  isFamilyFriendly: cavern.family_friendly,
  isPetFriendly: /pets? (?:are )?permitted|leashed pets/i.test(cavern.pet_policy),
  isAccessible: !/not wheelchair|no wheelchair|does not permit wheelchairs/i.test(
    cavern.accessibility,
  ),
  feeRequired: cavern.admission_required,
  alternateNames: cavernAlternateNames(cavern.name),
  description: cavern.geology,
  officialUrl: cavern.officialUrl,
  phone: null,
  email: null,
  address: null,
  profile: {
    ownership: "Private commercial attraction",
    operator: cavern.operator,
    accessType: "Public admission with authorized guided cavern access",
    tourInformation: {
      experienceType: cavern.experience_type,
      guidedTours: cavern.guided_tours,
      typicalDuration: cavern.duration,
      reservationsRecommended: cavern.reservations_recommended,
      minimumAge: cavern.minimum_age,
    },
    visitorAccess: {
      accessibility: cavern.accessibility,
      petPolicy: cavern.pet_policy,
      photographyPolicy: cavern.photography,
    },
    educationalExperience: {
      geology: cavern.geology,
      educationalProgramming: cavern.educational,
    },
  },
  hours: { operatingSeason: cavern.operating_season },
  fees: {
    admissionRequired: cavern.admission_required,
    reservationsRecommended: cavern.reservations_recommended,
  },
  regulations: {
    petPolicy: cavern.pet_policy,
    accessibility: cavern.accessibility,
    photographyPolicy: cavern.photography,
  },
  seasonalGuidance: {
    operatingSeason: cavern.operating_season,
    reservationsRecommended: cavern.reservations_recommended,
    verificationStatus: cavern.verification_status,
    lastReviewed: cavern.last_reviewed,
  },
  categories: cavern.categories,
  tags: [...cavern.tags, "cave", "caves", "cavern", "caverns", "show cave", "underground"],
  sourceUrl: cavern.officialUrl,
  sourceName: cavern.source_attribution,
  sourceUpdatedAt: cavern.last_reviewed,
  updatedAt: `${cavern.last_reviewed}T00:00:00.000Z`,
  observations: [],
  related: [],
  nearby: [],
}));

function applyTpwdCavernEnrichment(destination: ExploreEntity): ExploreEntity {
  const canonicalSlug = normalizeSlug(destination.slug || destination.id || destination.name);
  const enrichment = getTpwdCavernDestinationEnrichment(canonicalSlug);
  if (!enrichment) return destination;

  return {
    ...destination,
    id: canonicalSlug,
    slug: canonicalSlug,
    alternateNames: [...new Set([...destination.alternateNames, ...enrichment.alternateNames])],
    description: enrichment.description,
    officialUrl: enrichment.sourceUrl,
    phone: enrichment.phone,
    email: enrichment.email,
    address: enrichment.address,
    profile: {
      ...destination.profile,
      ...enrichment.profile,
      operator: enrichment.sourceName,
    },
    hours: enrichment.hours,
    fees: enrichment.fees,
    regulations: enrichment.regulations,
    seasonalGuidance: enrichment.seasonalGuidance,
    categories: [...new Set([...destination.categories, ...enrichment.categories])],
    tags: [...new Set([...destination.tags, ...enrichment.tags])],
    sourceUrl: enrichment.sourceUrl,
    sourceName: enrichment.sourceName,
    sourceUpdatedAt: enrichment.sourceUpdatedAt,
    updatedAt: `${enrichment.sourceUpdatedAt}T00:00:00.000Z`,
  };
}

function applyMajorSpringEnrichment(destination: ExploreEntity): ExploreEntity {
  const destinationSlug = normalizeSlug(destination.slug || destination.name);
  const enrichment = getMajorSpringDestinationEnrichment(destinationSlug);
  if (!enrichment) return destination;

  return {
    ...destination,
    alternateNames: [...new Set([...destination.alternateNames, ...enrichment.alternateNames])],
    description: [destination.description, enrichment.description].filter(Boolean).join(" "),
    profile: { ...destination.profile, spring: enrichment.profile },
    fees: { ...(destination.fees ?? {}), ...enrichment.fees },
    regulations: { ...(destination.regulations ?? {}), spring: enrichment.regulations },
    seasonalGuidance: {
      ...(destination.seasonalGuidance ?? {}),
      spring: enrichment.seasonalGuidance,
    },
    categories: [...new Set([...destination.categories, ...enrichment.categories])],
    tags: [...new Set([...destination.tags, ...enrichment.tags])],
    sourceUrl: enrichment.sourceUrl,
    sourceName: enrichment.sourceName,
    sourceUpdatedAt: enrichment.sourceUpdatedAt,
    updatedAt: `${enrichment.sourceUpdatedAt}T00:00:00.000Z`,
  };
}

function normalizeDestination(rawDestination: ExploreEntity): ExploreEntity {
  const cavernEnrichedDestination = applyTpwdCavernEnrichment(rawDestination);
  const enrichedDestination = applyMajorSpringEnrichment(cavernEnrichedDestination);
  const canonicalSlug = normalizeSlug(enrichedDestination.slug || enrichedDestination.name);
  const regionKey = enrichedDestination.region?.trim().toLowerCase() ?? "";
  const normalizedRegion = REGION_ALIASES[regionKey] ?? enrichedDestination.region ?? null;
  const typeKey = enrichedDestination.entityType.trim().toLowerCase();
  const normalizedType = ENTITY_TYPE_ALIASES[typeKey] ?? typeKey.replaceAll(" ", "_");
  const officialUrl = enrichedDestination.officialUrl?.trim() ?? null;
  const isTpwdDestination =
    officialUrl?.includes("tpwd.texas.gov/state-parks/") ||
    enrichedDestination.sourceUrl?.includes("tpwd.texas.gov/state-parks/") ||
    enrichedDestination.sourceName === "Texas Parks and Wildlife Department";
  const coordinateOverride = TPWD_COORDINATE_OVERRIDES[canonicalSlug];
  const latitude = coordinateOverride?.[0] ?? enrichedDestination.latitude;
  const longitude = coordinateOverride?.[1] ?? enrichedDestination.longitude;

  return {
    ...enrichedDestination,
    id: canonicalSlug,
    slug: canonicalSlug,
    name: normalizeWhitespace(enrichedDestination.name),
    entityType: normalizedType,
    city: enrichedDestination.city ? normalizeWhitespace(enrichedDestination.city) : null,
    county: enrichedDestination.county ? normalizeWhitespace(enrichedDestination.county) : null,
    region: normalizedRegion,
    latitude: validLatitude(latitude) ? latitude : null,
    longitude: validLongitude(longitude) ? longitude : null,
    officialUrl,
    sourceUrl: enrichedDestination.sourceUrl?.trim() || officialUrl,
    sourceName: isTpwdDestination
      ? "Texas Parks and Wildlife Department"
      : enrichedDestination.sourceName,
    activities: normalizeList(enrichedDestination.activities, ACTIVITY_ALIASES),
    amenities: normalizeList(enrichedDestination.amenities, AMENITY_ALIASES),
    alternateNames: [
      ...new Set(enrichedDestination.alternateNames.map(normalizeWhitespace).filter(Boolean)),
    ],
    categories: [
      ...new Set(
        [
          normalizedType.replaceAll("_", " "),
          normalizedRegion?.toLowerCase(),
          ...enrichedDestination.categories.map((value) =>
            normalizeWhitespace(value).toLowerCase(),
          ),
        ].filter((value): value is string => Boolean(value)),
      ),
    ],
    tags: [
      ...new Set(
        [
          ...normalizeList(enrichedDestination.tags, ACTIVITY_ALIASES),
          ...normalizeList(enrichedDestination.activities, ACTIVITY_ALIASES),
          enrichedDestination.city?.toLowerCase(),
          enrichedDestination.county?.toLowerCase(),
        ].filter((value): value is string => Boolean(value)),
      ),
    ],
  };
}

function qualityScore(destination: ExploreEntity): number {
  return [
    destination.summary,
    destination.description,
    destination.officialUrl,
    destination.latitude,
    destination.longitude,
    destination.activities.length,
    destination.amenities.length,
    destination.heroImageUrl,
    destination.profile && Object.keys(destination.profile).length,
  ].filter(Boolean).length;
}

function isCanonicalTpwdDestination(destination: ExploreEntity): boolean {
  return (
    destination.sourceName === "Texas Parks and Wildlife Department" &&
    (destination.officialUrl?.includes("tpwd.texas.gov/state-parks/") ?? false)
  );
}

const destinationBySlug = new Map<string, ExploreEntity>();
const nonThcCoreDestinations = coreDestinations.filter(
  (destination) => destination.sourceName !== "Texas Historical Commission",
);

for (const rawDestination of [
  ...curatedDestinations,
  ...nonThcCoreDestinations,
  ...waterDestinations,
  ...additionalDestinations,
  ...eastTexasRefugeDestinations,
  ...cavernDestinations,
  gormanCaveDestination,
  ...federalHikingTrailDestinations,
  ...stateParkHikingUnitDestinations,
  ...majorSpringDestinations,
  ...texasLighthouseDestinations,
  ...privateNaturalLandmarkDestinations,
  ...privateCulturalLandmarkDestinations,
  ...thcDestinations,
]) {
  const destination = normalizeDestination(rawDestination);
  const existing = destinationBySlug.get(destination.slug);

  if (
    !existing ||
    (!isCanonicalTpwdDestination(existing) &&
      (isCanonicalTpwdDestination(destination) ||
        qualityScore(destination) > qualityScore(existing)))
  ) {
    destinationBySlug.set(destination.slug, destination);
  }
}

export const exploreDestinations = applyHikingRelationships(
  [...destinationBySlug.values()].sort((a, b) => a.name.localeCompare(b.name)),
);

export const exploreDestinationCount = exploreDestinations.length;
