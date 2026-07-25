import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { BaseImporter } from "./BaseImporter";
import type {
  EMPTY_IMPORT_STATISTICS,
  ImportContext,
  ImportEntityDraft,
  ImportRecordResult,
  ImportRunResult,
  ImportSourceConfig,
  ImportStatistics,
} from "@/types/explore/import";

type Client = SupabaseClient<Database>;

export class ImportRunner {
  constructor(private readonly client: Client) {}

  async run(importer: BaseImporter, context: ImportContext): Promise<ImportRunResult> {
    const statistics: ImportStatistics = {
      downloaded: 0, parsed: 0, normalized: 0, inserted: 0, updated: 0,
      unchanged: 0, duplicates: 0, validationErrors: 0, failed: 0,
    };
    const records: ImportRecordResult[] = [];
    const warnings: string[] = [];

    try {
      await this.updateJob(context.jobId, { status: "running", started_at: context.startedAt, heartbeat_at: new Date().toISOString() });
      const payload = await importer.download(context);
      statistics.downloaded = 1;
      const parsed = await importer.parse(payload, context);
      statistics.parsed = parsed.length;

      for (const raw of parsed) {
        if (context.signal?.aborted) throw new DOMException("Import cancelled", "AbortError");
        try {
          const normalized = await importer.normalize(raw, context);
          statistics.normalized += 1;
          const issues = importer.validate(normalized);
          const checksum = importer.checksum(normalized);
          if (issues.some((issue) => issue.severity === "error")) {
            statistics.validationErrors += 1;
            records.push({ externalId: normalized.externalId, action: "reject", checksum, issues, duplicateCandidates: [] });
            await this.persistRecord(context, normalized, checksum, "reject", issues, []);
            continue;
          }

          const previous = await this.findPrevious(context.source.id, normalized.externalId);
          const action = previous?.checksum === checksum ? "unchanged" : previous ? "update" : "insert";
          statistics[action === "insert" ? "inserted" : action === "update" ? "updated" : "unchanged"] += 1;
          records.push({ externalId: normalized.externalId, action, checksum, issues, duplicateCandidates: [] });
          await this.persistRecord(context, normalized, checksum, action, issues, []);
        } catch (error) {
          statistics.failed += 1;
          warnings.push(error instanceof Error ? error.message : String(error));
        }
        if ((statistics.normalized + statistics.failed) % 25 === 0) {
          await this.updateJob(context.jobId, { heartbeat_at: new Date().toISOString(), statistics });
        }
      }

      const status = warnings.length || statistics.validationErrors ? "completed_with_warnings" : "completed";
      const completedAt = new Date().toISOString();
      await this.updateJob(context.jobId, { status, completed_at: completedAt, statistics, warnings });
      await this.updateSourceHealth(context.source.id, true);
      return { jobId: context.jobId, sourceId: context.source.id, status, startedAt: context.startedAt, completedAt, statistics, records, warnings };
    } catch (error) {
      const completedAt = new Date().toISOString();
      const detail = { message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined };
      await this.updateJob(context.jobId, { status: "failed", completed_at: completedAt, statistics, warnings, error: detail });
      await this.updateSourceHealth(context.source.id, false);
      return { jobId: context.jobId, sourceId: context.source.id, status: "failed", startedAt: context.startedAt, completedAt, statistics, records, warnings, error: detail };
    }
  }

  private async findPrevious(sourceId: string, externalId: string): Promise<{ checksum: string } | null> {
    const { data, error } = await this.client.from("explore_import_records" as never)
      .select("checksum").eq("source_id", sourceId).eq("external_id", externalId)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return data as { checksum: string } | null;
  }

  private async persistRecord(context: ImportContext, draft: ImportEntityDraft, checksum: string, action: string, issues: unknown[], duplicates: unknown[]): Promise<void> {
    const { error } = await this.client.from("explore_import_records" as never).insert({
      job_id: context.jobId, source_id: context.source.id, external_id: draft.externalId,
      action, checksum, normalized_payload: draft, raw_payload: draft.raw,
      validation_issues: issues, duplicate_candidates: duplicates,
      review_status: action === "unchanged" ? "approved" : "pending",
    } as never);
    if (error) throw error;
  }

  private async updateJob(jobId: string, values: Record<string, unknown>): Promise<void> {
    const { error } = await this.client.from("explore_import_jobs" as never).update(values as never).eq("id", jobId);
    if (error) throw error;
  }

  private async updateSourceHealth(sourceId: string, success: boolean): Promise<void> {
    const now = new Date().toISOString();
    const values = success
      ? { last_success_at: now, consecutive_failures: 0, updated_at: now }
      : { last_failure_at: now, updated_at: now };
    const { error } = await this.client.from("explore_import_sources" as never).update(values as never).eq("id", sourceId);
    if (error) throw error;
    if (!success) {
      const { data } = await this.client.from("explore_import_sources" as never).select("consecutive_failures").eq("id", sourceId).single();
      const failures = Number((data as { consecutive_failures?: number } | null)?.consecutive_failures ?? 0) + 1;
      await this.client.from("explore_import_sources" as never).update({ consecutive_failures: failures } as never).eq("id", sourceId);
    }
  }
}
