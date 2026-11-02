/**
 * Presentation-only grouping for race candidate lists.
 * Never reorder source ballot records or vote-ranked election results.
 * Preserve the supplied order within each party group.
 */
export function sortRaceCandidatesByParty<T>(
  candidates: readonly T[],
  getParty: (candidate: T) => string | null | undefined,
): T[] {
  return candidates
    .map((candidate, index) => ({ candidate, index, rank: displayPartyRank(getParty(candidate)) }))
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map(({ candidate }) => candidate);
}

function displayPartyRank(value: string | null | undefined): number {
  const party = value?.trim().toLowerCase() ?? "";
  if (party === "r" || /^(republican|gop)\b/.test(party)) return 0;
  if (party === "d" || /^democrat(ic)?\b/.test(party)) return 1;
  return 2;
}
