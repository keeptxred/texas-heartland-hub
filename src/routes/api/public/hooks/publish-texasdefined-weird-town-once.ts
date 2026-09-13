import { createFileRoute } from "@tanstack/react-router";
import {
  facebookPostMatchesArticle,
  fetchRecentFacebookPagePosts,
  normalizeFacebookHeadline,
} from "@/lib/facebook-page-history";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/TexasDefined";
const WORKFLOW_PATH = ".github/workflows/one-time-weird-town-facebook.yml";
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;
const ARTICLE_URL =
  "https://texasdefined.com/article/weirdest-town-names-in-texas-and-how-they-got-them";
const IMAGE_URL =
  "https://texasdefined.com/images/social/weird-texas-town-names-facebook-2026-09-12.png";
const SOURCE_POST_ID = "weird-texas-town-names-20260912";
const POST_TEXT = `Only in Texas can you leave Cut and Shoot, pass Dime Box, wonder if you’re really in Uncertain, and still have Bug Tussle on the map.

We dug into 20 of Texas’s strangest place names. Some came from post-office headaches. Some came from cattle, creeks and railroads. A few have origin stories so disputed that even Texas history sources preserve more than one version.

Which one have you actually been to—and what weird Texas town did we miss?

${ARTICLE_URL}`;

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

function isPng(bytes: ArrayBuffer): boolean {
  const view = new Uint8Array(bytes);
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return view.length >= signature.length && signature.every((value, index) => view[index] === value);
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

async function loadConnection(db: any): Promise<SocialConnectionRow> {
  const { data, error } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (error) throw new Error(error.message);

  const connection = data as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    throw new Error("TexasDefined Facebook Page is not connected");
  }
  return connection;
}

async function recordPublishedPost(args: {
  db: any;
  runId: string;
  imageSha256: string;
  externalId: string;
}): Promise<string> {
  const runUrl = `https://github.com/${REPOSITORY}/actions/runs/${args.runId}`;
  const { data: inserted, error } = await args.db
    .from("content_packages")
    .insert({
      source_title: `TexasDefined engagement ${SOURCE_POST_ID}`,
      source_url: runUrl,
      category: "TexasDefined",
      facebook_hook: POST_TEXT,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "IMAGE",
      asset_url: IMAGE_URL,
      workflow_status: "PUBLISHED",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const packageId = String(inserted.id);
  const { error: queueError } = await args.db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: SOCIAL_PLATFORM,
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: `Facebook weird-town article post ${args.externalId}; source_post_id=${SOURCE_POST_ID}; sha256=${args.imageSha256}`,
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function publishOnce(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, posted: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  let runId: string;
  try {
    const claims = await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
      allowedEventNames: ["push"],
    });
    if (typeof claims.run_id !== "string" || !/^\d+$/.test(claims.run_id)) {
      throw new Error("GitHub Actions OIDC token is missing a valid run ID");
    }
    runId = claims.run_id;
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
    const livePosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
    const normalizedCandidate = normalizeFacebookHeadline(POST_TEXT);
    const duplicate = livePosts.find((post) =>
      facebookPostMatchesArticle(post, {
        title: "20 Weird Texas Town Names That Sound Made Up—but Aren’t",
        url: ARTICLE_URL,
      }) || normalizeFacebookHeadline(post.message ?? "") === normalizedCandidate,
    );
    if (duplicate) {
      return Response.json({
        ok: true,
        posted: false,
        duplicate: true,
        reason: "The weird-town article is already present on the TexasDefined Facebook Page",
        source_post_id: SOURCE_POST_ID,
        article_url: ARTICLE_URL,
        post_url: duplicate.permalink_url ?? null,
        github_run_id: runId,
      });
    }
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "TexasDefined Facebook duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  let bytes: ArrayBuffer;
  try {
    const imageResponse = await fetch(IMAGE_URL, {
      headers: { accept: "image/png,image/*;q=0.8,*/*;q=0.1" },
      cache: "no-store",
    });
    if (!imageResponse.ok) throw new Error(`Approved image returned HTTP ${imageResponse.status}`);
    bytes = await imageResponse.arrayBuffer();
    if (bytes.byteLength <= 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES || !isPng(bytes)) {
      throw new Error("Approved weird-town image is empty, too large, or no longer a PNG");
    }
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Approved TexasDefined weird-town image could not be loaded",
        detail: error instanceof Error ? error.message : String(error),
        image_url: IMAGE_URL,
      },
      { status: 502 },
    );
  }

  const imageSha256 = await sha256Hex(bytes);
  const pageId = String(connection.account_id);
  const pageToken = String(connection.access_token);

  const graphResponse = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pageId)}/photos`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url: IMAGE_URL,
        caption: POST_TEXT,
        access_token: pageToken,
      }),
    },
  );
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string; type?: string; code?: number; error_subcode?: number; fbtrace_id?: string };
  };
  const externalId = graphJson.post_id ?? graphJson.id ?? null;
  if (!graphResponse.ok || !externalId) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        facebook_error_type: graphJson.error?.type ?? null,
        facebook_error_code: graphJson.error?.code ?? null,
        facebook_error_subcode: graphJson.error?.error_subcode ?? null,
        facebook_trace_id: graphJson.error?.fbtrace_id ?? null,
        source_post_id: SOURCE_POST_ID,
        image_url: IMAGE_URL,
        image_sha256: imageSha256,
        github_run_id: runId,
      },
      { status: 502 },
    );
  }

  const postIdMatch = graphJson.post_id?.match(/^(\d+)_(\d+)$/) ?? null;
  let postUrl =
    postIdMatch && postIdMatch[1] === pageId
      ? `https://www.facebook.com/permalink.php?story_fbid=${encodeURIComponent(postIdMatch[2])}&id=${encodeURIComponent(pageId)}`
      : graphJson.id && /^\d+$/.test(graphJson.id)
        ? `https://www.facebook.com/photo/?fbid=${encodeURIComponent(graphJson.id)}`
        : null;
  let postUrlSource = postUrl ? "constructed_fallback" : "unavailable";

  if (graphJson.post_id) {
    try {
      const refreshed = await fetchRecentFacebookPagePosts({ pageId, pageToken, limit: 25 });
      const publishedPost = refreshed.find((post) => post.id === graphJson.post_id);
      if (publishedPost?.permalink_url) {
        postUrl = publishedPost.permalink_url;
        postUrlSource = "meta_permalink_url";
      }
    } catch (error) {
      console.warn(
        "[TexasDefined Facebook] weird-town post succeeded but permalink lookup failed",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordPublishedPost({ db, runId, imageSha256, externalId });
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] weird-town post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    kind: "article",
    source_post_id: SOURCE_POST_ID,
    article_url: ARTICLE_URL,
    external_id: externalId,
    facebook_post_id: graphJson.post_id ?? null,
    facebook_photo_id: graphJson.id ?? null,
    post_url: postUrl,
    post_url_source: postUrlSource,
    package_id: packageId,
    record_warning: recordWarning,
    image_sha256: imageSha256,
    image_storage_url: IMAGE_URL,
    github_run_url: `https://github.com/${REPOSITORY}/actions/runs/${runId}`,
    github_run_id: runId,
    text_only_fallback: false,
    generic_fallback: false,
    posted_at: new Date().toISOString(),
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-texasdefined-weird-town-once")({
  server: { handlers: { POST: async ({ request }) => publishOnce(request) } },
});
