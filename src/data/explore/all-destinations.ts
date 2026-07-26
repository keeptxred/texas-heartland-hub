import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations as curatedDestinations } from "./destinations";
import { destinations as coreDestinations } from "./catalog.core";
import { destinations as waterDestinations } from "./catalog.water";
import { destinations as additionalDestinations } from "./catalog.additional";
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
  historic: "historic_site",
  "historic site": "historic_site",
  historic_site: "historic_site",
  lake: "lake",
  natural_area: "natural_area",
  "natural area": "natural_area",
  park: "park",
  state_park: "park",
  trail: "park",
  wildlife_area: "natural_area",
};

const ACTIVITY_ALIASES: Record<string, string> = {
  "bat-viewing": "bat viewing",
  beachcombing: "beachcombing",
  bicycling: "biking",
  boating: "boating",
  camping: "camping",
  caving: "caving",
  climbing: "climbing",
  cycling: "biking",
  fishing: "fishing",
  golf: "golf",
  hiking: "hiking",
  horseback: "horseback riding",
  "horseback-riding": "horseback riding",
  kayaking: "paddling",
  nature: "nature study",
  paddling: "paddling",
  picnicking: "picnicking",
  scuba: "scuba diving",
  "scuba-diving": "scuba diving",
  stargazing: "stargazing",
  swimming: "swimming",
  walking: "walking",
  wildlife: "wildlife",
};

const AMENITY_ALIASES: Record<string, string> = {
  "boat ramps": "boat ramp",
  bathrooms: "restrooms",
  campground: "camping",
  campsites: "camping",
  cabins: "cabins",
  parking: "parking",
  restroom: "restrooms",
  restrooms: "restrooms",
  showers: "showers",
  trails: "trails",
  "visitor centre": "visitor center",
};

const TPWD_COORDINATE_OVERRIDES: Record<string, readonly [number, number]> = {
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
  "palo-pinto-mountains-state-park": [32.535432, -98.556552],
  "powderhorn-state-park": [28.434172, -96.535221],
  "ray-roberts-lake-isle-du-bois-unit": [33.365671, -97.01215],
  "resaca-de-la-palma-state-park": [25.996275, -97.5712694],
  "tyler-state-park": [32.48218, -95.283396],
  "mustang-island-state-park": [27.672162, -97.175309],
  "old-tunnel-state-park": [30.101079, -98.820704],
  "palmetto-state-park": [29.596906, -97.58514],
  "palo-duro-canyon-state-park": [34.984709, -101.701867],
  "pedernales-falls-state-park": [30.308054, -98.257649],
  "possum-kingdom-state-park": [32.873573, -98.559331],
  "purtis-creek-state-park": [32.353794, -95.993554],
  "ray-roberts-lake-johnson-branch-unit": [33.429802, -97.056449],
  "san-angelo-state-park": [31.463922, -100.508038],
  "sea-rim-state-park": [29.675539, -94.043525],
  "seminole-canyon-state-park": [29.700094, -101.312875],
  "sheldon-lake-state-park": [29.857461, -95.160029],
  "south-llano-river-state-park": [30.445396, -99.804102],
  "stephen-f-austin-state-park": [29.811982, -96.108059],
  "village-creek-state-park": [30.250499, -94.1787],
};

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeList(values: string[], aliases: Record<string, string>): string[] {
  return [...new Set(values.map((value) => {
    const clean = normalizeWhitespace(value).toLowerCase();
    return aliases[clean] ?? aliases[clean.replaceAll(" ", "-")] ?? clean;
  }).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function validLatitude(value: number | null): value is number {
  return value != null && Number.isFinite(value) && value >= 25 && value <= 37;
}

function validLongitude(value: number | null): value is number {
  return value != null && Number.isFinite(value) && value >= -107 && value <= -93;
}

function normalizeDestination(destination: ExploreEntity): ExploreEntity {
  const canonicalSlug = normalizeSlug(destination.slug || destination.name);
  const regionKey = destination.region?.trim().toLowerCase() ?? "";
  const typeKey = destination.entityType.trim().toLowerCase();
  const officialUrl = destination.officialUrl?.trim() ?? null;
  const isTpwdDestination = officialUrl?.includes("tpwd.texas.gov/state-parks/") ?? false;
  const coordinateOverride = TPWD_COORDINATE_OVERRIDES[canonicalSlug];
  const latitude = coordinateOverride?.[0] ?? destination.latitude;
  const longitude = coordinateOverride?.[1] ?? destination.longitude;

  return {
    ...destination,
    id: canonicalSlug,
    slug: canonicalSlug,
    name: normalizeWhitespace(destination.name),
    entityType: ENTITY_TYPE_ALIASES[typeKey] ?? typeKey.replaceAll(" ", "_"),
    city: destination.city ? normalizeWhitespace(destination.city) : null,
    county: destination.county ? normalizeWhitespace(destination.county) : null,
    region: REGION_ALIASES[regionKey] ?? destination.region ?? null,
    latitude: validLatitude(latitude) ? latitude : null,
    longitude: validLongitude(longitude) ? longitude : null,
    officialUrl,
    sourceUrl: destination.sourceUrl?.trim() || officialUrl,
    sourceName: isTpwdDestination
      ? "Texas Parks and Wildlife Department"
      : destination.sourceName,
    activities: normalizeList(destination.activities, ACTIVITY_ALIASES),
    amenities: normalizeList(destination.amenities, AMENITY_ALIASES),
    alternateNames: [...new Set(destination.alternateNames.map(normalizeWhitespace).filter(Boolean))],
    categories: [...new Set([
      (ENTITY_TYPE_ALIASES[typeKey] ?? typeKey.replaceAll(" ", "_")).replaceAll("_", " "),
      REGION_ALIASES[regionKey] ?? destination.region,
      ...destination.categories.map((value) => normalizeWhitespace(value).toLowerCase()),
    ].filter((value): value is string => Boolean(value)))],
    tags: [...new Set([
      ...normalizeList(destination.tags, ACTIVITY_ALIASES),
      ...normalizeList(destination.activities, ACTIVITY_ALIASES),
      destination.city?.toLowerCase(),
      destination.county?.toLowerCase(),
    ].filter((value): value is string => Boolean(value)))],
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
  ].filter(Boolean).length;
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
  ...thcDestinations,
]) {
]) {
  const destination = normalizeDestination(rawDestination);
  const existing = destinationBySlug.get(destination.slug);

  if (!existing || qualityScore(destination) > qualityScore(existing)) {
    destinationBySlug.set(destination.slug, destination);
  }
}

export const exploreDestinations = [...destinationBySlug.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const exploreDestinationCount = exploreDestinations.length;
