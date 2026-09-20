import type { ElectionResourceLink } from "@/types/elections";

export interface ForecastCandidateProbability {
  candidateId: string;
  candidateName: string;
  partyLabel?: string;
  probability: number;
  candidateHref?: string;
}

export interface ForecastCardProps {
  raceName: string;
  raceHref: string;
  ratingLabel: string;
  generatedAt: string;
  modelVersion: string;
  confidence: number;
  projectedMargin?: number | null;
  candidateProbabilities: readonly ForecastCandidateProbability[];
  pollingWeight?: number;
  fundamentalsWeight?: number;
  incumbencyWeight?: number;
  fundraisingWeight?: number;
  notes?: string | null;
  methodologyHref?: string;
  relatedLinks?: readonly ElectionResourceLink[];
  className?: string;
}

export function ForecastCard({
  raceName,
  raceHref,
  ratingLabel,
  generatedAt,
  modelVersion,
  confidence,
  projectedMargin,
  candidateProbabilities,
  pollingWeight,
  fundamentalsWeight,
  incumbencyWeight,
  fundraisingWeight,
  notes,
  methodologyHref,
  relatedLinks = [],
  className = "",
}: ForecastCardProps) {
  const sortedCandidates = [...candidateProbabilities].sort((a, b) => b.probability - a.probability);
  const normalizedConfidence = Math.min(100, Math.max(0, confidence));
  const modelInputs = [
    ["Polling", pollingWeight],
    ["Fundamentals", fundamentalsWeight],
    ["Incumbency", incumbencyWeight],
    ["Fundraising", fundraisingWeight],
  ].filter((entry): entry is [string, number] => typeof entry[1] === "number");

  return (
    <article className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Election forecast</p>
          <a href={raceHref} className="mt-2 inline-block text-xl font-bold tracking-tight text-foreground underline-offset-4 hover:text-primary hover:underline">
            {raceName}
          </a>
          <p className="mt-1 text-sm text-muted-foreground">Updated {generatedAt} · Model {modelVersion}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{ratingLabel}</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            {normalizedConfidence.toFixed(0)}% confidence
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-muted/40 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-muted-foreground">Model confidence</span>
          <span className="font-mono font-bold text-foreground">{normalizedConfidence.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" aria-label={`Model confidence ${normalizedConfidence.toFixed(1)} percent`}>
          <div className="h-full rounded-full bg-primary" style={{ width: `${normalizedConfidence}%` }} />
        </div>
        {projectedMargin != null && (
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            Projected margin: {projectedMargin > 0 ? "+" : ""}{projectedMargin.toFixed(1)} points
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3" aria-label={`${raceName} candidate win probabilities`}>
        {sortedCandidates.map((candidate) => {
          const probability = Math.min(100, Math.max(0, candidate.probability));

          return (
            <div key={candidate.candidateId}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  {candidate.candidateHref ? (
                    <a href={candidate.candidateHref} className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline">
                      {candidate.candidateName}
                    </a>
                  ) : (
                    <span className="font-semibold text-foreground">{candidate.candidateName}</span>
                  )}
                  {candidate.partyLabel && <span className="ml-2 text-muted-foreground">{candidate.partyLabel}</span>}
                </div>
                <span className="shrink-0 font-mono font-bold text-foreground">{probability.toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${probability}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {modelInputs.length > 0 && (
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {modelInputs.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted/40 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-semibold text-foreground">{value.toFixed(0)}% weight</dd>
            </div>
          ))}
        </dl>
      )}

      {notes && <p className="mt-5 text-sm leading-6 text-muted-foreground">{notes}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5 text-sm">
        <a href={raceHref} className="font-semibold text-primary underline-offset-4 hover:underline">View race overview →</a>
        {methodologyHref && (
          <a href={methodologyHref} className="font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
            How this forecast works →
          </a>
        )}
      </div>

      {relatedLinks.length > 0 && (
        <nav aria-label="Related forecast resources" className="mt-5 rounded-lg bg-muted/40 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Related KeepTXRed resources</p>
          <ul className="mt-3 space-y-2">
            {relatedLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a href={link.href} title={link.relevance} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
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

export default ForecastCard;
