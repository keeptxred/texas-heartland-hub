import { useState } from 'react';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useExploreAdminRelationships } from '../hooks/useExploreAdminRelationships';

const PAGE_SIZE = 25;

export interface ExploreRelationshipExplorerPanelProps {
  onOpenEntity: (entityId: string) => void;
}

export function ExploreRelationshipExplorerPanel({ onOpenEntity }: ExploreRelationshipExplorerPanelProps) {
  const [page, setPage] = useState(1);
  const [entityId, setEntityId] = useState('');
  const relationships = useExploreAdminRelationships(
    { entityId: entityId.trim() || undefined, active: true },
    { page, pageSize: PAGE_SIZE },
  );
  const result = relationships.data;

  return (
    <section className="space-y-4" aria-labelledby="explore-relationships-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="explore-relationships-title" className="text-xl font-semibold">Relationship Explorer</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Inspect active directed relationships across the Explore Texas knowledge graph.
          </p>
        </div>
        <Button variant="outline" onClick={() => relationships.refetch()} disabled={relationships.isFetching}>
          {relationships.isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Input
        value={entityId}
        onChange={(event) => { setEntityId(event.target.value); setPage(1); }}
        placeholder="Filter by entity UUID"
        aria-label="Filter relationships by entity ID"
      />

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Source</th><th className="px-4 py-3">Relationship</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Weight</th><th className="px-4 py-3">Updated</th></tr>
            </thead>
            <tbody className="divide-y">
              {relationships.isLoading ? <Message>Loading relationships</Message> : relationships.isError ? <Message tone="error">{relationships.error.message}</Message> : !result?.items.length ? <Message>No active relationships found.</Message> : result.items.map((relationship) => (
                <tr key={relationship.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3"><button className="inline-flex items-center font-medium hover:underline" onClick={() => onOpenEntity(relationship.sourceEntity.id)}>{relationship.sourceEntity.name}<ExternalLink className="ml-1 h-3 w-3" /></button><p className="text-xs text-muted-foreground">/{relationship.sourceEntity.slug}</p></td>
                  <td className="px-4 py-3"><p className="font-medium">{relationship.typeName}</p><p className="text-xs text-muted-foreground">{relationship.typeKey}</p></td>
                  <td className="px-4 py-3"><button className="inline-flex items-center font-medium hover:underline" onClick={() => onOpenEntity(relationship.targetEntity.id)}>{relationship.targetEntity.name}<ExternalLink className="ml-1 h-3 w-3" /></button><p className="text-xs text-muted-foreground">/{relationship.targetEntity.slug}</p></td>
                  <td className="px-4 py-3 capitalize">{relationship.priority}</td>
                  <td className="px-4 py-3">{relationship.weight.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(relationship.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={result?.totalPages ?? 0} busy={relationships.isFetching} onPage={setPage} />
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
