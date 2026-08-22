import { Outlet, createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ElectionEmptyState, ElectionResearchList, RaceCard } from "@/components/elections";
import {
  useActiveElectionCycle,
  useElectionCycles,
  useElectionRaces,
  useElectionResearchList,
} from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionRaceListPage } from "@/pages/elections";
import type { ElectionType, OfficeLevel, PartyScope, RaceStatus } from "@/types/elections";
import {
  ELECTION_TYPES,
  ELECTION_TYPE_LABELS,
  OFFICE_LEVELS,
  OFFICE_LEVEL_LABELS,
  PARTY_SCOPES,
  PARTY_SCOPE_LABELS,
  RACE_STATUSES,
  RACE_STATUS_LABELS,
  isElectionType,
  isOfficeLevel,
  isPartyScope,
  isRaceStatus,
} from "@/types/elections/raceClassifications";

const RACE_SORT_OPTIONS = [
  { value: "election_date", label: "Election date" },
  { value: "office_level", label: "Office level" },
  { value: "competitive", label: "Competitiveness" },
  { value: "name", label: "Alphabetical" },
] as const;

type RaceSortOption = (typeof RACE_SORT_OPTIONS)[number]["value"];

interface ElectionRaceListSearch {
  cycle?: string;
  officeLevel?: OfficeLevel;
  electionType?: ElectionType;
  partyScope?: PartyScope;
  status?: RaceStatus;
  featured?: boolean;
  sort?: RaceSortOption;
  q?: string;
  browse?: "county" | "congressional_district" | "state_house_district" | "state_senate_district";
  area?: string;
}

function parseRaceListSearch(search: Record<string, unknown>): ElectionRaceListSearch {
  return {
    cycle: typeof search.cycle === "string" && search.cycle ? search.cycle : undefined,
    officeLevel:
      typeof search.officeLevel === "string" && isOfficeLevel(search.officeLevel)
        ? search.officeLevel
        : undefined,
    electionType:
      typeof search.electionType === "string" && isElectionType(search.electionType)
        ? search.electionType
        : undefined,
    partyScope:
      typeof search.partyScope === "string" && isPartyScope(search.partyScope)
        ? search.partyScope
        : undefined,
    status:
      typeof search.status === "string" && isRaceStatus(search.status) ? search.status : undefined,
    featured: search.featured === true || search.featured === "true" ? true : undefined,
    sort: RACE_SORT_OPTIONS.find((option) => option.value === search.sort)?.value,
    q: typeof search.q === "string" && search.q.trim() ? search.q.trim() : undefined,
    browse:
      search.browse === "county" ||
      search.browse === "congressional_district" ||
      search.browse === "state_house_district" ||
      search.browse === "state_senate_district"
        ? search.browse
        : undefined,
    area: typeof search.area === "string" && search.area ? search.area : undefined,
  };
}

export const Route = createFileRoute("/elections/races")({
  validateSearch: parseRaceListSearch,
  head: () => ({
    meta: [
      { title: "Texas Election Races | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Browse verified Texas election races, candidates, election dates, ratings, and reporting status.",
      },
      {
        property: "og:title",
        content: "Texas Election Races | KeepTXRed Election Central",
      },
      {
        property: "og:description",
        content:
          "Follow published statewide, congressional, legislative, county, and local Texas election races.",
      },
      { property: "og:url", content: "https://keeptxred.com/elections/races" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/races",
      },
    ],
  }),
  component: ElectionRacesRoute,
});

function ElectionRacesRoute() {
  const { raceSlug } = useParams({ strict: false }) as { raceSlug?: string };

  if (raceSlug) {
    return <Outlet />;
  }

  return (
    <ElectionRepositoryProvider>
      <ElectionRacesContent />
    </ElectionRepositoryProvider>
  );
}

