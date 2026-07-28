import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const errors = [];
const warnings = [];
const now = new Date();
const checkLinks = process.env.ELECTION_QA_CHECK_LINKS === "true";

const [cycles, races, candidates, polls, forecasts, results] = await Promise.all(
  ["cycle", "races", "candidates", "polls", "forecasts", "results"].map(async (name) =>
    JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")),
  ),
);
const publicRecords = (records) =>
  records.filter(
    (record) => record.publicationStatus === "published" && record.verificationStatus === "verified",
  );
const publicRaces = publicRecords(races);
const publicCandidates = publicRecords(candidates);
const publicPolls = publicRecords(polls);
const publicForecasts = publicRecords(forecasts);
const publicResults = publicRecords(results);

check(cycles.length === 1, `Expected one 2026 cycle; found ${cycles.length}.`);
check(publicRaces.length === 227, `Expected 227 launch-scope races; found ${publicRaces.length}.`);
check(countByPrefix("race-2026-us-house-") === 38, "U.S. House coverage must include all 38 districts.");
check(countByPrefix("race-2026-texas-house-") === 150, "Texas House coverage must include all 150 districts.");
check(countByPrefix("race-2026-texas-senate-") === 16, "Texas Senate coverage must include the 16 seats up in 2026.");
check(countByPrefix("race-2026-state-board-of-education-") === 8, "State Board of Education coverage must include eight seats.");
check(publicRaces.some((race) => race.id === "race-2026-us-senate"), "U.S. Senate race is missing.");

const routePaths = new Set([
  "/elections/2026",
  "/elections/races",
  "/elections/candidates",
  "/elections/polls",
  "/elections/forecast",
  "/elections/results",
  "/elections/voting",
  "/elections/methodology",
]);
for (const race of publicRaces) routePaths.add(`/elections/races/${race.slug}`);
for (const candidate of publicCandidates) routePaths.add(`/elections/candidates/${candidate.slug}`);
for (const poll of publicPolls) routePaths.add(`/elections/polls/${poll.slug}`);
for (const forecast of publicForecasts) routePaths.add(`/elections/forecast/${forecast.slug}`);
for (const result of publicResults) routePaths.add(`/elections/results/${result.slug}`);
for (const route of routePaths) {
  if (/\s|\/undefined|\/null/.test(route)) errors.push(`Invalid generated route: ${route}`);
}

const candidateIdentity = new Set();
for (const candidate of publicCandidates) {
  for (const raceId of candidate.raceIds ?? []) {
    const key = `${normalize(candidate.fullName)}|${candidate.party}|${raceId}`;
    if (candidateIdentity.has(key)) errors.push(`Duplicate public candidate identity: ${candidate.fullName} in ${raceId}.`);
    candidateIdentity.add(key);
  }
}

for (const race of publicRaces) {
  for (const candidateId of race.candidateIds ?? []) {
    const candidate = publicCandidates.find((item) => item.id === candidateId);
    check(Boolean(candidate), `Race ${race.id} references unavailable public candidate ${candidateId}.`);
    check(candidate?.raceIds?.includes(race.id), `Race/candidate relationship is not reciprocal for ${race.id}/${candidateId}.`);
  }
  freshness(race, `Race ${race.id}`);
}
for (const candidate of publicCandidates) freshness(candidate, `Candidate ${candidate.id}`);
for (const poll of publicPolls) {
  freshness(poll, `Poll ${poll.id}`);
  check(poll.questions?.length > 0, `Poll ${poll.id} has no questions.`);
  check(
    poll.questions?.some((question) => question.id === poll.primaryQuestionId),
    `Poll ${poll.id} has no matching primary question.`,
  );
}
for (const forecast of publicForecasts) {
  freshness(forecast, `Forecast ${forecast.id}`);
  check(forecast.candidateProbabilities?.length >= 2, `Forecast ${forecast.id} needs at least two candidates.`);
  const sum = (forecast.candidateProbabilities ?? []).reduce(
    (total, candidate) => total + Number(candidate.winProbability ?? 0),
    0,
  );
  check(Math.abs(sum - 1) <= 0.02, `Forecast ${forecast.id} probabilities total ${sum}, not approximately 1.0.`);
  if (forecast.fundamentalsBased) {
    check(
      forecast.model?.fundamentals?.sourceUrls?.length > 0,
      `Fundamentals forecast ${forecast.id} has no source list.`,
    );
  }
}
for (const result of publicResults) {
  freshness(result, `Result ${result.id}`);
  if (result.certificationStatus !== "certified") {
    check(
      /unofficial/i.test(`${result.status} ${result.notes ?? ""}`),
      `Uncertified result ${result.id} is not clearly labeled unofficial.`,
    );
  }
}

if (publicCandidates.length === 0) warnings.push("Candidate directory is not launch-ready: no verified candidates are published.");
if (publicPolls.length === 0) warnings.push("No public polls are loaded; honest empty states are required at launch.");
if (publicForecasts.length === 0) warnings.push("No forecasts are generated because no race has complete sourced model inputs.");
if (publicResults.length > 0) warnings.push("Results data exists before Election Day; confirm all records are explicitly unofficial.");

if (checkLinks) {
  const urls = new Set();
  for (const record of [...publicRaces, ...publicCandidates, ...publicPolls, ...publicForecasts, ...publicResults]) {
    collectUrls(record, urls);
  }
  for (const url of urls) {
    const response = await fetchWithTimeout(url, 10_000);
    if (!response) {
      errors.push(`External source timed out or could not be reached: ${url}.`);
      continue;
    }
    if ([401, 403, 429].includes(response.status)) {
      warnings.push(`External source is reachable but access-controlled or rate-limited: ${url} (${response.status}).`);
    } else if ([404, 410].includes(response.status) || response.status >= 500) {
      errors.push(`Broken external source: ${url} (${response.status}).`);
    } else if (response.status >= 400) {
      warnings.push(`External source returned ${response.status} and needs editorial review: ${url}.`);
    }
  }
}

for (const warning of warnings) console.warn(`QA warning: ${warning}`);
if (errors.length) {
  console.error(`Election launch QA failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(
  `Election launch QA passed: ${publicRaces.length} races, ${publicCandidates.length} candidates, ${publicPolls.length} polls, ${publicForecasts.length} forecasts, ${publicResults.length} results, ${routePaths.size} generated routes.`,
);

function countByPrefix(prefix) {
  return publicRaces.filter((race) => race.id.startsWith(prefix)).length;
}

function freshness(record, label) {
  const checked = new Date(record.lastCheckedAt ?? record.dataAsOf ?? record.updatedAt);
  if (Number.isNaN(checked.getTime())) {
    errors.push(`${label} has no valid freshness date.`);
    return;
  }
  const days = (now.getTime() - checked.getTime()) / 86_400_000;
  if (days > 60) errors.push(`${label} has not been checked in ${Math.floor(days)} days.`);
  else if (days > 30) warnings.push(`${label} has not been checked in ${Math.floor(days)} days.`);
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function collectUrls(value, urls) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectUrls(item, urls));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (/Url$/.test(key) && typeof child === "string" && child.startsWith("https://")) urls.add(child);
    else if (/Urls$/.test(key) && Array.isArray(child)) {
      child.filter((url) => typeof url === "string" && url.startsWith("https://")).forEach((url) => urls.add(url));
    } else collectUrls(child, urls);
  }
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "KeepTXRed Election Central QA" },
    });
    if (response.status === 405) {
      return fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "KeepTXRed Election Central QA" },
      });
    }
    return response;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
