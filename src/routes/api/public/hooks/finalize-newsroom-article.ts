import { createFileRoute } from "@tanstack/react-router";
import { scoreQuality } from "@/lib/content-quality";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { normalizeNewsroomWhyThisMatters } from "@/lib/newsroom-postpublish";
import { duplicateParagraphOccurrences } from "@/lib/public-article-readiness";
import {
  assessArticleSourceIntegrity,
  sourceReferencesFromBodyJson,
} from "@/lib/article-source-integrity";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const PRODUCTION_WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";
const SCORE_QUALITY_FLAGS = new Set([
  "weak_title",
  "weak_dek",
  "missing_author",
  "missing_publish_date",
  "missing_image",
  "thin_body",
  "missing_why_this_matters",
  "missing_texas_context",
]);

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

function existingNonScoreFlags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((flag): flag is string => typeof flag === "string")
    .filter((flag) => !SCORE_QUALITY_FLAGS.has(flag));
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
    .select("slug,title,dek,author,kind,published_at,body,body_json,quality_flags,source_name,source_url")
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

  const sourceIntegrity = assessArticleSourceIntegrity({
    sourceName: article.source_name,
    sourceUrl: article.source_url,
    sources: sourceReferencesFromBodyJson(normalized.bodyJson),
  });
  const sourceIntegrityFlags = sourceIntegrity.falseMultiSourceClaim
    ? ["seo_false_multisource", "seo_noindex"]
    : [];
  const repetitionFlags = duplicateParagraphOccurrences(normalized.bodyJson) > 2
    ? ["seo_low_value_commodity", "internal_repetition"]
    : [];

  const image = await generateFeaturedImageForSlugDirect(slug, false);
  const quality = scoreQuality({
    slug,
    title: article.title,
    dek: article.dek,
    author: article.author,
    published_at: article.published_at,
    kind: article.kind,
    body: normalized.body,
    body_json: normalized.bodyJson,
    image_url: image.ok ? image.url : null,
  });
  const qualityFlags = [...new Set([
    ...existingNonScoreFlags(article.quality_flags),
    ...quality.flags,
    ...sourceIntegrityFlags,
    ...repetitionFlags,
  ])];
  const { error: qualityUpdateError } = await db
    .from("daily_articles")
    .update({
      content_quality_score: quality.score,
      quality_flags: qualityFlags.length > 0 ? qualityFlags : null,
    })
    .eq("slug", slug);
  if (qualityUpdateError) return Response.json({ error: qualityUpdateError.message }, { status: 500 });

  return Response.json({
    ok: true,
    slug,
    normalizedWhyThisMatters: normalized.changed,
    image,
    contentQualityScore: quality.score,
    qualityFlags: qualityFlags.length > 0 ? qualityFlags : null,
    sourceIntegrity,
    duplicateParagraphOccurrences: duplicateParagraphOccurrences(normalized.bodyJson),
  });
}

export const Route = createFileRoute("/api/public/hooks/finalize-newsroom-article")({
  server: {
    handlers: {
      POST: post,
    },
  },
});
