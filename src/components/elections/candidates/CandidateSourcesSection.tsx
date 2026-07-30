import type { CandidateDetail } from "@/types/elections";

export function CandidateSourcesSection({ candidate }: { candidate: CandidateDetail }) {
  const rawSources =
    candidate.sources.length > 0
      ? candidate.sources
      : [
          {
            label: candidate.source.sourceName,
            url: candidate.source.sourceUrl,
            retrievedAt: candidate.source.retrievedAt,
          },
        ];
  const sources = rawSources.flatMap((source) => {
    const url = safeExternalUrl(source.url);
    return url ? [{ ...source, url }] : [];
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">Sources and verification</h2>
      <p className="mt-3 text-sm text-slate-600">
        Last verified:{" "}
        {candidate.verifiedAt ? formatDate(candidate.verifiedAt) : "Not yet verified"}
      </p>
      {sources.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {sources.map((source) => (
            <li key={`${source.label}-${source.url}`}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-red-700 hover:underline"
              >
                {source.label}
              </a>
              <span className="ml-2 text-xs text-slate-500">
                Retrieved {formatDate(source.retrievedAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-slate-600">No safe public source URL is available.</p>
      )}
    </section>
  );
}

function safeExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(value));
}

export default CandidateSourcesSection;
