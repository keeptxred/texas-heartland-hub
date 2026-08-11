import { createFileRoute } from "@tanstack/react-router";
import { applyGscMetrics, type GscRow } from "@/lib/gsc";

const EXPECTED_REPOSITORY = "keeptxred/texas-heartland-hub";
const EXPECTED_WORKFLOW = ".github/workflows/sync-gsc-metrics.yml";

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
      "User-Agent": "KeepTXRed-gsc-sync",
    },
  });
  if (!response.ok) return { ok: false, reason: `github-run-lookup-${response.status}` };

  const run = await response.json() as Record<string, any>;
  if (run?.repository?.full_name !== EXPECTED_REPOSITORY) return { ok: false, reason: "run-repository-mismatch" };
  if (run?.path !== EXPECTED_WORKFLOW) return { ok: false, reason: "workflow-path-mismatch" };
  if (run?.head_branch !== "main") return { ok: false, reason: "branch-mismatch" };
  if (!["schedule", "workflow_dispatch", "push"].includes(String(run?.event || ""))) {
    return { ok: false, reason: "event-not-allowed" };
  }
  if (!["queued", "in_progress"].includes(String(run?.status || ""))) {
    return { ok: false, reason: `run-not-active-${String(run?.status || "unknown")}` };
  }
  return { ok: true };
}

function validRow(value: unknown): value is GscRow {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.slug === "string"
    && /^[a-z0-9][a-z0-9-]{2,220}$/i.test(row.slug)
    && Number.isFinite(Number(row.impressions))
    && Number(row.impressions) >= 0
    && Number.isFinite(Number(row.clicks))
    && Number(row.clicks) >= 0
    && (row.ctr == null || Number.isFinite(Number(row.ctr)))
    && (row.position == null || Number.isFinite(Number(row.position)));
}

export const Route = createFileRoute("/api/admin/gsc-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const verification = await verifyGithubRun(request);
        if (!verification.ok) {
          return Response.json(
            { ok: false, error: "Unauthorized GitHub Actions run", reason: verification.reason },
            { status: 401 },
          );
        }

        const payload = await request.json().catch(() => null) as { rows?: unknown } | null;
        if (!Array.isArray(payload?.rows) || payload.rows.length > 500 || !payload.rows.every(validRow)) {
          return Response.json({ ok: false, error: "Invalid GSC metrics payload" }, { status: 400 });
        }

        const result = await applyGscMetrics(payload.rows as GscRow[]);
        return Response.json({ ok: true, ...result });
      },
    },
  },
});
