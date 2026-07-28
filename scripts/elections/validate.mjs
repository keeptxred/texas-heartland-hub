import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const FILES = ["cycle", "races", "candidates", "polls", "forecasts", "results", "sources"];
const errors = [];

async function load(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    const value = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(value)) throw new Error("top-level value must be an array");
    return value;
  } catch (error) {
    errors.push(`${name}.json: ${error.message}`);
    return [];
  }
}

function value(record, ...keys) {
  for (const key of keys) if (record?.[key] !== undefined) return record[key];
  return undefined;
}

function requireField(collection, record, index, ...keys) {
  const found = value(record, ...keys);
  if (found === undefined || found === null || found === "") {
    errors.push(`${collection}[${index}] is missing ${keys.join("/")}`);
  }
  return found;
}

function validateUnique(records, collection, field) {
  const seen = new Map();
  records.forEach((record, index) => {
    const current = value(record, field);
    if (current === undefined || current === null || current === "") return;
    const normalized = String(current).trim().toLowerCase();
    if (seen.has(normalized)) {
      errors.push(`${collection}[${index}] duplicates ${field} from ${collection}[${seen.get(normalized)}]: ${current}`);
    } else {
      seen.set(normalized, index);
    }
  });
}

function validateDates(collection, record, index) {
  for (const key of ["retrievedDate", "retrieved_date", "lastVerifiedDate", "last_verified_date", "timestamp", "created_at", "updated_at", "startDate", "start_date", "endDate", "end_date"]) {
    if (record[key] !== undefined && Number.isNaN(Date.parse(record[key]))) {
      errors.push(`${collection}[${index}].${key} is not a valid date: ${record[key]}`);
    }
  }
}

function validateSources(collection, record, index) {
  const publicationStatus = String(value(record, "publicationStatus", "publication_status") ?? "published").toLowerCase();
  if (["draft", "unpublished", "private"].includes(publicationStatus)) {
    errors.push(`${collection}[${index}] is not publishable (${publicationStatus})`);
  }

  const sourceUrls = [
    value(record, "sourceUrl", "source_url"),
    ...(Array.isArray(record.sourceUrls) ? record.sourceUrls : []),
    ...(Array.isArray(record.source_urls) ? record.source_urls : []),
  ].filter(Boolean);
  for (const url of sourceUrls) {
    if (!String(url).startsWith("https://")) errors.push(`${collection}[${index}] source URL must use HTTPS: ${url}`);
  }
}

const data = Object.fromEntries(await Promise.all(FILES.map(async (name) => [name, await load(name)])));

for (const [collection, records] of Object.entries(data)) {
  validateUnique(records, collection, "id");
  validateUnique(records, collection, "slug");
  records.forEach((record, index) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(`${collection}[${index}] must be an object`);
      return;
    }
    requireField(collection, record, index, "id");
    if (collection !== "sources") requireField(collection, record, index, "slug");
    validateDates(collection, record, index);
    validateSources(collection, record, index);

    const serialized = JSON.stringify(record).toLowerCase();
    for (const forbidden of ["voter_name", "voter_address", "date_of_birth", "driver_license", "ssn"]) {
      if (serialized.includes(forbidden)) errors.push(`${collection}[${index}] contains prohibited person-level voter data key: ${forbidden}`);
    }
  });
}

const raceIds = new Set(data.races.map((record) => value(record, "id")));
const candidateIds = new Set(data.candidates.map((record) => value(record, "id")));

const candidateIdentity = new Map();
data.candidates.forEach((record, index) => {
  const raceId = requireField("candidates", record, index, "raceId", "race_id");
  if (raceId && !raceIds.has(raceId)) errors.push(`candidates[${index}] references unknown race ${raceId}`);
  const key = `${String(raceId).toLowerCase()}|${String(value(record, "name", "fullName", "full_name") ?? "").trim().toLowerCase()}|${String(value(record, "party") ?? "").trim().toLowerCase()}`;
  if (candidateIdentity.has(key)) errors.push(`candidates[${index}] duplicates candidate identity from candidates[${candidateIdentity.get(key)}]`);
  else candidateIdentity.set(key, index);
});

for (const collection of ["polls", "forecasts", "results"]) {
  data[collection].forEach((record, index) => {
    const raceId = requireField(collection, record, index, "raceId", "race_id");
    if (raceId && !raceIds.has(raceId)) errors.push(`${collection}[${index}] references unknown race ${raceId}`);
  });
}

data.polls.forEach((record, index) => {
  const start = value(record, "startDate", "start_date", "fieldworkStart", "fieldwork_start");
  const end = value(record, "endDate", "end_date", "fieldworkEnd", "fieldwork_end");
  if (start && end && Date.parse(start) > Date.parse(end)) errors.push(`polls[${index}] start date is after end date`);
  const sampleSize = value(record, "sampleSize", "sample_size");
  if (sampleSize !== undefined && (!Number.isInteger(sampleSize) || sampleSize <= 0)) errors.push(`polls[${index}] sample size must be a positive integer`);
  const responses = value(record, "responses", "candidateResults", "candidate_results");
  if (Array.isArray(responses)) {
    responses.forEach((response, responseIndex) => {
      const candidateId = value(response, "candidateId", "candidate_id");
      const percentage = Number(value(response, "percentage", "pct", "share"));
      if (candidateId && !candidateIds.has(candidateId)) errors.push(`polls[${index}].responses[${responseIndex}] references unknown candidate ${candidateId}`);
      if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) errors.push(`polls[${index}].responses[${responseIndex}] percentage must be between 0 and 100`);
    });
  }
});

data.forecasts.forEach((record, index) => {
  for (const [key, raw] of Object.entries(record)) {
    if (!/probability/i.test(key)) continue;
    const probability = Number(raw);
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) errors.push(`forecasts[${index}].${key} must be between 0 and 1`);
  }
  if (value(record, "fundamentalsBased", "fundamentals_based")) {
    const sources = value(record, "sourceIds", "source_ids", "sources");
    if (!Array.isArray(sources) || sources.length === 0) errors.push(`forecasts[${index}] is fundamentals-based but has no sources`);
  }
});

if (errors.length) {
  console.error(`Election data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Election data validation passed (${FILES.map((name) => `${data[name].length} ${name}`).join(", ")}).`);
