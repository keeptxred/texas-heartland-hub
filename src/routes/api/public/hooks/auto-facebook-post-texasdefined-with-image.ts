import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import {
  resolveTexasDefinedFacebookImage,
  type ResolvedTexasDefinedFacebookImage,
} from "@/lib/texasdefined-facebook-images";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const SMART_PREVIEW_PATH = "/api/public/hooks/auto-facebook-post-texasdefined-smart";
const ARTICLE_POST_PATH = "/api/public/hooks/auto-facebook-post-texasdefined";

type SmartPreview = {
  ok?: boolean;
  posted?: boolean;
  dry_run?: boolean;
  site?: string;
  kind?: string;
  title?: string;
  message?: string;
  would_post?: boolean;
  would_forward_article?: boolean;
  error?: string;
  detail?: string;
  reason?: string;
  schedule_decision?: {
    shouldPost?: boolean;
    reason?: string;
    dateKey?: string;
    postsToday?: number;
    nextTargetMinute?: number | null;
    targets?: number[];
  };
  hard_guard?: {
    allowed?: boolean;
    reason?: string | null;
    postsToday?: number;
    latestPublishedAt?: string | null;
  };
  [key: string]: unknown;
};

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

function internalUrl(request: Request, pathname: string): string {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = "";
  url.hash = "";
  return url.toString();
}

async function readJson(response: Response): Promise<SmartPreview> {
  const text = await response.text();
  try {
    return JSON.parse(text) as SmartPreview;
  } catch {
    return {
      ok: false,
      error: `TexasDefined Facebook upstream returned non-JSON HTTP ${response.status}`,
      detail: text.slice(0, 500),
    };
  }
}

async function loadSmartPreview(request: Request, token: string): Promise<{ response: Response; preview: SmartPreview }> {
  const response = await fetch(internalUrl(request, SMART_PREVIEW_PATH), {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "X-KTR-Facebook-Mode": "scheduled",
      "X-KTR-Facebook-Dry-Run": "true",
    },
  });
  return { response, preview: await readJson(response) };
}

async function forwardArticlePost(request: Request, token: string): Promise<Response> {
  const response = await fetch(internalUrl(request, ARTICLE_POST_PATH), {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "X-KTR-Facebook-Mode": "manual",
    },
  });
  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}

function waitResponse(preview: SmartPreview): Response {
  const decision = preview.schedule_decision;
  const hardGuard = preview.hard_guard;
  return Response.json({
    ok: true,
    posted: false,
    scheduled_wait: true,
    image_required: true,
    reason:
      decision?.shouldPost === false
        ? decision.reason ?? "Waiting for the next TexasDefined Facebook window"
        : hardGuard?.allowed === false
          ? hardGuard.reason ?? "TexasDefined Facebook hard posting guard blocked this slot"
          : preview.reason ?? "TexasDefined Facebook post is not due",
    kind: preview.kind ?? null,
    posts_today: Math.max(decision?.postsToday ?? 0, hardGuard?.postsToday ?? 0),
    schedule_date: decision?.dateKey ?? null,
  });
}

