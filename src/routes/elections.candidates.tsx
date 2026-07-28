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

const CANDIDATE_SORT_OPTIONS = [
  { value: "last_name", label: "Last name" },
  { value: "office", label: "Office" },
  { value: "party", label: "Party" },
  { value: "race_date", label: "Race date" },
] as const;

type CandidateSortOption = (typeof CANDIDATE_SORT_OPTIONS)[number]["value"];

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
  const [sortBy, setSortBy] = useState<CandidateSortOption>("last_name");
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
    sort: [{ field: sortBy, direction: "asc" }],
  });

  return (
    <ElectionCandidateListPage
      error={candidates.error}
      isLoading={candidates.isLoading}
      onRetry={() => void candidates.refetch()}
    >
      <div className="space-y-6">
        <label className="block max-w-xs text-sm font-semibold text-slate-900">
          Sort candidates
          <select
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            value={sortBy}
            onChange={(event) => {
              const option = CANDIDATE_SORT_OPTIONS.find(
                (item) => item.value === event.target.value,
              );
              if (option) {
                setSortBy(option.value);
              }
            }}
          >
            {CANDIDATE_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
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
