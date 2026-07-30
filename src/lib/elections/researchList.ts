export interface ElectionResearchSelection {
  candidateIds: readonly string[];
  raceIds: readonly string[];
}

export const EMPTY_ELECTION_RESEARCH_SELECTION: ElectionResearchSelection = {
  candidateIds: [],
  raceIds: [],
};

export function parseElectionResearchSelection(value: string | null): ElectionResearchSelection {
  if (!value) return EMPTY_ELECTION_RESEARCH_SELECTION;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return EMPTY_ELECTION_RESEARCH_SELECTION;
    const record = parsed as Record<string, unknown>;
    return {
      candidateIds: uniqueStrings(record.candidateIds),
      raceIds: uniqueStrings(record.raceIds),
    };
  } catch {
    return EMPTY_ELECTION_RESEARCH_SELECTION;
  }
}

export function serializeElectionResearchSelection(selection: ElectionResearchSelection) {
  return JSON.stringify({
    candidateIds: uniqueStrings(selection.candidateIds),
    raceIds: uniqueStrings(selection.raceIds),
  });
}

function uniqueStrings(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0)),
  );
}
