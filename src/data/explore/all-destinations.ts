import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations as curatedDestinations } from "./destinations";
import { destinations as coreDestinations } from "./catalog.core";
import { destinations as waterDestinations } from "./catalog.water";
import { destinations as additionalDestinations } from "./catalog.additional";

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

  return {
    ...destination,
    id: canonicalSlug,
    slug: canonicalSlug,
    name: normalizeWhitespace(destination.name),
    entityType: ENTITY_TYPE_ALIASES[typeKey] ?? typeKey.replaceAll(" ", "_"),
    city: destination.city ? normalizeWhitespace(destination.city) : null,
    county: destination.county ? normalizeWhitespace(destination.county) : null,
    region: REGION_ALIASES[regionKey] ?? destination.region ?? null,
    latitude: validLatitude(destination.latitude) ? destination.latitude : null,
    longitude: validLongitude(destination.longitude) ? destination.longitude : null,
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

for (const rawDestination of [
  ...curatedDestinations,
  ...coreDestinations,
  ...waterDestinations,
  ...additionalDestinations,
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
