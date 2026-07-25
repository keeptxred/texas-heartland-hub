/*
PATH:
src/features/explore/admin/components/ExploreEntityEditorDialog.tsx

FILE:
ExploreEntityEditorDialog.tsx
*/

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Archive, Loader2, Save } from 'lucide-react';
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
import type {
  ExploreEntity,
  ExploreEntityStatus,
  ExploreEntityUpdateInput,
  ExploreVisibility,
} from '@/types/explore';

import { useExploreAdminEntity } from '../hooks/useExploreAdminEntity';
import {
  useArchiveExploreAdminEntity,
  useUpdateExploreAdminEntity,
} from '../hooks/useExploreAdminEntityMutations';

const STATUS_OPTIONS: Array<{ value: ExploreEntityStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'imported', label: 'Imported' },
  { value: 'validated', label: 'Validated' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'published', label: 'Published' },
  { value: 'verified', label: 'Verified' },
  { value: 'archived', label: 'Archived' },
];

const VISIBILITY_OPTIONS: Array<{ value: ExploreVisibility; label: string }> = [
  { value: 'internal', label: 'Internal' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'public', label: 'Public' },
];

interface EditorValues {
  name: string;
  slug: string;
  alternateNames: string;
  shortDescription: string;
  summary: string;
  longDescription: string;
  status: ExploreEntityStatus;
  visibility: ExploreVisibility;
  sourceConfidence: string;
  popularityScore: string;
  featured: boolean;
}

