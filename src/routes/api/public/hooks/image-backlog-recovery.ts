import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
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

function isEligible(row: BacklogRow): boolean {
  const status = (row.image_generation_status ?? "").trim().toLowerCase();
  if (status !== "pending" && status !== "failed") return false;
  if (row.featured_image_url?.trim()) return false;
  return meetsArticleMainWordCount(row.kind, row.body_json);
}

function priority(row: BacklogRow): number {
  return (row.image_generation_status ?? "").trim().toLowerCase() === "pending" ? 0 : 1;
}

async function post({ request }: { request: Request }) {
  if (!(await authorized(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const requestedSlug = (url.searchParams.get("slug") ?? "").trim();
  const dryRun = url.searchParams.get("dry") === "1";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated database types can lag internal image-recovery fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data, error } = await db
    .from("daily_articles")
    .select("slug,published_at,featured_image_url,image_generation_status,kind,body_json")
    .is("featured_image_url", null)
    .in("image_generation_status", ["pending", "failed"])
    .order("published_at", { ascending: false })
    .limit(250);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const eligible = ((data ?? []) as BacklogRow[])
    .filter(isEligible)
    .sort((a, b) => {
      const byStatus = priority(a) - priority(b);
      if (byStatus) return byStatus;
      const aTime = a.published_at ? Date.parse(a.published_at) : 0;
      const bTime = b.published_at ? Date.parse(b.published_at) : 0;
      return bTime - aTime;
    });
  const slugs = eligible.map((row) => row.slug);

  if (dryRun) {
    return Response.json({
      ok: true,
      dryRun: true,
      ready: slugs.length,
      pending: eligible.filter((row) => priority(row) === 0).length,
      failed: eligible.filter((row) => priority(row) === 1).length,
      slugs,
      scope: "missing_quality_article_images_pending_first",
    });
  }

  if (!requestedSlug) return Response.json({ error: "Missing eligible slug" }, { status: 400 });
  if (!slugs.includes(requestedSlug)) {
    return Response.json({ error: "Slug is not currently an eligible missing-image backlog item" }, { status: 409 });
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
    scope: "missing_quality_article_images_pending_first",
    results: [result],
  }, { status: result.ok ? 200 : 422 });
}

export const Route = createFileRoute("/api/public/hooks/image-backlog-recovery")({
  server: { handlers: { POST: post } },
});
