import type { ElectionPollSummary, PollGrade, PollMode, PollPopulation } from "@/types/elections";

export interface PollingAverageCandidate {
  candidateId: string;
  candidateName: string;
  averagePercentage: number;
  pollCount: number;
}

export interface PollWeightFactors {
  recency: number;
  sampleSize: number;
  population: number;
  pollsterQuality: number;
  independence: number;
  methodology: number;
}

export interface PollWeightExplanation {
  pollId: string;
  pollsterName: string;
  fieldEndDate: string;
  finalWeight: number;
  factors: PollWeightFactors;
  explanation: readonly string[];
}

export interface PollingAverage {
  candidates: readonly PollingAverageCandidate[];
  pollCount: number;
  fieldDateFrom: string;
  fieldDateTo: string;
  weightedMargin: number | null;
  uncertaintyRange: { low: number; high: number } | null;
  recalculatedAt: string;
  pollWeights: readonly PollWeightExplanation[];
}

export interface PollingAverageOptions {
  /** Deterministic clock override for tests, CI, and archived calculations. */
  asOf?: string | Date;
  /** Recency half-life in days. Defaults to 21 days. */
  recencyHalfLifeDays?: number;
}

const POPULATION_WEIGHTS: Record<PollPopulation, number> = {
  likely_voters: 1,
  primary_voters: 1,
  caucus_goers: 0.95,
  registered_voters: 0.88,
  party_members: 0.82,
  adults: 0.68,
  other: 0.72,
  unknown: 0.62,
};

const POLLSTER_GRADE_WEIGHTS: Record<PollGrade, number> = {
  a_plus: 1.2,
  a: 1.15,
  a_minus: 1.1,
  b_plus: 1.05,
  b: 1,
  b_minus: 0.95,
  c_plus: 0.9,
  c: 0.84,
  c_minus: 0.78,
  d: 0.65,
  f: 0.45,
  unrated: 0.8,
};

const MODE_WEIGHTS: Record<PollMode, number> = {
  mixed_mode: 1.08,
  live_phone: 1.05,
  online_panel: 1,
  automated_phone: 0.92,
  text_message: 0.88,
  mail: 0.85,
  in_person: 0.82,
  other: 0.78,
  unknown: 0.7,
};

/**
 * Calculates a transparent weighted mean of published candidate toplines.
 * Missing candidate responses are never imputed and no synthetic poll result is
 * created. Each usable poll receives a multiplicative weight based on recency,
 * sample size, population, pollster quality, independence, and methodology.
 */
export function calculatePollingAverage(
  polls: readonly ElectionPollSummary[],
  options: PollingAverageOptions = {},
): PollingAverage | null {
  const asOf = toDate(options.asOf ?? new Date());
  const halfLife = Math.max(1, options.recencyHalfLifeDays ?? 21);
  const usablePolls = polls.flatMap((poll) => {
    if (!poll.primaryQuestion || !["published", "revised", "completed"].includes(poll.status)) {
      return [];
    }
    const weight = calculatePollWeight(poll, asOf, halfLife);
    return weight.finalWeight > 0 ? [{ poll, question: poll.primaryQuestion, weight }] : [];
  });

  const totals = new Map<
    string,
    { candidateName: string; weightedTotal: number; weightTotal: number; pollIds: Set<string> }
  >();

  for (const { poll, question, weight } of usablePolls) {
    for (const response of question.responses) {
      if (
        response.percentage == null ||
        response.candidateId == null ||
        response.candidateName == null
      ) {
        continue;
      }
      const candidateId = response.candidateId;
      const current = totals.get(candidateId) ?? {
        candidateName: response.candidateName,
        weightedTotal: 0,
        weightTotal: 0,
        pollIds: new Set<string>(),
      };
      if (!current.pollIds.has(poll.id)) {
        current.weightedTotal += response.percentage * weight.finalWeight;
        current.weightTotal += weight.finalWeight;
        current.pollIds.add(poll.id);
      }
      totals.set(candidateId, current);
    }
  }

  const candidates = Array.from(totals.entries())
    .filter(([, value]) => value.weightTotal > 0)
    .map(([candidateId, value]) => ({
      candidateId,
      candidateName: value.candidateName,
      averagePercentage: roundToTenth(value.weightedTotal / value.weightTotal),
      pollCount: value.pollIds.size,
    }))
    .sort(
      (left, right) =>
        right.averagePercentage - left.averagePercentage ||
        left.candidateName.localeCompare(right.candidateName),
    );

  if (candidates.length === 0) return null;

  const fieldDates = usablePolls.map(({ poll }) => poll.fieldEndDate).sort();
  const weightedMargin =
    candidates.length >= 2
      ? roundToTenth(candidates[0].averagePercentage - candidates[1].averagePercentage)
      : null;
  const marginUncertainty = calculateMarginUncertainty(usablePolls);

  return {
    candidates,
    pollCount: new Set(usablePolls.map(({ poll }) => poll.id)).size,
    fieldDateFrom: fieldDates[0] ?? "",
    fieldDateTo: fieldDates.at(-1) ?? "",
    weightedMargin,
    uncertaintyRange:
      weightedMargin == null || marginUncertainty == null
        ? null
        : {
            low: roundToTenth(weightedMargin - marginUncertainty),
            high: roundToTenth(weightedMargin + marginUncertainty),
          },
    recalculatedAt: asOf.toISOString(),
    pollWeights: usablePolls.map(({ weight }) => weight),
  };
}

