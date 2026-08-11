import { RelatedResources } from "../resources";
import { ELECTION_INTERNAL_LINKS, ELECTION_ROUTES } from "@/lib/elections";
import type { CandidateDetail, RaceDetail } from "@/types/elections";

export interface CandidateInternalLinksProps {
  candidate: CandidateDetail;
  race: RaceDetail | null;
}

function districtPathForRaceSlug(slug: string): { href: string; title: string } | null {
  const patterns: Array<[RegExp, string, string]> = [
    [/^2026-us-house-district-(\d{1,2})$/, "congressional-district", "Texas Congressional District"],
    [/^2026-texas-house-district-(\d{1,3})$/, "texas-house-district", "Texas House District"],
    [/^2026-texas-senate-district-(\d{1,2})$/, "texas-senate-district", "Texas Senate District"],
  ];
  for (const [pattern, prefix, label] of patterns) {
    const match = pattern.exec(slug);
    if (match) {
      return {
        href: `/elections/districts/${prefix}-${match[1]}`,
        title: `${label} ${match[1]} election page`,
      };
    }
  }
  return null;
}

export function CandidateInternalLinks({ candidate, race }: CandidateInternalLinksProps) {
  const district = race ? districtPathForRaceSlug(race.slug) : null;
  const resources = [
    ...(race
      ? [
          {
            title: race.name,
            href: ELECTION_ROUTES.race(race.slug),
            description: `Review the full ${race.officeName} race.`,
            eyebrow: "Related race",
          },
          ...(district
            ? [
                {
                  title: district.title,
                  href: district.href,
                  description: "Open the district hub for its race, verified candidates, geography, and election resources.",
                  eyebrow: "Election district",
                },
              ]
            : []),
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
      description="Continue to the related race, district, other candidates, and trusted Texas election guidance."
    />
  );
}

export default CandidateInternalLinks;
