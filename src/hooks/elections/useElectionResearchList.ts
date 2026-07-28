import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_ELECTION_RESEARCH_SELECTION,
  parseElectionResearchSelection,
  serializeElectionResearchSelection,
  type ElectionResearchSelection,
} from "@/lib/elections/researchList";

const STORAGE_KEY = "keeptxred.election-research.v1";

export function useElectionResearchList() {
  const [selection, setSelection] = useState<ElectionResearchSelection>(
    EMPTY_ELECTION_RESEARCH_SELECTION,
  );

  useEffect(() => {
    setSelection(parseElectionResearchSelection(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  const update = useCallback((next: ElectionResearchSelection) => {
    setSelection(next);
    window.localStorage.setItem(STORAGE_KEY, serializeElectionResearchSelection(next));
  }, []);

  const toggleCandidate = useCallback(
    (id: string) =>
      update({
        ...selection,
        candidateIds: toggleId(selection.candidateIds, id),
      }),
    [selection, update],
  );
  const toggleRace = useCallback(
    (id: string) =>
      update({
        ...selection,
        raceIds: toggleId(selection.raceIds, id),
      }),
    [selection, update],
  );

  return {
    ...selection,
    toggleCandidate,
    toggleRace,
    clear: () => update(EMPTY_ELECTION_RESEARCH_SELECTION),
  };
}

function toggleId(values: readonly string[], id: string) {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
}
