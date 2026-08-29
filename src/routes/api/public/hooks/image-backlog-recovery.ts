import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { isLegacyGeneratedNewsAsset } from "@/lib/facebook-image-readiness";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { resetStaleFeaturedImageGenerationLeasesDirect } from "@/lib/featured-image-stale-lease";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/image-backlog-recovery.yml";

type BacklogRow = {
  slug: string;
  published_at: string | null;
  featured_image_url: string | null;
  image_generation_status: string | null;
  kind: string | null;
  body_json: Parameters<typeof meetsArticleMainWordCount>[1];
};

type AdSensePriorityRow = {
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
      allowedEventNames: ["push", "schedule", "workflow_dispatch", "workflow_run"],
    });
    return true;
  } catch {
    return false;
  }
}

function isMissingImage(row: BacklogRow): boolean {
  return !row.featured_image_url?.trim();
}

function isEligible(row: BacklogRow): boolean {
  if (!row.published_at) return false;
  if (!meetsArticleMainWordCount(row.kind, row.body_json)) return false;

  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  const missing = isMissingImage(row);
  const legacy = isLegacyGeneratedNewsAsset(row.featured_image_url);
  if (!missing && !legacy) return false;

  if (missing) return status === "pending" || status === "failed";
  return status === "pending" || status === "failed" || status === "ready";
}

function priority(row: BacklogRow): number {
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  if (isMissingImage(row)) return status === "pending" ? 0 : 1;
  if (status === "pending" || status === "failed") return 2;
  return 3;
}

async function post({ request }: { request: Request }) {
  if (!(await authorized(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const requestedSlug = (url.searchParams.get("slug") ?? "").trim();
  const dryRun = url.searchParams.get("dry") === "1";

  const staleResetResult = await resetStaleFeaturedImageGenerationLeasesDirect();
  if (staleResetResult.error) return Response.json({ error: staleResetResult.error }, { status: 500 });
  const staleReset = staleResetResult.reset;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated database types can lag internal image-recovery fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const columns = "slug,published_at,featured_image_url,image_generation_status,kind,body_json";

  const [missingResult, legacyResult, adsensePriorityResult] = await Promise.all([
    db
      .from("daily_articles")
      .select(columns)
      .is("featured_image_url", null)
      .in("image_generation_status", ["pending", "failed"])
      .order("published_at", { ascending: false })
      .limit(250),
    db
      .from("daily_articles")
      .select(columns)
      .like("featured_image_url", "%/images/news/generated/%")
      .in("image_generation_status", ["pending", "failed", "ready"])
      .order("published_at", { ascending: false })
      .limit(250),
    db
      .from("adsense_cloud_article_readiness")
      .select("slug")
      .eq("adsense_ready", true)
      .eq("image_ready", false)
      .limit(250),
  ]);
  if (missingResult.error) return Response.json({ error: missingResult.error.message }, { status: 500 });
  if (legacyResult.error) return Response.json({ error: legacyResult.error.message }, { status: 500 });

  // AdSense priority is an ordering enhancement only. If the audit view is
  // temporarily unavailable, preserve the existing general recovery queue.
  const adsensePrioritySlugs = new Set<string>(
    adsensePriorityResult.error
      ? []
      : ((adsensePriorityResult.data ?? []) as AdSensePriorityRow[]).map((row) => row.slug).filter(Boolean),
  );

  const merged = new Map<string, BacklogRow>();
  for (const row of [...(missingResult.data ?? []), ...(legacyResult.data ?? [])] as BacklogRow[]) {
    if (row?.slug) merged.set(row.slug, row);
  }

  const eligible = [...merged.values()]
    .filter(isEligible)
    .sort((a, b) => {
      const byAdSensePriority = Number(adsensePrioritySlugs.has(b.slug)) - Number(adsensePrioritySlugs.has(a.slug));
      if (byAdSensePriority) return byAdSensePriority;
      const byStatus = priority(a) - priority(b);
      if (byStatus) return byStatus;
      const aTime = a.published_at ? Date.parse(a.published_at) : 0;
      const bTime = b.published_at ? Date.parse(b.published_at) : 0;
      return bTime - aTime;
    });
  const slugs = eligible.map((row) => row.slug);
  const missingCount = eligible.filter(isMissingImage).length;
  const legacyCount = eligible.filter((row) => isLegacyGeneratedNewsAsset(row.featured_image_url)).length;
  const adsensePriorityCount = eligible.filter((row) => adsensePrioritySlugs.has(row.slug)).length;

  if (dryRun) {
    return Response.json({
      ok: true,
      dryRun: true,
      ready: slugs.length,
      missing: missingCount,
      legacy: legacyCount,
      adsensePriority: adsensePriorityCount,
      staleReset,
      slugs,
      scope: "adsense_ready_missing_first_then_missing_or_legacy_published_quality_article_images",
    });
  }

  if (!requestedSlug) return Response.json({ error: "Missing eligible slug" }, { status: 400 });
  if (!slugs.includes(requestedSlug)) {
    return Response.json({ error: "Slug is not currently an eligible published image-recovery backlog item" }, { status: 409 });
  }

  const generated = await generateFeaturedImageForSlugDirect(requestedSlug, true);
  const result = generated.ok
    ? { slug: requestedSlug, ok: true as const, url: generated.url }
    : { slug: requestedSlug, ok: false as const, error: generated.error };

  return Response.json({
    ok: result.ok,
    processed: 1,
    succeeded: result.ok ? 1 : 0,
    failed: result.ok ? 0 : 1,
    staleReset,
    scope: "adsense_ready_missing_first_then_missing_or_legacy_published_quality_article_images",
    results: [result],
  }, { status: result.ok ? 200 : 422 });
}

export const Route = createFileRoute("/api/public/hooks/image-backlog-recovery")({
  server: { handlers: { POST: post } },
});
