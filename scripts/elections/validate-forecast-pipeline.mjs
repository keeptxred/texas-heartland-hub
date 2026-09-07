import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");

const [races, candidates, polls, averages, forecasts, diagnostics] = await Promise.all([
  readJson("races.json"),
  readJson("candidates.json"),
  readJson("polls.json"),
  readJson("polling-averages.json"),
  readJson("forecasts.json"),
  readJson("forecast-diagnostics.json"),
]);

const errors = [];
const publicVerified = (record) =>
  record?.publicationStatus === "published" && record?.verificationStatus === "verified";
const raceById = new Map(races.map((race) => [race.id, race]));
const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
const pollById = new Map(polls.map((poll) => [poll.id, poll]));
const averageByRace = new Map(averages.map((average) => [average.raceId, average]));
const forecastByRace = new Map();

for (const forecast of forecasts) {
  if (forecastByRace.has(forecast.raceId)) {
    errors.push(`Duplicate forecast records for ${forecast.raceId}.`);
  }
  forecastByRace.set(forecast.raceId, forecast);

  if (!publicVerified(forecast)) {
    errors.push(`Forecast ${forecast.id} is not published and verified.`);
  }
  if (!raceById.has(forecast.raceId)) {
    errors.push(`Forecast ${forecast.id} references unknown race ${forecast.raceId}.`);
  }
  if (!Array.isArray(forecast.candidateProbabilities) || forecast.candidateProbabilities.length !== 2) {
    errors.push(`Forecast ${forecast.id} must contain exactly two major-party probability records.`);
  }
  const probabilityTotal = (forecast.candidateProbabilities ?? []).reduce(
    (total, row) => total + Number(row.winProbability ?? 0),
    0,
  );
  if (Math.abs(probabilityTotal - 1) > 0.02) {
    errors.push(`Forecast ${forecast.id} probabilities total ${probabilityTotal}, not approximately 1.0.`);
  }
  for (const row of forecast.candidateProbabilities ?? []) {
    const candidate = candidateById.get(row.candidateId);
    if (!candidate) errors.push(`Forecast ${forecast.id} references unknown candidate ${row.candidateId}.`);
    else if (!candidate.raceIds?.includes(forecast.raceId)) {
      errors.push(`Forecast ${forecast.id} candidate ${row.candidateId} is not linked to ${forecast.raceId}.`);
    }
  }
  if (!forecast.sourceIds?.includes("ktr-forecast-model")) {
    errors.push(`Forecast ${forecast.id} is missing the canonical model source ID.`);
  }
  if (!forecast.snapshots?.length) {
    errors.push(`Forecast ${forecast.id} has no retained snapshot.`);
  }
}

const diagnosticEntries = diagnostics.polledRaces ?? [];
for (const entry of diagnosticEntries) {
  if (!raceById.has(entry.raceId)) {
    errors.push(`Forecast diagnostics reference unknown race ${entry.raceId}.`);
  }

  const matchedCandidateIds = entry.matchedCandidateIds ?? [];
  if (entry.matchedCandidateCount !== matchedCandidateIds.length) {
    errors.push(
      `Forecast diagnostics for ${entry.raceId} report ${entry.matchedCandidateCount ?? "missing"} matched candidate(s), but list ${matchedCandidateIds.length}.`,
    );
  }

  for (const candidateId of matchedCandidateIds) {
    const candidate = candidateById.get(candidateId);
    if (!candidate) {
      errors.push(`Forecast diagnostics for ${entry.raceId} reference unknown matched candidate ${candidateId}.`);
    } else if (!candidate.raceIds?.includes(entry.raceId)) {
      errors.push(`Forecast diagnostics candidate ${candidateId} is not linked to ${entry.raceId}.`);
    }
  }
}

const generatedDiagnostics = diagnosticEntries.filter(
  (entry) => entry.outcome === "generated",
);
if (diagnostics.totals?.generated !== generatedDiagnostics.length) {
  errors.push(
    `Forecast diagnostics total ${diagnostics.totals?.generated ?? "missing"} does not match ${generatedDiagnostics.length} generated race entries.`,
  );
}

for (const entry of generatedDiagnostics) {
  const forecast = forecastByRace.get(entry.raceId);
  if (!forecast) {
    errors.push(`Forecast-eligible race ${entry.raceId} is missing from forecasts.json.`);
    continue;
  }
  const average = averageByRace.get(entry.raceId);
  if (!average) errors.push(`Forecast ${forecast.id} has no persisted polling-average record.`);

  const expectedMajorPartyIds = [entry.republicanCandidateId, entry.democraticCandidateId].filter(Boolean);
  const actualIds = new Set((forecast.candidateProbabilities ?? []).map((row) => row.candidateId));
  for (const candidateId of expectedMajorPartyIds) {
    if (!actualIds.has(candidateId)) {
      errors.push(`Forecast ${forecast.id} is missing expected major-party candidate ${candidateId}.`);
    }
  }

  for (const pollId of entry.pollIds ?? []) {
    const poll = pollById.get(pollId);
    if (!poll || !publicVerified(poll)) {
      errors.push(`Forecast ${forecast.id} depends on unavailable poll ${pollId}.`);
      continue;
    }
    if (poll.source?.sourceId && !forecast.sourceIds?.includes(poll.source.sourceId)) {
      errors.push(`Forecast ${forecast.id} is missing source ID ${poll.source.sourceId} from poll ${pollId}.`);
    }
  }
}

if (generatedDiagnostics.length > 0 && forecasts.length === 0) {
  errors.push(
    `${generatedDiagnostics.length} race(s) are forecast-eligible, but forecasts.json is empty.`,
  );
}
if (forecasts.length !== generatedDiagnostics.length) {
  errors.push(
    `Forecast count ${forecasts.length} does not match generated diagnostic count ${generatedDiagnostics.length}.`,
  );
}

if (errors.length) {
  console.error(`Forecast pipeline validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Forecast pipeline validation passed: ${forecasts.length} forecast(s), ${averages.length} polling average(s), ${generatedDiagnostics.length} eligible race(s).`,
);

async function readJson(filename) {
  return JSON.parse(await readFile(path.join(DATA_DIR, filename), "utf8"));
}
