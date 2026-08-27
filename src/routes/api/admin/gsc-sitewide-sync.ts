import { createFileRoute } from "@tanstack/react-router";
import {
  applyGscSitewideMetrics,
  applyGscUrlInspections,
  type GscDailyPageMetric,
  type GscUrlInspection,
} from "@/lib/gsc-sitewide";

const EXPECTED_REPOSITORY = "keeptxred/texas-heartland-hub";
const EXPECTED_WORKFLOW = ".github/workflows/sync-gsc-sitewide.yml";
const MAX_METRIC_ROWS = 500;
const MAX_INSPECTION_ROWS = 250;

type GithubRunVerification = { ok: true } | { ok: false; reason: string };

async function verifyGithubRun(request: Request): Promise<GithubRunVerification> {
  const directToken = request.headers.get("x-github-token")?.trim() ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const token = directToken || bearerToken;
  const runId = request.headers.get("x-github-run-id") ?? "";
  const repository = request.headers.get("x-github-repository") ?? "";

  if (!token) return { ok: false, reason: "missing-token" };
  if (!/^\d+$/.test(runId)) return { ok: false, reason: "invalid-run-id" };
  if (repository !== EXPECTED_REPOSITORY) return { ok: false, reason: "repository-mismatch" };

  const response = await fetch(`https://api.github.com/repos/${EXPECTED_REPOSITORY}/actions/runs/${runId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "KeepTXRed-gsc-sitewide-sync",
    },
  });
  if (!response.ok) return { ok: false, reason: `github-run-lookup-${response.status}` };

  const run = await response.json() as Record<string, any>;
  if (run?.repository?.full_name !== EXPECTED_REPOSITORY) return { ok: false, reason: "run-repository-mismatch" };
  if (run?.path !== EXPECTED_WORKFLOW) return { ok: false, reason: "workflow-path-mismatch" };
  if (run?.head_branch !== "main") return { ok: false, reason: "branch-mismatch" };
  if (!["schedule", "workflow_dispatch"].includes(String(run?.event || ""))) return { ok: false, reason: "event-not-allowed" };
  if (!["queued", "in_progress"].includes(String(run?.status || ""))) return { ok: false, reason: `run-not-active-${String(run?.status || "unknown")}` };
  return { ok: true };
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validCanonicalUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 500) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "keeptxred.com" && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function validPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && value.length <= 400;
}

function validMetricRow(value: unknown): value is GscDailyPageMetric {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return validDate(row.metricDate) && validCanonicalUrl(row.url) && validPath(row.path)
    && Number.isFinite(Number(row.impressions)) && Number(row.impressions) >= 0
    && Number.isFinite(Number(row.clicks)) && Number(row.clicks) >= 0
    && (row.ctr == null || Number.isFinite(Number(row.ctr)))
    && (row.position == null || Number.isFinite(Number(row.position)));
}

function validOptionalString(value: unknown, max = 1000): boolean {
  return value == null || (typeof value === "string" && value.length <= max);
}

function validStringArray(value: unknown): boolean {
  return value == null || (Array.isArray(value) && value.length <= 50
    && value.every((item) => typeof item === "string" && item.length <= 1000));
}

function validInspectionRow(value: unknown): value is GscUrlInspection {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return validCanonicalUrl(row.url) && validPath(row.path)
    && validOptionalString(row.verdict, 100)
    && validOptionalString(row.coverageState, 500)
    && validOptionalString(row.robotsTxtState, 100)
    && validOptionalString(row.indexingState, 100)
    && validOptionalString(row.pageFetchState, 100)
    && validOptionalString(row.lastCrawlTime, 100)
    && validOptionalString(row.googleCanonical)
    && validOptionalString(row.userCanonical)
    && validStringArray(row.sitemap)
    && validStringArray(row.referringUrls)
    && validOptionalString(row.inspectionResultLink, 2000);
}

export const Route = createFileRoute("/api/admin/gsc-sitewide-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const verification = await verifyGithubRun(request);
        if (!verification.ok) {
          return Response.json({ ok: false, error: "Unauthorized GitHub Actions run", reason: verification.reason }, { status: 401 });
        }

        const payload = await request.json().catch(() => null) as { metrics?: unknown; inspections?: unknown } | null;
        const metrics = payload?.metrics ?? [];
        const inspections = payload?.inspections ?? [];
        if (!Array.isArray(metrics) || metrics.length > MAX_METRIC_ROWS || !metrics.every(validMetricRow)) {
          return Response.json({ ok: false, error: "Invalid sitewide GSC metrics payload" }, { status: 400 });
        }
        if (!Array.isArray(inspections) || inspections.length > MAX_INSPECTION_ROWS || !inspections.every(validInspectionRow)) {
          return Response.json({ ok: false, error: "Invalid GSC inspection payload" }, { status: 400 });
        }
        if (metrics.length === 0 && inspections.length === 0) {
          return Response.json({ ok: false, error: "No GSC data supplied" }, { status: 400 });
        }

        const [metricsStored, inspectionsStored] = await Promise.all([
          applyGscSitewideMetrics(metrics as GscDailyPageMetric[]),
          applyGscUrlInspections(inspections as GscUrlInspection[]),
        ]);
        return Response.json({ ok: true, metricsStored, inspectionsStored });
      },
    },
  },
});
