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
      className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{office}</p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">{name}</h3>
          {district && <p className="mt-1 text-sm text-muted-foreground">{district}</p>}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {competitive && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
              Competitive
            </span>
          )}
          {rating && (
            <span className="rounded-full bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-inset ring-border">
              {RATING_LABELS[rating] ?? rating}
            </span>
          )}
        </div>
      </div>

      {(electionDate || electionType || status) && (
        <dl className="mt-5 grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-3">
          {electionDate && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Election date
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{electionDate}</dd>
            </div>
          )}
          {electionType && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Election type
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{electionType}</dd>
            </div>
          )}
          {status && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 font-semibold text-foreground">{RACE_STATUS_LABELS[status]}</dd>
            </div>
          )}
        </dl>
      )}

      {summary && <p className="mt-4 text-sm leading-6 text-muted-foreground">{summary}</p>}

      {candidates.length > 0 && (
        <section aria-label={`${name} candidates`} className="mt-5">
          <h4 className="text-sm font-semibold text-foreground">Candidates</h4>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {candidates.map((candidate) => (
              <li
                key={candidate.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  {candidate.candidateHref ? (
                    <a
                      href={candidate.candidateHref}
                      className="font-semibold text-foreground hover:text-primary hover:underline"
                    >
                      {candidate.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-foreground">{candidate.name}</span>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
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
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View race details →
          </a>
        ) : null}
        {relatedLinks.map((link) => (
          <a
            key={`${link.href}-${link.label}`}
            href={link.href}
            title={link.relevance}
            className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {link.label} →
          </a>
        ))}
      </div>
    </article>
  );
}

export default RaceCard;
