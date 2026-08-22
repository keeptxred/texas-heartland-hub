import { createFileRoute } from "@tanstack/react-router";

const EXPECTED_REPOSITORY = "keeptxred/texas-heartland-hub";
const EXPECTED_WORKFLOW = ".github/workflows/sync-texas-legislation.yml";
const PROXY_PREFIX = "/api/admin/legislation-sync-proxy/rest/v1/";
const ALLOWED_METHODS = new Set(["GET", "POST", "PATCH", "DELETE"]);
const ALLOWED_RPCS = new Set([
  "upsert_bidirectional_authority_relationship",
  "refresh_bill_relationships",
  "refresh_bill_committee_activity_edges",
  "prune_unapproved_bill_article_authority_edges",
]);

function allowedResource(resource: string, method: string) {
  if (!resource || resource.includes("..") || resource.includes("\\")) return false;
  const pathname = resource.split("?", 1)[0];
  const rpc = /^rpc\/([a-z0-9_]+)$/i.exec(pathname);
  if (rpc) return method === "POST" && ALLOWED_RPCS.has(rpc[1]);
  return /^(?:bills|bill_[a-z0-9_]+|legislative_[a-z0-9_]+)$/i.test(pathname);
}

function parseWorkflowCredential(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const composite = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const separator = composite.lastIndexOf("::");
  if (separator <= 0) return null;
  const token = composite.slice(0, separator);
  const runId = composite.slice(separator + 2);
  if (!token || !/^\d+$/.test(runId)) return null;
  return { token, runId };
}

async function verifyGithubRun(request: Request) {
  const credential = parseWorkflowCredential(request);
  if (!credential) return false;
  const response = await fetch(`https://api.github.com/repos/${EXPECTED_REPOSITORY}/actions/runs/${credential.runId}`, {
    headers: {
      Authorization: `Bearer ${credential.token}`,
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

function databaseHeaders(serviceKey: string, request: Request) {
  const headers: Record<string, string> = {
    apikey: serviceKey,
    "Content-Type": request.headers.get("content-type") || "application/json",
  };
  if (!serviceKey.startsWith("sb_secret_")) headers.Authorization = `Bearer ${serviceKey}`;
  const prefer = request.headers.get("prefer");
  if (prefer) headers.Prefer = prefer;
  return headers;
}

async function handle(request: Request) {
  const method = request.method.toUpperCase();
  if (!ALLOWED_METHODS.has(method)) return Response.json({ error: "Method not allowed" }, { status: 405 });
  if (!(await verifyGithubRun(request))) return Response.json({ error: "Unauthorized GitHub Actions run" }, { status: 401 });

  const url = new URL(request.url);
  if (!url.pathname.startsWith(PROXY_PREFIX)) return Response.json({ error: "Invalid proxy path" }, { status: 400 });
  const resourcePath = `${url.pathname.slice(PROXY_PREFIX.length)}${url.search}`;
  if (!allowedResource(resourcePath, method)) return Response.json({ error: "Legislative resource is not allowed" }, { status: 403 });

  const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
  if (!supabaseUrl || !serviceKey) return Response.json({ error: "Server database credentials are unavailable" }, { status: 503 });

  const body = method === "GET" ? undefined : await request.text();
  const upstream = await fetch(`${supabaseUrl}/rest/v1/${resourcePath}`, {
    method,
    headers: databaseHeaders(serviceKey, request),
    body,
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
  });
}

export const Route = createFileRoute("/api/admin/legislation-sync-proxy/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
      PATCH: ({ request }) => handle(request),
      DELETE: ({ request }) => handle(request),
    },
  },
});
