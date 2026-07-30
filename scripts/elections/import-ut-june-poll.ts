import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const SOURCE_ID = "source-ut-texas-politics-project-june-2026";
const SOURCE_NAME = "University of Texas/Texas Politics Project Poll";
const SOURCE_URL =
  "https://texaspolitics.utexas.edu/blog/june-poll-finds-a-competitive-u-s-senate-race-in-texas-amid-continuing-economic-concerns-data-center-backlash";
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();
const publishedAt = "2026-06-22T12:00:00.000Z";

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
    slug: "ut-texas-politics-project-june-2026-us-senate",
    title: "June 2026 Texas U.S. Senate trial ballot",
    toplineUrl: "https://texaspolitics.utexas.edu/set/u-s-senate-trial-ballot-june-2026",
    prompt:
      "If the 2026 U.S. senate election in Texas were held today, and the candidates were the Republican Ken Paxton, the Democrat James Talarico, and the Libertarian Ted Brown, who would you vote for, or haven’t you thought enough about it to have an opinion?",
    requiredCandidates: ["Ken Paxton", "James Talarico"],
    responses: [
      ["Ken Paxton", "republican", 43],
      ["James Talarico", "democratic", 42],
      ["Ted Brown", "libertarian", 3],
      ["Someone else", null, 2],
      ["No opinion", null, 10],
    ],
  },
  {
    raceId: "race-2026-governor",
    slug: "ut-texas-politics-project-june-2026-governor",
    title: "June 2026 Texas gubernatorial trial ballot",
    toplineUrl: "https://texaspolitics.utexas.edu/set/gubernatorial-trial-ballot-june-2026",
    prompt:
      "If the 2026 election for Governor were held today, and the candidates were Greg Abbott and Gina Hinojosa, who would you vote for, or haven’t you thought enough about it to have an opinion?",
    requiredCandidates: ["Greg Abbott", "Gina Hinojosa"],
    responses: [
      ["Greg Abbott", "republican", 47],
      ["Gina Hinojosa", "democratic", 40],
      ["Pat Dixon", "libertarian", 1],
      ["Someone else", null, 2],
      ["No opinion", null, 10],
    ],
  },
  {
    raceId: "race-2026-lieutenant-governor",
    slug: "ut-texas-politics-project-june-2026-lieutenant-governor",
    title: "June 2026 Texas lieutenant governor trial ballot",
    toplineUrl:
      "https://texaspolitics.utexas.edu/set/lieutenant-governor-trial-ballot-june-2026",
    prompt:
      "If the 2026 election for Lieutenant Governor were held today, and the candidates were Dan Patrick and Vikki Goodwin, who would you vote for, or haven’t you thought enough about it to have an opinion?",
    requiredCandidates: ["Dan Patrick", "Vikki Goodwin"],
    responses: [
      ["Dan Patrick", "republican", 43],
      ["Vikki Goodwin", "democratic", 36],
      ["Anthony Cristo", "libertarian", 2],
      ["Kevin McCormick", "green", 1],
      ["Someone else", null, 3],
      ["No opinion", null, 16],
    ],
  },
  {
    raceId: "race-2026-attorney-general",
    slug: "ut-texas-politics-project-june-2026-attorney-general",
    title: "June 2026 Texas attorney general trial ballot",
    toplineUrl: "https://texaspolitics.utexas.edu/set/attorney-general-trial-ballot-june-2026",
    prompt:
      "If the 2026 election for Attorney General were held today, and the candidates were Mayes Middleton and Nathan Johnson, who would you vote for, or haven’t you thought enough about it to have an opinion?",
    requiredCandidates: ["Mayes Middleton", "Nathan Johnson"],
    responses: [
      ["Mayes Middleton", "republican", 41],
      ["Nathan Johnson", "democratic", 36],
      ["Tom Oxford", "libertarian", 2],
      ["Someone else", null, 4],
      ["No opinion", null, 18],
    ],
  },
  {
    raceId: "race-2026-comptroller",
    slug: "ut-texas-politics-project-june-2026-comptroller",
    title: "June 2026 Texas comptroller trial ballot",
    toplineUrl:
      "https://texaspolitics.utexas.edu/set/comptroller-trial-ballot-june-2026",
    prompt:
      "If the 2026 election for Comptroller were held today, and the candidates were Don Huffines and Sarah Eckhardt, who would you vote for, or haven’t you thought enough about it to have an opinion?",
    requiredCandidates: ["Don Huffines", "Sarah Eckhardt"],
    responses: [
      ["Don Huffines", "republican", 40],
      ["Sarah Eckhardt", "democratic", 34],
      ["Shehla Faizi", "green", 1],
      ["Alonzo Echavarria-Garza", "libertarian", 1],
      ["Someone else", null, 2],
      ["No opinion", null, 21],
    ],
  },
] as const;

