import type { Database } from "@/integrations/supabase/types";

export type Json = Database["public"]["Tables"] extends Record<string, never>
  ? unknown
  : Database["public"]["Tables"][keyof Database["public"]["Tables"]] extends { Row: infer Row }
    ? Row extends { metadata?: infer Metadata }
      ? Metadata
      : unknown
    : unknown;

export type ImportSourceType =
  | "tpwd" | "nps" | "usace" | "usfs" | "thc" | "usgs" | "noaa"
  | "twdb" | "osm" | "county_gis" | "municipality" | "tourism" | "custom";

export type ImportJobStatus =
  | "queued" | "running" | "completed" | "completed_with_warnings"
  | "failed" | "cancelled" | "rolled_back";

export type ImportMode = "scheduled" | "manual" | "bulk";
export type ImportExecutionMode = "live" | "dry-run" | "preview";
export type ImportRecordAction = "insert" | "update" | "unchanged" | "duplicate" | "reject";
export type ReviewStatus = "pending" | "approved" | "rejected" | "merged";

export interface ImportStatistics {
  downloaded: number;
  parsed: number;
  normalized: number;
  inserted: number;
  updated: number;
  unchanged: number;
  duplicates: number;
  validationErrors: number;
  failed: number;
}

export interface ImportSourceConfig {
  id: string;
  name: string;
  type: ImportSourceType;
  enabled: boolean;
  endpoint: string;
  schedule?: string;
  auth?: { type: "none" | "api-key" | "bearer" | "basic"; secretName?: string };
  headers?: Record<string, string>;
  query?: Record<string, string>;
  timeoutMs?: number;
  retry?: { attempts: number; baseDelayMs: number; maxDelayMs: number };
  cursor?: { field: string; value?: string };
  metadata?: Record<string, unknown>;
}

export interface ImportEntityDraft {
  externalId: string;
  entityType: string;
  name: string;
  slug?: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: Record<string, unknown> | null;
  taxonomy?: string[];
  relationships?: Array<{ type: string; targetExternalId: string }>;
  media?: Array<{ url: string; type: "image" | "video" | "document"; title?: string }>;
  sourceUpdatedAt?: string | null;
  sourceUrl?: string | null;
  metadata?: Record<string, unknown>;
  raw: unknown;
}

export interface ImportValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: "warning" | "error";
}

export interface DuplicateCandidate {
  entityId: string;
  score: number;
  reasons: string[];
}

export interface ImportRecordResult {
  externalId: string;
  action: ImportRecordAction;
  entityId?: string;
  checksum: string;
  issues: ImportValidationIssue[];
  duplicateCandidates: DuplicateCandidate[];
}

export interface ImportContext {
  jobId: string;
  source: ImportSourceConfig;
  mode: ImportMode;
  executionMode: ImportExecutionMode;
  startedAt: string;
  signal?: AbortSignal;
}

export interface ImportRunResult {
  jobId: string;
  sourceId: string;
  status: ImportJobStatus;
  startedAt: string;
  completedAt: string;
  statistics: ImportStatistics;
  records: ImportRecordResult[];
  warnings: string[];
  error?: { message: string; stack?: string };
  nextCursor?: string;
}

export interface ImportConnector<TRaw = unknown> {
  readonly sourceType: ImportSourceType;
  download(context: ImportContext): Promise<unknown>;
  parse(payload: unknown, context: ImportContext): Promise<TRaw[]>;
  normalize(record: TRaw, context: ImportContext): Promise<ImportEntityDraft>;
  getNextCursor?(payload: unknown, context: ImportContext): string | undefined;
}

export const EMPTY_IMPORT_STATISTICS: ImportStatistics = {
  downloaded: 0,
  parsed: 0,
  normalized: 0,
  inserted: 0,
  updated: 0,
  unchanged: 0,
  duplicates: 0,
  validationErrors: 0,
  failed: 0,
};
