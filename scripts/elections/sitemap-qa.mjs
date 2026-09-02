import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const errors = [];

const [races, candidates, polls, forecasts, results] = await Promise.all(
  ["races", "candidates", "polls", "forecasts", "results"].map(async (name) =>
    JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")),
  ),
);

const staticPaths = [
  "/elections/2026",
  "/elections/races",
  "/elections/statewide",
  "/elections/legislative",
  "/elections/districts",
  "/elections/candidates",
  "/elections/polls",
  "/elections/forecast",
  "/elections/results",
  "/elections/methodology",
  "/elections/corrections",
  "/elections/voting",
  "/elections/voting/polling-hours",
  "/elections/voting/voter-registration-card",
  "/elections/voting/polling-place",
];
const expected = new Set(staticPaths);
addPublic(races, "/elections/races/");
addPublic(candidates, "/elections/candidates/");
addPublic(polls, "/elections/polls/");
addPublic(forecasts, "/elections/forecast/");
addPublic(results, "/elections/results/");
const districtCount = addDistrictPages(races);

if (expected.has("/elections")) errors.push("Legacy /elections redirect must not be indexed.");
if (!expected.has("/elections/2026")) errors.push("Canonical /elections/2026 route is missing.");

for (const route of expected) {
  if (!route.startsWith("/elections/")) errors.push(`Non-canonical election sitemap route: ${route}`);
  if (/\s|undefined|null|\/\//.test(route)) errors.push(`Invalid election sitemap route: ${route}`);
}

const dynamicCount =
  publicRecords(races).length +
  publicRecords(candidates).length +
  publicRecords(polls).length +
  publicRecords(forecasts).length +
  publicRecords(results).length;
const expectedCount = staticPaths.length + dynamicCount + districtCount;
if (expected.size !== expectedCount) {
  errors.push(`Election sitemap has duplicate paths: expected ${expectedCount}, found ${expected.size}.`);
}

if (errors.length) {
  console.error(`Election sitemap QA failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Election sitemap QA passed: ${expected.size} unique canonical URLs (${staticPaths.length} static, ${dynamicCount} record pages, ${districtCount} district pages).`,
);

function addDistrictPages(records) {
  let count = 0;
  for (const race of publicRecords(records)) {
    const number = Number(race.districtNumber);
    let slug = null;
    if (race.jurisdictionType === "congressional_district" && number >= 1 && number <= 38) {
      slug = `congressional-district-${number}`;
    } else if (race.jurisdictionType === "state_senate_district") {
      slug = `texas-senate-district-${number}`;
    } else if (race.jurisdictionType === "state_house_district" && number >= 1 && number <= 150) {
      slug = `texas-house-district-${number}`;
    }
    if (!slug) continue;
    expected.add(`/elections/districts/${slug}`);
    count += 1;
  }
  return count;
}

function addPublic(records, prefix) {
  for (const record of publicRecords(records)) {
    if (typeof record.slug !== "string" || !record.slug) {
      errors.push(`Published record under ${prefix} is missing a slug.`);
      continue;
    }
    expected.add(`${prefix}${record.slug}`);
  }
}

function publicRecords(records) {
  return records.filter(
    (record) => record.publicationStatus === "published" && record.verificationStatus === "verified",
  );
}
