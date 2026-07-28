import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_FILE = path.join(ROOT, "src/data/elections/2026/races.json");
const OFFICES_URL =
  "https://www.sos.texas.gov/elections/candidates/guide/2026/offices2026.shtml";
const CYCLE_ID = "election-cycle-2026-texas-general";
const ELECTION_DATE = "2026-11-03";
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();

const page = await fetch(OFFICES_URL, {
  headers: { "user-agent": "KeepTXRed Election Central data importer" },
});
if (!page.ok) throw new Error(`Texas SOS offices import failed: ${page.status} ${page.statusText}`);
const html = await page.text();
const officialPageText = normalizeHtmlText(html);
for (const expected of [
  /offices up for election in 2026/i,
  /united states representatives/i,
  /state representatives/i,
  /state senators/i,
  /state board of education/i,
  /supreme court/i,
  /court of criminal appeals/i,
]) {
  if (!expected.test(officialPageText)) {
    throw new Error(`Texas SOS offices page changed; expected office category not found: ${expected}`);
  }
}

const existing = JSON.parse(await readFile(DATA_FILE, "utf8"));
const existingById = new Map(existing.map((record) => [record.id, record]));
const races = buildCatalog().map((definition) => buildRace(definition, existingById.get(definition.id)));
if (races.length !== 227) {
  throw new Error(`Race catalog must contain 227 launch-scope records; generated ${races.length}.`);
}
await writeFile(DATA_FILE, `${JSON.stringify(races, null, 2)}\n`);
console.log(`Imported ${races.length} Texas 2026 races from the official offices-up-for-election scope.`);

function buildCatalog() {
  return [
    statewide("us-senate", "U.S. Senate", "federal", "legislative", 6, true),
    statewide("governor", "Governor", "state", "executive", 4, true),
    statewide("lieutenant-governor", "Lieutenant Governor", "state", "executive", 4, true),
    statewide("attorney-general", "Attorney General", "state", "executive", 4, true),
    statewide("comptroller", "Comptroller of Public Accounts", "state", "executive", 4, true),
    statewide("land-commissioner", "Commissioner of the General Land Office", "state", "executive", 4, true),
    statewide("agriculture-commissioner", "Commissioner of Agriculture", "state", "executive", 4, true),
    statewide("railroad-commissioner", "Railroad Commissioner", "state", "executive", 6, true),
    ...[1, 2, 7, 8].map((place) =>
      statewide(
        `texas-supreme-court-place-${place}`,
        place === 1
          ? "Texas Supreme Court Chief Justice, Place 1"
          : `Texas Supreme Court, Place ${place}`,
        "state",
        "judicial",
        6,
        false,
      ),
    ),
    ...[3, 4, 9].map((place) =>
      statewide(
        `court-of-criminal-appeals-place-${place}`,
        `Texas Court of Criminal Appeals, Place ${place}`,
        "state",
        "judicial",
        6,
        false,
      ),
    ),
    ...range(1, 38).map((district) =>
      districtRace({
        prefix: "us-house",
        officeName: "U.S. House",
        label: `U.S. House District ${district}`,
        district,
        officeLevel: "federal",
        raceType: "legislative",
        jurisdictionType: "congressional_district",
        termLengthYears: 2,
      }),
    ),
    ...[1, 2, 3, 4, 5, 9, 11, 13, 18, 19, 21, 22, 24, 26, 28, 31].map((district) =>
      districtRace({
        prefix: "texas-senate",
        officeName: "Texas Senate",
        label: `Texas Senate District ${district}`,
        district,
        officeLevel: "state",
        raceType: "legislative",
        jurisdictionType: "state_senate_district",
        termLengthYears: 4,
      }),
    ),
    ...range(1, 150).map((district) =>
      districtRace({
        prefix: "texas-house",
        officeName: "Texas House",
        label: `Texas House District ${district}`,
        district,
        officeLevel: "state",
        raceType: "legislative",
        jurisdictionType: "state_house_district",
        termLengthYears: 2,
      }),
    ),
    ...[2, 5, 6, 7, 8, 9, 13, 14].map((district) =>
      districtRace({
        prefix: "state-board-of-education",
        officeName: "State Board of Education",
        label: `State Board of Education District ${district}`,
        district,
        officeLevel: "state",
        raceType: "administrative",
        jurisdictionType: "state_board_of_education_district",
        termLengthYears: 4,
      }),
    ),
  ];
}

