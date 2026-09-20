import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/adsense-image-backfill.yml";
const FACEBOOK_FRESHNESS_DAYS = 4;
const ADSENSE_BACKLOG_LIMIT = 100;

type RecoveryArticleRow = {
  slug: string;
  published_at: string;
  updated_at: string;
  featured_image_url: string | null;
  image_generation_status: string | null;
  kind: string | null;
  body_json: Parameters<typeof meetsArticleMainWordCount>[1];
};

type ReadinessRow = {
  slug: string;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function authorized(request: Request): Promise<boolean> {
  const token = bearerToken(request);
  if (!token) return false;
  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
      allowedEventNames: ["schedule", "workflow_dispatch", "workflow_run"],
    });
    return true;
  } catch {
    return false;
  }
}

function substantiveAndNotGenerating(row: RecoveryArticleRow): boolean {
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  return status !== "generating" && meetsArticleMainWordCount(row.kind, row.body_json);
}

function needsFreshImageRecovery(row: RecoveryArticleRow): boolean {
  if (!substantiveAndNotGenerating(row)) return false;
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  const hasImage = Boolean(row.featured_image_url?.trim());
  return !hasImage || status === "failed";
}

function imageRecoveryPriority(row: RecoveryArticleRow): [number, number, number] {
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  const failed = status === "failed" ? 1 : 0;
  const updatedAt = Number.isFinite(Date.parse(row.updated_at)) ? Date.parse(row.updated_at) : 0;
  const publishedAt = Number.isFinite(Date.parse(row.published_at)) ? Date.parse(row.published_at) : 0;
  // Give never-failed/incomplete rows one opportunity before retrying failures.
  // Within the same state, rotate the least recently touched row to the front so
  // one strict-validator failure cannot permanently starve the rest of the queue.
  return [failed, updatedAt, -publishedAt];
}

export function orderImageRecoveryRows(rows: RecoveryArticleRow[]): RecoveryArticleRow[] {
  return [...rows].sort((a, b) => {
    const aPriority = imageRecoveryPriority(a);
    const bPriority = imageRecoveryPriority(b);
    return aPriority[0] - bPriority[0]
      || aPriority[1] - bPriority[1]
      || aPriority[2] - bPriority[2]
      || a.slug.localeCompare(b.slug);
  });
}

async function post({ request }: { request: Request }) {
  if (!(await authorized(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const requestedSlug = (url.searchParams.get("slug") ?? "").trim();
  const dryRun = url.searchParams.get("dry") === "1";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated Supabase types can lag internal image status fields and audit views.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const cutoff = new Date(Date.now() - FACEBOOK_FRESHNESS_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const articleSelect = "slug,published_at,updated_at,featured_image_url,image_generation_status,kind,body_json";

  const [{ data: recentRows, error: recentError }, { data: readinessRows, error: readinessError }] = await Promise.all([
    db
      .from("daily_articles")
      .select(articleSelect)
      .gte("published_at", cutoff)
      .order("published_at", { ascending: false })
      .limit(100),
    db
      .from("adsense_cloud_article_readiness")
      .select("slug")
      .eq("adsense_ready", true)
      .eq("image_ready", false)
      .order("published_at", { ascending: false })
      .limit(ADSENSE_BACKLOG_LIMIT),
  ]);
  if (recentError) return Response.json({ error: recentError.message }, { status: 500 });
  if (readinessError) return Response.json({ error: readinessError.message }, { status: 500 });

  const backlogSlugs = ((readinessRows ?? []) as ReadinessRow[])
    .map((row) => row.slug?.trim())
    .filter((slug): slug is string => Boolean(slug));

  let backlogArticleRows: RecoveryArticleRow[] = [];
  if (backlogSlugs.length > 0) {
    const { data, error } = await db
      .from("daily_articles")
      .select(articleSelect)
      .in("slug", backlogSlugs)
      .order("published_at", { ascending: false })
      .limit(ADSENSE_BACKLOG_LIMIT);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    backlogArticleRows = (data ?? []) as RecoveryArticleRow[];
  }

  const eligibleBySlug = new Map<string, RecoveryArticleRow>();
  for (const row of (recentRows ?? []) as RecoveryArticleRow[]) {
    if (needsFreshImageRecovery(row)) eligibleBySlug.set(row.slug, row);
  }
  for (const row of backlogArticleRows) {
    // The readiness view already established that the article is KTR-safe and
    // its image state is incomplete. Keep the substantive article-length gate
    // here so older thin rows can never become eligible just because the view
    // later changes independently.
    if (substantiveAndNotGenerating(row)) eligibleBySlug.set(row.slug, row);
  }

  const slugs = orderImageRecoveryRows([...eligibleBySlug.values()]).map((row) => row.slug);
  if (dryRun) {
    return Response.json({
      ok: true,
      dryRun: true,
      ready: slugs.length,
      slugs,
      freshness_days: FACEBOOK_FRESHNESS_DAYS,
      adsense_backlog_candidates: backlogSlugs.length,
      scope: "fresh_quality_plus_adsense_backlog",
    });
  }

  if (!requestedSlug) {
    return Response.json({ error: "Missing eligible slug" }, { status: 400 });
  }
  if (!slugs.includes(requestedSlug)) {
    return Response.json({ error: "Slug is not currently eligible for image recovery" }, { status: 409 });
  }

  // Force a verified regeneration so URL, alt text and ready status converge
  // together even when a stale featured_image_url exists from a failed attempt.
  const generated = await generateFeaturedImageForSlugDirect(requestedSlug, true);
  const result = generated.ok
    ? { slug: requestedSlug, ok: true as const, url: generated.url }
    : { slug: requestedSlug, ok: false as const, error: generated.error };

  return Response.json({
    ok: result.ok,
    ready: slugs.length,
    processed: 1,
    succeeded: result.ok ? 1 : 0,
    failed: result.ok ? 0 : 1,
    scope: "fresh_quality_plus_adsense_backlog",
    results: [result],
  }, { status: result.ok ? 200 : 422 });
}

export const Route = createFileRoute("/api/public/hooks/adsense-image-backfill")({
  server: { handlers: { POST: post } },
});