export interface ExploreEntityEditorDialogProps {
  entityId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExploreEntityEditorDialog({
  entityId,
  open,
  onOpenChange,
}: ExploreEntityEditorDialogProps) {
  const entityQuery = useExploreAdminEntity(entityId, { enabled: open });
  const updateMutation = useUpdateExploreAdminEntity();
  const archiveMutation = useArchiveExploreAdminEntity();
  const [values, setValues] = useState<EditorValues | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (entityQuery.data) {
      setValues(toEditorValues(entityQuery.data));
      setValidationError(null);
    }
  }, [entityQuery.data]);

  useEffect(() => {
    if (!open) {
      setValues(null);
      setValidationError(null);
    }
  }, [open]);

  const isBusy = updateMutation.isPending || archiveMutation.isPending;
  const hasChanges = useMemo(() => {
    if (!entityQuery.data || !values) return false;
    return JSON.stringify(values) !== JSON.stringify(toEditorValues(entityQuery.data));
  }, [entityQuery.data, values]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entityId || !values) return;

    const error = validate(values);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);

    try {
      await updateMutation.mutateAsync({
        entityId,
        input: toUpdateInput(values),
      });
      toast.success('Explore Texas entity saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save the entity.');
    }
  }

  async function handleArchive() {
    if (!entityId || !entityQuery.data) return;

    const confirmed = window.confirm(
      `Archive ${entityQuery.data.name}? It will be moved to internal visibility.`,
    );
    if (!confirmed) return;

    try {
      await archiveMutation.mutateAsync({ entityId });
      toast.success('Explore Texas entity archived.');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to archive the entity.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isBusy && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Explore Texas Entity</DialogTitle>
          <DialogDescription>
            Review editorial content, publishing state, visibility, and ranking signals.
          </DialogDescription>
        </DialogHeader>

        {entityQuery.isLoading ? (
          <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Loading entity
          </div>
        ) : entityQuery.isError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {entityQuery.error.message}
          </div>
        ) : values ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" required>
                <input
                  value={values.name}
                  onChange={(event) => setValues({ ...values, name: event.target.value })}
                  className={inputClasses}
                  maxLength={160}
                  required
                />
              </Field>

              <Field label="Slug" required hint="Lowercase letters, numbers, and hyphens only.">
                <input
                  value={values.slug}
                  onChange={(event) =>
                    setValues({ ...values, slug: normalizeSlugInput(event.target.value) })
                  }
                  className={inputClasses}
                  maxLength={180}
                  required
                />
              </Field>

              <Field label="Status">
                <select
                  value={values.status}
                  onChange={(event) =>
                    setValues({ ...values, status: event.target.value as ExploreEntityStatus })
                  }
                  className={inputClasses}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Visibility">
                <select
                  value={values.visibility}
                  onChange={(event) =>
                    setValues({ ...values, visibility: event.target.value as ExploreVisibility })
                  }
                  className={inputClasses}
                >
                  {VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Source confidence" hint="A decimal from 0 to 1.">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={values.sourceConfidence}
                  onChange={(event) =>
                    setValues({ ...values, sourceConfidence: event.target.value })
                  }
                  className={inputClasses}
                />
              </Field>

              <Field label="Popularity score" hint="A non-negative ranking score.">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={values.popularityScore}
                  onChange={(event) =>
                    setValues({ ...values, popularityScore: event.target.value })
                  }
                  className={inputClasses}
                />
              </Field>

              <Field label="Alternate names" hint="Separate aliases with commas." className="md:col-span-2">
                <input
                  value={values.alternateNames}
                  onChange={(event) =>
                    setValues({ ...values, alternateNames: event.target.value })
                  }
                  className={inputClasses}
                />
              </Field>

              <Field label="Short description" className="md:col-span-2">
                <textarea
                  value={values.shortDescription}
                  onChange={(event) =>
                    setValues({ ...values, shortDescription: event.target.value })
                  }
                  className={`${inputClasses} min-h-20 py-2`}
                  maxLength={500}
                />
              </Field>

              <Field label="Summary" className="md:col-span-2">
                <textarea
                  value={values.summary}
                  onChange={(event) => setValues({ ...values, summary: event.target.value })}
                  className={`${inputClasses} min-h-28 py-2`}
                />
              </Field>

              <Field label="Long description" className="md:col-span-2">
                <textarea
                  value={values.longDescription}
                  onChange={(event) =>
                    setValues({ ...values, longDescription: event.target.value })
                  }
                  className={`${inputClasses} min-h-48 py-2`}
                />
              </Field>
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => setValues({ ...values, featured: event.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span>
                <span className="block font-medium">Featured entity</span>
                <span className="text-muted-foreground">
                  Prioritize this record in curated Explore Texas experiences.
                </span>
              </span>
            </label>

            {validationError ? (
              <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                {validationError}
              </p>
            ) : null}

            <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
              <Button
                type="button"
                variant="destructive"
                onClick={handleArchive}
                disabled={isBusy || entityQuery.data?.status === 'archived'}
              >
                {archiveMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Archive className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Archive
              </Button>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isBusy}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isBusy || !hasChanges}>
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  Save changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`space-y-1.5 ${className ?? ''}`}>
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function toEditorValues(entity: ExploreEntity): EditorValues {
  return {
    name: entity.name,
    slug: entity.slug,
    alternateNames: entity.alternateNames.join(', '),
    shortDescription: entity.shortDescription ?? '',
    summary: entity.summary ?? '',
    longDescription: entity.longDescription ?? '',
    status: entity.status,
    visibility: entity.visibility,
    sourceConfidence: String(entity.sourceConfidence),
    popularityScore: String(entity.popularityScore),
    featured: entity.featured,
  };
}

function toUpdateInput(values: EditorValues): ExploreEntityUpdateInput {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    alternateNames: values.alternateNames
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
    shortDescription: nullable(values.shortDescription),
    summary: nullable(values.summary),
    longDescription: nullable(values.longDescription),
    status: values.status,
    visibility: values.visibility,
    sourceConfidence: Number(values.sourceConfidence),
    popularityScore: Number(values.popularityScore),
    featured: values.featured,
  };
}

function validate(values: EditorValues): string | null {
  if (!values.name.trim()) return 'Name is required.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    return 'Slug must contain lowercase letters, numbers, and single hyphens only.';
  }

  const confidence = Number(values.sourceConfidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    return 'Source confidence must be between 0 and 1.';
  }

  const popularity = Number(values.popularityScore);
  if (!Number.isFinite(popularity) || popularity < 0) {
    return 'Popularity score must be zero or greater.';
  }

  return null;
}

function normalizeSlugInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '');
}

function nullable(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

const inputClasses =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
