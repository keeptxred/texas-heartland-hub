import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const RACE_FILE = path.join(ROOT, "src/data/elections/2026/races.json");
const INPUT_FILE = path.resolve(
  process.env.ELECTION_GEOGRAPHY_IMPORT ?? path.join(ROOT, "scripts/elections/import/geography.json"),
);
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();

const [races, rows] = await Promise.all([
  readJson(RACE_FILE),
  readJson(INPUT_FILE),
]);
const byRace = new Map(rows.map((row) => [row.raceId, normalizeRow(row)]).filter((entry) => entry[0]));
let updated = 0;
const output = races.map((race) => {
  const geography = byRace.get(race.id);
  if (!geography) return race;
  updated += 1;
  return {
    ...race,
    countyIds: geography.counties.map((county) => county.id),
    counties: geography.counties,
    zipCodes: geography.zipCodesAuthoritative ? geography.zipCodes : [],
    officialCountyElectionLinks: geography.officialCountyElectionLinks,
    officialSampleBallotLinks: geography.officialSampleBallotLinks,
    geographySource: {
      sourceName: geography.sourceName,
      sourceUrl: geography.sourceUrl,
      retrievedAt: geography.retrievedAt,
      zipCodesAuthoritative: geography.zipCodesAuthoritative,
    },
    updatedAt: timestamp,
    dataAsOf: geography.retrievedAt,
    lastCheckedAt: timestamp,
  };
});

await writeFile(RACE_FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Updated authoritative ballot geography for ${updated} race(s).`);

function normalizeRow(row) {
  if (!row || typeof row !== "object") return null;
  const sourceUrl = String(row.sourceUrl ?? "");
  if (!sourceUrl.startsWith("https://")) {
    throw new Error(`Geography row ${row.raceId ?? "unknown"} needs an HTTPS source URL.`);
  }
  const counties = (row.counties ?? []).map((county) => ({
    id: String(county.id ?? county.fipsCode ?? slugify(county.name)),
    name: String(county.name),
    slug: String(county.slug ?? slugify(county.name)),
  }));
  const officialCountyElectionLinks = normalizeLinks(row.officialCountyElectionLinks ?? []);
  const officialSampleBallotLinks = normalizeLinks(row.officialSampleBallotLinks ?? []);
  return {
    raceId: String(row.raceId ?? ""),
    counties,
    zipCodes: [...new Set((row.zipCodes ?? []).map(String))].sort(),
    zipCodesAuthoritative: row.zipCodesAuthoritative === true,
    officialCountyElectionLinks,
    officialSampleBallotLinks,
    sourceName: String(row.sourceName ?? "Official election geography source"),
    sourceUrl,
    retrievedAt: String(row.retrievedAt ?? timestamp),
  };
}

function normalizeLinks(links) {
  return links.map((link) => {
    const url = typeof link === "string" ? link : link.url;
    if (!String(url).startsWith("https://")) throw new Error(`Election geography link must use HTTPS: ${url}`);
    return typeof link === "string"
      ? { label: "Official election information", url }
      : { label: String(link.label ?? "Official election information"), url: String(url) };
  });
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readJson(file) {
  const parsed = JSON.parse(await readFile(file, "utf8"));
  return Array.isArray(parsed) ? parsed : parsed.records ?? [];
}
