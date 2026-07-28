import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const RACE_FILE = path.join(ROOT, "src/data/elections/2026/races.json");
const LEGISLATIVE_SERVICE =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer";
const COUNTY_LAYER =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/3";
const COUNTY_LINKS_URL = "https://www.sos.texas.gov/elections/voter/links.shtml";
const CENSUS_SOURCE_URL = `${LEGISLATIVE_SERVICE}/layers`;
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();

interface ArcGisFeature {
  attributes: Record<string, unknown>;
  geometry?: Record<string, unknown>;
}

interface CountyRecord {
  id: string;
  name: string;
  slug: string;
  fipsCode: string;
  officialElectionUrl: string;
}

const races = JSON.parse(await readFile(RACE_FILE, "utf8"));
const [allCounties, countyLinks, congressional, senate, house] = await Promise.all([
  queryFeatures(COUNTY_LAYER, {
    where: "STATE='48'",
    outFields: "GEOID,BASENAME,NAME,STATE",
    returnGeometry: "false",
  }),
  fetchCountyLinks(),
  queryDistricts(0),
  queryDistricts(1),
  queryDistricts(2),
]);

const countiesByFips = new Map(
  allCounties.map((feature) => {
    const fips = String(feature.attributes.GEOID ?? "");
    const name = countyName(feature.attributes);
    return [fips, countyRecord(fips, name, countyLinks)] as const;
  }),
);
const geographyByRace = new Map<string, CountyRecord[]>();
const statewideCounties = [...countiesByFips.values()].sort(sortCounty);

for (const race of races) {
  if (race.jurisdictionType === "statewide") geographyByRace.set(race.id, statewideCounties);
}

await mapDistrictLayer(congressional, "CD119", "race-2026-us-house-", geographyByRace, countiesByFips);
await mapDistrictLayer(senate, "SLDU", "race-2026-texas-senate-", geographyByRace, countiesByFips);
await mapDistrictLayer(house, "SLDL", "race-2026-texas-house-", geographyByRace, countiesByFips);

let updated = 0;
const output = races.map((race: Record<string, unknown>) => {
  const counties = geographyByRace.get(String(race.id));
  if (!counties?.length) return race;
  updated += 1;
  return {
    ...race,
    countyIds: counties.map((county) => county.id),
    counties: counties.map(({ id, name, slug }) => ({ id, name, slug })),
    zipCodes: Array.isArray(race.zipCodes) ? race.zipCodes : [],
    officialCountyElectionLinks: counties.map((county) => ({
      label: `${county.name} official election website`,
      url: county.officialElectionUrl,
      countyId: county.id,
    })),
    officialSampleBallotLinks: Array.isArray(race.officialSampleBallotLinks)
      ? race.officialSampleBallotLinks
      : [],
    geographySource: {
      sourceName: "U.S. Census Bureau TIGERweb",
      sourceUrl: CENSUS_SOURCE_URL,
      retrievedAt: timestamp,
      boundaryVintage: "January 1, 2025",
      congressionalSession: "119th Congress",
      stateLegislativeVintage: "2024 districts",
      zipCodesAuthoritative: false,
    },
    countyElectionLinkSource: {
      sourceName: "Texas Secretary of State County Sources",
      sourceUrl: COUNTY_LINKS_URL,
      retrievedAt: timestamp,
    },
    updatedAt: timestamp,
    dataAsOf: timestamp,
    lastCheckedAt: timestamp,
    staleAfter: addDays(new Date(timestamp), 90).toISOString(),
    freshnessStatus: "fresh",
  };
});

