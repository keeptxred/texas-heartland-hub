import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const COLLECTIONS = ["cycle", "races", "candidates", "polls", "forecasts", "results"];
const errors = [];

const sources = JSON.parse(await readFile(path.join(DATA_DIR, "sources.json"), "utf8"));
const sourceIds = new Set();
const sourceUrls = new Map();
for (const [index, source] of sources.entries()) {
  if (!source?.id) errors.push(`sources[${index}] is missing id.`);
  else if (sourceIds.has(source.id)) errors.push(`Duplicate source ID: ${source.id}.`);
  else sourceIds.add(source.id);
  if (!source?.name) errors.push(`sources[${index}] is missing name.`);
  if (!isHttps(source?.sourceUrl)) errors.push(`sources[${index}] must have an HTTPS sourceUrl.`);
  if (!validDate(source?.retrievedAt)) errors.push(`sources[${index}] has an invalid retrievedAt.`);
  if (!validDate(source?.lastVerifiedAt)) errors.push(`sources[${index}] has an invalid lastVerifiedAt.`);
  if (isHttps(source?.sourceUrl)) {
    const previous = sourceUrls.get(source.sourceUrl);
    if (previous && previous !== source.id) {
      errors.push(`Source URL ${source.sourceUrl} is duplicated by ${previous} and ${source.id}.`);
    } else sourceUrls.set(source.sourceUrl, source.id);
  }
}

for (const collection of COLLECTIONS) {
  const records = JSON.parse(await readFile(path.join(DATA_DIR, `${collection}.json`), "utf8"));
  for (const [index, record] of records.entries()) {
    const source = record?.source;
    if (!source?.sourceName || !isHttps(source?.sourceUrl) || !validDate(source?.retrievedAt)) {
      errors.push(`${collection}[${index}] has incomplete primary source attribution.`);
      continue;
    }
    if (source.sourceId && !sourceIds.has(source.sourceId)) {
      errors.push(
        `${collection}[${index}] references ${source.sourceId}, which is missing from sources.json.`,
      );
    }
  }
}

if (errors.length) {
  console.error(`Election source validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Election source validation passed: ${sources.length} canonical source(s).`);

function isHttps(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}
