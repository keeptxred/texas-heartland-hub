import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const OFFICIAL_FILE = path.resolve(
  process.env.ELECTION_OFFICIAL_CANDIDATES ??
    path.join(ROOT, "scripts/elections/import/official-candidates.json"),
);
const REPORT_FILE = path.resolve(
  process.env.ELECTION_STATEWIDE_AUDIT_REPORT ??
    path.join(ROOT, "artifacts/elections/statewide-race-audit.json"),
);

const [races, candidates, officialRows] = await Promise.all([
  readJson(path.join(DATA_DIR, "races.json")),
  readJson(path.join(DATA_DIR, "candidates.json")),
  readJson(OFFICIAL_FILE),
]);

const errors = [];
const warnings = [];
const raceById = new Map(races.map((race) => [race.id, race]));
const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
const statewideRaces = races.filter((race) => isStatewideRaceId(race.id));
const statewideRaceIds = new Set(statewideRaces.map((race) => race.id));

const duplicateIds = duplicates(candidates, (candidate) => candidate.id);
for (const id of duplicateIds) errors.push(`Duplicate candidate ID: ${id}`);
const duplicateRaceIds = duplicates(races, (race) => race.id);
for (const id of duplicateRaceIds) errors.push(`Duplicate race ID: ${id}`);

const generatedIdentity = new Map();
for (const candidate of candidates) {
  const raceIds = [...new Set(candidate.raceIds ?? [])];
  if (candidate.primaryRaceId && !raceIds.includes(candidate.primaryRaceId)) {
    errors.push(`${candidate.id}: primaryRaceId ${candidate.primaryRaceId} is absent from raceIds.`);
  }
  for (const raceId of raceIds) {
    if (!raceById.has(raceId)) errors.push(`${candidate.id}: references unknown race ${raceId}.`);
    const race = raceById.get(raceId);
    if (race && !(race.candidateIds ?? []).includes(candidate.id)) {
      errors.push(`${candidate.id}: race ${raceId} does not reciprocally list the candidate.`);
    }
    if (!statewideRaceIds.has(raceId)) continue;
    const key = identity(candidate.fullName, candidate.party, raceId);
    if (generatedIdentity.has(key)) {
      errors.push(`Duplicate statewide candidate identity ${key}: ${generatedIdentity.get(key)} and ${candidate.id}.`);
    } else generatedIdentity.set(key, candidate.id);
  }
}

for (const race of statewideRaces) {
  const listed = race.candidateIds ?? [];
  if (!listed.length) errors.push(`${race.id}: statewide race has no candidates.`);
  if (new Set(listed).size !== listed.length) errors.push(`${race.id}: candidateIds contains duplicates.`);
  for (const candidateId of listed) {
    const candidate = candidateById.get(candidateId);
    if (!candidate) {
      errors.push(`${race.id}: references missing candidate ${candidateId}.`);
      continue;
    }
    if (!(candidate.raceIds ?? []).includes(race.id)) {
      errors.push(`${race.id}: candidate ${candidateId} does not reciprocally reference the race.`);
    }
  }
}

const officialStatewide = [];
for (const row of officialRows) {
  const raceId = raceIdFromOffice(row.officeName ?? row.office ?? row.raceName);
  if (!raceId || !isStatewideRaceId(raceId)) continue;
  if (!raceById.has(raceId)) {
    errors.push(`Official office “${row.officeName}” maps to missing race ${raceId}.`);
    continue;
  }
  const party = normalizeParty(row.party ?? row.partyName ?? row.partyCode);
  const fullName = clean(row.fullName ?? row.ballotName ?? row.candidateName ?? row.name);
  if (!fullName || !party) {
    errors.push(`Unusable official statewide row for ${row.officeName}: missing candidate name or party.`);
    continue;
  }
  const key = identity(fullName, party, raceId);
  officialStatewide.push({ fullName, party, raceId, key, sourceRecordId: row.sourceRecordId ?? null });
  if (!generatedIdentity.has(key)) {
    errors.push(`Missing official candidate: ${fullName} (${party}) in ${raceId}.`);
  }
}

