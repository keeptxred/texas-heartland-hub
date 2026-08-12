import { Link } from "@tanstack/react-router";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import type { RaceDetail } from "@/types/elections";

export interface RaceAuthoritySectionProps {
  race: RaceDetail;
}

function formatDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function districtSlug(race: RaceDetail) {
  if (!race.districtNumber) return null;
  if (race.jurisdictionType === "congressional_district") {
    return `congressional-district-${race.districtNumber}`;
  }
  if (race.jurisdictionType === "state_house_district") {
    return `texas-house-district-${race.districtNumber}`;
  }
  if (race.jurisdictionType === "state_senate_district") {
    return `texas-senate-district-${race.districtNumber}`;
  }
  return null;
}

export function RaceAuthoritySection({ race }: RaceAuthoritySectionProps) {
  const slug = districtSlug(race);
  const sources = [
    {
      name: race.source.sourceName,
      url: race.source.sourceUrl,
      note: "Primary race record.",
    },
    race.geographySource
      ? {
          name: race.geographySource.sourceName,
          url: race.geographySource.sourceUrl,
          note: "District geography and boundary reference.",
        }
      : null,
    race.countyElectionLinkSource
      ? {
          name: "Official county election directory",
          url: race.countyElectionLinkSource.sourceUrl,
          note: "Address-specific ballot and local election verification.",
        }
      : null,
  ].filter((source): source is { name: string; url: string; note: string } => Boolean(source));

  return (
    <section aria-labelledby="race-authority-heading" className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          Race authority record
        </p>
        <h2 id="race-authority-heading" className="mt-2 text-2xl font-bold text-slate-950">
          Dates, geography, and official sources
        </h2>
      </div>

      <dl className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <RaceFact label="Registration deadline" value={formatDate(race.registrationDeadline)} />
        <RaceFact label="Early voting begins" value={formatDate(race.earlyVotingStart)} />
        <RaceFact label="Early voting ends" value={formatDate(race.earlyVotingEnd)} />
        <RaceFact label="Election Day" value={formatDate(race.electionDate)} />
      </dl>

      {race.counties.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-950">District and county geography</h3>
          <p className="mt-2 leading-7 text-slate-600">
            District boundaries may include all or part of a county. Use an official county ballot
            lookup to confirm the contests assigned to a specific address.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {race.counties.map((county) => (
              <a
                key={county.id}
                href={`/explore/county/${county.slug}`}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-700"
              >
                {county.name}
              </a>
            ))}
          </div>
          {slug ? (
            <Link
              to="/elections/districts/$districtSlug"
              params={{ districtSlug: slug }}
              className="mt-5 inline-flex font-semibold text-red-700 hover:underline"
            >
              View {race.districtName ?? "district"} authority page →
            </Link>
          ) : null}
        </div>
      ) : null}

      <CitationTrustPanel
        sources={sources}
        methodology="KeepTXRed publishes this race from verified election records, keeps district geography separate from address-specific ballot assignment, and normalizes recurring election dates and status fields across race pages. Polling, forecasts, and editorial analysis are displayed in separate sections and are not treated as primary-source race facts."
        lastVerified={`${formatDate((race.lastCheckedAt ?? "").slice(0, 10))}. Freshness status: ${race.freshnessStatus}.`}
      />
    </section>
  );
}

function RaceFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-slate-950">{value}</dd>
    </div>
  );
}

export default RaceAuthoritySection;
