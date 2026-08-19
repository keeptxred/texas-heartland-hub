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
  const requestedSlug = (url.searchParams.get("slug") ?? "").trim();
  const dryRun = url.searchParams.get("dry") === "1";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated Supabase types can lag internal diagnostic views.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data: readyRows, error } = await db
    .from("adsense_cloud_article_readiness")
    .select("slug,published_at")
    .eq("adsense_ready", true)
    .eq("image_ready", false)
    .order("published_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const slugs = (readyRows ?? []).map((row: { slug: string }) => row.slug);
  if (dryRun) return Response.json({ ok: true, dryRun: true, ready: slugs.length, slugs });

  if (!requestedSlug) {
    return Response.json({ error: "Missing eligible slug" }, { status: 400 });
  }
  if (!slugs.includes(requestedSlug)) {
    return Response.json({ error: "Slug is not currently image-missing and AdSense-ready" }, { status: 409 });
  }

  // The readiness view says this article is not image-ready. Force a verified
  // regeneration so URL, alt text and ready status converge together even when
  // a stale featured_image_url already exists from an earlier failed attempt.
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
    results: [result],
  }, { status: result.ok ? 200 : 422 });
}

export const Route = createFileRoute("/api/public/hooks/adsense-image-backfill")({
  server: { handlers: { POST: post } },
});
