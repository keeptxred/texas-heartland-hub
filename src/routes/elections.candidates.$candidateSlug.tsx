import { createFileRoute } from "@tanstack/react-router";
import candidates from "@/data/elections/2026/candidates.json";
import {
  CandidateBiographySection,
  CandidateCampaignLinks,
  CandidateDetailSeo,
  CandidateExpandedProfile,
  CandidateInternalLinks,
  CandidateOfficeHistory,
  CandidatePollingSection,
  CandidateRaceSection,
  CandidateResultsSection,
  CandidateSourcesSection,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import {
  useElectionCandidate,
  useElectionRace,
  usePollsByCandidate,
  useResultByRace,
} from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/candidates/$candidateSlug")({
  head: ({ params }) => {
    const record = candidates.find(
      (item) =>
        item.slug === params.candidateSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );
    const validSlug = isElectionSlug(params.candidateSlug);
    const indexable = validSlug && Boolean(record);
    const canonicalUrl = `https://keeptxred.com/elections/candidates/${params.candidateSlug}`;
    const recordName =
      record && "fullName" in record && typeof record.fullName === "string"
        ? record.fullName
        : record && "name" in record && typeof record.name === "string"
          ? record.name
          : "Texas Election Candidate";
    const recordDescription =
      record && "biography" in record && typeof record.biography === "string" && record.biography
        ? record.biography
        : record && "description" in record && typeof record.description === "string" && record.description
          ? record.description
          : "View verified information for this Texas election candidate.";
    const recordImage =
      record &&
      "imageUrl" in record &&
      typeof record.imageUrl === "string" &&
      record.imageUrl &&
      "imageRights" in record &&
      record.imageRights &&
      typeof record.imageRights === "object" &&
      "usageStatus" in record.imageRights &&
      record.imageRights.usageStatus === "approved"
        ? record.imageUrl
        : null;
    const title = indexable
      ? `${recordName} | KeepTXRed Election Central`
      : "Election candidate not found | KeepTXRed";

    return {
      meta: [
        { title },
        { name: "description", content: recordDescription },
        {
          name: "robots",
          content: indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow",
        },
        ...(indexable
          ? [
              { property: "og:title", content: title },
              { property: "og:description", content: recordDescription },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: title },
              { name: "twitter:description", content: recordDescription },
              ...(recordImage
                ? [
                    { property: "og:image", content: recordImage },
                    { property: "og:image:alt", content: `Portrait of ${recordName}` },
                    { name: "twitter:image", content: recordImage },
                  ]
                : []),
            ]
          : []),
      ],
      links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : [],
      scripts: indexable
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: recordName,
                description: recordDescription,
                url: canonicalUrl,
                ...(recordImage ? { image: recordImage } : {}),
                affiliation: {
                  "@type": "Organization",
                  name:
                    record && "partyLabel" in record && typeof record.partyLabel === "string"
                      ? record.partyLabel
                      : record && "party" in record && typeof record.party === "string"
                        ? record.party
                        : "Candidate",
                },
              }).replace(/</g, "\\u003c"),
            },
          ]
        : [],
    };
  },
  component: ElectionCandidateDetailRoute,
});

function ElectionCandidateDetailRoute() {
  const { candidateSlug } = Route.useParams();
  const validSlug = isElectionSlug(candidateSlug);
  const indexable =
    validSlug &&
    candidates.some(
      (item) =>
        item.slug === candidateSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Candidate"
        description="Verified candidate details from KeepTXRed Election Central."
        indexable={indexable}
        canonicalUrl={
          indexable ? `https://keeptxred.com/elections/candidates/${candidateSlug}` : undefined
        }
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.candidates} />}
      >
        {indexable ? (
          <ElectionCandidateDetailData candidateSlug={candidateSlug} />
        ) : (
          <ElectionErrorState
            kind="not_found"
            title="Election candidate not found"
            message="This candidate URL is invalid. Return to the candidate list to browse published Texas election candidates."
          />
        )}
      </ElectionLayout>
    </ElectionRepositoryProvider>
  );
}

function ElectionCandidateDetailData({ candidateSlug }: { candidateSlug: string }) {
  const candidate = useElectionCandidate({
    slug: electionSlugs.candidate(candidateSlug),
  });
  const race = useElectionRace({ id: candidate.data?.primaryRaceId ?? undefined });
  const polls = usePollsByCandidate(candidate.data?.id);
  const result = useResultByRace(candidate.data?.primaryRaceId ?? undefined);
  const error = candidate.error ?? race.error ?? polls.error ?? result.error;
  const isLoading = candidate.isLoading || race.isLoading || polls.isLoading || result.isLoading;

  const handleRetry = () => {
    void candidate.refetch();
    void race.refetch();
    void polls.refetch();
    void result.refetch();
  };

  if (isLoading) {
    return <ElectionLoading variant="detail" label="Loading Texas election candidate details" />;
  }

  if (error) {
    return (
      <ElectionErrorState
        kind="service"
        title="Election candidate details could not be loaded"
        technicalMessage={error.message}
        retryAction={{ label: "Try again", onClick: handleRetry }}
      />
    );
  }

  if (candidate.isMissing || !candidate.data) {
    return (
      <ElectionErrorState
        kind="not_found"
        title="Election candidate not found"
        message="This candidate is not published or is no longer available."
      />
    );
  }

  return (
    <div className="space-y-10">
      <CandidateDetailSeo candidate={candidate.data} race={race.data ?? null} />
      <CandidateBiographySection candidate={candidate.data} race={race.data ?? null} />
      <CandidateCampaignLinks candidate={candidate.data} />
      <CandidateOfficeHistory candidate={candidate.data} />
      <CandidateRaceSection candidate={candidate.data} race={race.data ?? null} />
      <CandidateExpandedProfile candidate={candidate.data} />
      <CandidatePollingSection
        candidate={candidate.data}
        polls={polls.data?.items ?? []}
        hasStaleData={polls.hasStaleData}
      />
      <CandidateResultsSection
        candidate={candidate.data}
        result={result.data ?? null}
        isPreElection={result.isPreElection}
      />
      <CandidateSourcesSection candidate={candidate.data} />
      <CandidateInternalLinks candidate={candidate.data} race={race.data ?? null} />
    </div>
  );
}
