import { createFileRoute } from "@tanstack/react-router";
import {
  KTR_PREFERRED_SOURCE_SOCIAL_COPY,
  KTR_PREFERRED_SOURCE_URL,
} from "@/lib/google-preferred-source";
import { fetchRecentFacebookPagePosts } from "@/lib/facebook-page-history";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/promote-google-preferred-source.yml";
const GRAPH_VERSION = "v21.0";
const REPOST_GUARD_DAYS = 21;

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function loadConnection(db: any): Promise<SocialConnectionRow> {
  const { data, error } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .ilike("platform", "facebook")
    .maybeSingle();
  if (error) throw new Error(error.message);

  const connection = data as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    throw new Error("Keep TX Red Facebook Page is not connected");
  }
  return connection;
}

function postedRecently(createdTime: string | undefined, now = Date.now()): boolean {
  if (!createdTime) return true;
  const created = Date.parse(createdTime);
  if (!Number.isFinite(created)) return true;
  return created >= now - REPOST_GUARD_DAYS * 24 * 60 * 60 * 1000;
}

async function recordPromotion(args: { db: any; externalId: string }): Promise<string | null> {
  try {
    const { data: inserted, error } = await args.db
      .from("content_packages")
      .insert({
        source_title: "Google Preferred Sources",
        source_url: null,
        category: "Audience growth",
        facebook_hook: KTR_PREFERRED_SOURCE_SOCIAL_COPY,
        facebook_body: null,
        facebook_cta: "Add Keep TX Red as a Preferred Source on Google",
        facebook_hashtags: null,
        status: "PUBLISHED",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const packageId = String(inserted.id);
    const { error: queueError } = await args.db.from("publishing_queue").insert({
      content_package_id: packageId,
      platform: "facebook",
      status: "PUBLISHED",
      published_time: new Date().toISOString(),
      notes: `Google Preferred Sources promotion ${args.externalId}`,
    });
    if (queueError) throw new Error(queueError.message);
    return packageId;
  } catch (error) {
    console.error(
      "[KeepTXRed Preferred Sources] Facebook post succeeded but history recording failed",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

async function promoteGooglePreferredSource(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, posted: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
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
        posted: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  let connection: SocialConnectionRow;
  try {
    connection = await loadConnection(db);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: error instanceof Error ? error.message : String(error),
        requires_connection: true,
      },
      { status: 503 },
    );
  }

  try {
    const recentPosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
    const duplicate = recentPosts.find(
      (post) => postedRecently(post.created_time) && (post.message ?? "").includes(KTR_PREFERRED_SOURCE_URL),
    );
    if (duplicate) {
      return Response.json({
        ok: true,
        posted: false,
        duplicate: true,
        reason: `Preferred Sources promotion already appeared within ${REPOST_GUARD_DAYS} days`,
        existing_post_id: duplicate.id ?? null,
        existing_post_url: duplicate.permalink_url ?? null,
      });
    }
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Keep TX Red Facebook duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/feed`;
  const body = new FormData();
  body.set("access_token", String(connection.access_token));
  body.set("message", KTR_PREFERRED_SOURCE_SOCIAL_COPY);

  const graphResponse = await fetch(graphUrl, { method: "POST", body });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  const externalId = graphJson.id ?? null;
  if (!graphResponse.ok || !externalId) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
      },
      { status: 502 },
    );
  }

  const packageId = await recordPromotion({ db, externalId });
  return Response.json({
    ok: true,
    posted: true,
    site: "KeepTXRed",
    kind: "preferred-source-promotion",
    external_id: externalId,
    post_url: `https://www.facebook.com/${externalId}`,
    preferred_source_url: KTR_PREFERRED_SOURCE_URL,
    package_id: packageId,
    posted_at: new Date().toISOString(),
  });
}

export const Route = createFileRoute("/api/public/hooks/promote-google-preferred-source")({
  server: { handlers: { POST: async ({ request }) => promoteGooglePreferredSource(request) } },
});
