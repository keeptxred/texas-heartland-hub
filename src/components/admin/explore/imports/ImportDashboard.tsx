import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useEnqueueImport,
  useImportJobs,
  useImportReviewQueue,
  useImportRollbacks,
  useImportSources,
  useReviewImportRecord,
} from "@/hooks/explore/useImportPlatform";

function text(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "—" : JSON.stringify(value);
}

export function ImportDashboard() {
  const sources = useImportSources();
  const jobs = useImportJobs();
  const reviews = useImportReviewQueue();
  const rollbacks = useImportRollbacks();
  const enqueue = useEnqueueImport();
  const review = useReviewImportRecord();
  const [sourceId, setSourceId] = useState("");

  const counts = useMemo(() => {
    const rows = jobs.data ?? [];
    return {
      queued: rows.filter((job) => job.status === "queued").length,
      running: rows.filter((job) => job.status === "running").length,
      completed: rows.filter((job) => String(job.status).startsWith("completed")).length,
      failed: rows.filter((job) => job.status === "failed").length,
    };
  }, [jobs.data]);

  return (
    <div className="border-2 border-foreground/10 bg-card p-5 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Explore Texas</div>
          <h2 className="font-display text-2xl">Data Import & Synchronization</h2>
          <p className="text-sm text-muted-foreground">Authoritative-source ingestion, validation, review, and rollback operations.</p>
        </div>
        <div className="flex gap-2">
          <select className="h-10 border border-input bg-background px-3 text-sm" value={sourceId} onChange={(event) => setSourceId(event.target.value)}>
            <option value="">Select source</option>
            {(sources.data ?? []).map((source) => <option key={text(source.id)} value={text(source.id)}>{text(source.name)}</option>)}
          </select>
          <Button disabled={!sourceId || enqueue.isPending} onClick={() => enqueue.mutate({ sourceId, executionMode: "preview" })}>Preview</Button>
          <Button disabled={!sourceId || enqueue.isPending} onClick={() => enqueue.mutate({ sourceId, executionMode: "live" })}>Run import</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(counts).map(([label, value]) => (
          <div key={label} className="border border-border p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className="font-display text-2xl">{value}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="validation">Validation Errors</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicate & Merge Review</TabsTrigger>
          <TabsTrigger value="sources">Source Configuration</TabsTrigger>
          <TabsTrigger value="health">Connector Health</TabsTrigger>
          <TabsTrigger value="rollbacks">Rollback History</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs"><JobTable rows={jobs.data ?? []} /></TabsContent>
        <TabsContent value="validation"><ReviewTable rows={(reviews.data ?? []).filter((row) => Array.isArray(row.validation_issues) && row.validation_issues.length > 0)} onReview={(id, status) => review.mutate({ id, status })} /></TabsContent>
        <TabsContent value="duplicates"><ReviewTable rows={(reviews.data ?? []).filter((row) => Array.isArray(row.duplicate_candidates) && row.duplicate_candidates.length > 0)} onReview={(id, status) => review.mutate({ id, status })} /></TabsContent>
        <TabsContent value="sources"><SourceTable rows={sources.data ?? []} /></TabsContent>
        <TabsContent value="health"><SourceTable rows={sources.data ?? []} health /></TabsContent>
        <TabsContent value="rollbacks"><SimpleTable rows={rollbacks.data ?? []} columns={["job_id", "status", "statistics", "started_at", "completed_at", "created_at"]} /></TabsContent>
      </Tabs>
    </div>
  );
}

function JobTable({ rows }: { rows: Array<Record<string, unknown>> }) {
  return <SimpleTable rows={rows} columns={["id", "status", "mode", "execution_mode", "statistics", "started_at", "completed_at", "created_at"]} />;
}

function SourceTable({ rows, health = false }: { rows: Array<Record<string, unknown>>; health?: boolean }) {
  return <SimpleTable rows={rows} columns={health ? ["name", "source_type", "enabled", "last_success_at", "last_failure_at", "consecutive_failures"] : ["name", "source_type", "endpoint", "enabled", "schedule", "updated_at"]} />;
}

function ReviewTable({ rows, onReview }: { rows: Array<Record<string, unknown>>; onReview: (id: string, status: "approved" | "rejected" | "merged") => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b">{["External ID", "Action", "Issues / Candidates", "Created", "Actions"].map((heading) => <th key={heading} className="p-2 text-[10px] uppercase tracking-wider">{heading}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={text(row.id)} className="border-b align-top"><td className="p-2">{text(row.external_id)}</td><td className="p-2">{text(row.action)}</td><td className="p-2 max-w-xl break-words">{text((row.validation_issues as unknown[])?.length ? row.validation_issues : row.duplicate_candidates)}</td><td className="p-2">{text(row.created_at)}</td><td className="p-2 whitespace-nowrap"><button className="mr-2 underline text-primary" onClick={() => onReview(text(row.id), "approved")}>Approve</button><button className="mr-2 underline" onClick={() => onReview(text(row.id), "merged")}>Merge</button><button className="underline text-destructive" onClick={() => onReview(text(row.id), "rejected")}>Reject</button></td></tr>)}</tbody>
      </table>
      {!rows.length ? <p className="p-4 text-sm text-muted-foreground">No records.</p> : null}
    </div>
  );
}

function SimpleTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b">{columns.map((column) => <th key={column} className="p-2 text-[10px] uppercase tracking-wider">{column.replaceAll("_", " ")}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={text(row.id ?? index)} className="border-b align-top">{columns.map((column) => <td key={column} className="p-2 max-w-sm break-words">{text(row[column])}</td>)}</tr>)}</tbody>
      </table>
      {!rows.length ? <p className="p-4 text-sm text-muted-foreground">No records.</p> : null}
    </div>
  );
}
