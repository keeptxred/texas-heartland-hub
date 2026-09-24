import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { publishSingleFeedItem } from "@/lib/multi-source-publish";

const OIDC_AUDIENCE = "keeptxred-newsroom";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/retry-feed-3745344-once.yml";
const FEED_ITEM_ID = 3745344;

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function retryExactFeedItem(request: Request) {
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
      allowedEventNames: ["push"],
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

  const result = await publishSingleFeedItem(FEED_ITEM_ID);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: feed } = await (supabaseAdmin as any)
    .from("texas_news_feed")
    .select("id,internal_slug,preflight_json,event_cluster_id,cluster_json")
    .eq("id", FEED_ITEM_ID)
    .maybeSingle();

  return Response.json({
    ok: result.ok,
    feed_item_id: FEED_ITEM_ID,
    slug: result.slug ?? feed?.internal_slug ?? null,
    alreadyPublished: result.alreadyPublished ?? false,
    error: result.error ?? null,
    feed: feed ?? null,
  });
}

export const Route = createFileRoute("/api/public/hooks/retry-feed-3745344-once")({
  server: {
    handlers: {
      POST: async ({ request }) => retryExactFeedItem(request),
    },
  },
});