async function recordImagePost(args: {
  db: any;
  preview: SmartPreview;
  image: ResolvedTexasDefinedFacebookImage;
  externalId: string | null;
}): Promise<string | null> {
  const message = String(args.preview.message ?? "").trim();
  const title = String(args.preview.title ?? "TexasDefined Facebook post").trim();
  const kind = String(args.preview.kind ?? "engagement").trim();

  const { data: inserted, error } = await args.db
    .from("content_packages")
    .insert({
      source_title: title,
      source_url: args.image.sourcePageUrl,
      category: "TexasDefined",
      facebook_hook: message,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "IMAGE",
      asset_url: args.image.imageUrl,
      workflow_status: "PUBLISHED",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const packageId = inserted.id as string;
  const { error: queueError } = await args.db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: SOCIAL_PLATFORM,
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: args.externalId
      ? `Facebook image post ${args.externalId}; kind=${kind}; image_strategy=${args.image.strategy}`
      : `TexasDefined Facebook image post; kind=${kind}; image_strategy=${args.image.strategy}`,
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function runTexasDefinedFacebookPostWithImage(request: Request) {
  const token = bearerToken(request);
  if (!token) return Response.json({ ok: false, posted: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });

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

  const incomingDryRun = ["1", "true", "yes"].includes(
    request.headers.get("x-ktr-facebook-dry-run")?.trim().toLowerCase() ?? "",
  );
  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";

  let previewResponse: Response;
  let preview: SmartPreview;
  try {
    ({ response: previewResponse, preview } = await loadSmartPreview(request, token));
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "TexasDefined Facebook candidate preview failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  if (!previewResponse.ok || preview.ok !== true) {
    return Response.json(
      {
        ...preview,
        ok: false,
        posted: false,
        image_required: true,
        error: preview.error ?? `TexasDefined Facebook candidate preview returned HTTP ${previewResponse.status}`,
      },
      { status: previewResponse.status >= 400 ? previewResponse.status : 502 },
    );
  }

  const kind = String(preview.kind ?? "");

  if (kind === "article") {
    if (incomingDryRun) {
      return Response.json({
        ...preview,
        ok: true,
        posted: false,
        dry_run: true,
        image_required: true,
        image_strategy: "article-og-image",
        note: "Dry run: article posts remain on the existing article-photo publisher; no Facebook post or database write occurred",
      });
    }
    if (preview.would_post !== true) return waitResponse(preview);
    return forwardArticlePost(request, token);
  }

  const message = String(preview.message ?? "").trim();
  if (!message) {
    return Response.json(
      {
        ok: false,
        posted: false,
        image_required: true,
        error: "TexasDefined Facebook candidate did not include a message",
        kind: kind || null,
      },
      { status: 502 },
    );
  }

  let image: ResolvedTexasDefinedFacebookImage | null = null;
  try {
    image = await resolveTexasDefinedFacebookImage({ message, kind });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        image_required: true,
        error: "TexasDefined Facebook relevant-image resolution failed",
        detail: error instanceof Error ? error.message : String(error),
        kind,
      },
      { status: 502 },
    );
  }

  if (!image) {
    return Response.json({
      ok: true,
      posted: false,
      image_required: true,
      image_guard: true,
      reason: "No verified relevant image is available for this TexasDefined Facebook candidate; text-only posting is disabled",
      kind,
      title: preview.title ?? null,
      message,
      posts_today: Math.max(preview.schedule_decision?.postsToday ?? 0, preview.hard_guard?.postsToday ?? 0),
    });
  }

  if (incomingDryRun) {
    return Response.json({
      ...preview,
      ok: true,
      posted: false,
      dry_run: true,
      image_required: true,
      image_url: image.imageUrl,
      image_source_url: image.sourcePageUrl,
      image_source_title: image.sourceTitle,
      image_strategy: image.strategy,
      note: "Dry run: relevant image resolved successfully; no Facebook post or database write occurred",
    });
  }

  if (preview.would_post !== true) return waitResponse(preview);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const { data: rawConnection, error: connectionError } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (connectionError) return Response.json({ ok: false, posted: false, error: connectionError.message }, { status: 500 });

  const connection = rawConnection as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined Facebook Page is not connected", requires_connection: true },
      { status: 503 },
    );
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/photos`;
  const graphResponse = await fetch(graphUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: image.imageUrl,
      caption: message,
      access_token: String(connection.access_token),
    }),
  });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string };
  };
  if (!graphResponse.ok || (!graphJson.id && !graphJson.post_id)) {
    return Response.json(
      {
        ok: false,
        posted: false,
        image_required: true,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
        image_url: image.imageUrl,
        image_source_url: image.sourcePageUrl,
      },
      { status: 502 },
    );
  }

  const externalId = graphJson.post_id ?? graphJson.id ?? null;
  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordImagePost({ db, preview, image, externalId });
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] image post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    kind,
    title: preview.title ?? null,
    article_url: null,
    external_id: externalId,
    post_url: externalId ? `https://www.facebook.com/${externalId}` : null,
    package_id: packageId,
    record_warning: recordWarning,
    posted_at: new Date().toISOString(),
    mode,
    image_required: true,
    image_url: image.imageUrl,
    image_source_url: image.sourcePageUrl,
    image_source_title: image.sourceTitle,
    image_strategy: image.strategy,
    text_only_fallback: false,
  });
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post-texasdefined-with-image")({
  server: { handlers: { POST: async ({ request }) => runTexasDefinedFacebookPostWithImage(request) } },
});
