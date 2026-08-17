import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useMemo, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { useActiveElectionCycle, useElectionRaces } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import type { JurisdictionType, RaceSummary } from "@/types/elections";

type DistrictLookupResult = {
  matchedAddress: string;
  districts: {
    congressional: string;
    texasSenate: string;
    texasHouse: string;
  };
};

export const Route = createFileRoute("/find-representative")({
  head: () => ({
    meta: [
      { title: "Find Your 2026 Texas Races & Representatives — Keep TX Red" },
      {
        name: "description",
        content:
          "Enter a Texas street address to find your U.S. House, Texas House, and Texas Senate districts and the verified 2026 KTR races tied to them.",
      },
      { property: "og:title", content: "Find Your 2026 Texas Races & Representatives" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/find-representative" }],
  }),
  component: FindRepRoute,
});

function FindRepRoute() {
  return (
    <ElectionRepositoryProvider>
      <FindRepPage />
    </ElectionRepositoryProvider>
  );
}

function FindRepPage() {
  const [address, setAddress] = useState("");
  const [lookup, setLookup] = useState<DistrictLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const activeCycle = useActiveElectionCycle();
  const races = useElectionRaces({
    filters: {
      electionCycleIds: activeCycle.data?.id ? [activeCycle.data.id] : [],
      electionTypes: ["general"],
      jurisdictionTypes: [
        "congressional_district",
        "state_house_district",
        "state_senate_district",
      ],
      publicationStatuses: ["published"],
      verificationStatuses: ["verified"],
      stateCodes: ["TX"],
    },
    pagination: { page: 1, pageSize: 500 },
    sort: [{ field: "name", direction: "asc" }],
  });

  const matchedRaces = useMemo(() => {
    if (!lookup) return [];
    return [
      buildMatch(
        "U.S. House",
        "Congressional District",
        "congressional-district",
        "congressional_district",
        lookup.districts.congressional,
        races.data?.items ?? [],
      ),
      buildMatch(
        "Texas House",
        "Texas House District",
        "texas-house-district",
        "state_house_district",
        lookup.districts.texasHouse,
        races.data?.items ?? [],
      ),
      buildMatch(
        "Texas Senate",
        "Texas Senate District",
        "texas-senate-district",
        "state_senate_district",
        lookup.districts.texasSenate,
        races.data?.items ?? [],
      ),
    ];
  }, [lookup, races.data?.items]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = address.trim();
    if (normalized.length < 8) {
      setLookup(null);
      setLookupError("Enter a full Texas street address, including city or ZIP code.");
      return;
    }

    setIsLookingUp(true);
    setLookup(null);
    setLookupError(null);
    try {
      const response = await fetch("/api/elections/district-lookup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address: normalized }),
      });
      const payload = (await response.json()) as DistrictLookupResult | { error?: string };
      if (!response.ok || !("districts" in payload)) {
        throw new Error(
          "error" in payload && payload.error
            ? payload.error
            : "The district lookup could not be completed.",
        );
      }
      setLookup(payload);
    } catch (error) {
      setLookupError(
        error instanceof Error ? error.message : "The district lookup could not be completed.",
      );
    } finally {
      setIsLookingUp(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="2026 Election Lookup"
        title="FIND YOUR"
        highlight="RACES"
        description="Enter your Texas street address to identify your congressional, Texas House, and Texas Senate districts and connect them to verified 2026 KTR race pages."
      />
      <div className="mx-auto max-w-5xl px-4 py-14">
        <form onSubmit={submit} className="border-2 border-foreground/10 bg-card p-6 md:p-8">
          <label
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            htmlFor="address"
          >
            Texas Street Address
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="address"
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              autoComplete="street-address"
              placeholder="e.g. 123 Main St, Houston, TX 77002"
              className="h-12 flex-1 border-2 border-foreground/20 bg-background px-4 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLookingUp}
              className="h-12 bg-primary px-6 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLookingUp ? "Finding…" : "Find My Races →"}
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            This lookup sends the address to the U.S. Census Bureau geocoder to resolve current
            legislative districts. KTR does not persist the submitted address.
          </p>
          {lookupError ? (
            <p className="mt-4 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
              {lookupError}
            </p>
          ) : null}
        </form>

        {lookup ? (
          <section className="mt-8 space-y-6" aria-live="polite">
            <div className="border-2 border-primary/30 bg-primary/5 p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Districts for</p>
              <h2 className="mt-2 font-display text-2xl">{lookup.matchedAddress}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                KTR matches these current districts against its published, verified 2026
                general-election race records.
              </p>

              {activeCycle.isLoading || races.isLoading ? (
                <p className="mt-6 text-sm text-muted-foreground">Loading verified 2026 races…</p>
              ) : activeCycle.error || races.error ? (
                <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  Districts were found, but KTR race data could not be loaded. Use the official
                  verification links below.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {matchedRaces.map((item) => (
                    <article key={item.label} className="border-2 border-foreground/10 bg-background p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.label}</p>
                      <h3 className="mt-1 font-display text-xl">{item.districtLabel}</h3>

                      {item.race ? (
                        <>
                          <h4 className="mt-4 font-semibold leading-6">{item.race.name}</h4>
                          {item.race.candidates.length ? (
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {item.race.candidates
                                .slice(0, 5)
                                .map((candidate) => candidate.fullName)
                                .join(" · ")}
                            </p>
                          ) : null}
                          <a
                            href={ELECTION_ROUTES.race(item.race.slug)}
                            className="mt-4 inline-block text-sm font-bold text-primary hover:underline"
                          >
                            View 2026 race →
                          </a>
                          <a
                            href={ELECTION_ROUTES.district(item.districtSlug)}
                            className="mt-3 block text-sm font-semibold text-primary hover:underline"
                          >
                            View district page →
                          </a>
                        </>
                      ) : (
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          No published KTR 2026 general-election race matches this district. Texas Senate seats are staggered,
                          so not every Senate district appears on the 2026 ballot.
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-foreground/10 pt-5">
                <a
                  href={ELECTION_ROUTES.statewide}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  View statewide 2026 Texas races that apply to every voter →
                </a>
              </div>
            </div>

            <div className="border-2 border-foreground/10 bg-card p-6">
              <h2 className="font-display text-xl">This is not your complete ballot</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This tool identifies the major federal and state legislative districts KTR currently
                tracks. County, city, school district, judicial, precinct, special-district, and
                proposition contests can vary by address. Confirm your official ballot with your
                county election authority.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <a
                  className="font-semibold text-primary underline"
                  href="https://wrm.capitol.texas.gov/home"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Verify Texas districts by address
                </a>
                <a
                  className="font-semibold text-primary underline"
                  href="https://teamrv-mvp.sos.texas.gov/MVP/mvp.do"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Texas SOS voter lookup
                </a>
                <Link to="/county-elections" className="font-semibold text-primary underline">
                  County election offices
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <div className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
          <Link to="/representatives" className="border-2 border-foreground/10 p-5 hover:border-primary">
            <strong className="font-display text-xl">Representatives</strong>
            <br />
            <span className="text-xs text-muted-foreground">Current officeholders</span>
          </Link>
          <Link to="/register-to-vote" className="border-2 border-foreground/10 p-5 hover:border-primary">
            <strong className="font-display text-xl">Register</strong>
            <br />
            <span className="text-xs text-muted-foreground">Get on the rolls</span>
          </Link>
          <Link to="/elections/2026" className="border-2 border-foreground/10 p-5 hover:border-primary">
            <strong className="font-display text-xl">Election Central</strong>
            <br />
            <span className="text-xs text-muted-foreground">Races, candidates, polls & results</span>
          </Link>
        </div>
      </div>
    </>
  );
}

function buildMatch(
  label: string,
  districtLabelPrefix: string,
  districtSlugPrefix: string,
  jurisdictionType: JurisdictionType,
  districtNumber: string,
  races: readonly RaceSummary[],
) {
  const race = findDistrictRace(races, jurisdictionType, districtNumber);
  return {
    label,
    districtLabel: `${districtLabelPrefix} ${districtNumber}`,
    districtSlug: `${districtSlugPrefix}-${districtNumber}`,
    race,
  };
}

function findDistrictRace(
  races: readonly RaceSummary[],
  jurisdictionType: JurisdictionType,
  districtNumber: string,
) {
  return (
    races.find(
      (race) =>
        race.jurisdictionType === jurisdictionType &&
        normalizeDistrictNumber(race.districtNumber) === normalizeDistrictNumber(districtNumber),
    ) ?? null
  );
}

function normalizeDistrictNumber(value: string | null) {
  const raw = String(value ?? "").trim();
  const numeric = Number(raw);
  return Number.isInteger(numeric) && numeric > 0 ? String(numeric) : raw;
}
