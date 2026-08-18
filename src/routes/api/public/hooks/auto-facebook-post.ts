import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { quickPublishToFacebookFn } from "@/services/quickPublish.functions";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SITE_URL = "https://keeptxred.com";
const LOOKBACK_DAYS = 7;
const MAX_CANDIDATES = 40;
const MAX_ATTEMPTS = 8;

type ArticleRow = {
  slug: string;
  title: string;
  dek: string;
  featured_image_url: string | null;
  published_at: string;
  source_name: string | null;
  internal_url: string;
  kind: string;
  body_json: unknown;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function articleUrl(row: ArticleRow): string {
  const raw = String(row.internal_url ?? "").trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${SITE_URL}/news/${row.slug}`;
}

async function runAutoFacebookPost(request: Request) {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

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

  const adminToken = process.env.ADMIN_PASSCODE ?? "keeptxred";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: rawArticles, error: articleError } = await db
    .from("daily_articles")
    .select("slug,title,dek,featured_image_url,published_at,source_name,internal_url,kind,body_json")
    .not("featured_image_url", "is", null)
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false })
    .limit(MAX_CANDIDATES);

  if (articleError) {
    return Response.json({ ok: false, error: articleError.message }, { status: 500 });
  }

  const articles = ((rawArticles ?? []) as ArticleRow[]).filter(
    (row) =>
      Boolean(row.slug && row.title && row.featured_image_url) &&
      meetsArticleMainWordCount(row.kind, row.body_json as never),
  );

  if (articles.length === 0) {
    return Response.json({ ok: true, posted: false, no_items: true, reason: "No eligible recent articles" });
  }

  const urls = articles.map(articleUrl);
  const { data: publishedPackages, error: packageError } = await db
    .from("content_packages")
    .select("source_url,status,workflow_status")
    .in("source_url", urls)
    .or("status.eq.PUBLISHED,workflow_status.eq.PUBLISHED");

  if (packageError) {
    return Response.json({ ok: false, error: packageError.message }, { status: 500 });
  }

  const alreadyPosted = new Set<string>(
    (publishedPackages ?? [])
      .map((row: { source_url?: string | null }) => row.source_url)
      .filter((value: unknown): value is string => typeof value === "string" && value.length > 0),
  );

  const candidates = articles.filter((row) => !alreadyPosted.has(articleUrl(row)));
  if (candidates.length === 0) {
    return Response.json({ ok: true, posted: false, no_items: true, reason: "All eligible recent articles were already posted" });
  }

  const attempts: Array<{ slug: string; ok: boolean; error?: string }> = [];

  for (const row of candidates.slice(0, MAX_ATTEMPTS)) {
    const url = articleUrl(row);
    const result = await quickPublishToFacebookFn({
      data: {
        token: adminToken,
        headline: row.title,
        source: row.source_name ?? "KeepTXRed",
        source_url: url,
        feed_item_id: null,
        caption: row.title,
        asset_url: row.featured_image_url,
        slug: row.slug,
      },
    });

    if (result.ok) {
      return Response.json({
        ok: true,
        posted: true,
        slug: row.slug,
        title: row.title,
        article_url: url,
        external_id: result.external_id,
        post_url: result.post_url,
        posted_at: result.posted_at,
        attempted: attempts.length + 1,
      });
    }

    attempts.push({ slug: row.slug, ok: false, error: result.error });

    if (result.requires_connection) {
      return Response.json(
        {
          ok: false,
          posted: false,
          error: result.error,
          requires_connection: true,
          attempts,
        },
        { status: 503 },
      );
    }
  }

  return Response.json(
    {
      ok: false,
      posted: false,
      error: "No eligible article passed Facebook publishing checks",
      attempts,
    },
    { status: 422 },
  );
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post")({
  server: {
    handlers: {
      POST: async ({ request }) => runAutoFacebookPost(request),
    },
  },
});
