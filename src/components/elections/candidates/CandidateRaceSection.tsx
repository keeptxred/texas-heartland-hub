import { RaceCard } from "../cards";
import { ElectionEmptyState } from "../states";
import { ELECTION_ROUTES } from "@/lib/elections";
import type { CandidateDetail, RaceDetail } from "@/types/elections";
import { ELECTION_TYPE_LABELS } from "@/types/elections/raceClassifications";

export interface CandidateRaceSectionProps {
  candidate: CandidateDetail;
  race: RaceDetail | null;
}

export function CandidateRaceSection({ candidate, race }: CandidateRaceSectionProps) {
  return (
    <section aria-labelledby="candidate-race-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          Ballot assignment
        </p>
        <h2
          id="candidate-race-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Candidate race
        </h2>
      </div>

      {!race ? (
        <ElectionEmptyState
          kind="races"
          title="No primary race is published"
          message="A race summary will appear after this candidate has been assigned to a verified published race."
        />
      ) : (
        <RaceCard
          name={race.name}
          office={race.officeName}
          district={race.districtName ?? undefined}
          electionDate={race.electionDate}
          electionType={ELECTION_TYPE_LABELS[race.electionType]}
          status={race.status}
          rating={race.rating}
          competitive={race.competitive}
          summary={race.description ?? undefined}
          raceHref={ELECTION_ROUTES.race(race.slug)}
          candidates={race.candidates
            .filter((opponent) => opponent.id !== candidate.id)
            .map((opponent) => ({
              id: opponent.id,
              name: opponent.fullName,
              partyLabel: opponent.partyLabel ?? undefined,
              incumbent: opponent.incumbent,
            }))}
        />
      )}
    </section>
  );
}

export default CandidateRaceSection;
