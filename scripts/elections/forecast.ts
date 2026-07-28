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
const now = process.env.ELECTION_FORECAST_AS_OF
  ? new Date(process.env.ELECTION_FORECAST_AS_OF)
  : new Date();
if (Number.isNaN(now.getTime())) throw new Error("ELECTION_FORECAST_AS_OF is not a valid date.");
const timestamp = now.toISOString();

const [races, candidates, polls, existingForecasts] = await Promise.all([
  readJson("races.json"),
  readJson("candidates.json"),
  readJson("polls.json"),
  readJson("forecasts.json"),
]);

const generatedByRace = new Map();
for (const race of races) {
  if (!isPublicVerified(race)) {
    console.warn(`Skipping ${race.id}: race is not published and verified.`);
    continue;
  }

  const raceCandidates = candidates.filter(
    (candidate) =>
      Array.isArray(candidate.raceIds) &&
      candidate.raceIds.includes(race.id) &&
      isPublicVerified(candidate),
  );
  const republican = raceCandidates.find((candidate) => candidate.party === "republican");
  const democratic = raceCandidates.find((candidate) => candidate.party === "democratic");
  if (!republican || !democratic) {
    continue;
  }

  const racePolls = polls.filter(
    (poll) =>
      poll.raceId === race.id &&
      isPublicVerified(poll) &&
      ["published", "revised"].includes(poll.status),
  );
  const configuredInputs = race.forecastInputs;
  if (configuredInputs && !configuredInputs.enabled) continue;
  const pollingOnlyInputs =
    !configuredInputs && racePolls.length
      ? {
          enabled: true,
          previousElectionMargin: null,
          districtPartisanLean: null,
          electionEnvironment: 0,
          candidateAdjustments: {},
          sourceUrls: [],
        }
      : null;
  const inputs = configuredInputs?.enabled ? configuredInputs : pollingOnlyInputs;
  if (!inputs) continue;

  const pollingAverages = calculateCandidatePollingAverages(racePolls, now);
  if (
    pollingOnlyInputs &&
    (pollingAverages.get(republican.id) == null || pollingAverages.get(democratic.id) == null)
  ) {
    console.warn(`Skipping ${race.id}: polling-only forecast requires both major-party averages.`);
    continue;
  }

  const previous = existingForecasts
    .filter((forecast) => forecast.raceId === race.id && forecast.source?.sourceId === MODEL_SOURCE_ID)
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))[0];
  const previousProbabilities = Object.fromEntries(
    (previous?.candidateProbabilities ?? []).map((candidate) => [
      candidate.candidateId,
      candidate.winProbability,
    ]),
  );
  const adjustments = inputs.candidateAdjustments ?? {};
  const sourceUrls = [
    ...(Array.isArray(inputs.sourceUrls) ? inputs.sourceUrls : []),
    ...racePolls.map((poll) => poll.source?.sourceUrl).filter(Boolean),
  ];
  if (sourceUrls.length === 0) {
    console.warn(`Skipping ${race.id}: forecast inputs need at least one source URL.`);
    continue;
  }

  const result = runForecastModel({
    raceId: race.id,
    asOf: timestamp,
    candidates: [republican, democratic].map((candidate) => ({
      candidateId: candidate.id,
      party: candidate.party,
      pollingAverage: pollingAverages.get(candidate.id) ?? null,
      incumbencyAdjustment: number(adjustments[candidate.id]?.incumbency, 0),
      fundraisingAdjustment: number(adjustments[candidate.id]?.fundraising, 0),
      candidateQualityAdjustment: number(adjustments[candidate.id]?.candidateQuality, 0),
    })),
    previousElectionMargin: nullableNumber(inputs.previousElectionMargin),
    districtPartisanLean: nullableNumber(inputs.districtPartisanLean),
    electionEnvironment: number(inputs.electionEnvironment, 0),
    sourceUrls,
    previousWinProbabilities: previousProbabilities,
  });

  const snapshot = {
    forecastId: `forecast-${race.id}`,
    capturedAt: timestamp,
    status: "active",
    rating: result.rating,
    confidenceLevel: result.confidenceLevel,
    projectedWinnerCandidateId: result.projectedWinnerCandidateId,
    projectedMargin: result.expectedMargin,
    candidateSummaries: result.candidateProbabilities.map((candidate) => ({
      candidateId: candidate.candidateId,
      candidateSlug:
        raceCandidates.find((item) => item.id === candidate.candidateId)?.slug ?? candidate.candidateId,
      candidateName:
        raceCandidates.find((item) => item.id === candidate.candidateId)?.fullName ?? candidate.candidateId,
      party: candidate.party,
      imageUrl: raceCandidates.find((item) => item.id === candidate.candidateId)?.imageUrl ?? null,
      winProbability: candidate.winProbability,
      projectedVoteShare: candidate.projectedVoteShare,
      projectedVoteShareLow: candidate.projectedVoteShareLow,
      projectedVoteShareHigh: candidate.projectedVoteShareHigh,
      pollingAverage: candidate.pollingAverage,
      winProbabilityChange: candidate.winProbabilityChange,
    })),
  };
  const priorSnapshots = Array.isArray(previous?.snapshots) ? previous.snapshots : [];
  const day = timestamp.slice(0, 10);
  const snapshots = [
    ...priorSnapshots.filter((item) => String(item.capturedAt).slice(0, 10) !== day),
    snapshot,
  ].sort((left, right) => String(left.capturedAt).localeCompare(String(right.capturedAt)));
  const sourceIds = [
    MODEL_SOURCE_ID,
    ...racePolls.map((poll) => poll.source?.sourceId).filter(Boolean),
  ];

  generatedByRace.set(race.id, {
    id: `forecast-${race.id}`,
    slug: `${race.slug}-forecast`,
    electionCycleId: race.electionCycleId,
    raceId: race.id,
    title: `${race.name} forecast`,
    status: "active",
    rating: result.rating,
    confidenceLevel: result.confidenceLevel,
    model: {
      model: result.model,
      modelName: "Keep TX Red 2026 Election Forecast",
      modelVersion: result.modelVersion,
      methodologyUrl: METHOD_URL,
      simulationCount: null,
      lastModelRunAt: timestamp,
      fundamentals: {
        previousElectionMargin: nullableNumber(inputs.previousElectionMargin),
        districtPartisanLean: nullableNumber(inputs.districtPartisanLean),
        incumbencyAdjustment:
          number(adjustments[republican.id]?.incumbency, 0) -
          number(adjustments[democratic.id]?.incumbency, 0),
        fundraisingAdvantage:
          number(adjustments[republican.id]?.fundraising, 0) -
          number(adjustments[democratic.id]?.fundraising, 0),
        candidateQualityAdjustment:
          number(adjustments[republican.id]?.candidateQuality, 0) -
          number(adjustments[democratic.id]?.candidateQuality, 0),
        dataAsOf: timestamp,
        sourceUrls: result.sourceUrls,
      },
    },
    candidateProbabilities: result.candidateProbabilities,
    projectedMargin: result.expectedMargin,
    projectedWinnerCandidateId: result.projectedWinnerCandidateId,
    publishedAt: previous?.publishedAt ?? timestamp,
    finalizedAt: null,
    notes:
      result.model === "polling"
        ? "Polling-only forecast using the weighted public polling average; no fundamentals adjustments were applied."
        : result.model === "fundamentals"
          ? "Fundamentals-based forecast; no credible public polling average was available."
          : "Hybrid forecast using weighted public polling and disclosed fundamentals.",
    createdAt: previous?.createdAt ?? timestamp,
    updatedAt: timestamp,
    verificationStatus: "verified",
    verifiedAt: timestamp,
    verifiedBy: "GitHub Actions election forecast workflow",
    verificationNotes: null,
    publicationStatus: "published",
    unpublishedAt: null,
    scheduledFor: null,
    publishedBy: "GitHub Actions election forecast workflow",
    dataAsOf: timestamp,
    lastCheckedAt: timestamp,
    staleAfter: addDays(now, 2).toISOString(),
    expiresAt: addDays(now, 7).toISOString(),
    freshnessStatus: "fresh",
    source: {
      sourceId: MODEL_SOURCE_ID,
      sourceName: "Keep TX Red Election Forecast Model",
      sourceType: "forecast_provider",
      sourceUrl: METHOD_URL,
      sourceRecordId: race.id,
      retrievedAt: timestamp,
      attributionText: "Keep TX Red deterministic election model",
    },
    fundamentalsBased: result.fundamentalsBased,
    sourceIds: [...new Set(sourceIds)],
    snapshots,
  });
}

