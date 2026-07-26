import type { ImportEntityDraft, ImportSourceType } from "@/types/explore/import";

const SOURCE_TAGS: Partial<Record<ImportSourceType, readonly string[]>> = {
  tpwd: ["texas-parks-wildlife"],
  nps: ["national-park-service"],
  usace: ["federal-recreation"],
  usfs: ["national-forests"],
  thc: ["texas-history"],
  usgs: ["geology"],
  noaa: ["weather-climate"],
  twdb: ["texas-water"],
  osm: ["openstreetmap"],
  county_gis: ["county-data"],
  municipality: ["municipal-data"],
  tourism: ["official-tourism"],
};

const ENTITY_TAGS: Record<string, readonly string[]> = {
  park: ["parks", "outdoors"],
  trail: ["trails", "outdoors"],
  lake: ["lakes", "water-recreation"],
  river: ["rivers", "water-recreation"],
  river_access: ["rivers", "river-access", "water-recreation"],
  historic_site: ["historic-sites", "history"],
  campground: ["camping", "outdoors"],
  wildlife_area: ["wildlife", "outdoors"],
  visitor_center: ["visitor-centers"],
  museum: ["museums", "culture"],
  beach: ["beaches", "water-recreation"],
};

export function assignImportTaxonomy(
  draft: ImportEntityDraft,
  sourceType: ImportSourceType,
): string[] {
  const values = new Set<string>();
  for (const value of draft.taxonomy ?? []) add(values, value);
  for (const value of SOURCE_TAGS[sourceType] ?? []) add(values, value);
  for (const value of ENTITY_TAGS[draft.entityType] ?? []) add(values, value);

  const searchable = `${draft.name} ${draft.description ?? ""}`.toLowerCase();
  if (/\b(fishing|fishery|angler)\b/.test(searchable)) add(values, "fishing");
  if (/\b(hike|hiking|trailhead)\b/.test(searchable)) add(values, "hiking");
  if (/\b(camp|campground|campsite)\b/.test(searchable)) add(values, "camping");
  if (/\b(kayak\w*|canoe\w*|paddl\w*|boat ramps?)\b/.test(searchable))
    add(values, "paddling-boating");
  if (/\b(bird|birding|ornitholog)\b/.test(searchable)) add(values, "birding");
  if (/\b(historic|historical|heritage|landmark)\b/.test(searchable)) add(values, "history");
  if (/\b(accessible|ada|wheelchair)\b/.test(searchable)) add(values, "accessible");
  return [...values].sort();
}

function add(values: Set<string>, raw: string): void {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (normalized) values.add(normalized);
}
