// Record-aware Explore classification + normalization shared by explore-import
// and explore-review. Classification never maps a whole source to one generic
// type: it inspects feature/facility type, designation, name, and metadata.

export interface ClassificationResult {
  entityType: string;
  confident: boolean;
  signal: string;
}

const RULES: Array<{ key: string; pattern: RegExp }> = [
  { key: "national_seashore", pattern: /national\s+seashore/ },
  { key: "national_preserve", pattern: /national\s+preserve/ },
  { key: "national_monument", pattern: /national\s+monument/ },
  { key: "national_park", pattern: /national\s+(park|recreation\s+area)/ },
  { key: "battlefield", pattern: /battlefield|battleground/ },
  { key: "mission", pattern: /\bmission\b/ },
  { key: "museum", pattern: /museum|visitor\s+center|interpretive\s+center/ },
  { key: "wildlife_refuge", pattern: /wildlife\s+(refuge|management\s+area)|\bwma\b/ },
  { key: "natural_area", pattern: /natural\s+area|preserve\b/ },
  { key: "historic_site", pattern: /historic(al)?\s+(site|park|district|landmark)|state\s+historic/ },
  { key: "state_park", pattern: /state\s+park|state\s+recreation\s+area/ },
  { key: "campground", pattern: /campground|camping\s+area|rv\s+park/ },
  { key: "cavern", pattern: /cavern/ },
  { key: "cave", pattern: /\bcave\b/ },
  { key: "waterfall", pattern: /waterfall|\bfalls\b/ },
  { key: "swimming_hole", pattern: /swimming\s+hole/ },
  { key: "spring", pattern: /\bspring(s)?\b/ },
  { key: "beach", pattern: /\bbeach\b/ },
  { key: "island", pattern: /\bisland\b/ },
  { key: "reservoir", pattern: /reservoir|\bdam\b|impoundment/ },
  { key: "lake", pattern: /\blake\b/ },
  { key: "river", pattern: /\briver\b|\bcreek\b|\bbayou\b|paddling\s+trail/ },
  { key: "trail", pattern: /\btrail(way|head)?\b|greenway/ },
  { key: "scenic_drive", pattern: /scenic\s+(drive|byway|loop)/ },
  { key: "monument", pattern: /\bmonument\b|\bmarker\b/ },
  { key: "winery", pattern: /winery|vineyard/ },
  { key: "brewery", pattern: /brewery|brewing|taproom/ },
  { key: "hotel", pattern: /\bhotel\b|\bmotel\b|\binn\b|lodge\b/ },
  { key: "restaurant", pattern: /restaurant|\bcafe\b|barbecue|\bbbq\b/ },
];

// Fallback per source type when no record-level signal is found. A fallback
// result is never "confident", so those records stay pending for human review.
const SOURCE_FALLBACK: Record<string, string> = {
  tpwd: "state_park",
  nps: "national_park",
  usace: "reservoir",
  usfs: "natural_area",
  thc: "historic_site",
  usgs: "natural_area",
  noaa: "natural_area",
  twdb: "reservoir",
  osm: "business",
  county_gis: "city",
  municipality: "city",
  tourism: "business",
  custom: "business",
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function pick(record: Record<string, unknown>, fields: string[]): unknown {
  for (const field of fields) {
    for (const key of Object.keys(record)) {
      if (key.toLowerCase() !== field.toLowerCase()) continue;
      const value = record[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }
  return undefined;
}

export function classify(
  properties: Record<string, unknown>,
  sourceType: string,
  allowedKeys: Set<string>,
): ClassificationResult {
  const typeSignals = [
    pick(properties, ["Type", "type", "site_type", "park_type", "facility_type", "feature_type", "featureclass", "designation", "unit_type", "category", "class"]),
    pick(properties, ["Comments", "subtype", "description"]),
  ]
    .filter((value) => typeof value === "string")
    .join(" ");
  const name = String(pick(properties, ["Name", "name", "park_name", "site_name", "fullName", "title"]) ?? "");

  // Authoritative type/designation fields outrank the name.
  for (const scope of [typeSignals, name]) {
    const text = scope.toLowerCase();
    if (!text.trim()) continue;
    for (const rule of RULES) {
      if (rule.pattern.test(text) && allowedKeys.has(rule.key)) {
        return { entityType: rule.key, confident: true, signal: scope === typeSignals ? "type_field" : "name" };
      }
    }
  }

  const fallback = SOURCE_FALLBACK[sourceType] ?? "business";
  return {
    entityType: allowedKeys.has(fallback) ? fallback : "business",
    confident: false,
    signal: "source_fallback",
  };
}

// Texas bounding box; coordinates outside it (or 0,0) are rejected.
export const TEXAS_BOUNDS = { minLat: 25.5, maxLat: 36.6, minLng: -107.0, maxLng: -93.3 };

export function inTexas(latitude: number | null, longitude: number | null): boolean {
  if (latitude === null || longitude === null) return false;
  if (latitude === 0 && longitude === 0) return false;
  return (
    latitude >= TEXAS_BOUNDS.minLat &&
    latitude <= TEXAS_BOUNDS.maxLat &&
    longitude >= TEXAS_BOUNDS.minLng &&
    longitude <= TEXAS_BOUNDS.maxLng
  );
}

export function slugify(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || "explore-entity"
  );
}

export function normalizedName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function distanceKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
