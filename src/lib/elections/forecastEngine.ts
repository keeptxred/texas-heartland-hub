import type {
  ForecastConfidenceLevel,
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
  model: "hybrid" | "fundamentals";
  fundamentalsBased: boolean;
  projectedWinnerCandidateId: string | null;
  candidateProbabilities: readonly ForecastCandidateOutput[];
  sourceUrls: readonly string[];
  timestamp: string;
  modelVersion: string;
}

export const ELECTION_FORECAST_MODEL_VERSION = "ktr-2026.1";

/**
 * Deterministic two-candidate forecast. Positive margins favor the Republican
 * candidate and negative margins favor the Democratic candidate. The model
 * never creates polling values; it switches to disclosed fundamentals when no
 * credible polling average is supplied.
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
  const fundamentalsBased = pollingMargin == null;
  const expectedMargin = clamp(
    fundamentalsBased
      ? previousMargin * 0.35 +
          partisanLean * 0.4 +
          input.electionEnvironment * 0.25 +
          candidateAdjustment
      : pollingMargin * 0.65 +
          previousMargin * 0.12 +
          partisanLean * 0.13 +
          input.electionEnvironment * 0.1 +
          candidateAdjustment,
    -40,
    40,
  );

  const uncertainty = fundamentalsBased ? 7.5 : confidenceUncertainty(input.candidates);
  const republicanShare = clamp(50 + expectedMargin / 2, 1, 99);
  const democraticShare = 100 - republicanShare;
  const republicanProbability = logistic(expectedMargin, fundamentalsBased ? 6.5 : 4.75);
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
    confidenceLevel: confidenceFromInputs(input, fundamentalsBased),
    model: fundamentalsBased ? "fundamentals" : "hybrid",
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
  fundamentalsBased: boolean,
): ForecastConfidenceLevel {
  const pollCount = input.candidates.filter((candidate) => candidate.pollingAverage != null).length;
  const sourceCount = new Set(input.sourceUrls).size;
  if (!fundamentalsBased && pollCount >= 2 && sourceCount >= 3) return "high";
  if (!fundamentalsBased) return "medium";
  if (sourceCount >= 4 && input.previousElectionMargin != null && input.districtPartisanLean != null) {
    return "medium";
  }
  return "low";
}

function confidenceUncertainty(candidates: readonly ForecastCandidateInput[]) {
  const available = candidates.filter((candidate) => candidate.pollingAverage != null).length;
  return available >= 2 ? 4.5 : 6;
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