function statewide(slug, name, officeLevel, raceType, termLengthYears, featured) {
  return {
    id: `race-2026-${slug}`,
    slug: `2026-${slug}`,
    name: `2026 Texas ${name}`,
    shortName: name,
    officeId: `office-${slug}`,
    officeName: name,
    officeLevel,
    raceType,
    jurisdictionType: "statewide",
    districtId: null,
    districtName: null,
    districtNumber: null,
    termLengthYears,
    featured,
  };
}

function districtRace({
  prefix,
  officeName,
  label,
  district,
  officeLevel,
  raceType,
  jurisdictionType,
  termLengthYears,
}) {
  return {
    id: `race-2026-${prefix}-${district}`,
    slug: `2026-${prefix}-district-${district}`,
    name: `2026 ${label}`,
    shortName: label,
    officeId: `office-${prefix}`,
    officeName,
    officeLevel,
    raceType,
    jurisdictionType,
    districtId: `district-${prefix}-${district}`,
    districtName: `${officeName} District ${district}`,
    districtNumber: String(district),
    termLengthYears,
    featured: false,
  };
}

function buildRace(definition, previous) {
  const source = {
    sourceId: "tx-sos-offices-up-2026",
    sourceName: "Texas Secretary of State",
    sourceType: "official",
    sourceUrl: OFFICES_URL,
    sourceRecordId: definition.slug,
    retrievedAt: timestamp,
    attributionText: "Texas Secretary of State offices up for election in 2026",
  };
  return {
    id: definition.id,
    electionCycleId: CYCLE_ID,
    slug: definition.slug,
    name: definition.name,
    shortName: definition.shortName,
    description: previous?.description ?? null,
    officeId: definition.officeId,
    officeName: definition.officeName,
    officeLevel: definition.officeLevel,
    raceType: definition.raceType,
    electionType: "general",
    jurisdictionType: definition.jurisdictionType,
    partyScope: "partisan",
    districtId: definition.districtId,
    districtName: definition.districtName,
    districtNumber: definition.districtNumber,
    stateCode: "TX",
    countyIds: previous?.countyIds ?? [],
    electionDate: ELECTION_DATE,
    filingDeadline: null,
    registrationDeadline: "2026-10-05",
    earlyVotingStart: "2026-10-19",
    earlyVotingEnd: "2026-10-30",
    status: "general",
    rating: previous?.rating ?? "unrated",
    featured: previous?.featured ?? definition.featured,
    competitive: previous?.competitive ?? false,
    uncontested: previous?.uncontested ?? false,
    candidateIds: previous?.candidateIds ?? [],
    incumbentCandidateId: previous?.incumbentCandidateId ?? null,
    winnerCandidateId: previous?.winnerCandidateId ?? null,
    calledAt: previous?.calledAt ?? null,
    certifiedAt: previous?.certifiedAt ?? null,
    cancelledAt: previous?.cancelledAt ?? null,
    seatsAvailable: 1,
    termLengthYears: definition.termLengthYears,
    runoffRequired: false,
    notes: previous?.notes ?? null,
    createdAt: previous?.createdAt ?? timestamp,
    updatedAt: timestamp,
    verificationStatus: "verified",
    verifiedAt: timestamp,
    verifiedBy: "Texas SOS race import",
    verificationNotes:
      "Office scope verified against the Texas Secretary of State offices-up-for-election page.",
    publicationStatus: "published",
    publishedAt: previous?.publishedAt ?? timestamp,
    unpublishedAt: null,
    scheduledFor: null,
    publishedBy: previous?.publishedBy ?? "Texas SOS race import",
    dataAsOf: timestamp,
    lastCheckedAt: timestamp,
    staleAfter: addDays(new Date(timestamp), 45).toISOString(),
    expiresAt: "2026-11-04T12:00:00.000Z",
    freshnessStatus: "fresh",
    source,
    coverageLevel: "full_directory",
    counties: previous?.counties ?? [],
    zipCodes: previous?.zipCodes ?? [],
    officialCountyElectionLinks: previous?.officialCountyElectionLinks ?? [],
    officialSampleBallotLinks: previous?.officialSampleBallotLinks ?? [],
    forecastInputs: previous?.forecastInputs ?? { enabled: false },
  };
}

function normalizeHtmlText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86_400_000);
}
