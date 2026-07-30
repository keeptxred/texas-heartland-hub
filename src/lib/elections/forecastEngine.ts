import type {
  ForecastConfidenceLevel,
  ForecastModel,
  ForecastRating,
} from "../../types/elections/forecastClassifications";

export interface ForecastCandidateInput {
  candidateId: string;
  party: string;
  pollingAverage: number | null;
  incumbencyAdjustment: number;
  fundraisingAdjustment: number;
  candidateQualityAdjustment: number;
}

export interface ForecastEngineInput {
  raceId: string;
  asOf: string;
  candidates: readonly ForecastCandidateInput[];
  previousElectionMargin: number | null;
  districtPartisanLean: number | null;
  electionEnvironment: number;
  sourceUrls: readonly string[];
  previousWinProbabilities?: Readonly<Record<string, number>>;
}

export interface ForecastCandidateOutput {
  candidateId: string;
  party: string;
  winProbability: number;
  runoffProbability: null;
  projectedVoteShare: number;
  projectedVoteShareLow: number;
  projectedVoteShareHigh: number;
  pollingAverage: number | null;
  winProbabilityChange: number | null;
}

export interface ForecastEngineOutput {
  expectedMargin: number;
  rating: ForecastRating;
  confidenceLevel: ForecastConfidenceLevel;
  model: ForecastModel;
  fundamentalsBased: boolean;
  projectedWinnerCandidateId: string | null;
  candidateProbabilities: readonly ForecastCandidateOutput[];
  sourceUrls: readonly string[];
  timestamp: string;
  modelVersion: string;
}

export const ELECTION_FORECAST_MODEL_VERSION = "ktr-2026.2";

/**
 * Deterministic two-candidate forecast. Positive margins favor the Republican
 * candidate and negative margins favor the Democratic candidate. The model
 * never creates polling or fundamentals values. It uses polling alone when
 * that is the only sourced input, combines polling and disclosed fundamentals
 * when both exist, and uses fundamentals only when no polling average exists.
 */
export function runForecastModel(input: ForecastEngineInput): ForecastEngineOutput {
  const republican = input.candidates.find((candidate) => normalizeParty(candidate.party) === "republican");
  const democratic = input.candidates.find((candidate) => normalizeParty(candidate.party) === "democratic");
  if (!republican || !democratic) {
    throw new Error(`Forecast ${input.raceId} requires one Republican and one Democratic candidate.`);
  }

  const pollingMargin =
    republican.pollingAverage != null && democratic.pollingAverage != null
      ? republican.pollingAverage - democratic.pollingAverage
      : null;
  const previousMargin = input.previousElectionMargin ?? 0;
  const partisanLean = input.districtPartisanLean ?? 0;
  const candidateAdjustment =
    republican.incumbencyAdjustment - democratic.incumbencyAdjustment +
    republican.fundraisingAdjustment - democratic.fundraisingAdjustment +
    republican.candidateQualityAdjustment - democratic.candidateQualityAdjustment;
  const hasFundamentals =
    input.previousElectionMargin != null ||
    input.districtPartisanLean != null ||
    input.electionEnvironment !== 0 ||
    candidateAdjustment !== 0;
  const model: ForecastModel =
    pollingMargin == null ? "fundamentals" : hasFundamentals ? "hybrid" : "polling";
  const fundamentalsBased = model === "fundamentals";
  const expectedMargin = clamp(
    model === "fundamentals"
      ? previousMargin * 0.35 +
          partisanLean * 0.4 +
          input.electionEnvironment * 0.25 +
          candidateAdjustment
      : model === "polling"
        ? pollingMargin ?? 0
        : (pollingMargin ?? 0) * 0.65 +
          previousMargin * 0.12 +
          partisanLean * 0.13 +
          input.electionEnvironment * 0.1 +
          candidateAdjustment,
    -40,
    40,
  );

  const sourceCount = new Set(input.sourceUrls).size;
  const uncertainty =
    model === "fundamentals" ? 7.5 : model === "polling" && sourceCount < 2 ? 6 : 4.5;
  const republicanShare = clamp(50 + expectedMargin / 2, 1, 99);
  const democraticShare = 100 - republicanShare;
  const republicanProbability = logistic(expectedMargin, model === "fundamentals" ? 6.5 : 4.75);
  const democraticProbability = 1 - republicanProbability;
  const probabilities = new Map([
    [republican.candidateId, republicanProbability],
    [democratic.candidateId, democraticProbability],
  ]);
  const shares = new Map([
    [republican.candidateId, republicanShare],
    [democratic.candidateId, democraticShare],
  ]);

  const candidateProbabilities = input.candidates.map((candidate) => {
    const probability = probabilities.get(candidate.candidateId) ?? 0;
    const share = shares.get(candidate.candidateId) ?? 0;
    const previous = input.previousWinProbabilities?.[candidate.candidateId];
    return {
      candidateId: candidate.candidateId,
      party: candidate.party,
      winProbability: roundProbability(probability),
      runoffProbability: null,
      projectedVoteShare: roundToTenth(share),
      projectedVoteShareLow: roundToTenth(clamp(share - uncertainty, 0, 100)),
      projectedVoteShareHigh: roundToTenth(clamp(share + uncertainty, 0, 100)),
      pollingAverage: candidate.pollingAverage,
      winProbabilityChange:
        previous == null ? null : roundToTenth((roundProbability(probability) - previous) * 100),
    };
  });
  const projectedWinner = [...candidateProbabilities].sort(
    (left, right) => right.winProbability - left.winProbability,
  )[0];

  return {
    expectedMargin: roundToTenth(expectedMargin),
    rating: ratingFromMargin(expectedMargin),
    confidenceLevel: confidenceFromInputs(input, model),
    model,
    fundamentalsBased,
    projectedWinnerCandidateId:
      projectedWinner && projectedWinner.winProbability > 0.5 ? projectedWinner.candidateId : null,
    candidateProbabilities,
    sourceUrls: [...new Set(input.sourceUrls)],
    timestamp: new Date(input.asOf).toISOString(),
    modelVersion: ELECTION_FORECAST_MODEL_VERSION,
  };
}

export function ratingFromMargin(margin: number): ForecastRating {
  if (margin >= 15) return "safe_republican";
  if (margin >= 8) return "likely_republican";
  if (margin >= 3) return "leans_republican";
  if (margin > -3) return "toss_up";
  if (margin > -8) return "leans_democratic";
  if (margin > -15) return "likely_democratic";
  return "safe_democratic";
}

function confidenceFromInputs(
  input: ForecastEngineInput,
  model: ForecastModel,
): ForecastConfidenceLevel {
  const sourceCount = new Set(input.sourceUrls).size;
  if (model === "polling") return sourceCount >= 2 ? "medium" : "low";
  if (model === "hybrid") return sourceCount >= 3 ? "high" : "medium";
  if (sourceCount >= 4 && input.previousElectionMargin != null && input.districtPartisanLean != null) {
    return "medium";
  }
  return "low";
}

function normalizeParty(party: string) {
  const normalized = party.toLowerCase();
  if (normalized === "gop" || normalized.startsWith("rep")) return "republican";
  if (normalized.startsWith("dem")) return "democratic";
  return normalized;
}

function logistic(margin: number, scale: number) {
  return 1 / (1 + Math.exp(-margin / scale));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

function roundProbability(value: number) {
  return Math.round(clamp(value, 0.01, 0.99) * 100) / 100;
}
