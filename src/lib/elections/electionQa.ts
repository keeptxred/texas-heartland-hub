import type { CandidateSummary, ElectionForecastDetail } from "@/types/elections";

export interface ElectionQaIssue {
  code: string;
  message: string;
  recordId?: string;
}

export function findCandidateDuplicates(
  candidates: readonly CandidateSummary[],
): readonly ElectionQaIssue[] {
  const seen = new Map<string, string>();
  const issues: ElectionQaIssue[] = [];

  for (const candidate of candidates) {
    const raceId = candidate.primaryRace?.id ?? "unassigned";
    const key = `${normalize(candidate.fullName)}|${raceId}`;
    const previous = seen.get(key);
    if (previous) {
      issues.push({
        code: "candidate_duplicate",
        message: `${candidate.fullName} appears more than once in the same race.`,
        recordId: candidate.id,
      });
    } else {
      seen.set(key, candidate.id);
    }
  }
  return issues;
}

export function validateForecast(forecast: ElectionForecastDetail): readonly ElectionQaIssue[] {
  const issues: ElectionQaIssue[] = [];
  for (const candidate of forecast.candidateSummaries) {
    if (!isPercentage(candidate.winProbability)) {
      issues.push({
        code: "forecast_probability_range",
        message: `${candidate.candidateName} has a win probability outside 0–100.`,
        recordId: candidate.candidateId,
      });
    }
    if (candidate.projectedVoteShare != null && !isPercentage(candidate.projectedVoteShare)) {
      issues.push({
        code: "forecast_vote_share_range",
        message: `${candidate.candidateName} has an estimated vote share outside 0–100.`,
        recordId: candidate.candidateId,
      });
    }
  }
  if (forecast.model.model === "fundamentals") {
    if (!forecast.model.fundamentals) {
      issues.push({
        code: "forecast_fundamentals_missing",
        message: "A fundamentals-based forecast must disclose its inputs.",
        recordId: forecast.id,
      });
    } else if (forecast.model.fundamentals.sourceUrls.length === 0) {
      issues.push({
        code: "forecast_fundamentals_sources_missing",
        message: "A fundamentals-based forecast must cite at least one source.",
        recordId: forecast.id,
      });
    }
  }
  return issues;
}

export function validatePublicSourceUrl(url: string): ElectionQaIssue | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return { code: "source_not_https", message: "Public election sources must use HTTPS." };
    }
    return null;
  } catch {
    return { code: "source_invalid_url", message: "Election source URL is invalid." };
  }
}

function normalize(value: string) {
  return value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "");
}

function isPercentage(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}
