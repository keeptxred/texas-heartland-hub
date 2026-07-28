import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const blockers = [];
const warnings = [];
const now = new Date();

const [cycles, races, candidates, polls, forecasts] = await Promise.all(
  ["cycle", "races", "candidates", "polls", "forecasts"].map(async (name) =>
    JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")),
  ),
);

const publicCycles = publicRecords(cycles);
const publicRaces = publicRecords(races);
const publicCandidates = publicRecords(candidates);
const publicPolls = publicRecords(polls);
const publicForecasts = publicRecords(forecasts);
const candidateById = new Map(publicCandidates.map((candidate) => [candidate.id, candidate]));
const uncoveredRaceIds = [];
const partiallyCoveredRaceIds = [];
const missingGeographyRaceIds = [];

require(publicCycles.length === 1, `Expected one published 2026 cycle; found ${publicCycles.length}.`);
require(publicRaces.length === 227, `Expected all 227 launch-scope races; found ${publicRaces.length}.`);

let coveredRaces = 0;
let fullyCoveredRaces = 0;
let geographyCoveredRaces = 0;
let geographyRequiredRaces = 0;
for (const race of publicRaces) {
  const raceCandidates = (race.candidateIds ?? [])
    .map((id) => candidateById.get(id))
    .filter(Boolean)
    .filter((candidate) => candidate.raceIds?.includes(race.id));
  if (raceCandidates.length > 0) coveredRaces += 1;
  if (race.uncontested ? raceCandidates.length >= 1 : raceCandidates.length >= 2) {
    fullyCoveredRaces += 1;
  }
  if (raceCandidates.length === 0) {
    uncoveredRaceIds.push(race.id);
    blockers.push(`${race.id} has no published verified candidate.`);
  } else if (!race.uncontested && raceCandidates.length < 2) {
    partiallyCoveredRaceIds.push(race.id);
    blockers.push(`${race.id} is not marked uncontested and has fewer than two published candidates.`);
  }

  if (requiresCountyGeography(race)) {
    geographyRequiredRaces += 1;
    const countyIds = Array.isArray(race.countyIds) ? race.countyIds : [];
    const counties = Array.isArray(race.counties) ? race.counties : [];
    const officialLinks = Array.isArray(race.officialCountyElectionLinks)
      ? race.officialCountyElectionLinks
      : [];
    const expectedCount = race.jurisdictionType === "statewide" ? 254 : 1;
    const valid =
      countyIds.length >= expectedCount &&
      counties.length === countyIds.length &&
      officialLinks.length === countyIds.length &&
      race.geographySource?.sourceUrl?.startsWith("https://");
    if (valid) geographyCoveredRaces += 1;
    else {
      missingGeographyRaceIds.push(race.id);
      blockers.push(`${race.id} lacks complete authoritative county geography or county links.`);
    }
    if (
      Array.isArray(race.zipCodes) &&
      race.zipCodes.length > 0 &&
      race.geographySource?.zipCodesAuthoritative !== true
    ) {
      blockers.push(`${race.id} publishes ZIP coverage without an authoritative ZIP source.`);
    }
  }
  freshness(race, `Race ${race.id}`);
}
for (const candidate of publicCandidates) freshness(candidate, `Candidate ${candidate.id}`);

require(publicCandidates.length > 0, "Candidate directory has no published verified candidates.");
require(
  fullyCoveredRaces === publicRaces.length,
  `Candidate coverage is incomplete: ${fullyCoveredRaces}/${publicRaces.length} races satisfy launch coverage.`,
);
require(
  geographyCoveredRaces === geographyRequiredRaces,
  `Geography coverage is incomplete: ${geographyCoveredRaces}/${geographyRequiredRaces} required races are covered.`,
);

if (publicPolls.length === 0) warnings.push("No public polls are loaded; the published no-poll state must remain visible.");
if (publicForecasts.length === 0) {
  warnings.push("No forecasts are loaded; the published no-forecast state must remain visible.");
}

const enabled = readBoolean(process.env.VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE, false);
const ready = blockers.length === 0;
const report = {
  generatedAt: now.toISOString(),
  ready,
  homepageTakeoverEnabled: enabled,
  counts: {
    cycles: publicCycles.length,
    races: publicRaces.length,
    candidates: publicCandidates.length,
    polls: publicPolls.length,
    forecasts: publicForecasts.length,
    racesWithAtLeastOneCandidate: coveredRaces,
    launchCoveredRaces: fullyCoveredRaces,
    geographyRequiredRaces,
    geographyCoveredRaces,
  },
  uncoveredRaceIds,
  partiallyCoveredRaceIds,
  missingGeographyRaceIds,
  warnings,
  blockerCount: blockers.length,
};

if (readBoolean(process.env.ELECTION_WRITE_READINESS, false)) {
  await writeFile(
    path.join(DATA_DIR, "readiness.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log("Wrote src/data/elections/2026/readiness.json.");
}

console.log(
  `Election Central readiness: ${ready ? "READY" : "NOT READY"}; ${publicRaces.length} races, ${publicCandidates.length} candidates, ${coveredRaces}/${publicRaces.length} races with at least one candidate, ${fullyCoveredRaces}/${publicRaces.length} launch-covered races, ${geographyCoveredRaces}/${geographyRequiredRaces} geography-covered races.`,
);
for (const warning of warnings) console.warn(`Launch warning: ${warning}`);

if (!ready) {
  console.warn(`Launch blockers (${blockers.length}):`);
  for (const blocker of blockers.slice(0, 40)) console.warn(`- ${blocker}`);
  if (blockers.length > 40) console.warn(`- …and ${blockers.length - 40} more.`);
}

if (enabled && !ready) {
  console.error(
    "VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE is enabled before Election Central is launch-ready.",
  );
  process.exit(1);
}

if (enabled && ready) console.log("Homepage takeover is enabled and the launch gate passed.");
else console.log("Homepage takeover remains disabled.");

function publicRecords(records) {
  return records.filter(
    (record) => record.publicationStatus === "published" && record.verificationStatus === "verified",
  );
}

function requiresCountyGeography(race) {
  return [
    "statewide",
    "congressional_district",
    "state_senate_district",
    "state_house_district",
  ].includes(race.jurisdictionType);
}

function freshness(record, label) {
  const checked = new Date(record.lastCheckedAt ?? record.dataAsOf ?? record.updatedAt);
  if (Number.isNaN(checked.getTime())) {
    blockers.push(`${label} has no valid freshness timestamp.`);
    return;
  }
  const days = (now.getTime() - checked.getTime()) / 86_400_000;
  if (record.freshnessStatus === "stale" || record.freshnessStatus === "expired" || days > 60) {
    blockers.push(`${label} is stale or expired.`);
  } else if (record.freshnessStatus === "aging" || days > 30) {
    warnings.push(`${label} is aging and should be reverified.`);
  }
}

function require(condition, message) {
  if (!condition) blockers.push(message);
}

function readBoolean(value, fallback) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) return false;
  return fallback;
}
