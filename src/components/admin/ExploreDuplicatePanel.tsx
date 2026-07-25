import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  useDuplicateCandidateDetail,
  useDuplicateCandidatesList,
  useMergeDuplicateCandidate,
  useResolveDuplicateCandidate,
} from '@/hooks/explore/useDuplicateCandidates';
import type {
  ExploreDuplicateCandidateWithEntities,
  ExploreDuplicateEntitySummary,
  ExploreDuplicateStatus,
} from '@/types/explore/duplicates';

const STATUS_OPTIONS: Array<{ value: ExploreDuplicateStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'merged', label: 'Merged' },
  { value: 'not_duplicate', label: 'Not duplicate' },
  { value: 'deferred', label: 'Deferred' },
];

const PAGE_SIZE = 25;

function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return (
    sessionStorage.getItem('ktr-admin-passcode') ||
    (import.meta.env.VITE_ADMIN_PASSCODE as string) ||
    'keeptxred'
  );
}

function fmtDate(v: string | null): string {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function entityLocation(e: ExploreDuplicateEntitySummary | null | undefined): string {
  if (!e || !e.location) return '—';
  const parts = [e.location.city, e.location.stateCode].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

function isEntityUsable(e: ExploreDuplicateEntitySummary | null | undefined): boolean {
  return !!e && e.status !== 'archived' && !e.archivedAt;
}

export function ExploreDuplicatePanel() {
  const token = getAdminToken();
  const [status, setStatus] = useState<ExploreDuplicateStatus>('pending');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = useDuplicateCandidatesList({
    token,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  const items = list.data?.items ?? [];
  const total = list.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            ★ Explore Texas
          </div>
          <h2 className="font-display text-xl mt-1">Duplicate Review</h2>
          <p className="text-sm text-muted-foreground">
            Review, merge, or dismiss duplicate entity candidates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="dup-status">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as ExploreDuplicateStatus);
              setPage(1);
            }}
          >
            <SelectTrigger id="dup-status" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => list.refetch()}
            disabled={list.isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {list.isLoading ? (
          <p className="text-sm text-muted-foreground py-6">Loading duplicate candidates…</p>
        ) : list.isError ? (
          <div className="py-6">
            <p className="text-sm text-destructive" role="alert">
              {list.error?.message ?? 'Failed to load duplicate candidates.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => list.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">
            No {status.replace('_', ' ')} candidates.
          </p>
        ) : (
          <ul className="divide-y divide-border" data-loading={list.isFetching ? 'true' : 'false'}>
            {items.map((c) => (
              <CandidateRow
                key={c.id}
                candidate={c}
                onOpen={() => setSelectedId(c.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {pageCount > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pageCount} — {total} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || list.isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount || list.isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <ReviewDialog
        token={token}
        candidateId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

function CandidateRow({
  candidate,
  onOpen,
}: {
  candidate: ExploreDuplicateCandidateWithEntities;
  onOpen: () => void;
}) {
  const { entityA, entityB } = candidate;
  const bothUsable = isEntityUsable(entityA) && isEntityUsable(entityB);
  const invalid = !entityA || !entityB;
  return (
    <li className="py-3 flex items-start gap-3 justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
            {(candidate.similarityScore * 100).toFixed(0)}% match
          </Badge>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">
            {candidate.status.replace('_', ' ')}
          </Badge>
          {(candidate.matchingFields ?? []).slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>
        <div className="mt-1 text-sm font-medium truncate">
          <span className="text-foreground">{entityA?.name ?? '(missing)'}</span>
          <span className="text-muted-foreground"> ↔ </span>
          <span className="text-foreground">{entityB?.name ?? '(missing)'}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {entityA?.entityTypeName ?? '—'} · {entityLocation(entityA)}
          {' · '}
          {entityB?.entityTypeName ?? '—'} · {entityLocation(entityB)}
          {' · created '}
          {fmtDate(candidate.createdAt)}
        </div>
        {invalid ? (
          <p className="text-[11px] text-destructive mt-1">
            One or both entities are missing.
          </p>
        ) : !bothUsable ? (
          <p className="text-[11px] text-amber-700 mt-1">
            One or both entities are already archived.
          </p>
        ) : null}
      </div>
      <div className="shrink-0">
        <Button
          size="sm"
          variant="default"
          onClick={onOpen}
          disabled={invalid}
          aria-label={`Review duplicate candidate ${candidate.id}`}
        >
          Review
        </Button>
      </div>
    </li>
  );
}

function ReviewDialog({
  token,
  candidateId,
  onClose,
}: {
  token: string;
  candidateId: string | null;
  onClose: () => void;
}) {
  const detail = useDuplicateCandidateDetail({ token, candidateId });
  const merge = useMergeDuplicateCandidate(token);
  const resolve = useResolveDuplicateCandidate(token);

  const [survivorId, setSurvivorId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState<null | 'not_duplicate' | 'deferred'>(null);

  const candidate = detail.data;
  const open = candidateId !== null;

  // Reset local selection when the candidate changes.
  useMemo(() => {
    setSurvivorId(null);
    setReason('');
    setConfirmOpen(false);
    setConfirmResolve(null);
  }, [candidateId]);

  const busy = merge.isPending || resolve.isPending;

  const canMerge =
    !!candidate &&
    candidate.status === 'pending' &&
    isEntityUsable(candidate.entityA) &&
    isEntityUsable(candidate.entityB) &&
    survivorId !== null &&
    (survivorId === candidate.entityAId || survivorId === candidate.entityBId) &&
    !busy;

  const canResolve =
    !!candidate && candidate.status === 'pending' && !busy;

  const survivor =
    candidate && survivorId
      ? survivorId === candidate.entityAId
        ? candidate.entityA
        : candidate.entityB
      : null;
  const loser =
    candidate && survivorId
      ? survivorId === candidate.entityAId
        ? candidate.entityB
        : candidate.entityA
      : null;

  function safeClose(next: boolean) {
    if (busy) return;
    if (!next) onClose();
  }

  async function doMerge() {
    if (!candidate || !survivorId) return;
    try {
      const res = await merge.mutateAsync({
        candidateId: candidate.id,
        survivorId,
        reason: reason.trim() || undefined,
      });
      toast.success(`Merged. Survivor: ${survivor?.name ?? res.survivorId}`);
      setConfirmOpen(false);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Merge failed');
    }
  }

  async function doResolve(status: 'not_duplicate' | 'deferred') {
    if (!candidate) return;
    try {
      await resolve.mutateAsync({
        candidateId: candidate.id,
        status,
        reason: reason.trim() || undefined,
      });
      toast.success(status === 'not_duplicate' ? 'Marked not duplicate' : 'Deferred');
      setConfirmResolve(null);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update candidate');
    }
  }

  return (
    <Dialog open={open} onOpenChange={safeClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Duplicate Candidate Review</DialogTitle>
          <DialogDescription>
            Compare both entities and choose which to keep. The other will be archived.
          </DialogDescription>
        </DialogHeader>

        {detail.isLoading ? (
          <p className="text-sm text-muted-foreground py-6">Loading…</p>
        ) : detail.isError || !candidate ? (
          <div className="py-6">
            <p className="text-sm text-destructive" role="alert">
              {detail.error?.message ?? 'Failed to load candidate.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => detail.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Badge variant="outline">
                Similarity: {(candidate.similarityScore * 100).toFixed(1)}%
              </Badge>
              <Badge variant="secondary">Status: {candidate.status.replace('_', ' ')}</Badge>
              {(candidate.matchingFields ?? []).map((f) => (
                <Badge key={f} variant="outline">
                  {f}
                </Badge>
              ))}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <EntityCard
                entity={candidate.entityA}
                other={candidate.entityB}
                selected={survivorId === candidate.entityAId}
                selectable={
                  candidate.status === 'pending' && isEntityUsable(candidate.entityA)
                }
                onSelect={() => setSurvivorId(candidate.entityAId)}
                side="A"
              />
              <EntityCard
                entity={candidate.entityB}
                other={candidate.entityA}
                selected={survivorId === candidate.entityBId}
                selectable={
                  candidate.status === 'pending' && isEntityUsable(candidate.entityB)
                }
                onSelect={() => setSurvivorId(candidate.entityBId)}
                side="B"
              />
            </div>

            {survivor && loser ? (
              <div className="mt-4 border-l-4 border-primary bg-primary/5 p-3 text-sm">
                <div>
                  <strong>Keep:</strong> {survivor.name}{' '}
                  <span className="text-muted-foreground">
                    (slug <code>{survivor.slug}</code> retained)
                  </span>
                </div>
                <div>
                  <strong>Archive:</strong> {loser.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Related media, taxonomy, relationships, observations, reviews, and
                  sources will be consolidated on the surviving entity. This operation
                  cannot be automatically reversed.
                </p>
              </div>
            ) : null}

            <div className="mt-4">
              <label
                htmlFor="dup-reason"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Reason (optional)
              </label>
              <Textarea
                id="dup-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Notes shown on the resolved candidate…"
                maxLength={1000}
                rows={2}
                disabled={busy || candidate.status !== 'pending'}
              />
            </div>

            <DialogFooter className="mt-4 flex flex-wrap gap-2 sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmResolve('not_duplicate')}
                  disabled={!canResolve}
                >
                  Mark Not Duplicate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmResolve('deferred')}
                  disabled={!canResolve}
                >
                  Defer Review
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
                disabled={!canMerge}
              >
                Merge & Archive
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>

      <Dialog
        open={confirmOpen}
        onOpenChange={(next) => {
          if (!merge.isPending) setConfirmOpen(next);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm merge</DialogTitle>
            <DialogDescription>
              {survivor && loser ? (
                <>
                  Keep <strong>{survivor.name}</strong> and archive{' '}
                  <strong>{loser.name}</strong>. Related records will be consolidated.
                  This operation cannot be automatically reversed.
                </>
              ) : (
                'Select a canonical entity to continue.'
              )}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional reason"
            maxLength={1000}
            disabled={merge.isPending}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={merge.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={doMerge}
              disabled={!canMerge || merge.isPending}
            >
              {merge.isPending ? 'Merging…' : 'Confirm merge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmResolve !== null}
        onOpenChange={(next) => {
          if (!resolve.isPending && !next) setConfirmResolve(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmResolve === 'not_duplicate' ? 'Mark as not duplicate' : 'Defer review'}
            </DialogTitle>
            <DialogDescription>
              {confirmResolve === 'not_duplicate'
                ? 'This pair will no longer appear in the pending duplicate queue.'
                : 'The candidate remains unresolved but is removed from the pending workflow.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmResolve(null)}
              disabled={resolve.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmResolve && doResolve(confirmResolve)}
              disabled={resolve.isPending || !confirmResolve}
            >
              {resolve.isPending ? 'Saving…' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function EntityCard({
  entity,
  other,
  selected,
  selectable,
  onSelect,
  side,
}: {
  entity: ExploreDuplicateEntitySummary | null;
  other: ExploreDuplicateEntitySummary | null;
  selected: boolean;
  selectable: boolean;
  onSelect: () => void;
  side: 'A' | 'B';
}) {
  if (!entity) {
    return (
      <div className="border-2 border-dashed border-destructive/60 p-4 text-sm text-destructive">
        Entity {side} is missing.
      </div>
    );
  }
  const archived = entity.status === 'archived' || !!entity.archivedAt;
  return (
    <div
      className={`border-2 p-4 ${
        selected ? 'border-primary bg-primary/5' : 'border-foreground/10 bg-card'
      }`}
      aria-selected={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Entity {side}
          </div>
          <h3 className="font-display text-lg truncate">{entity.name}</h3>
          <div className="text-[11px] text-muted-foreground truncate">
            <code>{entity.slug}</code>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <Badge variant={selected ? 'default' : 'outline'} className="text-[10px]">
            {selected ? 'KEEP' : archived ? 'ARCHIVED' : 'ARCHIVE (if not kept)'}
          </Badge>
          <Button
            size="sm"
            variant={selected ? 'default' : 'outline'}
            onClick={onSelect}
            disabled={!selectable}
            aria-pressed={selected}
          >
            {selected ? 'Selected' : 'Keep this'}
          </Button>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <Field label="Type" a={entity.entityTypeName} b={other?.entityTypeName ?? null} />
        <Field label="Status" a={entity.status} b={other?.status ?? null} />
        <Field label="Visibility" a={entity.visibility} b={other?.visibility ?? null} />
        <Field label="City" a={entity.location?.city ?? null} b={other?.location?.city ?? null} />
        <Field label="County" a={entity.location?.county ?? null} b={other?.location?.county ?? null} />
        <Field label="State" a={entity.location?.stateCode ?? null} b={other?.location?.stateCode ?? null} />
        <Field
          label="Address"
          a={entity.location?.addressLine1 ?? null}
          b={other?.location?.addressLine1 ?? null}
        />
        <Field
          label="Coordinates"
          a={
            entity.location?.latitude != null && entity.location?.longitude != null
              ? `${entity.location.latitude}, ${entity.location.longitude}`
              : null
          }
          b={
            other?.location?.latitude != null && other?.location?.longitude != null
              ? `${other.location.latitude}, ${other.location.longitude}`
              : null
          }
        />
        <Field label="Verified" a={fmtDate(entity.verifiedAt)} b={fmtDate(other?.verifiedAt ?? null)} />
        <Field label="Created" a={fmtDate(entity.createdAt)} b={fmtDate(other?.createdAt ?? null)} />
        <Field label="Updated" a={fmtDate(entity.updatedAt)} b={fmtDate(other?.updatedAt ?? null)} />
        <Field
          label="Confidence"
          a={entity.sourceConfidence.toFixed(2)}
          b={other ? other.sourceConfidence.toFixed(2) : null}
        />
        <Field
          label="Popularity"
          a={entity.popularityScore.toFixed(0)}
          b={other ? other.popularityScore.toFixed(0) : null}
        />
        <Field label="Summary" a={entity.summary} b={other?.summary ?? null} wide />
        <Field
          label="Profile"
          a={entity.hasProfile ? 'Yes' : 'No'}
          b={other ? (other.hasProfile ? 'Yes' : 'No') : null}
        />
      </dl>

      <div className="mt-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Related records
        </div>
        <div className="grid grid-cols-3 gap-1 text-[11px]">
          <Count label="Media" a={entity.counts.media} b={other?.counts.media ?? null} />
          <Count label="Categories" a={entity.counts.categories} b={other?.counts.categories ?? null} />
          <Count label="Tags" a={entity.counts.tags} b={other?.counts.tags ?? null} />
          <Count label="Amenities" a={entity.counts.amenities} b={other?.counts.amenities ?? null} />
          <Count label="Activities" a={entity.counts.activities} b={other?.counts.activities ?? null} />
          <Count label="Relationships" a={entity.counts.relationships} b={other?.counts.relationships ?? null} />
          <Count label="Observations" a={entity.counts.observations} b={other?.counts.observations ?? null} />
          <Count label="Reviews" a={entity.counts.reviews} b={other?.counts.reviews ?? null} />
          <Count label="Sources" a={entity.counts.sources} b={other?.counts.sources ?? null} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  a,
  b,
  wide,
}: {
  label: string;
  a: string | number | null;
  b: string | number | null;
  wide?: boolean;
}) {
  const equal = normalize(a) === normalize(b);
  const display = a === null || a === '' ? '—' : String(a);
  return (
    <>
      <dt className={`text-muted-foreground ${wide ? 'col-span-2' : ''}`}>{label}</dt>
      <dd
        className={`${wide ? 'col-span-2' : ''} break-words ${
          equal ? '' : 'font-semibold text-foreground underline decoration-primary/50 underline-offset-2'
        }`}
        aria-label={equal ? `${label}: matches` : `${label}: differs`}
      >
        {display}
        {!equal ? <span className="sr-only"> (differs)</span> : null}
      </dd>
    </>
  );
}

function Count({
  label,
  a,
  b,
}: {
  label: string;
  a: number;
  b: number | null;
}) {
  const equal = b !== null && a === b;
  return (
    <div className={`border p-1 ${equal ? '' : 'border-primary/60 bg-primary/5'}`}>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold">{a}</div>
    </div>
  );
}

function normalize(v: string | number | null): string {
  if (v === null || v === undefined) return '';
  return String(v).trim().toLowerCase();
}