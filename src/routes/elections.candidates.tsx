import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CandidateCard,
  CandidateComparison,
  CandidateListFilters,
  ElectionEmptyState,
  ElectionResearchList,
} from "@/components/elections";
import { useElectionCandidates, useElectionResearchList } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionCandidateListPage } from "@/pages/elections";
import type {
  CandidateParty,
  CandidateStatus,
  IncumbencyType,
  OfficeLevel,
} from "@/types/elections";
import { isCandidateStatus, isIncumbencyType } from "@/types/elections/candidateClassifications";
import { CANDIDATE_PARTIES } from "@/types/elections/domain";
import { isOfficeLevel } from "@/types/elections/raceClassifications";

const CANDIDATE_SORT_OPTIONS = [
  { value: "last_name", label: "Last name" },
  { value: "office", label: "Office" },
  { value: "party", label: "Party" },
  { value: "race_date", label: "Race date" },
] as const;

type CandidateSortOption = (typeof CANDIDATE_SORT_OPTIONS)[number]["value"];

interface ElectionCandidateListSearch {
  party?: CandidateParty;
  officeLevel?: OfficeLevel;
  status?: CandidateStatus;
  incumbency?: IncumbencyType;
  sort?: CandidateSortOption;
  q?: string;
}

function parseCandidateListSearch(search: Record<string, unknown>): ElectionCandidateListSearch {
  return {
    party:
      typeof search.party === "string"
        ? CANDIDATE_PARTIES.find((party) => party === search.party)
        : undefined,
    officeLevel:
      typeof search.officeLevel === "string" && isOfficeLevel(search.officeLevel)
        ? search.officeLevel
        : undefined,
    status: isCandidateStatus(search.status) ? search.status : undefined,
    incumbency: isIncumbencyType(search.incumbency) ? search.incumbency : undefined,
    sort: CANDIDATE_SORT_OPTIONS.find((option) => option.value === search.sort)?.value,
    q: typeof search.q === "string" && search.q.trim() ? search.q.trim() : undefined,
  };
}

export const Route = createFileRoute("/elections/candidates")({
  validateSearch: parseCandidateListSearch,
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
  const search = Route.useSearch();
  const [comparisonIds, setComparisonIds] = useState<readonly string[]>([]);
  const research = useElectionResearchList();
  const navigate = useNavigate({ from: Route.fullPath });
  const sortBy = search.sort ?? "last_name";
  const candidates = useElectionCandidates({
    filters: {
      stateCodes: ["TX"],
      parties: search.party ? [search.party] : undefined,
      officeLevels: search.officeLevel ? [search.officeLevel] : undefined,
      statuses: search.status ? [search.status] : undefined,
      incumbencyTypes: search.incumbency ? [search.incumbency] : undefined,
      publicationStatuses: ["published"],
      search: search.q,
    },
    pagination: { page: 1, pageSize: 50 },
    sort: [{ field: sortBy, direction: "asc" }],
  });

  const updateSearch = (updates: Partial<ElectionCandidateListSearch>) => {
    void navigate({
      search: (previous: any) => ({ ...previous, ...updates }),
      replace: true,
    });
  };
  const comparisonCandidates =
    candidates.data?.items.filter((candidate) => comparisonIds.includes(candidate.id)) ?? [];
  const savedCandidates =
    candidates.data?.items
      .filter((candidate) => research.candidateIds.includes(candidate.id))
      .map((candidate) => ({
        id: candidate.id,
        label: candidate.fullName,
        href: ELECTION_ROUTES.candidate(candidate.slug),
      })) ?? [];

  return (
    <ElectionCandidateListPage
      error={candidates.error}
      isLoading={candidates.isLoading}
      onRetry={() => void candidates.refetch()}
    >
      <div className="space-y-6">
        <ElectionResearchList
          entries={savedCandidates}
          totalSaved={research.candidateIds.length + research.raceIds.length}
          onClear={research.clear}
        />
        <CandidateComparison
          candidates={comparisonCandidates}
          onClear={() => setComparisonIds([])}
        />
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Select two to four published candidates below to compare their verified directory fields.
        </aside>
        <label className="block max-w-xl text-sm font-semibold text-slate-900">
          Search by candidate name or office
          <input
            type="search"
            value={search.q ?? ""}
            onChange={(event) => updateSearch({ q: event.target.value || undefined })}
            placeholder="Candidate or office"
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </label>
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
                updateSearch({ sort: option.value });
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
          party={search.party ?? null}
          officeLevel={search.officeLevel ?? null}
          status={search.status ?? null}
          incumbency={search.incumbency ?? null}
          onPartyChange={(party) => updateSearch({ party: party ?? undefined })}
          onOfficeLevelChange={(officeLevel) =>
            updateSearch({ officeLevel: officeLevel ?? undefined })
          }
          onStatusChange={(status) => updateSearch({ status: status ?? undefined })}
          onIncumbencyChange={(incumbency) => updateSearch({ incumbency: incumbency ?? undefined })}
        />
        {candidates.isEmpty ? (
          <ElectionEmptyState kind="filters" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {candidates.data?.items.map((candidate) => (
              <div key={candidate.id} className="space-y-2">
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={comparisonIds.includes(candidate.id)}
                    disabled={!comparisonIds.includes(candidate.id) && comparisonIds.length >= 4}
                    onChange={(event) =>
                      setComparisonIds((current) =>
                        event.target.checked
                          ? [...current, candidate.id]
                          : current.filter((id) => id !== candidate.id),
                      )
                    }
                  />
                  Compare {candidate.ballotName}
                </label>
                <button
                  type="button"
                  onClick={() => research.toggleCandidate(candidate.id)}
                  className="text-sm font-semibold text-blue-800 underline-offset-4 hover:underline"
                >
                  {research.candidateIds.includes(candidate.id)
                    ? "Remove from ballot research"
                    : "Save to ballot research"}
                </button>
                <CandidateCard
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
                  photoUrl={
                    candidate.imageRights?.usageStatus === "approved" ? candidate.imageUrl : null
                  }
                  occupation={candidate.occupation}
                  hometown={candidate.hometown}
                  profileHref={ELECTION_ROUTES.candidate(candidate.slug)}
                  raceHref={
                    candidate.primaryRace
                      ? ELECTION_ROUTES.race(candidate.primaryRace.slug)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </ElectionCandidateListPage>
  );
}
