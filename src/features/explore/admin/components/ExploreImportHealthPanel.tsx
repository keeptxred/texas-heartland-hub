import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ExploreImportJobStatus } from '@/repositories/explore/ImportJobRepository';
import { useExploreAdminImportJobs } from '../hooks/useExploreAdminImportJobs';

const PAGE_SIZE = 25;

type StatusFilter = ExploreImportJobStatus | 'all';

export function ExploreImportHealthPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>('all');
  const jobs = useExploreAdminImportJobs(
    status === 'all' ? {} : { status },
    { page, pageSize: PAGE_SIZE },
  );
  const result = jobs.data;

  return (
    <section className="space-y-4" aria-labelledby="explore-import-health-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="explore-import-health-title" className="text-xl font-semibold">Import Health</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor connector execution, throughput, warnings, failures, and completion state.
          </p>
        </div>
        <Button variant="outline" onClick={() => jobs.refetch()} disabled={jobs.isFetching}>
          {jobs.isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'queued', 'running', 'completed', 'completed_with_warnings', 'failed', 'cancelled'] as StatusFilter[]).map((value) => (
          <Button key={value} size="sm" variant={status === value ? 'default' : 'outline'} onClick={() => { setStatus(value); setPage(1); }}>
            {value.replaceAll('_', ' ')}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Connector</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Received</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Warnings</th><th className="px-4 py-3">Errors</th><th className="px-4 py-3">Started</th></tr>
            </thead>
            <tbody className="divide-y">
              {jobs.isLoading ? <Message>Loading import jobs</Message> : jobs.isError ? <Message tone="error">{jobs.error.message}</Message> : !result?.items.length ? <Message>No import jobs found.</Message> : result.items.map((job) => (
                <tr key={job.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{job.connectorKey}</td>
                  <td className="px-4 py-3 capitalize">{job.status.replaceAll('_', ' ')}</td>
                  <td className="px-4 py-3">{job.recordsReceived.toLocaleString()}</td>
                  <td className="px-4 py-3">{job.entitiesCreated.toLocaleString()}</td>
                  <td className="px-4 py-3">{job.entitiesUpdated.toLocaleString()}</td>
                  <td className="px-4 py-3">{job.warningsCount.toLocaleString()}</td>
                  <td className="px-4 py-3">{job.errorsCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(job.startedAt ?? job.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={result?.totalPages ?? 0} busy={jobs.isFetching} onPage={setPage} />
      </div>
    </section>
  );
}

function Message({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'error' }) {
  return <tr><td colSpan={8} className={`px-4 py-12 text-center ${tone === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>{children}</td></tr>;
}

function Pagination({ page, totalPages, busy, onPage }: { page: number; totalPages: number; busy: boolean; onPage: (page: number) => void }) {
  return <div className="flex items-center justify-end gap-2 border-t px-4 py-3"><Button size="sm" variant="outline" disabled={page <= 1 || busy} onClick={() => onPage(page - 1)}>Previous</Button><span className="text-sm text-muted-foreground">Page {page} of {Math.max(1, totalPages)}</span><Button size="sm" variant="outline" disabled={page >= totalPages || busy || totalPages === 0} onClick={() => onPage(page + 1)}>Next</Button></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}
