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
    <article className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Election forecast</p>
          <a href={raceHref} className="mt-2 inline-block text-xl font-bold tracking-tight text-slate-950 underline-offset-4 hover:text-red-700 hover:underline">
            {raceName}
          </a>
          <p className="mt-1 text-sm text-slate-500">Updated {generatedAt} · Model {modelVersion}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">{ratingLabel}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {normalizedConfidence.toFixed(0)}% confidence
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-slate-700">Model confidence</span>
          <span className="font-mono font-bold text-slate-950">{normalizedConfidence.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" aria-label={`Model confidence ${normalizedConfidence.toFixed(1)} percent`}>
          <div className="h-full rounded-full bg-red-700" style={{ width: `${normalizedConfidence}%` }} />
        </div>
        {projectedMargin != null && (
          <p className="mt-3 text-sm font-semibold text-slate-700">
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
                    <a href={candidate.candidateHref} className="font-semibold text-slate-950 underline-offset-4 hover:text-red-700 hover:underline">
                      {candidate.candidateName}
                    </a>
                  ) : (
                    <span className="font-semibold text-slate-950">{candidate.candidateName}</span>
                  )}
                  {candidate.partyLabel && <span className="ml-2 text-slate-500">{candidate.partyLabel}</span>}
                </div>
                <span className="shrink-0 font-mono font-bold text-slate-950">{probability.toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-red-700" style={{ width: `${probability}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {modelInputs.length > 0 && (
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {modelInputs.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-1 font-semibold text-slate-900">{value.toFixed(0)}% weight</dd>
            </div>
          ))}
        </dl>
      )}

      {notes && <p className="mt-5 text-sm leading-6 text-slate-600">{notes}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5 text-sm">
        <a href={raceHref} className="font-semibold text-red-700 underline-offset-4 hover:underline">View race overview →</a>
        {methodologyHref && (
          <a href={methodologyHref} className="font-semibold text-slate-700 underline-offset-4 hover:text-red-700 hover:underline">
            How this forecast works →
          </a>
        )}
      </div>

      {relatedLinks.length > 0 && (
        <nav aria-label="Related forecast resources" className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Related KeepTXRed resources</p>
          <ul className="mt-3 space-y-2">
            {relatedLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a href={link.href} title={link.relevance} className="text-sm font-semibold text-red-700 underline-offset-4 hover:underline">
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
