import candidates from '@/data/elections/2026/candidates.json';
import polls from '@/data/elections/2026/polls.json';
import races from '@/data/elections/2026/races.json';
import results from '@/data/elections/2026/results.json';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

export type ElectionDirectoryKind = 'races' | 'candidates' | 'polls' | 'results';

const RECORDS: Record<ElectionDirectoryKind, readonly Record<string, unknown>[]> = {
  races,
  candidates,
  polls,
  results,
};

const METHODOLOGY: Record<ElectionDirectoryKind, string> = {
  races: 'The race directory is generated from Election Central records that are published for public use. Race detail pages preserve record-specific election dates, office and jurisdiction relationships, candidate links, status fields and source references. Missing relationships are left missing rather than inferred.',
  candidates: 'The candidate directory is generated from published Election Central candidate records and their verified race relationships. Candidate detail pages preserve record-specific source links, filing or ballot context, incumbency and other available fields; unsupported biography, positions or relationships are not filled from generic assumptions.',
  polls: 'The poll directory normalizes public poll records without copying aggregator averages. Individual poll records preserve field dates, sample information, sponsor and methodology/source links when available. Polls are measurements of surveyed populations, not election results or forecasts.',
  results: 'The results directory publishes Election Central result records with source attribution, reporting status and certification context. Election-night or partial totals are not treated as final certified results, and missing totals or winners are not inferred.',
};

const TITLE: Record<ElectionDirectoryKind, string> = {
  races: 'Race directory sources',
  candidates: 'Candidate directory sources',
  polls: 'Polling directory sources',
  results: 'Election results sources',
};

export function ElectionDirectoryTrustPanel({ kind }: { kind: ElectionDirectoryKind }) {
  const lastVerified = newestVerification(RECORDS[kind]);
  return (
    <CitationTrustPanel
      sources={[
        { name: 'Texas Secretary of State — Elections', url: 'https://www.sos.state.tx.us/elections/', note: 'Primary statewide election administration and official election-resource entry point.' },
        { name: 'KeepTXRed Election Central methodology', url: 'https://keeptxred.com/elections/methodology', note: 'Normalization, verification, polling and publication rules used by Election Central.' },
      ]}
      methodology={METHODOLOGY[kind]}
      lastVerified={lastVerified}
      title={TITLE[kind]}
    />
  );
}

function newestVerification(records: readonly Record<string, unknown>[]) {
  const dates = records
    .filter((record) => record.publicationStatus === 'published')
    .flatMap((record) => [record.verifiedAt, record.updatedAt, record.dataAsOf, record.sourceCheckedAt])
    .filter((value): value is string => typeof value === 'string' && Boolean(Date.parse(value)))
    .sort((a, b) => Date.parse(b) - Date.parse(a));

  if (!dates.length) return 'Record-level verification dates are unavailable in the current directory snapshot; see the individual record source links before relying on a time-sensitive fact.';
  return `Latest published record verification/update in this directory: ${new Date(dates[0]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}. Individual record dates control when they differ.`;
}

export default ElectionDirectoryTrustPanel;
