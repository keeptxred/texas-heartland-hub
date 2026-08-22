import type { ElectionResourceLink } from "@/types/elections";

export interface PollCardResult {
  candidateId: string;
  candidateName: string;
  partyLabel?: string;
  percentage: number;
  candidateHref?: string;
}

export interface PollCardProps {
  pollster: string;
  raceName?: string;
  raceHref?: string;
  fieldDates: string;
  publishedDate?: string;
  sampleSize: number;
  populationLabel: string;
  methodologyLabel: string;
  marginOfError?: number | null;
  grade?: string | null;
  sponsor?: string | null;
  results: readonly PollCardResult[];
  sourceUrl?: string;
  disclosureLabels?: readonly string[];
  relatedLinks?: readonly ElectionResourceLink[];
  className?: string;
}

export function PollCard({
  pollster,
  raceName,
  raceHref,
  fieldDates,
  publishedDate,
  sampleSize,
  populationLabel,
  methodologyLabel,
  marginOfError,
  grade,
  sponsor,
  results,
  sourceUrl,
  disclosureLabels = [],
  relatedLinks = [],
  className = "",
}: PollCardProps) {
  const sortedResults = [...results].sort((a, b) => b.percentage - a.percentage);
  const leader = sortedResults[0];
  const runnerUp = sortedResults[1];
  const spread = leader && runnerUp ? leader.percentage - runnerUp.percentage : null;

  return (
    <article
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Latest poll</p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">{pollster}</h3>
          {raceName && raceHref ? (
            <a
              href={raceHref}
              className="mt-1 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {raceName}
            </a>
          ) : raceName ? (
            <p className="mt-1 text-sm font-semibold text-muted-foreground">{raceName}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {grade && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              Pollster grade {grade}
            </span>
          )}
          {spread !== null && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Leader +{spread.toFixed(1)}
            </span>
          )}
          {disclosureLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <PollDetail label="Field dates" value={fieldDates} />
        <PollDetail
          label="Sample"
          value={`${sampleSize.toLocaleString("en-US")} ${populationLabel}`}
        />
        <PollDetail label="Method" value={methodologyLabel} />
        <PollDetail
          label="Margin of error"
          value={marginOfError == null ? "Not reported" : `±${marginOfError}%`}
        />
        {publishedDate && <PollDetail label="Published" value={publishedDate} />}
        {sponsor && <PollDetail label="Sponsor" value={sponsor} />}
      </dl>

      <div className="mt-6 space-y-3" aria-label={`${pollster} poll results`}>
        {sortedResults.map((result) => (
          <div key={result.candidateId}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                {result.candidateHref ? (
                  <a
                    href={result.candidateHref}
                    className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    {result.candidateName}
                  </a>
                ) : (
                  <span className="font-semibold text-foreground">{result.candidateName}</span>
                )}
                {result.partyLabel && (
                  <span className="ml-2 text-muted-foreground">{result.partyLabel}</span>
                )}
              </div>
              <span className="shrink-0 font-mono font-bold text-foreground">
                {result.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, result.percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5 text-sm">
        {raceHref ? (
          <a
            href={raceHref}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            View race overview →
          </a>
        ) : null}
        {sourceUrl && (
          <a
            href={sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            View poll source ↗
          </a>
        )}
      </div>

      {relatedLinks.length > 0 && (
        <nav aria-label="Related poll resources" className="mt-5 rounded-lg bg-muted/40 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Related KeepTXRed resources
          </p>
          <ul className="mt-3 space-y-2">
            {relatedLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  title={link.relevance}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {link.label} →
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}

function PollDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export default PollCard;
