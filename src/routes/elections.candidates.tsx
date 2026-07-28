import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CandidateCard, CandidateListFilters, ElectionEmptyState } from "@/components/elections";
import { useElectionCandidates } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionCandidateListPage } from "@/pages/elections";
import type {
  CandidateParty,
  CandidateStatus,
  IncumbencyType,
  OfficeLevel,
} from "@/types/elections";

export const Route = createFileRoute("/elections/candidates")({
  head: () => ({
    meta: [
      {
        title: "Texas Election Candidates | KeepTXRed Election Central",
      },
      {
        name: "description",
        content:
          "Browse verified candidate information for published Texas election races, including party, filing, incumbency, and race details.",
      },
      {
        property: "og:title",
        content: "Texas Election Candidates | KeepTXRed Election Central",
      },
      {
        property: "og:description",
        content:
          "Review published candidate profiles for Texas statewide, congressional, legislative, county, and local races.",
      },
      { property: "og:url", content: "/elections/candidates" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/candidates",
      },
    ],
  }),
  component: ElectionCandidatesRoute,
});

function ElectionCandidatesRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionCandidatesContent />
    </ElectionRepositoryProvider>
  );
}

function ElectionCandidatesContent() {
  const [party, setParty] = useState<CandidateParty | null>(null);
  const [officeLevel, setOfficeLevel] = useState<OfficeLevel | null>(null);
  const [status, setStatus] = useState<CandidateStatus | null>(null);
  const [incumbency, setIncumbency] = useState<IncumbencyType | null>(null);
  const candidates = useElectionCandidates({
    filters: {
      stateCodes: ["TX"],
      parties: party ? [party] : undefined,
      officeLevels: officeLevel ? [officeLevel] : undefined,
      statuses: status ? [status] : undefined,
      incumbencyTypes: incumbency ? [incumbency] : undefined,
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 50 },
    sort: [{ field: "last_name", direction: "asc" }],
  });

  return (
    <ElectionCandidateListPage
      error={candidates.error}
      isLoading={candidates.isLoading}
      onRetry={() => void candidates.refetch()}
    >
      <div className="space-y-6">
        <CandidateListFilters
          party={party}
          officeLevel={officeLevel}
          status={status}
          incumbency={incumbency}
          onPartyChange={setParty}
          onOfficeLevelChange={setOfficeLevel}
          onStatusChange={setStatus}
          onIncumbencyChange={setIncumbency}
        />
        {candidates.isEmpty ? (
          <ElectionEmptyState kind="filters" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {candidates.data?.items.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                name={candidate.ballotName}
                party={candidate.party}
                partyLabel={candidate.partyLabel ?? undefined}
                office={candidate.primaryRace?.officeName}
                district={candidate.primaryRace?.districtName ?? undefined}
                incumbent={
                  candidate.incumbencyType === "incumbent" ||
                  candidate.incumbencyType === "appointed_incumbent"
                }
                status={candidate.status}
                photoUrl={candidate.imageUrl}
                occupation={candidate.occupation}
                hometown={candidate.hometown}
                raceHref={
                  candidate.primaryRace
                    ? ELECTION_ROUTES.race(candidate.primaryRace.slug)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </ElectionCandidateListPage>
  );
}
