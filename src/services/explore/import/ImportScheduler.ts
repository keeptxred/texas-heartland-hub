import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { ImportExecutionMode, ImportMode } from "@/types/explore/import";

type Client = SupabaseClient<Database>;

export class ImportScheduler {
  constructor(private readonly client: Client) {}

  async enqueue(
    sourceId: string,
    mode: ImportMode = "manual",
    executionMode: ImportExecutionMode = "live",
    requestedBy?: string,
  ): Promise<string> {
    const { data, error } = await this.client
      .from("explore_import_jobs" as never)
      .insert({
        source_id: sourceId,
        mode,
        execution_mode: executionMode,
        status: "queued",
        requested_by: requestedBy ?? null,
      } as never)
      .select("id")
      .single();
    if (error) throw error;
    return (data as { id: string }).id;
  }

  async cancel(jobId: string): Promise<void> {
    const { error } = await this.client
      .from("explore_import_jobs" as never)
      .update({ status: "cancelled", completed_at: new Date().toISOString() } as never)
      .eq("id", jobId)
      .in("status", ["queued", "running"]);
    if (error) throw error;
  }

  async retry(jobId: string, requestedBy?: string): Promise<string> {
    const { data, error } = await this.client
      .from("explore_import_jobs" as never)
      .select("source_id,mode,execution_mode")
      .eq("id", jobId)
      .single();
    if (error) throw error;
    const job = data as {
      source_id: string;
      mode: ImportMode;
      execution_mode: ImportExecutionMode;
    };
    return this.enqueue(job.source_id, job.mode, job.execution_mode, requestedBy);
  }
}