const generated = [];
for (const definition of definitions) {
  const candidateMatches = new Map(
    definition.requiredCandidates.map((name) => [
      name,
      findCandidate(publicCandidates, name, definition.raceId),
    ]),
  );
  if ([...candidateMatches.values()].some((candidate) => !candidate)) {
    const missing = [...candidateMatches]
      .filter(([, candidate]) => !candidate)
      .map(([name]) => name)
      .join(", ");
    console.warn(`Skipping ${definition.raceId}: verified candidate records are missing for ${missing}.`);
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
      isUndecided: /no opinion|not sure|undecided/i.test(label),
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
      slug: "ut-texas-politics-project",
      websiteUrl: "https://texaspolitics.utexas.edu/polling",
      grade: "unrated",
      transparencyScore: null,
      methodologyUrl: SOURCE_URL,
    },
    sponsors: [
      {
        name: "The University of Texas at Austin",
        type: "academic",
        websiteUrl: "https://www.utexas.edu/",
        partisanAffiliation: null,
        notes: null,
      },
    ],
    fieldStartDate: "2026-06-05",
    fieldEndDate: "2026-06-12",
    releaseDate: "2026-06-22",
    revisedAt: null,
    methodology: {
      population: "registered_voters",
      sampleSize: 1200,
      marginOfError: 2.83,
      confidenceLevel: null,
      mode: "online_panel",
      languages: [],
      weightingDescription:
        "Texas Politics Project reported a weighting-adjusted margin of error of ±3.47 percentage points.",
      samplingDescription:
        "Survey of 1,200 self-reported registered Texas voters conducted online by YouGov.",
      likelyVoterModelDescription: null,
      questionOrderRandomized: null,
      includesCellPhones: null,
      responseRate: null,
      methodologyUrl: SOURCE_URL,
    },
    questions: [
      {
        id: questionId,
        type: "multi_candidate",
        prompt: definition.prompt,
        order: 1,
        sampleSize: 1200,
        population: "registered_voters",
        responses,
        notes: "Percentages may total 99–101 because the source reports rounded whole numbers.",
      },
    ],
    primaryQuestionId: questionId,
    toplineUrl: definition.toplineUrl,
    questionnaireUrl: SOURCE_URL,
    crosstabsUrl: SOURCE_URL,
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
      "Topline values, field dates, sample size, population, methodology, and margin of error are published by the original pollster.",
    publicationStatus: "published",
    publishedAt,
    unpublishedAt: null,
    scheduledFor: null,
    publishedBy: "Election poll import pipeline",
    dataAsOf: "2026-06-12T23:59:59.000Z",
    lastCheckedAt: timestamp,
    staleAfter: "2026-08-12T00:00:00.000Z",
    expiresAt: "2026-11-04T12:00:00.000Z",
    freshnessStatus: "aging",
    source: {
      sourceId: SOURCE_ID,
      sourceName: SOURCE_NAME,
      sourceType: "academic",
      sourceUrl: SOURCE_URL,
      sourceRecordId: definition.slug,
      retrievedAt: timestamp,
      attributionText: "University of Texas/Texas Politics Project Poll, June 2026",
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
  sourceType: "academic",
  sourceUrl: SOURCE_URL,
  retrievedAt: timestamp,
  lastVerifiedAt: timestamp,
  notes:
    "Original June 2026 poll release, toplines, field dates, sample size, population, methodology, and margin of error.",
};
const outputSources = [
  ...existingSources.filter((source) => source.id !== SOURCE_ID),
  sourceRecord,
].sort((left, right) => String(left.id).localeCompare(String(right.id)));

await Promise.all([
  writeFile(path.join(DATA_DIR, "polls.json"), `${JSON.stringify(outputPolls, null, 2)}\n`),
  writeFile(path.join(DATA_DIR, "sources.json"), `${JSON.stringify(outputSources, null, 2)}\n`),
]);
console.log(`Imported ${generated.length} verified June UT/Texas Politics Project race poll(s).`);

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
