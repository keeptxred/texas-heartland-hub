import type { ElectionResourceLink, RaceRating, RaceStatus } from "@/types/elections";
import { RACE_STATUS_LABELS } from "@/types/elections/raceClassifications";

export interface RaceCardCandidate {
  id: string;
  name: string;
  partyLabel?: string;
  candidateHref?: string;
  incumbent?: boolean;
}

export interface RaceCardProps {
  name: string;
  office: string;
  district?: string;
  electionDate?: string;
  electionType?: string;
  status?: RaceStatus;
  rating?: RaceRating;
  candidates?: readonly RaceCardCandidate[];
  raceHref?: string;
  summary?: string;
  competitive?: boolean;
  relatedLinks?: readonly ElectionResourceLink[];
  className?: string;
}

const RATING_LABELS: Partial<Record<RaceRating, string>> = {
  safe_republican: "Safe Republican",
  likely_republican: "Likely Republican",
  leans_republican: "Leans Republican",
  toss_up: "Toss-up",
  leans_democratic: "Leans Democratic",
  likely_democratic: "Likely Democratic",
  safe_democratic: "Safe Democratic",
  unrated: "Unrated",
};

export function RaceCard({
  name,
  office,
  district,
  electionDate,
  electionType,
  status,
  rating,
  candidates = [],
  raceHref,
  summary,
  competitive = false,
  relatedLinks = [],
  className = "",
}: RaceCardProps) {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">{office}</p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{name}</h3>
          {district && <p className="mt-1 text-sm text-slate-600">{district}</p>}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {competitive && (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
              Competitive
            </span>
          )}
          {rating && (
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
              {RATING_LABELS[rating] ?? rating}
            </span>
          )}
        </div>
      </div>

      {(electionDate || electionType || status) && (
        <dl className="mt-5 grid gap-3 border-y border-slate-100 py-4 text-sm sm:grid-cols-3">
          {electionDate && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Election date
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">{electionDate}</dd>
            </div>
          )}
          {electionType && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Election type
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">{electionType}</dd>
            </div>
          )}
          {status && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </dt>
              <dd className="mt-1 font-semibold text-slate-900">{RACE_STATUS_LABELS[status]}</dd>
            </div>
          )}
        </dl>
      )}

      {summary && <p className="mt-4 text-sm leading-6 text-slate-600">{summary}</p>}

      {candidates.length > 0 && (
        <section aria-label={`${name} candidates`} className="mt-5">
          <h4 className="text-sm font-semibold text-slate-950">Candidates</h4>
          <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
            {candidates.map((candidate) => (
              <li
                key={candidate.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  {candidate.candidateHref ? (
                    <a
                      href={candidate.candidateHref}
                      className="font-semibold text-slate-950 hover:text-red-700 hover:underline"
                    >
                      {candidate.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-slate-950">{candidate.name}</span>
                  )}
                  <div className="mt-1 text-xs text-slate-500">
                    {[candidate.partyLabel, candidate.incumbent ? "Incumbent" : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {raceHref ? (
          <a
            href={raceHref}
            className="text-sm font-semibold text-red-700 underline-offset-4 hover:underline"
          >
            View race details →
          </a>
        ) : null}
        {relatedLinks.map((link) => (
          <a
            key={`${link.href}-${link.label}`}
            href={link.href}
            title={link.relevance}
            className="text-sm font-semibold text-slate-700 underline-offset-4 hover:text-red-700 hover:underline"
          >
            {link.label} →
          </a>
        ))}
      </div>
    </article>
  );
}

export default RaceCard;
