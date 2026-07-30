import { skipToken, useQuery } from "@tanstack/react-query";
import {
  electionQueryDefaults,
  electionQueryKeys,
  electionQueryStaleTimes,
} from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
import type { ElectionCycleId, RaceSummary } from "@/types/elections";

const FEATURED_OFFICE_PRIORITY: readonly [RegExp, number][] = [
  [/^governor$/i, 10],
  [/^lieutenant governor$/i, 20],
  [/^attorney general$/i, 30],
  [/^comptroller/i, 40],
  [/(general land office|land commissioner)/i, 50],
  [/(agriculture commissioner|commissioner of agriculture)/i, 60],
  [/railroad commission/i, 70],
  [/(chief justice.*supreme court|supreme court.*chief justice)/i, 80],
  [/supreme court/i, 90],
  [/(presiding judge.*criminal appeals|criminal appeals.*presiding judge)/i, 100],
  [/court of criminal appeals/i, 110],
  [/state board of education/i, 120],
  [/state senate/i, 130],
  [/state (representative|house)/i, 140],
];

function getFeaturedOfficePriority(race: RaceSummary) {
  const officeName = race.officeName.trim();
  const matchedPriority = FEATURED_OFFICE_PRIORITY.find(([pattern]) =>
    pattern.test(officeName),
  );

  return matchedPriority?.[1] ?? 999;
}

function sortFeaturedRaces(races: readonly RaceSummary[]) {
  return races
    .map((race, index) => ({ race, index }))
    .sort(
      (left, right) =>
        left.race.electionDate.localeCompare(right.race.electionDate) ||
        getFeaturedOfficePriority(left.race) - getFeaturedOfficePriority(right.race) ||
        left.race.officeName.localeCompare(right.race.officeName) ||
        left.race.districtNumber?.localeCompare(right.race.districtNumber ?? "", undefined, {
          numeric: true,
        }) ||
        left.race.name.localeCompare(right.race.name) ||
        left.race.id.localeCompare(right.race.id) ||
        left.index - right.index,
    )
    .map(({ race }) => race);
}

export function useFeaturedElectionRaces(electionCycleId?: ElectionCycleId, limit?: number) {
  const { races } = useElectionRepositories();
  const result = useQuery({
    ...electionQueryDefaults,
    queryKey: electionCycleId
      ? electionQueryKeys.races.featured(electionCycleId, limit)
      : [...electionQueryKeys.races.all(), "featured", "disabled", limit ?? null],
    queryFn: electionCycleId ? () => races.listFeatured(electionCycleId, limit) : skipToken,
    select: sortFeaturedRaces,
    staleTime: electionQueryStaleTimes.races,
  });

  return {
    ...result,
    isEmpty: result.isSuccess && result.data.length === 0,
  };
}
