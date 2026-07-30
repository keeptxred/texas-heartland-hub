import type { RaceDetail } from "@/types/elections";
import {
  JURISDICTION_TYPE_LABELS,
  RACE_STATUS_LABELS,
} from "@/types/elections/raceClassifications";

export interface RaceDetailHeaderProps {
  race: RaceDetail;
}

function formatElectionDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function RaceDetailHeader({ race }: RaceDetailHeaderProps) {
  const jurisdiction = race.districtName ?? JURISDICTION_TYPE_LABELS[race.jurisdictionType];

  return (
    <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            {race.officeName}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {race.name}
          </h1>
          {race.description ? (
            <p className="mt-4 text-base leading-7 text-slate-600">{race.description}</p>
          ) : null}
        </div>
        {race.featured ? (
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-700 ring-1 ring-inset ring-red-200">
            Featured race
          </span>
        ) : null}
      </div>

      <dl className="mt-7 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Jurisdiction
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{jurisdiction}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Election date
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">
            <time dateTime={race.electionDate}>{formatElectionDate(race.electionDate)}</time>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">
            {RACE_STATUS_LABELS[race.status]}
          </dd>
        </div>
      </dl>
    </header>
  );
}

export default RaceDetailHeader;
