import { createFileRoute } from "@tanstack/react-router";
import { generateFeaturedImageForSlugDirect } from "@/lib/featured-image.functions";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { publishSingleFeedItem } from "@/lib/multi-source-publish";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/run-daily-news-now.yml";

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function publishExactFlyoverFeed(request: Request) {
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
      allowedEventNames: ["workflow_dispatch"],
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

  let payload: { feed_item_id?: unknown } = {};
  try {
    payload = await request.json() as { feed_item_id?: unknown };
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const feedItemId =
    typeof payload.feed_item_id === "number"
      ? payload.feed_item_id
      : typeof payload.feed_item_id === "string"
        ? Number(payload.feed_item_id)
        : Number.NaN;

  if (!Number.isSafeInteger(feedItemId) || feedItemId <= 0) {
    return Response.json({ ok: false, error: "Invalid feed_item_id" }, { status: 400 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const { data: feed, error: feedError } = await db
    .from("texas_news_feed")
    .select("id,title,target_site,internal_slug,ready_for_rewrite,preflight_json")
    .eq("id", feedItemId)
    .maybeSingle();

  if (feedError || !feed) {
    return Response.json(
      { ok: false, feed_item_id: feedItemId, error: feedError?.message ?? "Feed item not found" },
      { status: 404 },
    );
  }
  if (feed.target_site && feed.target_site !== "keeptxred") {
    return Response.json(
      {
        ok: false,
        feed_item_id: feedItemId,
        title: feed.title,
        error: `Feed item is routed to ${feed.target_site}, not KeepTXRed.`,
      },
      { status: 409 },
    );
  }

  const result = await publishSingleFeedItem(feedItemId);
  const slug = result.slug ?? feed.internal_slug ?? null;
  if (!result.ok || !slug) {
    return Response.json({
      ok: false,
      feed_item_id: feedItemId,
      title: feed.title,
      slug,
      alreadyPublished: result.alreadyPublished ?? false,
      error: result.error ?? "Exact feed publisher did not return a slug.",
    });
  }

  const image = await generateFeaturedImageForSlugDirect(slug, false);
  const { data: article, error: articleError } = await db
    .from("daily_articles")
    .select("slug,title,featured_image_url,image_url,image_generation_status,image_alt_text,quality_flags,published_at")
    .eq("slug", slug)
    .maybeSingle();

  const imageUrl =
    (article?.featured_image_url as string | null | undefined) ??
    (article?.image_url as string | null | undefined) ??
    (image.ok ? image.url : null);

  const imageOk = Boolean(image.ok && imageUrl);
  const liveUrl = `https://keeptxred.com/news/${slug}`;

  return Response.json({
    ok: imageOk && !articleError && Boolean(article),
    publication_ok: true,
    feed_item_id: feedItemId,
    title: feed.title,
    slug,
    live_url: liveUrl,
    alreadyPublished: result.alreadyPublished ?? false,
    image: {
      ok: imageOk,
      url: imageUrl,
      error: image.ok ? null : image.error ?? "Featured image generation failed",
    },
    article: article ?? null,
    error: articleError?.message ?? (!imageOk ? "Featured image is not production-ready." : null),
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-flyover-feed")({
  server: {
    handlers: {
      POST: async ({ request }) => publishExactFlyoverFeed(request),
    },
  },
});
