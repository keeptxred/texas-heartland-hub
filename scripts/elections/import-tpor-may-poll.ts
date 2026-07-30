import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const SOURCE_ID = "source-tpor-may-2026-general-election";
const SOURCE_NAME = "Texas Public Opinion Research";
const SOURCE_URL =
  "https://texaspublicopinionresearch.substack.com/p/new-poll-james-talarico-leads-ken";
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();
const publishedAt = "2026-05-29T12:00:00.000Z";

const [candidates, existingPolls, existingSources] = await Promise.all([
  readJson("candidates.json"),
  readJson("polls.json"),
  readJson("sources.json"),
]);
const publicCandidates = candidates.filter(
  (candidate) =>
    candidate.publicationStatus === "published" && candidate.verificationStatus === "verified",
);

const definitions = [
  {
    raceId: "race-2026-us-senate",
    slug: "tpor-may-2026-us-senate",
    title: "May 2026 Texas U.S. Senate general-election poll",
    prompt: "If the 2026 general election for U.S. Senate were held today, who would you vote for?",
    requiredCandidates: ["Ken Paxton", "James Talarico"],
    responses: [
      ["James Talarico", "democratic", 47],
      ["Ken Paxton", "republican", 44],
      ["Undecided", null, 7],
    ],
  },
  {
    raceId: "race-2026-governor",
    slug: "tpor-may-2026-governor",
    title: "May 2026 Texas gubernatorial general-election poll",
    prompt: "If the 2026 general election for Governor were held today, who would you vote for?",
    requiredCandidates: ["Greg Abbott", "Gina Hinojosa"],
    responses: [
      ["Greg Abbott", "republican", 46],
      ["Gina Hinojosa", "democratic", 41],
      ["Undecided", null, 9],
    ],
  },
  {
    raceId: "race-2026-attorney-general",
    slug: "tpor-may-2026-attorney-general",
    title: "May 2026 Texas attorney general general-election poll",
    prompt:
      "If the 2026 general election for Attorney General were held today, who would you vote for?",
    requiredCandidates: ["Mayes Middleton", "Nathan Johnson"],
    responses: [
      ["Mayes Middleton", "republican", 44],
      ["Nathan Johnson", "democratic", 39],
      ["Undecided", null, 13],
    ],
  },
] as const;