const output = [
  ...existingForecasts.filter(
    (forecast) => forecast.source?.sourceId !== MODEL_SOURCE_ID || !generatedByRace.has(forecast.raceId),
  ),
  ...generatedByRace.values(),
].sort((left, right) => String(left.raceId).localeCompare(String(right.raceId)));
await writeFile(path.join(DATA_DIR, "forecasts.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Updated ${generatedByRace.size} forecast(s); preserved ${output.length - generatedByRace.size} external or inactive record(s).`,
);

async function readJson(filename) {
  return JSON.parse(await readFile(path.join(DATA_DIR, filename), "utf8"));
}

function isPublicVerified(record) {
  return record.publicationStatus === "published" && record.verificationStatus === "verified";
}

function calculateCandidatePollingAverages(racePolls, asOf) {
  const totals = new Map();
  for (const poll of racePolls) {
    const question = poll.questions?.find((item) => item.id === poll.primaryQuestionId);
    if (!question) continue;
    const summary = {
      id: poll.id,
      pollsterName: poll.pollster?.name ?? "Unknown pollster",
      pollsterGrade: poll.pollster?.grade ?? "unrated",
      fieldEndDate: poll.fieldEndDate,
      methodology: poll.methodology,
      internalPoll: Boolean(poll.internalPoll),
      partisanPoll: Boolean(poll.partisanPoll),
    } as ElectionPollSummary;
    const weight = calculatePollWeight(summary, asOf).finalWeight;
    if (weight <= 0) continue;
    for (const response of question.responses ?? []) {
      if (!response.candidateId || response.percentage == null) continue;
      const current = totals.get(response.candidateId) ?? { total: 0, weight: 0 };
      current.total += response.percentage * weight;
      current.weight += weight;
      totals.set(response.candidateId, current);
    }
  }
  return new Map(
    [...totals.entries()]
      .filter(([, value]) => value.weight > 0)
      .map(([candidateId, value]) => [candidateId, Math.round((value.total / value.weight) * 10) / 10]),
  );
}

function nullableNumber(value) {
  return value == null || value === "" ? null : number(value, 0);
}

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86_400_000);
}
