export interface FeaturedRaceLink {
  label: string;
  href: string;
}

export interface FeaturedRaceCandidate {
  name: string;
  party?: string;
  incumbent?: boolean;
}

export interface FeaturedRaceCardProps {
  office: string;
  district?: string;
  electionDate?: string;
  electionType?: string;
  rating?: string;
  status?: string;
  candidates?: readonly FeaturedRaceCandidate[];
  raceHref: string;
  contextualLinks?: readonly FeaturedRaceLink[];
  className?: string;
}

export function FeaturedRaceCard({
  office,
  district,
  electionDate,
  electionType,
  rating,
  status,
  candidates = [],
  raceHref,
  contextualLinks = [],
  className = "",
}: FeaturedRaceCardProps) {
  return (
    <article className={`flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Featured race</p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
            <a href={raceHref} className="hover:text-red-700 hover:underline">
              {office}
            </a>
          </h3>
          {district && <p className="mt-1 text-sm font-medium text-slate-600">{district}</p>}
        </div>
        {rating && (
          <span className="shrink-0 rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {rating}
          </span>
        )}
      </div>

      {(electionDate || electionType || status) && (
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          {electionDate && <RaceDetail label="Election date" value={electionDate} />}
          {electionType && <RaceDetail label="Election type" value={electionType} />}
          {status && <RaceDetail label="Status" value={status} />}
        </dl>
      )}

      {candidates.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-950">Candidates</h4>
          <ul className="mt-2 space-y-2">
            {candidates.slice(0, 4).map((candidate) => (
              <li key={`${candidate.name}-${candidate.party ?? "candidate"}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-900">
                  {candidate.name}{candidate.incumbent ? " (Incumbent)" : ""}
                </span>
                {candidate.party && <span className="text-xs font-semibold text-slate-500">{candidate.party}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-5">
        <a href={raceHref} className="inline-flex text-sm font-semibold text-red-700 underline-offset-4 hover:underline">
          View race details →
        </a>
        {contextualLinks.length > 0 && (
          <nav aria-label={`${office} related resources`} className="mt-4 border-t border-slate-200 pt-4">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {contextualLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a href={link.href} className="font-medium text-slate-700 underline-offset-4 hover:text-red-700 hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}

function RaceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export default FeaturedRaceCard;
