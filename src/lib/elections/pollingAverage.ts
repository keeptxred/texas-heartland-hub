import type { ElectionPollSummary } from "@/types/elections";

export interface PollingAverageCandidate {
  candidateId: string;
  candidateName: string;
  averagePercentage: number;
  pollCount: number;
}

export interface PollingAverage {
  candidates: readonly PollingAverageCandidate[];
  pollCount: number;
  fieldDateFrom: string;
  fieldDateTo: string;
}

/**
 * Calculates an equal-weight mean of published candidate toplines. Repository
 * filtering decides which credible polls enter the calculation; this function
 * never imputes a missing response or manufactures a poll result.
 */
export function calculatePollingAverage(
  polls: readonly ElectionPollSummary[],
): PollingAverage | null {
  const usablePolls = polls.flatMap((poll) =>
    poll.primaryQuestion ? [{ poll, question: poll.primaryQuestion }] : [],
  );
  const totals = new Map<string, { candidateName: string; total: number; pollIds: Set<string> }>();

  for (const { poll, question } of usablePolls) {
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
        total: 0,
        pollIds: new Set<string>(),
      };
      if (!current.pollIds.has(poll.id)) {
        current.total += response.percentage;
        current.pollIds.add(poll.id);
      }
      totals.set(candidateId, current);
    }
  }

  const candidates = Array.from(totals.entries())
    .map(([candidateId, value]) => ({
      candidateId,
      candidateName: value.candidateName,
      averagePercentage: roundToTenth(value.total / value.pollIds.size),
      pollCount: value.pollIds.size,
    }))
    .sort(
      (left, right) =>
        right.averagePercentage - left.averagePercentage ||
        left.candidateName.localeCompare(right.candidateName),
    );

  if (candidates.length === 0) return null;
  const fieldDates = usablePolls.map(({ poll }) => poll.fieldEndDate).sort();

  return {
    candidates,
    pollCount: new Set(usablePolls.map(({ poll }) => poll.id)).size,
    fieldDateFrom: fieldDates[0] ?? "",
    fieldDateTo: fieldDates.at(-1) ?? "",
  };
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}
