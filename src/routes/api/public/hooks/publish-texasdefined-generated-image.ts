import { createFileRoute } from "@tanstack/react-router";
import {
  fetchRecentFacebookPagePosts,
  normalizeFacebookHeadline,
} from "@/lib/facebook-page-history";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/TexasDefined";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-engagement.yml";
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;

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
  postText: string;
  sourcePostId: string;
  imageSha256: string;
  artifactUrl: string | null;
  runUrl: string | null;
  externalId: string;
}): Promise<string> {
  const sourceUrl = args.runUrl || args.artifactUrl;
  const { data: inserted, error } = await args.db
    .from("content_packages")
    .insert({
      source_title: `TexasDefined engagement ${args.sourcePostId}`,
      source_url: sourceUrl,
      category: "TexasDefined",
      facebook_hook: args.postText,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "IMAGE",
      asset_url: args.artifactUrl || args.runUrl,
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
    notes: `Facebook generated-image post ${args.externalId}; source_post_id=${args.sourcePostId}; sha256=${args.imageSha256}`,
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function publishTexasDefinedGeneratedImage(request: Request): Promise<Response> {
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

  let form: FormData;
  try {
    form = await request.formData();
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Invalid multipart Facebook publish request",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 },
    );
  }

  const postTextValue = form.get("post_text");
  const imageValue = form.get("image");
  const expectedShaValue = form.get("image_sha256");
  const sourcePostIdValue = form.get("source_post_id");
  const artifactUrlValue = form.get("artifact_url");
  const runUrlValue = form.get("github_run_url");

  if (typeof postTextValue !== "string" || postTextValue.length === 0) {
    return Response.json({ ok: false, posted: false, error: "Facebook post text is required" }, { status: 400 });
  }
  if (!(imageValue instanceof File) || imageValue.size <= 0) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image is required" }, { status: 400 });
  }
  if (!imageValue.type.startsWith("image/")) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook asset is not an image" }, { status: 400 });
  }
  if (imageValue.size > MAX_FACEBOOK_IMAGE_BYTES) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image exceeds size limit" }, { status: 413 });
  }
  if (typeof expectedShaValue !== "string" || !/^[a-f0-9]{64}$/i.test(expectedShaValue)) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image SHA-256 is required" }, { status: 400 });
  }

  const postText = postTextValue;
  const sourcePostId = typeof sourcePostIdValue === "string" && sourcePostIdValue ? sourcePostIdValue : "unknown";
  const artifactUrl = typeof artifactUrlValue === "string" && artifactUrlValue ? artifactUrlValue : null;
  const runUrl = typeof runUrlValue === "string" && runUrlValue ? runUrlValue : null;
  const bytes = await imageValue.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image is empty or too large" }, { status: 400 });
  }

  const actualSha = await sha256Hex(bytes);
  if (actualSha.toLowerCase() !== expectedShaValue.toLowerCase()) {
    return Response.json(
      { ok: false, posted: false, error: "Generated Facebook image changed after storage", expected_sha256: expectedShaValue, actual_sha256: actualSha },
      { status: 409 },
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
    const normalizedCandidate = normalizeFacebookHeadline(postText);
    if (
      normalizedCandidate &&
      livePosts.some((post) => normalizeFacebookHeadline(post.message ?? "") === normalizedCandidate)
    ) {
      return Response.json({
        ok: true,
        posted: false,
        duplicate: true,
        reason: "Exact TexasDefined Facebook message is already present on the Page",
        source_post_id: sourcePostId,
        image_sha256: actualSha,
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

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/photos`;
  const body = new FormData();
  body.set("access_token", String(connection.access_token));
  body.set("caption", postText);
  body.set("source", new Blob([bytes], { type: imageValue.type }), imageValue.name || "texasdefined-facebook.png");

  const graphResponse = await fetch(graphUrl, { method: "POST", body });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string };
  };
  const externalId = graphJson.post_id ?? graphJson.id ?? null;
  if (!graphResponse.ok || !externalId) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
        source_post_id: sourcePostId,
        image_sha256: actualSha,
      },
      { status: 502 },
    );
  }

  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordPublishedPost({
      db,
      postText,
      sourcePostId,
      imageSha256: actualSha,
      artifactUrl,
      runUrl,
      externalId,
    });
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] generated image post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    kind: "engagement",
    source_post_id: sourcePostId,
    external_id: externalId,
    post_url: `https://www.facebook.com/${externalId}`,
    package_id: packageId,
    record_warning: recordWarning,
    image_sha256: actualSha,
    image_storage_url: artifactUrl,
    github_run_url: runUrl,
    text_only_fallback: false,
    generic_fallback: false,
    posted_at: new Date().toISOString(),
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-texasdefined-generated-image")({
  server: { handlers: { POST: async ({ request }) => publishTexasDefinedGeneratedImage(request) } },
});
