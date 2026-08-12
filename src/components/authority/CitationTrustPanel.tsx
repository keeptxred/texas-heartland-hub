import { ExternalLink } from 'lucide-react';

export type CitationSource = {
  name: string;
  url?: string | null;
  note?: string | null;
};

export interface CitationTrustPanelProps {
  sources: CitationSource[];
  methodology: string;
  lastVerified: string;
  title?: string;
  className?: string;
}

export function CitationTrustPanel({
  sources,
  methodology,
  lastVerified,
  title = 'Sources and verification',
  className = '',
}: CitationTrustPanelProps) {
  return (
    <section
      aria-labelledby="citation-trust-heading"
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-6 ${className}`.trim()}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Reference notes</p>
      <h2 id="citation-trust-heading" className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-slate-950">Sources</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
            {sources.map((source) => (
              <li key={`${source.name}-${source.url ?? ''}`}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 font-semibold text-red-700 hover:underline"
                  >
                    {source.name}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : <span className="font-semibold text-slate-900">{source.name}</span>}
                {source.note ? <span className="block">{source.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-950">Methodology</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{methodology}</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-950">Last verified</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{lastVerified}</p>
        </div>
      </div>
    </section>
  );
}

export default CitationTrustPanel;
