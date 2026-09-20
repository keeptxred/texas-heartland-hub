import { createFileRoute } from "@tanstack/react-router";

const EXPECTED_REPOSITORY = "keeptxred/texas-heartland-hub";
const EXPECTED_WORKFLOW = ".github/workflows/sync-texas-legislation.yml";
const ALLOWED_METHODS = new Set(["GET", "POST", "PATCH", "DELETE"]);
const ALLOWED_RPCS = new Set([
  "upsert_bidirectional_authority_relationship",
  "refresh_bill_relationships",
  "refresh_bill_committee_activity_edges",
  "prune_unapproved_bill_article_authority_edges",
]);

function allowedPath(path: string, method: string) {
  if (!path || path.includes("..") || path.includes("\\")) return false;
  const rpc = /^rpc\/([a-z0-9_]+)$/i.exec(path);
  if (rpc) return method === "POST" && ALLOWED_RPCS.has(rpc[1]);
  return /^(?:bills|bill_[a-z0-9_]+|legislative_[a-z0-9_]+)(?:\?|$)/i.test(path);
}

async function verifyGithubRun(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const runId = request.headers.get("x-github-run-id") ?? "";
  const repository = request.headers.get("x-github-repository") ?? "";
  if (!token || !/^\d+$/.test(runId) || repository !== EXPECTED_REPOSITORY) return false;

  const response = await fetch(`https://api.github.com/repos/${EXPECTED_REPOSITORY}/actions/runs/${runId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "KeepTXRed-legislation-sync",
    },
  });
  if (!response.ok) return false;
  const run = await response.json() as Record<string, any>;
  return run?.repository?.full_name === EXPECTED_REPOSITORY
    && run?.path === EXPECTED_WORKFLOW
    && run?.head_branch === "main"
    && ["schedule", "workflow_dispatch"].includes(String(run?.event || ""))
    && ["queued", "in_progress"].includes(String(run?.status || ""));
}

function serviceHeaders(serviceKey: string, prefer?: string) {
  const headers: Record<string, string> = {
    apikey: serviceKey,
    "Content-Type": "application/json",
  };
  if (!serviceKey.startsWith("sb_secret_")) headers.Authorization = `Bearer ${serviceKey}`;
  if (prefer) headers.Prefer = prefer;
  return headers;
}

export const Route = createFileRoute("/api/admin/legislation-sync-proxy")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await verifyGithubRun(request))) {
          return Response.json({ ok: false, error: "Unauthorized GitHub Actions run" }, { status: 401 });
        }

        const payload = await request.json().catch(() => null) as {
          path?: unknown;
          method?: unknown;
          body?: unknown;
          prefer?: unknown;
        } | null;
        const path = typeof payload?.path === "string" ? payload.path : "";
        const method = typeof payload?.method === "string" ? payload.method.toUpperCase() : "GET";
        const prefer = typeof payload?.prefer === "string" ? payload.prefer : undefined;
        if (!ALLOWED_METHODS.has(method) || !allowedPath(path, method)) {
          return Response.json({ ok: false, error: "Legislative sync path or method is not allowed" }, { status: 400 });
        }

        const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
        const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ ok: false, error: "Server database credentials are unavailable" }, { status: 503 });
        }

        const upstream = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
          method,
          headers: serviceHeaders(serviceKey, prefer),
          body: method === "GET" ? undefined : JSON.stringify(payload?.body ?? {}),
        });
        const text = await upstream.text();
        return new Response(text, {
          status: upstream.status,
          headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
        });
      },
    },
  },
});
