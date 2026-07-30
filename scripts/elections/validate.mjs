import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const FILES = ["cycle", "races", "candidates", "polls", "forecasts", "results", "sources"];
const errors = [];
const warnings = [];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DATE_KEYS = /(?:At|Date|Deadline|Start|End|After|Before|From|To)$/;
const PROHIBITED_VOTER_KEYS = new Set([
  "voterName",
  "voterAddress",
  "voterEmail",
  "voterPhone",
  "voterDateOfBirth",
  "voterDriverLicense",
  "voterSocialSecurityNumber",
  "voterRegistrationNumber",
  "individualVoterRecord",
]);

const data = Object.fromEntries(
  await Promise.all(FILES.map(async (name) => [name, await load(name)])),
);

validateCollectionBasics();
validateCycles();
validateRaces();
validateCandidates();
validatePolls();
validateForecasts();
validateResults();
validateSourcesRegistry();
validateRelationships();
validateNoPersonLevelVoterData();

if (warnings.length) {
  console.warn(`Election data validation produced ${warnings.length} warning(s):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`Election data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Election data validation passed (${FILES.map((name) => `${data[name].length} ${name}`).join(", ")}).`,
);

async function load(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(parsed)) throw new Error("top-level value must be an array");
    return parsed;
  } catch (error) {
    errors.push(`${name}.json: ${error.message}`);
    return [];
  }
}

function validateCollectionBasics() {
  for (const [collection, records] of Object.entries(data)) {
    const ids = new Map();
    const slugs = new Map();
    records.forEach((record, index) => {
      const location = `${collection}[${index}]`;
      if (!isObject(record)) {
        errors.push(`${location} must be an object.`);
        return;
      }
      requiredString(record, "id", location);
      if (record.id) unique(ids, normalize(record.id), location, "id", record.id);
      if (collection !== "sources") {
        requiredString(record, "slug", location);
        if (record.slug && !SLUG.test(record.slug)) errors.push(`${location}.slug is not canonical: ${record.slug}`);
        if (record.slug) unique(slugs, normalize(record.slug), location, "slug", record.slug);
      }
      validateMetadata(record, location, collection === "sources");
      walk(record, location, (value, key, currentPath) => {
        if (typeof value === "string" && DATE_KEYS.test(key) && value && !isIsoDate(value)) {
          errors.push(`${currentPath} is not a valid ISO date or timestamp: ${value}`);
        }
        if (/Url$/.test(key) && value != null && value !== "" && !isHttpsUrl(value)) {
          errors.push(`${currentPath} must use HTTPS: ${value}`);
        }
        if (/Urls$/.test(key) && Array.isArray(value)) {
          value.forEach((url, urlIndex) => {
            if (!isHttpsUrl(url)) errors.push(`${currentPath}[${urlIndex}] must use HTTPS: ${url}`);
          });
        }
      });
    });
  }
}

function validateMetadata(record, location, sourceRegistry) {
  if (sourceRegistry) return;
  for (const key of [
    "createdAt",
    "updatedAt",
    "verificationStatus",
    "publicationStatus",
    "freshnessStatus",
    "source",
  ]) {
    if (record[key] == null || record[key] === "") errors.push(`${location}.${key} is required.`);
  }
  if (!isObject(record.source)) {
    errors.push(`${location}.source must be an object.`);
  } else {
    requiredString(record.source, "sourceName", `${location}.source`);
    requiredString(record.source, "sourceType", `${location}.source`);
    requiredHttps(record.source, "sourceUrl", `${location}.source`);
    requiredString(record.source, "retrievedAt", `${location}.source`);
  }
  if (record.publicationStatus === "published") {
    if (record.verificationStatus !== "verified") {
      errors.push(`${location} is published but not verified.`);
    }
    for (const key of ["publishedAt", "verifiedAt", "dataAsOf", "lastCheckedAt"]) {
      if (!record[key]) errors.push(`${location}.${key} is required for published records.`);
    }
  }
  if (["draft", "in_review", "scheduled", "unpublished"].includes(record.publicationStatus)) {
    warnings.push(`${location} is retained for editorial review and will not enter static public output.`);
  }
}

function validateCycles() {
  data.cycle.forEach((record, index) => {
    const location = `cycle[${index}]`;
    requiredNumber(record, "year", location);
    requiredString(record, "name", location);
    requiredString(record, "stateCode", location);
    if (!isObject(record.milestones)) errors.push(`${location}.milestones is required.`);
    else requiredDate(record.milestones, "generalElectionDate", `${location}.milestones`);
  });
}

function validateRaces() {
  data.races.forEach((record, index) => {
    const location = `races[${index}]`;
    for (const key of [
      "electionCycleId",
      "name",
      "officeId",
      "officeName",
      "officeLevel",
      "raceType",
      "electionType",
      "jurisdictionType",
      "partyScope",
      "stateCode",
      "status",
      "rating",
    ]) requiredString(record, key, location);
    requiredDate(record, "electionDate", location);
    requiredArray(record, "countyIds", location);
    requiredArray(record, "candidateIds", location);
    if (!Number.isInteger(record.seatsAvailable) || record.seatsAvailable < 1) {
      errors.push(`${location}.seatsAvailable must be a positive integer.`);
    }
  });
}

function validateCandidates() {
  data.candidates.forEach((record, index) => {
    const location = `candidates[${index}]`;
    for (const key of [
      "electionCycleId",
      "fullName",
      "firstName",
      "lastName",
      "ballotName",
      "party",
      "status",
      "filingStatus",
      "incumbencyType",
      "campaignStatus",
      "ballotAccessStatus",
      "stateCode",
    ]) requiredString(record, key, location);
    requiredArray(record, "raceIds", location);
    if (record.primaryRaceId && !record.raceIds?.includes(record.primaryRaceId)) {
      errors.push(`${location}.primaryRaceId must be included in raceIds.`);
    }
    if (!isObject(record.socialLinks)) errors.push(`${location}.socialLinks is required.`);
    if (!isObject(record.externalIds)) errors.push(`${location}.externalIds is required.`);
  });
}

function validatePolls() {
  data.polls.forEach((record, index) => {
    const location = `polls[${index}]`;
    for (const key of ["electionCycleId", "title", "status", "fieldStartDate", "fieldEndDate"]) {
      requiredString(record, key, location);
    }
    if (record.raceId == null && record.jurisdictionId == null) {
      errors.push(`${location} must identify a race or jurisdiction.`);
    }
    if (record.fieldStartDate && record.fieldEndDate && record.fieldStartDate > record.fieldEndDate) {
      errors.push(`${location} fieldStartDate is after fieldEndDate.`);
    }
    if (!isObject(record.pollster)) errors.push(`${location}.pollster is required.`);
    else requiredString(record.pollster, "name", `${location}.pollster`);
    if (!isObject(record.methodology)) errors.push(`${location}.methodology is required.`);
    else {
      if (!Number.isInteger(record.methodology.sampleSize) || record.methodology.sampleSize <= 0) {
        errors.push(`${location}.methodology.sampleSize must be a positive integer.`);
      }
      requiredString(record.methodology, "population", `${location}.methodology`);
      requiredString(record.methodology, "mode", `${location}.methodology`);
      if (
        record.methodology.marginOfError != null &&
        (!Number.isFinite(record.methodology.marginOfError) ||
          record.methodology.marginOfError < 0 ||
          record.methodology.marginOfError > 100)
      ) {
        errors.push(`${location}.methodology.marginOfError must be between 0 and 100.`);
      }
    }
    requiredArray(record, "questions", location);
    const questionIds = new Set();
    for (const [questionIndex, question] of (record.questions ?? []).entries()) {
      const questionLocation = `${location}.questions[${questionIndex}]`;
      requiredString(question, "id", questionLocation);
      if (questionIds.has(question.id)) errors.push(`${questionLocation}.id is duplicated within the poll.`);
      questionIds.add(question.id);
      requiredString(question, "prompt", questionLocation);
      requiredArray(question, "responses", questionLocation);
      for (const [responseIndex, response] of (question.responses ?? []).entries()) {
        const responseLocation = `${questionLocation}.responses[${responseIndex}]`;
        requiredString(response, "id", responseLocation);
        requiredString(response, "label", responseLocation);
        if (
          response.percentage != null &&
          (!Number.isFinite(response.percentage) || response.percentage < 0 || response.percentage > 100)
        ) {
          errors.push(`${responseLocation}.percentage must be null or between 0 and 100.`);
        }
      }
    }
    if (record.primaryQuestionId && !questionIds.has(record.primaryQuestionId)) {
      errors.push(`${location}.primaryQuestionId does not match a question.`);
    }
  });
}

function validateForecasts() {
  data.forecasts.forEach((record, index) => {
    const location = `forecasts[${index}]`;
    for (const key of ["electionCycleId", "raceId", "title", "status", "rating", "confidenceLevel"]) {
      requiredString(record, key, location);
    }
    if (!isObject(record.model)) errors.push(`${location}.model is required.`);
    else {
      requiredString(record.model, "model", `${location}.model`);
      requiredString(record.model, "modelName", `${location}.model`);
      if (record.model.model === "fundamentals" || record.fundamentalsBased) {
        if (!isObject(record.model.fundamentals)) {
          errors.push(`${location}.model.fundamentals is required for fundamentals-based forecasts.`);
        } else if (!record.model.fundamentals.sourceUrls?.length) {
          errors.push(`${location}.model.fundamentals.sourceUrls must disclose at least one source.`);
        }
      }
    }
    requiredArray(record, "candidateProbabilities", location);
    let probabilityTotal = 0;
    for (const [candidateIndex, candidate] of (record.candidateProbabilities ?? []).entries()) {
      const candidateLocation = `${location}.candidateProbabilities[${candidateIndex}]`;
      requiredString(candidate, "candidateId", candidateLocation);
      requiredString(candidate, "party", candidateLocation);
      if (!isProbability(candidate.winProbability)) {
        errors.push(`${candidateLocation}.winProbability must be between 0 and 1.`);
      } else probabilityTotal += candidate.winProbability;
      for (const key of ["projectedVoteShare", "projectedVoteShareLow", "projectedVoteShareHigh", "pollingAverage"]) {
        if (candidate[key] != null && !isPercent(candidate[key])) {
          errors.push(`${candidateLocation}.${key} must be null or between 0 and 100.`);
        }
      }
    }
    if (record.candidateProbabilities?.length && Math.abs(probabilityTotal - 1) > 0.02) {
      errors.push(`${location} candidate win probabilities must total approximately 1.0 (found ${probabilityTotal}).`);
    }
    if (Array.isArray(record.snapshots)) {
      const days = new Set();
      for (const [snapshotIndex, snapshot] of record.snapshots.entries()) {
        const day = String(snapshot.capturedAt ?? "").slice(0, 10);
        if (days.has(day)) errors.push(`${location}.snapshots has more than one snapshot for ${day}.`);
        days.add(day);
      }
    }
  });
}

function validateResults() {
  data.results.forEach((record, index) => {
    const location = `results[${index}]`;
    for (const key of [
      "electionCycleId",
      "raceId",
      "electionDate",
      "status",
      "reportingStatus",
      "certificationStatus",
      "tabulationScope",
    ]) requiredString(record, key, location);
    if (!Number.isFinite(record.totalVotes) || record.totalVotes < 0) {
      errors.push(`${location}.totalVotes must be a non-negative number.`);
    }
    requiredArray(record, "candidateResults", location);
    if (record.certificationStatus !== "certified" && record.publicationStatus === "published") {
      if (!/unofficial/i.test(`${record.status} ${record.notes ?? ""}`)) {
        warnings.push(`${location} should visibly label results as unofficial until certified.`);
      }
    }
  });
}

function validateSourcesRegistry() {
  data.sources.forEach((record, index) => {
    const location = `sources[${index}]`;
    requiredString(record, "name", location);
    requiredHttps(record, "url", location);
    requiredString(record, "type", location);
    requiredString(record, "retrievedAt", location);
  });
}

function validateRelationships() {
  const cycles = ids(data.cycle);
  const races = ids(data.races);
  const candidates = ids(data.candidates);
  const candidateIdentity = new Map();

  data.races.forEach((race, index) => {
    if (!cycles.has(race.electionCycleId)) errors.push(`races[${index}] references unknown cycle ${race.electionCycleId}.`);
    for (const candidateId of race.candidateIds ?? []) {
      if (!candidates.has(candidateId)) errors.push(`races[${index}] references unknown candidate ${candidateId}.`);
    }
  });

  data.candidates.forEach((candidate, index) => {
    if (!cycles.has(candidate.electionCycleId)) errors.push(`candidates[${index}] references unknown cycle ${candidate.electionCycleId}.`);
    for (const raceId of candidate.raceIds ?? []) {
      if (!races.has(raceId)) errors.push(`candidates[${index}] references unknown race ${raceId}.`);
      const race = data.races.find((record) => record.id === raceId);
      if (race && !race.candidateIds?.includes(candidate.id)) {
        errors.push(`Candidate ${candidate.id} and race ${raceId} do not have reciprocal relationships.`);
      }
      const key = `${normalize(candidate.fullName)}|${normalize(candidate.party)}|${raceId}`;
      unique(candidateIdentity, key, `candidates[${index}]`, "candidate identity", candidate.fullName);
    }
  });

  data.polls.forEach((poll, index) => {
    if (!cycles.has(poll.electionCycleId)) errors.push(`polls[${index}] references unknown cycle ${poll.electionCycleId}.`);
    if (poll.raceId && !races.has(poll.raceId)) errors.push(`polls[${index}] references unknown race ${poll.raceId}.`);
    for (const question of poll.questions ?? []) {
      for (const response of question.responses ?? []) {
        if (response.candidateId && !candidates.has(response.candidateId)) {
          errors.push(`Poll ${poll.id} references unknown candidate ${response.candidateId}.`);
        }
      }
    }
  });

  for (const collection of ["forecasts", "results"]) {
    data[collection].forEach((record, index) => {
      if (!cycles.has(record.electionCycleId)) errors.push(`${collection}[${index}] references unknown cycle ${record.electionCycleId}.`);
      if (!races.has(record.raceId)) errors.push(`${collection}[${index}] references unknown race ${record.raceId}.`);
      const candidateRows = collection === "forecasts" ? record.candidateProbabilities : record.candidateResults;
      for (const candidate of candidateRows ?? []) {
        if (!candidates.has(candidate.candidateId)) {
          errors.push(`${collection}[${index}] references unknown candidate ${candidate.candidateId}.`);
        }
      }
    });
  }
}

function validateNoPersonLevelVoterData() {
  for (const [collection, records] of Object.entries(data)) {
    records.forEach((record, index) => {
      walk(record, `${collection}[${index}]`, (_value, key, currentPath) => {
        if (PROHIBITED_VOTER_KEYS.has(key)) {
          errors.push(`${currentPath} is prohibited person-level voter data.`);
        }
      });
    });
  }
}

function walk(value, currentPath, visit) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${currentPath}[${index}]`, visit));
    return;
  }
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${currentPath}.${key}`;
    visit(child, key, childPath);
    walk(child, childPath, visit);
  }
}

function unique(map, normalized, location, field, display) {
  const previous = map.get(normalized);
  if (previous) errors.push(`${location} duplicates ${field} from ${previous}: ${display}`);
  else map.set(normalized, location);
}

function ids(records) {
  return new Set(records.map((record) => record.id));
}

function requiredString(record, key, location) {
  if (typeof record?.[key] !== "string" || !record[key].trim()) errors.push(`${location}.${key} is required.`);
}

function requiredNumber(record, key, location) {
  if (!Number.isFinite(record?.[key])) errors.push(`${location}.${key} must be a number.`);
}

function requiredArray(record, key, location) {
  if (!Array.isArray(record?.[key])) errors.push(`${location}.${key} must be an array.`);
}

function requiredDate(record, key, location) {
  if (!isIsoDate(record?.[key])) errors.push(`${location}.${key} must be a valid ISO date.`);
}

function requiredHttps(record, key, location) {
  if (!isHttpsUrl(record?.[key])) errors.push(`${location}.${key} must be a valid HTTPS URL.`);
}

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isHttpsUrl(value) {
  try {
    return typeof value === "string" && new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (typeof value !== "string" || !value) return false;
  if (DATE_ONLY.test(value)) return !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  return !Number.isNaN(Date.parse(value));
}

function isProbability(value) {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function isPercent(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

function normalize(value) {
  return String(value ?? "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]/g, "");
}
