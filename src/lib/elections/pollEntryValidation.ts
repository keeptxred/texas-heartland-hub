import type { PollEntryAdminInput, ValidPollEntryDraft } from "@/types/elections";
import { isElectionSlug } from "@/types/elections";

export interface PollEntryValidationResult {
  draft: ValidPollEntryDraft | null;
  errors: readonly string[];
}

export function validatePollEntry(input: PollEntryAdminInput): PollEntryValidationResult {
  const errors: string[] = [];
  if (!isElectionSlug(input.slug)) errors.push("Slug must use lowercase words and hyphens.");
  if (!input.title.trim()) errors.push("Poll title is required.");
  if (!input.electionCycleId.trim()) errors.push("Election cycle is required.");
  if (!input.pollsterName.trim()) errors.push("Pollster name is required.");
  if (!isDate(input.fieldStartDate) || !isDate(input.fieldEndDate)) {
    errors.push("Valid field dates are required.");
  } else if (input.fieldEndDate < input.fieldStartDate) {
    errors.push("Field end date cannot precede field start date.");
  }
  if (input.releaseDate && !isDate(input.releaseDate)) {
    errors.push("Release date must be valid.");
  }
  const sampleSize = Number(input.sampleSize);
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) {
    errors.push("Sample size must be a positive whole number.");
  }
  const marginOfError = input.marginOfError ? Number(input.marginOfError) : null;
  if (
    marginOfError != null &&
    (!Number.isFinite(marginOfError) || marginOfError < 0 || marginOfError > 100)
  ) {
    errors.push("Margin of error must be between 0 and 100.");
  }
  if (!input.questionPrompt.trim()) errors.push("Question wording is required.");
  if (input.responses.length < 2) errors.push("At least two responses are required.");
  const responses = input.responses.map((response, index) => {
    const percentage = Number(response.percentage);
    if (!response.label.trim()) errors.push(`Response ${index + 1} needs a label.`);
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      errors.push(`Response ${index + 1} percentage must be between 0 and 100.`);
    }
    return {
      label: response.label.trim(),
      candidateId: response.candidateId.trim() || null,
      percentage,
    };
  });
  const responseTotal = responses.reduce(
    (total, response) => total + (Number.isFinite(response.percentage) ? response.percentage : 0),
    0,
  );
  if (responseTotal > 101) errors.push("Published response percentages cannot total over 101.");
  if (!input.sourceName.trim()) errors.push("Source name is required.");
  if (!isHttpUrl(input.sourceUrl)) errors.push("A valid original-source URL is required.");
  if (input.methodologyUrl && !isHttpUrl(input.methodologyUrl)) {
    errors.push("Methodology URL must use HTTP or HTTPS.");
  }

  return {
    errors,
    draft:
      errors.length === 0
        ? {
            ...input,
            title: input.title.trim(),
            electionCycleId: input.electionCycleId.trim(),
            raceId: input.raceId.trim() || null,
            pollsterName: input.pollsterName.trim(),
            releaseDate: input.releaseDate || null,
            sampleSize,
            marginOfError,
            questionPrompt: input.questionPrompt.trim(),
            responses,
            sourceName: input.sourceName.trim(),
            methodologyUrl: input.methodologyUrl || null,
          }
        : null,
  };
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
