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
if (Number.isNaN(now.getTime())) {
  throw new Error("ELECTION_FORECAST_AS_OF is not a valid date.");
}
const timestamp = now.toISOString();

const [races, candidates, polls, existingForecasts] = await Promise.all([
  readJson("races.json"),
  readJson("candidates.json"),
  readJson("polls.json"),
  readJson("forecasts.json"),
]);

const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
const generatedByRace = new Map();
const skipped = [];
const diagnostics = {
  generatedAt: timestamp,
  totals: {
    races: races.length,
    candidates: candidates.length,
    polls: polls.length,
    publishedVerifiedRaces: 0,
    racesWithCandidateMatches: 0,
    racesWithPollMatches: 0,
    forecastInputsEnabled: 0,
    forecastInputsDisabled: 0,
    forecastInputsAbsent: 0,
    pollingFallbackEligible: 0,
    generated: 0,
  },
  polledRaces: [],
  skipped,
};

for (const race of races) {
  if (!isPublicVerified(race)) {
    skipped.push({ raceId: race.id, reason: "race is not published and verified" });
    continue;
  }
  diagnostics.totals.publishedVerifiedRaces += 1;

  const configuredInputs = race.forecastInputs;
  if (configuredInputs?.enabled) diagnostics.totals.forecastInputsEnabled += 1;
  else if (configuredInputs) diagnostics.totals.forecastInputsDisabled += 1;
  else diagnostics.totals.forecastInputsAbsent += 1;

  const racePolls = polls.filter(
    (poll) =>
      poll.raceId === race.id &&
      isPublicVerified(poll) &&
      ["published", "revised", "completed"].includes(poll.status),
  );
  if (racePolls.length > 0) diagnostics.totals.racesWithPollMatches += 1;

  const pollCandidateIds = new Set(
    racePolls.flatMap((poll) =>
      (poll.questions ?? []).flatMap((question) =>
        (question.responses ?? [])
          .map((response) => response.candidateId)
          .filter((candidateId) => typeof candidateId === "string"),
      ),
    ),
  );

  // Candidate imports and poll imports can be refreshed independently. Use the
  // canonical race relationship first, then accept a verified candidate that is
  // explicitly referenced by a verified poll for this same race.
  const raceCandidates = candidates.filter(
    (candidate) =>
      isPublicVerified(candidate) &&
      ((Array.isArray(candidate.raceIds) && candidate.raceIds.includes(race.id)) ||
        pollCandidateIds.has(candidate.id)),
  );
  const republican = raceCandidates.find(
    (candidate) => normalizeParty(candidate.party) === "republican",
  );
  const democratic = raceCandidates.find(
    (candidate) => normalizeParty(candidate.party) === "democratic",
  );
  if (republican && democratic) diagnostics.totals.racesWithCandidateMatches += 1;

  const diagnosticRow = {
    raceId: race.id,
    raceName: race.name,
    racePublishedVerified: true,
    configuredForecastInputs: configuredInputs
      ? { present: true, enabled: Boolean(configuredInputs.enabled) }
      : { present: false, enabled: false },
    pollCount: racePolls.length,
    pollIds: racePolls.map((poll) => poll.id),
    pollCandidateIds: [...pollCandidateIds],
    matchedCandidateCount: raceCandidates.length,
    matchedCandidateIds: raceCandidates.map((candidate) => candidate.id),
    republicanCandidateId: republican?.id ?? null,
    democraticCandidateId: democratic?.id ?? null,
    pollingAverageCandidateIds: [],
    outcome: "pending",
  };
  if (racePolls.length > 0) diagnostics.polledRaces.push(diagnosticRow);

  if (!republican || !democratic) {
    diagnosticRow.outcome = "missing verified Republican or Democratic candidate";
    skipped.push({ raceId: race.id, reason: diagnosticRow.outcome });
    continue;
  }
  if (racePolls.length === 0) {
    skipped.push({ raceId: race.id, reason: "no eligible verified polls" });
    continue;
  }

  // A disabled or absent fundamentals configuration must not suppress a fully
  // sourced polling-only forecast. Explicit enabled inputs still produce the
  // hybrid/fundamentals path.
  const pollingOnly = !configuredInputs?.enabled;
  if (pollingOnly) diagnostics.totals.pollingFallbackEligible += 1;
  const inputs = configuredInputs?.enabled
    ? configuredInputs
    : {
        enabled: true,
        previousElectionMargin: null,
        districtPartisanLean: null,
        electionEnvironment: 0,
        candidateAdjustments: {},
        sourceUrls: [],
      };

  const pollingAverages = calculateCandidatePollingAverages(racePolls, now);
  diagnosticRow.pollingAverageCandidateIds = [...pollingAverages.keys()];
  const republicanAverage = pollingAverages.get(republican.id);
  const democraticAverage = pollingAverages.get(democratic.id);
  if (republicanAverage == null || democraticAverage == null) {
    diagnosticRow.outcome = "missing polling average for one or both major-party candidates";
    skipped.push({ raceId: race.id, reason: diagnosticRow.outcome });
    continue;
  }

  const sourceUrls = [
    ...(Array.isArray(inputs.sourceUrls) ? inputs.sourceUrls : []),
    ...racePolls.flatMap((poll) => [
      poll.source?.sourceUrl,
      ...(poll.sources ?? []).map((source) => source.url),
    ]),
  ].filter((value) => typeof value === "string" && value.startsWith("https://"));
  if (sourceUrls.length === 0) {
    diagnosticRow.outcome = "no source URLs";
    skipped.push({ raceId: race.id, reason: diagnosticRow.outcome });
    continue;
  }

  const previous = existingForecasts
    .filter(
      (forecast) =>
        forecast.raceId === race.id && forecast.source?.sourceId === MODEL_SOURCE_ID,
    )
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))[0];
  const previousProbabilities = Object.fromEntries(
    (previous?.candidateProbabilities ?? []).map((candidate) => [
      candidate.candidateId,
      candidate.winProbability,
    ]),
  );
  const adjustments = inputs.candidateAdjustments ?? {};

  const result = runForecastModel({
    raceId: race.id,
    asOf: timestamp,
    candidates: [republican, democratic].map((candidate) => ({
      candidateId: candidate.id,
      party: normalizeParty(candidate.party),
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
    candidateSummaries: result.candidateProbabilities.map((candidate) => {
      const record = candidateById.get(candidate.candidateId);
      return {
        candidateId: candidate.candidateId,
        candidateSlug: record?.slug ?? candidate.candidateId,
        candidateName: record?.fullName ?? candidate.candidateId,
        party: candidate.party,
        imageUrl: record?.imageUrl ?? null,
        winProbability: candidate.winProbability,
        projectedVoteShare: candidate.projectedVoteShare,
        projectedVoteShareLow: candidate.projectedVoteShareLow,
        projectedVoteShareHigh: candidate.projectedVoteShareHigh,
        pollingAverage: candidate.pollingAverage,
        winProbabilityChange: candidate.winProbabilityChange,
      };
    }),
  };
  const priorSnapshots = Array.isArray(previous?.snapshots) ? previous.snapshots : [];
  const day = timestamp.slice(0, 10);
  const snapshots = [
    ...priorSnapshots.filter((item) => String(item.capturedAt).slice(0, 10) !== day),
    snapshot,
  ].sort((left, right) => String(left.capturedAt).localeCompare(String(right.capturedAt)));

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
    notes: pollingOnly
      ? "Polling-only forecast using weighted verified public polls; no fundamentals adjustments were applied."
      : result.fundamentalsBased
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
    sourceIds: [
      MODEL_SOURCE_ID,
      ...new Set(racePolls.map((poll) => poll.source?.sourceId).filter(Boolean)),
    ],
    snapshots,
  });
  diagnosticRow.outcome = "generated";
}

diagnostics.totals.generated = generatedByRace.size;
const output = [
  ...existingForecasts.filter(
    (forecast) =>
      forecast.source?.sourceId !== MODEL_SOURCE_ID || !generatedByRace.has(forecast.raceId),
  ),
  ...generatedByRace.values(),
].sort((left, right) => String(left.raceId).localeCompare(String(right.raceId)));

await writeFile(
  path.join(DATA_DIR, "forecasts.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);
await writeFile(
  path.join(DATA_DIR, "forecast-diagnostics.json"),
  `${JSON.stringify(diagnostics, null, 2)}\n`,
);

console.log("Forecast diagnostics summary:", JSON.stringify(diagnostics.totals));
for (const row of diagnostics.polledRaces) {
  console.log("Forecast polled-race diagnostic:", JSON.stringify(row));
}
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
    const question =
      poll.questions?.find((item) => item.id === poll.primaryQuestionId) ?? poll.questions?.[0];
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
      .map(([candidateId, value]) => [
        candidateId,
        Math.round((value.total / value.weight) * 10) / 10,
      ]),
  );
}

function normalizeParty(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "gop" || normalized.startsWith("rep")) return "republican";
  if (normalized.startsWith("dem")) return "democratic";
  return normalized;
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