function ElectionRacesContent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const research = useElectionResearchList();
  const officeLevel = search.officeLevel ?? null;
  const electionType = search.electionType ?? null;
  const partyScope = search.partyScope ?? null;
  const raceStatus = search.status ?? null;
  const featuredOnly = search.featured ?? false;
  const sortBy = search.sort ?? "election_date";
  const activeCycle = useActiveElectionCycle();
  const cycles = useElectionCycles({
    filters: {
      stateCodes: ["TX"],
      publicationStatuses: ["published"],
    },
    sort: [{ field: "election_date", direction: "desc" }],
  });
  const restoredCycleId = cycles.data?.items.find((cycle) => cycle.id === search.cycle)?.id ?? null;
  const electionCycleId = restoredCycleId ?? activeCycle.data?.id ?? null;
  const races = useElectionRaces({
    filters: {
      electionCycleIds: electionCycleId ? [electionCycleId] : [],
      officeLevels: officeLevel ? [officeLevel] : undefined,
      electionTypes: electionType ? [electionType] : undefined,
      partyScopes: partyScope ? [partyScope] : undefined,
      statuses: raceStatus ? [raceStatus] : undefined,
      featured: featuredOnly || undefined,
      publicationStatuses: ["published"],
      search: search.q,
    },
    pagination: { page: 1, pageSize: 500 },
    sort: [
      {
        field: sortBy,
        direction: sortBy === "competitive" ? "desc" : "asc",
      },
    ],
  });
  const error = activeCycle.error ?? cycles.error ?? races.error;
  const browseOptions = Array.from(
    new Set(
      (races.data?.items ?? []).flatMap((race) => {
        if (search.browse === "county") return race.counties.map((county) => county.name);
        if (search.browse && race.jurisdictionType === search.browse && race.districtName) {
          return [race.districtName];
        }
        return [];
      }),
    ),
  ).sort();
  const visibleRaces = (races.data?.items ?? []).filter((race) => {
    if (!search.browse || !search.area) return true;
    if (search.browse === "county") {
      return race.counties.some((county) => county.name === search.area);
    }
    return race.jurisdictionType === search.browse && race.districtName === search.area;
  });
  const savedRaces = (races.data?.items ?? [])
    .filter((race) => research.raceIds.includes(race.id))
    .map((race) => ({
      id: race.id,
      label: race.name,
      href: ELECTION_ROUTES.race(race.slug),
    }));

  const updateSearch = (updates: Partial<ElectionRaceListSearch>) => {
    void navigate({
      search: (previous: any) => ({ ...previous, ...updates }),
      replace: true,
    });
  };

  const handleCycleChange = (value: string) => {
    const cycle = cycles.data?.items.find((item) => item.id === value);
    updateSearch({ cycle: cycle?.id });
  };

  const handleRetry = () => {
    void activeCycle.refetch();
    void cycles.refetch();
    void races.refetch();
  };

  const hasFilters = Boolean(
    search.q ||
      search.browse ||
      search.area ||
      officeLevel ||
      electionType ||
      partyScope ||
      raceStatus ||
      featuredOnly,
  );

  const clearFilters = () => {
    updateSearch({
      q: undefined,
      browse: undefined,
      area: undefined,
      officeLevel: undefined,
      electionType: undefined,
      partyScope: undefined,
      status: undefined,
      featured: undefined,
    });
  };

  return (
    <ElectionRaceListPage
      error={error}
      isLoading={activeCycle.isLoading || cycles.isLoading || races.isLoading}
      onRetry={handleRetry}
    >
      <div className="space-y-6">
        <ElectionResearchList
          entries={savedRaces}
          totalSaved={research.candidateIds.length + research.raceIds.length}
          onClear={research.clear}
        />

        <section
          aria-labelledby="browse-ballot-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Find a race</p>
              <h2 id="browse-ballot-heading" className="mt-1 text-lg font-bold text-foreground">
                Search and filter Texas races
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Search by candidate or office, browse a county or district, or narrow the directory by race type and status.
              </p>
            </div>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Clear all filters
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="text-sm font-semibold text-foreground">
              Candidate or office
              <input
                type="search"
                value={search.q ?? ""}
                onChange={(event) => updateSearch({ q: event.target.value || undefined })}
                placeholder="Search candidate or office"
                className="mt-2 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <RaceFilterSelect
              label="Browse by"
              value={search.browse ?? ""}
              options={[
                { value: "county", label: "County" },
                { value: "congressional_district", label: "Congressional district" },
                { value: "state_house_district", label: "Texas House district" },
                { value: "state_senate_district", label: "Texas Senate district" },
              ]}
              onChange={(value) =>
                updateSearch({
                  browse:
                    value === "county" ||
                    value === "congressional_district" ||
                    value === "state_house_district" ||
                    value === "state_senate_district"
                      ? value
                      : undefined,
                  area: undefined,
                })
              }
            />
            <RaceFilterSelect
              label="County or district"
              value={search.area ?? ""}
              options={browseOptions.map((value) => ({ value, label: value }))}
              onChange={(value) => updateSearch({ area: value || undefined })}
            />
          </div>

          <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cycles.data && cycles.data.items.length > 0 ? (
              <label className="block text-sm font-semibold text-foreground">
                Election cycle
                <select
                  className="mt-2 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={electionCycleId ?? ""}
                  onChange={(event) => handleCycleChange(event.target.value)}
                >
                  {cycles.data.items.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <RaceFilterSelect
              label="Sort races"
              value={sortBy}
              options={RACE_SORT_OPTIONS}
              includeAllOption={false}
              onChange={(value) => {
                const option = RACE_SORT_OPTIONS.find((item) => item.value === value);
                if (option) {
                  updateSearch({ sort: option.value });
                }
              }}
            />
            <RaceFilterSelect
              label="Office level"
              value={officeLevel ?? ""}
              options={OFFICE_LEVELS.map((value) => ({
                value,
                label: OFFICE_LEVEL_LABELS[value],
              }))}
              onChange={(value) =>
                updateSearch({
                  officeLevel: OFFICE_LEVELS.find((item) => item === value),
                })
              }
            />
            <RaceFilterSelect
              label="Election type"
              value={electionType ?? ""}
              options={ELECTION_TYPES.map((value) => ({
                value,
                label: ELECTION_TYPE_LABELS[value],
              }))}
              onChange={(value) =>
                updateSearch({
                  electionType: ELECTION_TYPES.find((item) => item === value),
                })
              }
            />
            <RaceFilterSelect
              label="Party scope"
              value={partyScope ?? ""}
              options={PARTY_SCOPES.map((value) => ({
                value,
                label: PARTY_SCOPE_LABELS[value],
              }))}
              onChange={(value) =>
                updateSearch({
                  partyScope: PARTY_SCOPES.find((item) => item === value),
                })
              }
            />
            <RaceFilterSelect
              label="Race status"
              value={raceStatus ?? ""}
              options={RACE_STATUSES.map((value) => ({
                value,
                label: RACE_STATUS_LABELS[value],
              }))}
              onChange={(value) =>
                updateSearch({
                  status: RACE_STATUSES.find((item) => item === value),
                })
              }
            />
          </div>

          <label className="mt-5 flex min-h-10 items-center gap-2 border-t border-border pt-5 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(event) => updateSearch({ featured: event.target.checked || undefined })}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            Featured races only
          </label>
        </section>

        {!electionCycleId || races.isEmpty || visibleRaces.length === 0 ? (
          <ElectionEmptyState kind={search.q || search.area ? "search" : "races"} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {visibleRaces.map((race) => (
              <div key={race.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => research.toggleRace(race.id)}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {research.raceIds.includes(race.id)
                    ? "Remove from ballot research"
                    : "Save to ballot research"}
                </button>
                <RaceCard
                  name={race.name}
                  office={race.officeName}
                  district={race.districtName ?? undefined}
                  electionDate={race.electionDate}
                  electionType={ELECTION_TYPE_LABELS[race.electionType]}
                  status={race.status}
                  rating={race.rating}
                  competitive={race.competitive}
                  raceHref={ELECTION_ROUTES.race(race.slug)}
                  candidates={race.candidates.map((candidate) => ({
                    id: candidate.id,
                    name: candidate.fullName,
                    partyLabel: candidate.partyLabel ?? undefined,
                    candidateHref: ELECTION_ROUTES.candidate(candidate.slug),
                    incumbent: candidate.incumbent,
                  }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </ElectionRaceListPage>
  );
}

interface RaceFilterSelectProps {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  includeAllOption?: boolean;
}

function RaceFilterSelect({
  label,
  value,
  options,
  onChange,
  includeAllOption = true,
}: RaceFilterSelectProps) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <select
        className="mt-2 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {includeAllOption ? <option value="">All</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