await writeFile(RACE_FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Generated authoritative county geography for ${updated} race(s) using ${statewideCounties.length} Texas counties.`,
);

async function queryDistricts(layer: number) {
  return queryFeatures(`${LEGISLATIVE_SERVICE}/${layer}`, {
    where: "STATE='48'",
    outFields: "GEOID,BASENAME,NAME,STATE,CD119,SLDU,SLDL",
    returnGeometry: "true",
    outSR: "4326",
    geometryPrecision: "5",
  });
}

async function mapDistrictLayer(
  features: ArcGisFeature[],
  attribute: string,
  racePrefix: string,
  target: Map<string, CountyRecord[]>,
  countiesByFips: Map<string, CountyRecord>,
) {
  await mapLimit(features, 6, async (feature) => {
    const district = Number(feature.attributes[attribute] ?? feature.attributes.BASENAME);
    if (!Number.isInteger(district) || district <= 0 || !feature.geometry) return;
    const raceId = `${racePrefix}${district}`;
    const fipsCodes = await countiesIntersecting(feature.geometry);
    const counties = fipsCodes
      .map((fips) => countiesByFips.get(fips))
      .filter((county): county is CountyRecord => Boolean(county))
      .sort(sortCounty);
    if (counties.length) target.set(raceId, counties);
  });
}

async function countiesIntersecting(geometry: Record<string, unknown>) {
  const body = new URLSearchParams({
    f: "json",
    where: "STATE='48'",
    geometry: JSON.stringify(geometry),
    geometryType: "esriGeometryPolygon",
    inSR: "4326",
    spatialRel: "esriSpatialRelRelation",
    relationParam: "T********",
    outFields: "GEOID,BASENAME,NAME,STATE",
    returnGeometry: "false",
  });
  const response = await fetch(`${COUNTY_LAYER}/query`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "KeepTXRed Election Central geography importer",
    },
    body,
  });
  if (!response.ok) throw new Error(`TIGERweb county intersection failed: ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(`TIGERweb county intersection failed: ${payload.error.message}`);
  return [...new Set((payload.features ?? []).map((feature: ArcGisFeature) => String(feature.attributes.GEOID)))];
}

async function queryFeatures(endpoint: string, parameters: Record<string, string>) {
  const body = new URLSearchParams({ f: "json", ...parameters });
  const response = await fetch(`${endpoint}/query`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "KeepTXRed Election Central geography importer",
    },
    body,
  });
  if (!response.ok) throw new Error(`TIGERweb query failed: ${response.status} ${response.statusText}`);
  const payload = await response.json();
  if (payload.error) throw new Error(`TIGERweb query failed: ${payload.error.message}`);
  return (payload.features ?? []) as ArcGisFeature[];
}

async function fetchCountyLinks() {
  const response = await fetch(COUNTY_LINKS_URL, {
    headers: { "user-agent": "KeepTXRed Election Central geography importer" },
  });
  if (!response.ok) throw new Error(`Texas SOS county-link directory failed: ${response.status}`);
  const html = await response.text();
  const countySection = html.split(/County Sources/i)[1] ?? html;
  const links = new Map<string, string>();
  const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([^<]*?County)<\/a>/gi;
  for (const match of countySection.matchAll(pattern)) {
    const name = normalizeCountyName(match[2]);
    const resolved = new URL(match[1], COUNTY_LINKS_URL);
    if (resolved.protocol === "http:") resolved.protocol = "https:";
    if (resolved.protocol === "https:") links.set(name, resolved.toString());
  }
  return links;
}

function countyRecord(fipsCode: string, name: string, links: Map<string, string>): CountyRecord {
  const normalized = normalizeCountyName(name);
  return {
    id: `county-${fipsCode}`,
    name: `${normalized} County`,
    slug: slugify(normalized),
    fipsCode,
    officialElectionUrl: links.get(normalized) ?? COUNTY_LINKS_URL,
  };
}

function countyName(attributes: Record<string, unknown>) {
  return String(attributes.BASENAME ?? attributes.NAME ?? "")
    .replace(/\s+County$/i, "")
    .trim();
}

function normalizeCountyName(value: unknown) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+County$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sortCounty(left: CountyRecord, right: CountyRecord) {
  return left.name.localeCompare(right.name, "en-US");
}

async function mapLimit<T>(items: readonly T[], limit: number, task: (item: T) => Promise<void>) {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index];
      index += 1;
      await task(item);
    }
  });
  await Promise.all(workers);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}
