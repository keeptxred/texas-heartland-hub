import { useState } from 'react';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useExploreAdminSources } from '../hooks/useExploreAdminSources';

const PAGE_SIZE = 25;

export function ExploreSourceManagementPanel() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const sources = useExploreAdminSources(
    { query: query || undefined },
    { page, pageSize: PAGE_SIZE },
  );
  const result = sources.data;

  return (
    <section className="space-y-4" aria-labelledby="explore-sources-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="explore-sources-title" className="text-xl font-semibold">Import Sources</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Inspect source authority, licensing, confidence, and activation state.
          </p>
        </div>
        <Button variant="outline" onClick={() => sources.refetch()} disabled={sources.isFetching}>
          {sources.isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Input
        value={query}
        onChange={(event) => { setQuery(event.target.value); setPage(1); }}
        placeholder="Search source or publisher"
        aria-label="Search sources"
      />

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Source</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Confidence</th><th className="px-4 py-3">Authority</th><th className="px-4 py-3">License</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {sources.isLoading ? <Message>Loading sources</Message> : sources.isError ? <Message tone="error">{sources.error.message}</Message> : !result?.items.length ? <Message>No sources found.</Message> : result.items.map((source) => (
                <tr key={source.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3"><p className="font-medium">{source.name}</p><p className="text-xs text-muted-foreground">{source.publisher ?? 'No publisher'}</p>{source.baseUrl ? <a className="mt-1 inline-flex items-center text-xs underline" href={source.baseUrl} target="_blank" rel="noreferrer">Open source<ExternalLink className="ml-1 h-3 w-3" /></a> : null}</td>
                  <td className="px-4 py-3 capitalize">{source.sourceType}</td>
                  <td className="px-4 py-3">{source.defaultConfidence}%</td>
                  <td className="px-4 py-3">{source.isAuthoritative ? 'Authoritative' : 'Standard'}</td>
                  <td className="px-4 py-3">{source.licenseName ?? 'Unspecified'}</td>
                  <td className="px-4 py-3">{source.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={result?.totalPages ?? 0} busy={sources.isFetching} onPage={setPage} />
      </div>
    </section>
  );
}

function Message({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'error' }) {
  return <tr><td colSpan={6} className={`px-4 py-12 text-center ${tone === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>{children}</td></tr>;
}

function Pagination({ page, totalPages, busy, onPage }: { page: number; totalPages: number; busy: boolean; onPage: (page: number) => void }) {
  return <div className="flex items-center justify-end gap-2 border-t px-4 py-3"><Button size="sm" variant="outline" disabled={page <= 1 || busy} onClick={() => onPage(page - 1)}>Previous</Button><span className="text-sm text-muted-foreground">Page {page} of {Math.max(1, totalPages)}</span><Button size="sm" variant="outline" disabled={page >= totalPages || busy || totalPages === 0} onClick={() => onPage(page + 1)}>Next</Button></div>;
}
