import { RelatedResources } from "../resources";
import { ELECTION_INTERNAL_LINKS, ELECTION_ROUTES } from "@/lib/elections";
import type { CandidateSummary, RaceDetail } from "@/types/elections";

export interface RaceInternalLinksProps {
  candidates: readonly CandidateSummary[];
  relatedRaces: readonly RaceDetail[];
}

export function RaceInternalLinks({ candidates, relatedRaces }: RaceInternalLinksProps) {
  const resources = [
    ...relatedRaces.map((race) => ({
      title: race.name,
      href: ELECTION_ROUTES.race(race.slug),
      description: `Review the related ${race.officeName} race.`,
      eyebrow: "Related race",
    })),
    ...candidates.map((candidate) => ({
      title: `${candidate.ballotName} candidate profile`,
      href: ELECTION_ROUTES.candidate(candidate.slug),
      description: "Review verified candidate information and race assignments.",
      eyebrow: "Candidate",
    })),
    {
      title: "Register to vote in Texas",
      href: ELECTION_INTERNAL_LINKS.registerToVote,
      description: "Review Texas eligibility, deadlines, and registration steps.",
      eyebrow: "Voting guide",
    },
    {
      title: "Texas election laws",
      href: ELECTION_INTERNAL_LINKS.texasLaws,
      description: "Understand the rules governing voting and election administration.",
      eyebrow: "Texas laws",
    },
    {
      title: "Texas politics coverage",
      href: ELECTION_INTERNAL_LINKS.texasPolitics,
      description: "Follow Texas campaigns, policy debates, and political reporting.",
      eyebrow: "Politics",
    },
  ];

  return (
    <RelatedResources
      resources={resources}
      title="Related election resources"
      description="Continue exploring this race, its candidates, and practical Texas election guidance."
    />
  );
}

export default RaceInternalLinks;
