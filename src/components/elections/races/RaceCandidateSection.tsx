import { CandidateCard } from "../cards";
import { ElectionEmptyState } from "../states";
import { ELECTION_ROUTES } from "@/lib/elections";
import { getFeaturedCandidateProfile } from "@/lib/elections/featuredCandidateProfiles";
import type { CandidateSummary, RaceDetail } from "@/types/elections";

export interface RaceCandidateSectionProps {
  race: RaceDetail;
  candidates: readonly CandidateSummary[];
}

export function RaceCandidateSection({ race, candidates }: RaceCandidateSectionProps) {
  return (
    <section aria-labelledby="race-candidates-heading" className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Ballot field</p>
        <h2 id="race-candidates-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Candidates
        </h2>
      </div>

      {candidates.length === 0 ? (
        <ElectionEmptyState
          kind="candidates"
          title="No candidates are published for this race"
          message="Candidate cards will appear after filing and ballot information for this race has been verified."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {candidates.map((candidate) => {
            const featuredProfile = getFeaturedCandidateProfile(candidate.ballotName);
            return (
              <CandidateCard
                key={candidate.id}
                name={candidate.ballotName}
                party={candidate.party}
                partyLabel={candidate.partyLabel ?? undefined}
                office={race.officeName}
                district={race.districtName ?? undefined}
                incumbent={
                  candidate.incumbencyType === "incumbent" ||
                  candidate.incumbencyType === "appointed_incumbent"
                }
                status={candidate.status}
                photoUrl={candidate.imageUrl ?? featuredProfile?.imageUrl ?? null}
                occupation={candidate.occupation}
                hometown={candidate.hometown}
                profileHref={ELECTION_ROUTES.candidate(candidate.slug)}
                raceHref={ELECTION_ROUTES.race(race.slug)}
                className={candidate.status === "withdrawn" ? "border-amber-200 bg-amber-50/30" : undefined}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RaceCandidateSection;
