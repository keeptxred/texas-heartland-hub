import { createFileRoute } from "@tanstack/react-router";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/adsense-image-backfill.yml";

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
    });
    return true;
  } catch {
    return false;
  }
}

async function post({ request }: { request: Request }) {
  if (!(await authorized(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const rawLimit = Number(url.searchParams.get("limit") ?? "2");
  const rawOffset = Number(url.searchParams.get("offset") ?? "0");
  const limit = Math.max(1, Math.min(6, Number.isFinite(rawLimit) ? Math.floor(rawLimit) : 2));
  const offset = Math.max(0, Math.min(20, Number.isFinite(rawOffset) ? Math.floor(rawOffset) : 0));
  const dryRun = url.searchParams.get("dry") === "1";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated Supabase types can lag internal diagnostic views.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data: readyRows, error } = await db
    .from("adsense_cloud_article_readiness")
    .select("slug,published_at")
    .eq("adsense_ready", true)
    .order("published_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const slugs = (readyRows ?? []).map((row: { slug: string }) => row.slug);
  if (dryRun) return Response.json({ ok: true, dryRun: true, ready: slugs.length, slugs });

  const selected = slugs.slice(offset, offset + limit);
  const results: Array<{ slug: string; ok: boolean; url?: string; error?: string }> = [];

  for (const slug of selected) {
    const { data: article } = await db
      .from("daily_articles")
      .select("featured_image_url")
      .eq("slug", slug)
      .maybeSingle();

    if (article?.featured_image_url) {
      results.push({ slug, ok: true, url: article.featured_image_url });
      continue;
    }

    const generated = await generateFeaturedImageForSlugDirect(slug, false);
    if (!generated.ok) {
      results.push({ slug, ok: false, error: generated.error });
      continue;
    }

    // `trg_clear_missing_image_when_ready` owns quality-flag cleanup whenever
    // any image writer successfully attaches featured_image_url.
    results.push({ slug, ok: true, url: generated.url });
  }

  return Response.json({
    ok: results.every((result) => result.ok),
    ready: slugs.length,
    offset,
    limit,
    processed: results.length,
    succeeded: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  });
}

export const Route = createFileRoute("/api/public/hooks/adsense-image-backfill")({
  server: { handlers: { POST: post } },
});