export function calculatePollWeight(
  poll: ElectionPollSummary,
  asOf: Date = new Date(),
  recencyHalfLifeDays = 21,
): PollWeightExplanation {
  const fieldEnd = toDate(poll.fieldEndDate);
  const ageDays = Math.max(0, (asOf.getTime() - fieldEnd.getTime()) / 86_400_000);
  const recency = clamp(Math.pow(0.5, ageDays / Math.max(1, recencyHalfLifeDays)), 0.12, 1);
  const sampleSize = clamp(Math.sqrt(poll.methodology.sampleSize / 600), 0.5, 1.65);
  const population = POPULATION_WEIGHTS[poll.methodology.population];
  const pollsterQuality = POLLSTER_GRADE_WEIGHTS[poll.pollsterGrade];
  const independence = poll.internalPoll ? 0.55 : poll.partisanPoll ? 0.72 : 1;
  const methodology = clamp(
    MODE_WEIGHTS[poll.methodology.mode] *
      (poll.methodology.methodologyUrl ? 1.04 : 0.92) *
      (poll.methodology.marginOfError != null ? 1.03 : 0.94) *
      (poll.methodology.weightingDescription ? 1.02 : 0.97),
    0.55,
    1.18,
  );
  const factors = {
    recency: roundToThousandth(recency),
    sampleSize: roundToThousandth(sampleSize),
    population: roundToThousandth(population),
    pollsterQuality: roundToThousandth(pollsterQuality),
    independence: roundToThousandth(independence),
    methodology: roundToThousandth(methodology),
  };
  const finalWeight = roundToThousandth(
    factors.recency *
      factors.sampleSize *
      factors.population *
      factors.pollsterQuality *
      factors.independence *
      factors.methodology,
  );

  return {
    pollId: poll.id,
    pollsterName: poll.pollsterName,
    fieldEndDate: poll.fieldEndDate,
    finalWeight,
    factors,
    explanation: [
      `${Math.round(ageDays)} day(s) old`,
      `${poll.methodology.sampleSize.toLocaleString("en-US")} ${poll.methodology.population.replaceAll("_", " ")}`,
      `pollster grade ${poll.pollsterGrade.replaceAll("_", " ")}`,
      poll.internalPoll ? "internal poll penalty" : poll.partisanPoll ? "partisan poll penalty" : "independent poll",
      `${poll.methodology.mode.replaceAll("_", " ")} methodology`,
    ],
  };
}

function calculateMarginUncertainty(
  polls: readonly {
    poll: ElectionPollSummary;
    weight: PollWeightExplanation;
  }[],
): number | null {
  if (polls.length === 0) return null;
  let weightedVariance = 0;
  let totalWeight = 0;
  for (const { poll, weight } of polls) {
    const pollMoe = poll.methodology.marginOfError ?? 98 / Math.sqrt(poll.methodology.sampleSize);
    weightedVariance += Math.pow(weight.finalWeight * pollMoe, 2);
    totalWeight += weight.finalWeight;
  }
  if (totalWeight <= 0) return null;
  return Math.sqrt(2) * (Math.sqrt(weightedVariance) / totalWeight);
}

function toDate(value: string | Date): Date {
  const date = value instanceof Date ? value : new Date(value.includes("T") ? value : `${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid polling-average date: ${String(value)}`);
  return date;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

function roundToThousandth(value: number) {
  return Math.round(value * 1_000) / 1_000;
}