const officialKeys = new Set(officialStatewide.map((row) => row.key));
for (const [key, candidateId] of generatedIdentity) {
  if (officialKeys.has(key)) continue;
  const candidate = candidateById.get(candidateId);
  const message = `Generated statewide candidate is not in the current official extract: ${candidateId} (${key}).`;
  if (isOfficialCandidateListing(candidate)) {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

const officialDuplicates = duplicates(officialStatewide, (row) => row.key);
for (const key of officialDuplicates) errors.push(`Official extract contains duplicate statewide identity: ${key}.`);

const expectedRaceIds = [
  "race-2026-governor",
  "race-2026-lieutenant-governor",
  "race-2026-attorney-general",
  "race-2026-comptroller",
  "race-2026-land-commissioner",
  "race-2026-agriculture-commissioner",
  "race-2026-railroad-commissioner",
];
for (const raceId of expectedRaceIds) {
  if (!raceById.has(raceId)) errors.push(`Required statewide race is missing: ${raceId}.`);
}
if (!statewideRaces.some((race) => race.id.startsWith("race-2026-texas-supreme-court"))) {
  errors.push("No 2026 Texas Supreme Court race is defined.");
}
if (!statewideRaces.some((race) => race.id.startsWith("race-2026-court-of-criminal-appeals"))) {
  errors.push("No 2026 Court of Criminal Appeals race is defined.");
}

const report = {
  auditedAt: new Date().toISOString(),
  officialFile: path.relative(ROOT, OFFICIAL_FILE),
  statewideRaceCount: statewideRaces.length,
  officialStatewideCandidateCount: officialStatewide.length,
  generatedStatewideCandidateCount: generatedIdentity.size,
  races: statewideRaces.map((race) => ({
    id: race.id,
    officeName: race.officeName,
    candidateIds: race.candidateIds ?? [],
  })),
  errors,
  warnings,
};
await mkdir(path.dirname(REPORT_FILE), { recursive: true });
await writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`);

if (warnings.length) {
  console.warn(`Statewide race audit produced ${warnings.length} warning(s):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`Statewide race audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(
  `Statewide race audit passed: ${statewideRaces.length} races, ${officialStatewide.length} official candidates, ${generatedIdentity.size} generated candidates.`,
);

function isOfficialCandidateListing(candidate) {
  if (!candidate) return false;
  const sourceType = clean(candidate.source?.sourceType ?? candidate.sourceType).toLowerCase();
  const sourceUrl = clean(candidate.source?.sourceUrl ?? candidate.sourceUrl).toLowerCase();
  return (
    sourceType === "official_candidate_listing" ||
    sourceUrl.includes("goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information")
  );
}

function isStatewideRaceId(raceId) {
  return /^(race-2026-(governor|lieutenant-governor|attorney-general|comptroller|land-commissioner|agriculture-commissioner|railroad-commissioner|texas-supreme-court|court-of-criminal-appeals))/.test(
    String(raceId ?? ""),
  );
}

function raceIdFromOffice(value) {
  const office = clean(value).toUpperCase().replace(/\./g, "");
  if (!office) return null;
  if (/^GOVERNOR$/.test(office)) return "race-2026-governor";
  if (/LIEUTENANT GOVERNOR/.test(office)) return "race-2026-lieutenant-governor";
  if (/ATTORNEY GENERAL/.test(office)) return "race-2026-attorney-general";
  if (/COMPTROLLER/.test(office)) return "race-2026-comptroller";
  if (/GENERAL LAND|LAND COMMISSIONER/.test(office)) return "race-2026-land-commissioner";
  if (/AGRICULTURE/.test(office)) return "race-2026-agriculture-commissioner";
  if (/RAILROAD COMMISSIONER/.test(office)) return "race-2026-railroad-commissioner";
  if (/^CHIEF JUSTICE,? SUPREME COURT$/.test(office)) return "race-2026-texas-supreme-court-place-1";
  let match = office.match(/SUPREME COURT.*PLACE (\d+)/);
  if (match) return `race-2026-texas-supreme-court-place-${Number(match[1])}`;
  match = office.match(/COURT OF CRIMINAL APPEALS.*PLACE (\d+)/);
  if (match) return `race-2026-court-of-criminal-appeals-place-${Number(match[1])}`;
  return null;
}

function normalizeParty(value) {
  const party = clean(value).toLowerCase();
  if (/^(r|rep|republican|gop)$/.test(party)) return "republican";
  if (/^(d|dem|democrat|democratic)$/.test(party)) return "democratic";
  if (/^(l|lib|libertarian)$/.test(party)) return "libertarian";
  if (/^(g|grn|green)$/.test(party)) return "green";
  if (/^(i|ind|independent)$/.test(party)) return "independent";
  if (/^(w|write-in|write in|o|oth|other)$/.test(party)) return "other";
  return null;
}

function identity(name, party, raceId) {
  return `${normalize(name)}|${party}|${raceId}`;
}
function normalize(value) {
  return clean(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}
function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}
function duplicates(records, keyOf) {
  const seen = new Set();
  const duplicate = new Set();
  for (const record of records) {
    const key = keyOf(record);
    if (seen.has(key)) duplicate.add(key);
    seen.add(key);
  }
  return [...duplicate];
}
async function readJson(file) {
  const parsed = JSON.parse(await readFile(file, "utf8"));
  if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array.`);
  return parsed;
}
