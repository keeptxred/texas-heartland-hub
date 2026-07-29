import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runForecastModel } from "../../src/lib/elections/forecastEngine.ts";
import { calculatePollWeight } from "../../src/lib/elections/pollingAverage.ts";
import type { ElectionPollSummary } from "../../src/types/elections/pollProjections.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const METHOD_URL = "https://keeptxred.com/elections/methodology";
const MODEL_SOURCE_ID = "ktr-forecast-model";
const now = process.env.ELECTION_FORECAST_AS_OF ? new Date(process.env.ELECTION_FORECAST_AS_OF) : new Date();
if (Number.isNaN(now.getTime())) throw new Error("ELECTION_FORECAST_AS_OF is not a valid date.");
const timestamp = now.toISOString();

const [races, candidates, polls] = await Promise.all([
  readJson("races.json"),
  readJson("candidates.json"),
  readJson("polls.json"),
]);

const generatedByRace = new Map();
const skipped = [];
const skip = (race, reason) => skipped.push({ raceId: race.id, raceName: race.name, reason });

for (const race of races) {
  if (!isPublicVerified(race)) { skip(race, "race is not published and verified"); continue; }

  const raceCandidates = candidates.filter((candidate) => Array.isArray(candidate.raceIds) && candidate.raceIds.includes(race.id) && isPublicVerified(candidate));
  const republican = raceCandidates.find((candidate) => candidate.party === "republican");
  const democratic = raceCandidates.find((candidate) => candidate.party === "democratic");
  if (!republican || !democratic) { skip(race, "missing verified republican or democratic candidate"); continue; }

  const racePolls = polls.filter((poll) => poll.raceId === race.id && isPublishedVerifiedPoll(poll) && ["published", "revised", "completed"].includes(poll.status));
  if (!racePolls.length) { skip(race, "no eligible verified polls"); continue; }

  const pollingAverages = calculateCandidatePollingAverages(racePolls, now);
  if (pollingAverages.get(republican.id) == null || pollingAverages.get(democratic.id) == null) {
    skip(race, "missing polling average for one or both major-party candidates");
    continue;
  }

  const sourceUrls = racePolls.flatMap((poll) => [poll.source?.sourceUrl, ...(poll.sources ?? []).map((source) => source.url)]).filter(Boolean);
  if (!sourceUrls.length) { skip(race, "no source URLs"); continue; }

  const result = runForecastModel({
    raceId: race.id,
    asOf: timestamp,
    candidates: [republican, democratic].map((candidate) => ({ candidateId: candidate.id, party: candidate.party, pollingAverage: pollingAverages.get(candidate.id) ?? null, incumbencyAdjustment: 0, fundraisingAdjustment: 0, candidateQualityAdjustment: 0 })),
    previousElectionMargin: null,
    districtPartisanLean: null,
    electionEnvironment: 0,
    sourceUrls,
    previousWinProbabilities: {},
  });

  generatedByRace.set(race.id, {
    id: `forecast-${race.id}`,
    slug: `${race.slug}-forecast`,
    electionCycleId: race.electionCycleId,
    raceId: race.id,
    title: `${race.name} forecast`,
    status: "active",
    rating: result.rating,
    confidenceLevel: result.confidenceLevel,
    candidateProbabilities: result.candidateProbabilities,
    projectedMargin: result.expectedMargin,
    projectedWinnerCandidateId: result.projectedWinnerCandidateId,
    updatedAt: timestamp,
    createdAt: timestamp,
    publishedAt: timestamp,
    verificationStatus: "verified",
    publicationStatus: "published",
    dataAsOf: timestamp,
    source: { sourceId: MODEL_SOURCE_ID, sourceName: "Keep TX Red Election Forecast Model", sourceType: "forecast_provider", sourceUrl: METHOD_URL },
  });
}

await writeFile(path.join(DATA_DIR, "forecasts.json"), `${JSON.stringify([...generatedByRace.values()], null, 2)}\n`);
await writeFile(path.join(DATA_DIR, "forecast-diagnostics.json"), `${JSON.stringify({ generated: generatedByRace.size, skipped }, null, 2)}\n`);
console.log(`Updated ${generatedByRace.size} forecast(s)`);
if (skipped.length) console.log(`Skipped ${skipped.length} race(s): ${JSON.stringify(skipped)}`);

async function readJson(filename) { return JSON.parse(await readFile(path.join(DATA_DIR, filename), "utf8")); }
function isPublicVerified(record) { return record.publicationStatus === "published" && record.verificationStatus === "verified"; }
function isPublishedVerifiedPoll(poll) { return (poll.publicationStatus === "published" && poll.verificationStatus === "verified") || (poll.status === "published" && poll.verificationStatus === "verified"); }
function calculateCandidatePollingAverages(racePolls, asOf) { const totals = new Map(); for (const poll of racePolls) { const question = poll.questions?.find((item) => item.id === poll.primaryQuestionId) ?? poll.questions?.[0]; if (!question) continue; const weight = calculatePollWeight({ id: poll.id, pollsterName: poll.pollster?.name ?? "Unknown", pollsterGrade: poll.pollster?.grade ?? "unrated", fieldEndDate: poll.fieldEndDate, methodology: poll.methodology, internalPoll: Boolean(poll.internalPoll), partisanPoll: Boolean(poll.partisanPoll) } as ElectionPollSummary, asOf).finalWeight; for (const response of question.responses ?? []) { if (!response.candidateId || response.percentage == null) continue; const current = totals.get(response.candidateId) ?? { total: 0, weight: 0 }; current.total += response.percentage * weight; current.weight += weight; totals.set(response.candidateId, current); } } return new Map([...totals.entries()].filter(([, value]) => value.weight > 0).map(([id, value]) => [id, Math.round((value.total / value.weight) * 10) / 10])); }
