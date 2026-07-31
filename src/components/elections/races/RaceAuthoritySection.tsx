import { Link } from "@tanstack/react-router";
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

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-xl font-bold text-slate-950">Verification and primary sources</h3>
        <p className="mt-2 leading-7 text-slate-600">
          Race scope and election status are published only from verified records. Geography and
          county links are shown separately so district boundaries are not confused with an
          address-specific official ballot.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
          <a href={race.source.sourceUrl} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">
            {race.source.sourceName}
          </a>
          {race.geographySource ? (
            <a href={race.geographySource.sourceUrl} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">
              {race.geographySource.sourceName}
            </a>
          ) : null}
          {race.countyElectionLinkSource ? (
            <a href={race.countyElectionLinkSource.sourceUrl} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">
              Official county election directory
            </a>
          ) : null}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Data verified {formatDate(race.lastCheckedAt.slice(0, 10))}. Current freshness status:{" "}
          {race.freshnessStatus}.
        </p>
      </div>
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
