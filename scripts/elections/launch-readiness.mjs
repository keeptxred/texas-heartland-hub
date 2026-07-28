import { readFile } from "node:fs/promises";
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

require(publicCycles.length === 1, `Expected one published 2026 cycle; found ${publicCycles.length}.`);
require(publicRaces.length === 227, `Expected all 227 launch-scope races; found ${publicRaces.length}.`);

let coveredRaces = 0;
let fullyCoveredRaces = 0;
for (const race of publicRaces) {
  const raceCandidates = (race.candidateIds ?? [])
    .map((id) => candidateById.get(id))
    .filter(Boolean)
    .filter((candidate) => candidate.raceIds?.includes(race.id));
  if (raceCandidates.length > 0) coveredRaces += 1;
  if (race.uncontested ? raceCandidates.length >= 1 : raceCandidates.length >= 2) {
    fullyCoveredRaces += 1;
  }
  if (raceCandidates.length === 0) blockers.push(`${race.id} has no published verified candidate.`);
  else if (!race.uncontested && raceCandidates.length < 2) {
    blockers.push(`${race.id} is not marked uncontested and has fewer than two published candidates.`);
  }
  freshness(race, `Race ${race.id}`);
}
for (const candidate of publicCandidates) freshness(candidate, `Candidate ${candidate.id}`);

require(publicCandidates.length > 0, "Candidate directory has no published verified candidates.");
require(
  fullyCoveredRaces === publicRaces.length,
  `Candidate coverage is incomplete: ${fullyCoveredRaces}/${publicRaces.length} races satisfy launch coverage.`,
);

if (publicPolls.length === 0) warnings.push("No public polls are loaded; the published no-poll state must remain visible.");
if (publicForecasts.length === 0) {
  warnings.push("No forecasts are loaded; the published no-forecast state must remain visible.");
}

const enabled = readBoolean(process.env.VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE, false);
const ready = blockers.length === 0;

console.log(
  `Election Central readiness: ${ready ? "READY" : "NOT READY"}; ${publicRaces.length} races, ${publicCandidates.length} candidates, ${coveredRaces}/${publicRaces.length} races with at least one candidate, ${fullyCoveredRaces}/${publicRaces.length} launch-covered races.`,
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
