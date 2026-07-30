import type { ElectionPollSummary } from "@/types/elections";

export interface PollingTrend {
  candidates: readonly { key: string; name: string }[];
  points: readonly ({ date: string; pollster: string } & Record<string, string | number>)[];
}

export function buildPollingTrend(polls: readonly ElectionPollSummary[]): PollingTrend {
  const candidates = new Map<string, string>();
  const points = polls
    .flatMap((poll) => {
      if (!poll.primaryQuestion) return [];
      const point: { date: string; pollster: string } & Record<string, string | number> = {
        date: poll.fieldEndDate,
        pollster: poll.pollsterName,
      };
      for (const response of poll.primaryQuestion.responses) {
        if (
          response.candidateId == null ||
          response.candidateName == null ||
          response.percentage == null
        ) {
          continue;
        }
        const key = `candidate_${response.candidateId.replace(/[^a-zA-Z0-9_]/g, "_")}`;
        candidates.set(key, response.candidateName);
        point[key] = response.percentage;
      }
      return Object.keys(point).length > 2 ? [point] : [];
    })
    .sort((left, right) => left.date.localeCompare(right.date));

  return {
    candidates: Array.from(candidates, ([key, name]) => ({ key, name })),
    points,
  };
}
