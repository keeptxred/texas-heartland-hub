import { RelatedResources } from "../resources";
import { ELECTION_INTERNAL_LINKS, ELECTION_ROUTES } from "@/lib/elections";
import type { CandidateDetail, RaceDetail } from "@/types/elections";

export interface CandidateInternalLinksProps {
  candidate: CandidateDetail;
  race: RaceDetail | null;
}

export function CandidateInternalLinks({ candidate, race }: CandidateInternalLinksProps) {
  const resources = [
    ...(race
      ? [
          {
            title: race.name,
            href: ELECTION_ROUTES.race(race.slug),
            description: `Review the full ${race.officeName} race.`,
            eyebrow: "Related race",
          },
          ...race.candidates
            .filter((otherCandidate) => otherCandidate.id !== candidate.id)
            .map((otherCandidate) => ({
              title: `${otherCandidate.fullName} candidate profile`,
              href: ELECTION_ROUTES.candidate(otherCandidate.slug),
              description: "Review another candidate in this race.",
              eyebrow: "Other candidate",
            })),
        ]
      : []),
    {
      title: "Texas election laws",
      href: ELECTION_INTERNAL_LINKS.texasLaws,
      description: "Review rules governing Texas voting and elections.",
      eyebrow: "Texas laws",
    },
    {
      title: "Register to vote in Texas",
      href: ELECTION_INTERNAL_LINKS.registerToVote,
      description: "Review eligibility, deadlines, and registration steps.",
      eyebrow: "Voting guide",
    },
    {
      title: "Texas politics coverage",
      href: ELECTION_INTERNAL_LINKS.texasPolitics,
      description: "Follow Texas campaigns, policy, and political reporting.",
      eyebrow: "Politics",
    },
  ];

  return (
    <RelatedResources
      resources={resources}
      title="Related candidate resources"
      description="Continue to the related race, other candidates, and trusted Texas election guidance."
    />
  );
}

export default CandidateInternalLinks;