const generated = [];
for (const definition of definitions) {
  const missing = definition.requiredCandidates.filter(
    (name) => !findCandidate(publicCandidates, name, definition.raceId),
  );
  if (missing.length) {
    console.warn(`Skipping ${definition.raceId}: verified candidate records are missing for ${missing.join(", ")}.`);
    continue;
  }

  const questionId = `${definition.slug}-question`;
  const maximum = Math.max(...definition.responses.map((response) => response[2]));
  const responses = definition.responses.map(([label, party, percentage], index) => {
    const candidate = findCandidate(publicCandidates, label, definition.raceId);
    return {
      id: `${questionId}-response-${index + 1}`,
      label,
      candidateId: candidate?.id ?? null,
      party,
      percentage,
      respondentCount: null,
      marginFromLeader: Math.round((maximum - percentage) * 10) / 10,
      isLeader: percentage === maximum,
      isUndecided: /undecided|not sure|no opinion/i.test(label),
      isOther: /someone else|other/i.test(label),
    };
  });

  generated.push({
    id: `poll-${definition.slug}`,
    slug: definition.slug,
    electionCycleId: "election-cycle-2026-texas-general",
    raceId: definition.raceId,
    jurisdictionId: "jurisdiction-texas",
    title: definition.title,
    status: "published",
    pollster: {
      name: SOURCE_NAME,
      slug: "texas-public-opinion-research",
      websiteUrl: "https://texaspublicopinionresearch.substack.com/",
      grade: "unrated",
      transparencyScore: null,
      methodologyUrl: SOURCE_URL,
    },
    sponsors: [
      {
        name: SOURCE_NAME,
        type: "pollster",
        websiteUrl: "https://texaspublicopinionresearch.substack.com/",
        partisanAffiliation: null,
        notes: "The publisher describes the project as nonpartisan.",
      },
    ],
    fieldStartDate: "2026-05-27",
    fieldEndDate: "2026-05-28",
    releaseDate: "2026-05-29",
    revisedAt: null,
    methodology: {
      population: "likely_voters",
      sampleSize: 1670,
      marginOfError: 2.8,
      confidenceLevel: null,
      mode: "unknown",
      languages: [],
      weightingDescription: null,
      samplingDescription:
        "Texas Public Opinion Research reported a survey of 1,670 likely Texas general-election voters.",
      likelyVoterModelDescription: null,
      questionOrderRandomized: null,
      includesCellPhones: null,
      responseRate: null,
      methodologyUrl: SOURCE_URL,
    },
    questions: [
      {
        id: questionId,
        type: "head_to_head",
        prompt: definition.prompt,
        order: 1,
        sampleSize: 1670,
        population: "likely_voters",
        responses,
        notes:
          "Only percentages explicitly published in the original release are included; unreported remainder categories are not inferred.",
      },
    ],
    primaryQuestionId: questionId,
    toplineUrl: SOURCE_URL,
    questionnaireUrl: SOURCE_URL,
    crosstabsUrl: null,
    archiveUrl: SOURCE_URL,
    internalPoll: false,
    partisanPoll: false,
    trackingPoll: false,
    supersededByPollId: null,
    notes: null,
    createdAt: publishedAt,
    updatedAt: timestamp,
    verificationStatus: "verified",
    verifiedAt: timestamp,
    verifiedBy: "Election poll import pipeline",
    verificationNotes:
      "Topline values, field dates, sample size, likely-voter population, and margin of error are published by the original pollster.",
    publicationStatus: "published",
    publishedAt,
    unpublishedAt: null,
    scheduledFor: null,
    publishedBy: "Election poll import pipeline",
    dataAsOf: "2026-05-28T23:59:59.000Z",
    lastCheckedAt: timestamp,
    staleAfter: "2026-07-28T00:00:00.000Z",
    expiresAt: "2026-11-04T12:00:00.000Z",
    freshnessStatus: "aging",
    source: {
      sourceId: SOURCE_ID,
      sourceName: SOURCE_NAME,
      sourceType: "pollster",
      sourceUrl: SOURCE_URL,
      sourceRecordId: definition.slug,
      retrievedAt: timestamp,
      attributionText: "Texas Public Opinion Research, May 2026 general-election poll",
    },
  });
}

const generatedIds = new Set(generated.map((poll) => poll.id));
const outputPolls = [
  ...existingPolls.filter((poll) => !generatedIds.has(poll.id)),
  ...generated,
].sort((left, right) => String(left.fieldEndDate).localeCompare(String(right.fieldEndDate)));
const sourceRecord = {
  id: SOURCE_ID,
  name: SOURCE_NAME,
  sourceType: "pollster",
  sourceUrl: SOURCE_URL,
  retrievedAt: timestamp,
  lastVerifiedAt: timestamp,
  notes:
    "Original May 2026 general-election poll release with toplines, field dates, sample size, likely-voter population, and margin of error.",
};
const outputSources = [
  ...existingSources.filter((source) => source.id !== SOURCE_ID),
  sourceRecord,
].sort((left, right) => String(left.id).localeCompare(String(right.id)));

await Promise.all([
  writeFile(path.join(DATA_DIR, "polls.json"), `${JSON.stringify(outputPolls, null, 2)}\n`),
  writeFile(path.join(DATA_DIR, "sources.json"), `${JSON.stringify(outputSources, null, 2)}\n`),
]);
console.log(`Imported ${generated.length} verified May TPOR race poll(s).`);

async function readJson(filename: string) {
  return JSON.parse(await readFile(path.join(DATA_DIR, filename), "utf8"));
}

function findCandidate(candidates: readonly Record<string, unknown>[], name: string, raceId: string) {
  const expected = normalize(name);
  return candidates.find(
    (candidate) =>
      normalize(candidate.fullName) === expected &&
      Array.isArray(candidate.raceIds) &&
      candidate.raceIds.includes(raceId),
  );
}

function normalize(value: unknown) {
  return String(value ?? "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]/g, "");
}
