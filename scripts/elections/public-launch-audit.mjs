import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const blockers = [];
const warnings = [];

const [races, candidates, polls, forecasts, pollingAverages] = await Promise.all(
  ["races", "candidates", "polls", "forecasts", "polling-averages"].map(async (name) =>
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
const candidateById = new Map(publicCandidates.map((candidate) => [candidate.id, candidate]));
const forecastRaceIds = new Set(publicForecasts.map((forecast) => forecast.raceId));

const competitiveRaceIds = publicRaces
  .filter((race) => !race.uncontested)
  .filter((race) => {
    const parties = new Set(
      (race.candidateIds ?? [])
        .map((candidateId) => candidateById.get(candidateId)?.party)
        .filter(Boolean),
    );
    return parties.has("republican") && parties.has("democratic");
  })
  .map((race) => race.id);

const pollingEligibleRaceIds = pollingAverages
  .filter((average) => {
    const parties = new Set(
      (average.candidates ?? [])
        .map((candidate) => candidateById.get(candidate.candidateId)?.party)
        .filter(Boolean),
    );
    return parties.has("republican") && parties.has("democratic");
  })
  .map((average) => average.raceId);

const missingCompetitiveForecasts = competitiveRaceIds.filter((raceId) => !forecastRaceIds.has(raceId));
const homepageTakeoverEnabled = readBoolean(
  process.env.VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE,
  false,
);

if (missingCompetitiveForecasts.length > 0) {
  warnings.push(
    `Forecast coverage is limited to ${publicForecasts.length}/${competitiveRaceIds.length} competitive major-party races. Public copy must say forecasts cover selected races.`,
  );
  if (homepageTakeoverEnabled) {
    blockers.push(
      `Homepage takeover cannot launch while ${missingCompetitiveForecasts.length} competitive races have no forecast unless the homepage explicitly labels forecast coverage as selected races.`,
    );
  }
}

const candidateRoute = await readFile(
  path.join(ROOT, "src/routes/elections.candidates.tsx"),
  "utf8",
);
const pageSizeMatch = candidateRoute.match(/CANDIDATE_DIRECTORY_PAGE_SIZE\s*=\s*([\d_]+)/);
const pageSize = pageSizeMatch ? Number(pageSizeMatch[1].replaceAll("_", "")) : 0;
if (pageSize < publicCandidates.length) {
  blockers.push(
    `Candidate directory loads at most ${pageSize || "an unknown number of"} candidates but ${publicCandidates.length} are published.`,
  );
}

const approvedCandidateImages = publicCandidates.filter(
  (candidate) =>
    candidate.imageRights?.usageStatus === "approved" &&
    typeof candidate.imageUrl === "string" &&
    candidate.imageUrl.trim().length > 0,
).length;
const missingCandidateImages = publicCandidates.length - approvedCandidateImages;
if (missingCandidateImages > 0) {
  warnings.push(
    `${missingCandidateImages}/${publicCandidates.length} published candidates do not have an approved image URL.`,
  );
}

try {
  await access(path.join(ROOT, "public/images/elections/election-central-social.jpg"));
} catch {
  blockers.push(
    "Default Election Central social image is missing from public/images/elections/election-central-social.jpg.",
  );
}

const electionSourceFiles = await collectFiles([
  path.join(ROOT, "src/routes"),
  path.join(ROOT, "src/pages/elections"),
  path.join(ROOT, "src/components/elections"),
  path.join(ROOT, "src/lib/elections"),
]);
const unfinishedPattern = /\b(TODO|FIXME|HACK|XXX)\b|\b(mock|demo|placeholder)\b/gi;
for (const file of electionSourceFiles) {
  const content = await readFile(file, "utf8");
  const matches = [...content.matchAll(unfinishedPattern)];
  if (matches.length > 0) {
    warnings.push(
      `${path.relative(ROOT, file)} contains ${matches.length} unfinished/mock/demo/placeholder marker(s).`,
    );
  }
}

const requiredRoutes = [
  "src/routes/elections.2026.tsx",
  "src/routes/elections.races.tsx",
  "src/routes/elections.candidates.tsx",
  "src/routes/elections.polls.tsx",
  "src/routes/elections.forecast.tsx",
  "src/routes/elections.results.tsx",
  "src/routes/elections.voting.tsx",
  "src/routes/elections.methodology.tsx",
  "src/routes/elections.corrections.tsx",
];
for (const relative of requiredRoutes) {
  try {
    await access(path.join(ROOT, relative));
  } catch {
    blockers.push(`Required public route file is missing: ${relative}.`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  ready: blockers.length === 0,
  homepageTakeoverEnabled,
  counts: {
    races: publicRaces.length,
    candidates: publicCandidates.length,
    polls: publicPolls.length,
    forecasts: publicForecasts.length,
    competitiveMajorPartyRaces: competitiveRaceIds.length,
    competitiveRacesForecasted: competitiveRaceIds.length - missingCompetitiveForecasts.length,
    pollingEligibleRaces: pollingEligibleRaceIds.length,
    approvedCandidateImages,
    missingCandidateImages,
    candidateDirectoryPageSize: pageSize,
  },
  blockers,
  warnings,
};

console.log(JSON.stringify(report, null, 2));
for (const warning of warnings) console.warn(`Public launch warning: ${warning}`);
if (blockers.length > 0) {
  for (const blocker of blockers) console.error(`Public launch blocker: ${blocker}`);
  process.exit(1);
}

async function collectFiles(directories) {
  const files = [];
  for (const directory of directories) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await collectFiles([target])));
      else if (/\.(?:ts|tsx|js|mjs)$/.test(entry.name)) files.push(target);
    }
  }
  return files;
}

function readBoolean(value, fallback) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) return false;
  return fallback;
}
