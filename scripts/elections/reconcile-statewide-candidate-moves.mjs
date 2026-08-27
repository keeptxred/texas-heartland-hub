import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const CANDIDATE_FILE = path.join(DATA_DIR, "candidates.json");
const RACE_FILE = path.join(DATA_DIR, "races.json");
const OFFICIAL_FILE = path.resolve(
  process.env.ELECTION_OFFICIAL_CANDIDATES ??
    path.join(ROOT, "scripts/elections/import/official-candidates.json"),
);

export function reconcileStatewideCandidateMoves({ candidates, races, officialRows }) {
  const officialRacesByPerson = new Map();

  for (const row of officialRows) {
    const raceId = raceIdFromOffice(row.officeName ?? row.office ?? row.raceName);
    if (!raceId || !isStatewideRaceId(raceId)) continue;
    const fullName = clean(row.fullName ?? row.ballotName ?? row.candidateName ?? row.name);
    const party = normalizeParty(row.party ?? row.partyName ?? row.partyCode);
    if (!fullName || !party) continue;
    const key = personIdentity(fullName, party);
    const racesForPerson = officialRacesByPerson.get(key) ?? new Set();
    racesForPerson.add(raceId);
    officialRacesByPerson.set(key, racesForPerson);
  }

  const removedCandidateIds = new Set();
  for (const candidate of candidates) {
    const primaryRaceId = clean(candidate.primaryRaceId);
    if (!isStatewideRaceId(primaryRaceId)) continue;
    if (!isOfficialCandidateListing(candidate)) continue;
    const raceIds = [...new Set(candidate.raceIds ?? [primaryRaceId])].filter(Boolean);
    if (raceIds.some((raceId) => !isStatewideRaceId(raceId))) continue;

    const officialRaceIds = officialRacesByPerson.get(
      personIdentity(candidate.fullName, candidate.party),
    );
    if (!officialRaceIds || officialRaceIds.has(primaryRaceId)) continue;

    removedCandidateIds.add(candidate.id);
  }

  if (!removedCandidateIds.size) {
    return { candidates, races, removedCandidateIds: [] };
  }

  const reconciledCandidates = candidates.filter(
    (candidate) => !removedCandidateIds.has(candidate.id),
  );
  const reconciledRaces = races.map((race) => {
    const candidateIds = (race.candidateIds ?? []).filter(
      (candidateId) => !removedCandidateIds.has(candidateId),
    );
    if (candidateIds.length === (race.candidateIds ?? []).length) return race;
    return {
      ...race,
      candidateIds,
      uncontested: candidateIds.length === 1,
    };
  });

  return {
    candidates: reconciledCandidates,
    races: reconciledRaces,
    removedCandidateIds: [...removedCandidateIds].sort(),
  };
}

function isOfficialCandidateListing(candidate) {
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

function personIdentity(name, party) {
  return `${normalize(name)}|${normalizeParty(party) ?? clean(party).toLowerCase()}`;
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

async function readJson(file) {
  const parsed = JSON.parse(await readFile(file, "utf8"));
  if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array.`);
  return parsed;
}

async function main() {
  const [candidates, races, officialRows] = await Promise.all([
    readJson(CANDIDATE_FILE),
    readJson(RACE_FILE),
    readJson(OFFICIAL_FILE),
  ]);
  const result = reconcileStatewideCandidateMoves({ candidates, races, officialRows });
  if (!result.removedCandidateIds.length) {
    console.log("No stale statewide candidate race assignments required reconciliation.");
    return;
  }
  await Promise.all([
    writeFile(CANDIDATE_FILE, `${JSON.stringify(result.candidates, null, 2)}\n`),
    writeFile(RACE_FILE, `${JSON.stringify(result.races, null, 2)}\n`),
  ]);
  console.log(
    `Removed ${result.removedCandidateIds.length} stale official statewide candidate assignment(s): ${result.removedCandidateIds.join(", ")}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
