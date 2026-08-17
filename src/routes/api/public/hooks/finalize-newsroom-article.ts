import { createFileRoute } from "@tanstack/react-router";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { normalizeNewsroomWhyThisMatters } from "@/lib/newsroom-postpublish";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const PRODUCTION_WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";

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
      workflowPath: PRODUCTION_WORKFLOW_PATH,
    });
    return true;
  } catch {
    return false;
  }
}

async function post({ request }: { request: Request }) {
  if (!(await authorized(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { slug?: unknown } = {};
  try {
    payload = await request.json() as { slug?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";
  if (!slug || slug.length > 200) return Response.json({ error: "Invalid slug" }, { status: 400 });

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // The generated database types can lag article metadata fields used by the newsroom pipeline.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const { data: article, error } = await db
    .from("daily_articles")
    .select("slug,author,kind,body,body_json")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!article) return Response.json({ error: "Article not found" }, { status: 404 });
  if (article.author !== "Keep TX Red Newsroom" || article.kind !== "news") {
    return Response.json({ error: "Article is not a clustered newsroom publication" }, { status: 409 });
  }

  const normalized = normalizeNewsroomWhyThisMatters(article.body_json, article.body);
  if (normalized.changed) {
    const { error: updateError } = await db
      .from("daily_articles")
      .update({ body_json: normalized.bodyJson, body: normalized.body })
      .eq("slug", slug);
    if (updateError) return Response.json({ error: updateError.message }, { status: 500 });
  }

  const image = await generateFeaturedImageForSlugDirect(slug, false);

  return Response.json({
    ok: true,
    slug,
    normalizedWhyThisMatters: normalized.changed,
    image,
  });
}

export const Route = createFileRoute("/api/public/hooks/finalize-newsroom-article")({
  server: {
    handlers: {
      POST: post,
    },
  },
});
