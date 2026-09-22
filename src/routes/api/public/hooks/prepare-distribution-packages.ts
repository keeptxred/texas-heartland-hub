import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import {
  buildArticleDistributionPackage,
  type ArticleDistributionPackage,
  type DistributionArticle,
} from "@/lib/article-distribution-package";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { isPublicArticleReady, type PublicArticleCandidate } from "@/lib/public-article-readiness";
import { isKeepTxRedSearchOwnedStory } from "@/lib/ktr-search-ownership";

const OIDC_AUDIENCE = "keeptxred-distribution-packages";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/prepare-distribution-packages.yml";
const MAX_ARTICLE_AGE_DAYS = 4;
const MAX_ARTICLES = 160;

type ArticleRow = DistributionArticle & PublicArticleCandidate & {
  kind: string;
  source_name: string | null;
  source_url: string | null;
};

type ExistingPackageRow = {
  id: string;
  source_url: string | null;
  facebook_hook: string | null;
  facebook_body: string | null;
  facebook_cta: string | null;
  facebook_hashtags: string | null;
  instagram_hook: string | null;
  instagram_script: string | null;
  instagram_caption: string | null;
  instagram_hashtags: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  asset_type: string | null;
  asset_url: string | null;
  asset_notes: string | null;
  workflow_status: string | null;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function missing(value: string | null | undefined): boolean {
  return !value || !value.trim();
}

export function missingDistributionPackagePatch(
  existing: ExistingPackageRow,
  built: ArticleDistributionPackage,
): Record<string, string> {
  const patch: Record<string, string> = {};
  const assignIfMissing = (key: string, current: string | null | undefined, next: string) => {
    if (missing(current) && next.trim()) patch[key] = next;
  };

  assignIfMissing("facebook_hook", existing.facebook_hook, built.facebook.hook);
  assignIfMissing("facebook_body", existing.facebook_body, built.facebook.body);
  assignIfMissing("facebook_cta", existing.facebook_cta, built.facebook.cta);
  assignIfMissing("facebook_hashtags", existing.facebook_hashtags, built.facebook.hashtags);
  assignIfMissing("instagram_hook", existing.instagram_hook, built.instagram.hook);
  assignIfMissing("instagram_script", existing.instagram_script, built.instagram.script);
  assignIfMissing("instagram_caption", existing.instagram_caption, built.instagram.caption);
  assignIfMissing("instagram_hashtags", existing.instagram_hashtags, built.instagram.hashtags);
  assignIfMissing("seo_title", existing.seo_title, built.seo.title);
  assignIfMissing("seo_description", existing.seo_description, built.seo.description);
  assignIfMissing("seo_keywords", existing.seo_keywords, built.seo.keywords);
  assignIfMissing("asset_notes", existing.asset_notes, built.assetNotes);

  if (missing(existing.asset_url) && built.assetUrl) {
    patch.asset_url = built.assetUrl;
    if (missing(existing.asset_type)) patch.asset_type = "IMAGE";
    if ((existing.workflow_status ?? "DRAFT") === "DRAFT") patch.workflow_status = "ASSET_READY";
  }

  return patch;
}

function packageInsertRow(built: ArticleDistributionPackage) {
  return {
    source_title: built.sourceTitle,
    source_url: built.sourceUrl,
    category: built.category,
    facebook_hook: built.facebook.hook,
    facebook_body: built.facebook.body,
    facebook_cta: built.facebook.cta,
    facebook_hashtags: built.facebook.hashtags,
    instagram_hook: built.instagram.hook,
    instagram_script: built.instagram.script,
    instagram_caption: built.instagram.caption,
    instagram_hashtags: built.instagram.hashtags,
    seo_title: built.seo.title,
    seo_description: built.seo.description,
    seo_keywords: built.seo.keywords,
    asset_type: built.assetUrl ? "IMAGE" : null,
    asset_url: built.assetUrl,
    asset_notes: built.assetNotes,
    status: "DRAFT",
    workflow_status: built.assetUrl ? "ASSET_READY" : "DRAFT",
  };
}

async function prepareDistributionPackages(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const cutoff = new Date(Date.now() - MAX_ARTICLE_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const now = Date.now();

  const { data: rawArticles, error: articleError } = await db
    .from("daily_articles")
    .select("slug,title,seo_headline,dek,category,published_at,kind,body_json,keywords,seo_keywords,featured_image_url,image_url,image_generation_status,content_quality_score,quality_flags,source_name,source_url,discover_category")
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false })
    .limit(MAX_ARTICLES);

  if (articleError) return Response.json({ ok: false, error: articleError.message }, { status: 500 });

  const articles = ((rawArticles ?? []) as ArticleRow[]).filter((article) => {
    const published = Date.parse(article.published_at ?? "");
    return Boolean(article.slug && article.title)
      && Number.isFinite(published)
      && published <= now
      && meetsArticleMainWordCount(article.kind, article.body_json as never)
      && isPublicArticleReady(article)
      && isKeepTxRedSearchOwnedStory({
        title: article.title,
        description: article.dek,
        category: article.category,
        source: article.source_name,
        kind: article.kind,
      });
  });

  if (articles.length === 0) {
    return Response.json({ ok: true, created: 0, enriched: 0, unchanged: 0, eligible: 0 });
  }

  const builtByUrl = new Map(
    articles.map((article) => {
      const built = buildArticleDistributionPackage(article);
      return [built.sourceUrl, built] as const;
    }),
  );
  const urls = [...builtByUrl.keys()];

  const { data: rawPackages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_url,facebook_hook,facebook_body,facebook_cta,facebook_hashtags,instagram_hook,instagram_script,instagram_caption,instagram_hashtags,seo_title,seo_description,seo_keywords,asset_type,asset_url,asset_notes,workflow_status,created_at")
    .in("source_url", urls)
    .order("created_at", { ascending: false });

  if (packageError) return Response.json({ ok: false, error: packageError.message }, { status: 500 });

  const newestByUrl = new Map<string, ExistingPackageRow>();
  for (const row of (rawPackages ?? []) as ExistingPackageRow[]) {
    if (row.source_url && !newestByUrl.has(row.source_url)) newestByUrl.set(row.source_url, row);
  }

  const insertRows: ReturnType<typeof packageInsertRow>[] = [];
  const updates: Array<{ id: string; patch: Record<string, string> }> = [];
  let unchanged = 0;

  for (const [sourceUrl, built] of builtByUrl) {
    const existing = newestByUrl.get(sourceUrl);
    if (!existing) {
      insertRows.push(packageInsertRow(built));
      continue;
    }
    const patch = missingDistributionPackagePatch(existing, built);
    if (Object.keys(patch).length === 0) unchanged += 1;
    else updates.push({ id: existing.id, patch });
  }

  if (insertRows.length > 0) {
    const { error } = await db.from("content_packages").insert(insertRows);
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  for (const update of updates) {
    const { error } = await db.from("content_packages").update(update.patch).eq("id", update.id);
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({
    ok: true,
    eligible: articles.length,
    created: insertRows.length,
    enriched: updates.length,
    unchanged,
    article_urls: urls,
  });
}

export const Route = createFileRoute("/api/public/hooks/prepare-distribution-packages")({
  server: {
    handlers: {
      POST: async ({ request }) => prepareDistributionPackages(request),
    },
  },
});
