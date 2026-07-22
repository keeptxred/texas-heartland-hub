import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { assessImageUrl, verifyImageIsReachable } from "@/lib/facebook-image-readiness";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

const Input = z.object({
  token: z.string().min(1),
  headline: z.string().min(1),
  source: z.string().default(""),
  source_url: z.string().nullable().optional(),
  feed_item_id: z.number().int().nullable().optional(),
  caption: z.string().default(""),
  asset_url: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
});

const GRAPH_VERSION = "v21.0";
const KEEP_TX_RED_PAGE_ID = "1211420085383129";
const SITE_URL = "https://www.keeptxred.com";

function normalizeAssetUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let candidate = trimmed;
  if (candidate.startsWith("//")) candidate = `https:${candidate}`;
  else if (candidate.startsWith("/")) candidate = `${SITE_URL}${candidate}`;
  try {
    const u = new URL(candidate);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export type QuickPublishResult =
  | {
      ok: true;
      package_id: string;
      queue_id: string;
      external_id: string | null;
      post_url: string | null;
      posted_at: string;
    }
  | { ok: false; error: string; requires_connection?: boolean; package_id?: string };

function buildDefaultCaption(headline: string, source: string): string {
  void source;
  return headline;
}

function sanitizeCaption(raw: string): string {
  const lines = raw.split(/\r?\n/).filter((line) => {
    const t = line.trim();
    if (/^source\s*:/i.test(t)) return false;
    if (/read\s+more\s+at\s+keeptxred\.com/i.test(t)) return false;
    if (/^https?:\/\/(www\.)?keeptxred\.com\S*$/i.test(t)) return false;
    return true;
  });
  return lines
    .join("\n")
    .replace(/https?:\/\/(www\.)?keeptxred\.com\S*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function validateArticleUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export const quickPublishToFacebookFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<QuickPublishResult> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    console.log("[quickPublish] incoming", {
      feed_item_id: data.feed_item_id ?? null,
      has_asset_url: Boolean(data.asset_url),
      has_source_url: Boolean(data.source_url),
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Connection check first — cheapest exit, no writes.
    const { data: conn } = await supabaseAdmin
      .from("social_connections")
      .select("platform, connection_status, account_id, account_name, access_token")
      .ilike("platform", "facebook")
      .maybeSingle();
    console.log("[quickPublish] Stored social connection", {
      provider: conn?.platform ?? "facebook",
      page_id: conn?.account_id ?? null,
      page_name: conn?.account_name ?? null,
      connection_status: conn?.connection_status ?? null,
      has_access_token: Boolean(conn?.access_token),
      expected_page_id: KEEP_TX_RED_PAGE_ID,
    });
    if (!conn || conn.connection_status !== "CONNECTED" || !conn.access_token || !conn.account_id) {
      return {
        ok: false,
        error:
          "Facebook is not connected. Connect your Meta account to enable one-click publishing.",
        requires_connection: true,
      };
    }
    if (String(conn.account_id) !== KEEP_TX_RED_PAGE_ID) {
      return {
        ok: false,
        error: `Facebook is connected to Page ID ${conn.account_id}, but Keep TX Red publishing requires Page ID ${KEEP_TX_RED_PAGE_ID}. Reconnect Facebook and select the Keep TX Red Page.`,
        requires_connection: true,
      };
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (appId && appSecret) {
      try {
        const debugUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/debug_token`);
        debugUrl.searchParams.set("input_token", String(conn.access_token));
        debugUrl.searchParams.set("access_token", `${appId}|${appSecret}`);
        const debugRes = await fetch(debugUrl.toString());
        const debugJson = (await debugRes.json()) as {
          data?: {
            app_id?: string;
            type?: string;
            profile_id?: string;
            is_valid?: boolean;
            expires_at?: number;
          };
          error?: { message?: string };
        };
        console.log("[quickPublish] Stored token debug", {
          status: debugRes.status,
          ok: debugRes.ok,
          token_type: debugJson.data?.type ?? null,
          token_profile_id: debugJson.data?.profile_id ?? null,
          token_app_id: debugJson.data?.app_id ?? null,
          token_is_valid: debugJson.data?.is_valid ?? null,
          token_expires_at: debugJson.data?.expires_at ?? null,
          error: debugJson.error?.message ?? null,
        });
        if (debugRes.ok && debugJson.data?.is_valid === false) {
          return { ok: false, error: "Stored Facebook Page token is invalid. Reconnect Facebook.", requires_connection: true };
        }
        if (debugRes.ok && debugJson.data?.type && debugJson.data.type !== "PAGE") {
          return { ok: false, error: "Stored Facebook token is not a Page access token. Reconnect Facebook.", requires_connection: true };
        }
      } catch (e) {
        console.error("[quickPublish] Stored token debug failed", e);
      }
    }

    // 1b. Resolve media: if caller didn't pass asset_url, look up the article's featured image
    // via feed_item_id -> texas_news_feed.internal_slug -> daily_articles.featured_image_url.
    let resolvedAssetUrl: string | null = data.asset_url ?? null;
    let assetSource: "caller" | "daily_articles" | "none" = resolvedAssetUrl ? "caller" : "none";
    if (!resolvedAssetUrl && data.feed_item_id) {
      const { data: feedRow } = await supabaseAdmin
        .from("texas_news_feed")
        .select("internal_slug")
        .eq("id", data.feed_item_id)
        .maybeSingle();
      const slug = feedRow?.internal_slug ?? null;
      if (slug) {
        const { data: articleRow } = await supabaseAdmin
          .from("daily_articles")
          .select("featured_image_url")
          .eq("slug", slug)
          .maybeSingle();
        const raw = articleRow?.featured_image_url ?? null;
        console.log("[quickPublish:server] daily_articles featured_image_url", {
          slug,
          value_type: raw === null ? "null" : typeof raw,
          value_length: typeof raw === "string" ? raw.length : 0,
          is_empty: typeof raw === "string" ? raw.trim().length === 0 : true,
          starts_with: typeof raw === "string" ? raw.slice(0, 8) : null,
        });
        if (raw) {
          resolvedAssetUrl = raw;
          assetSource = "daily_articles";
        }
      }
    }

    // Normalize to an absolute http(s) URL. Relative paths (e.g. "/api/public/...")
    // are valid on the site but Facebook /photos requires a fully qualified URL.
    const normalizedAssetUrl = normalizeAssetUrl(resolvedAssetUrl);
    if (resolvedAssetUrl && !normalizedAssetUrl) {
      console.log("[quickPublish:server] asset_url rejected as invalid", {
        raw_length: resolvedAssetUrl.length,
        raw_starts_with: resolvedAssetUrl.slice(0, 8),
      });
    }
    resolvedAssetUrl = normalizedAssetUrl;
    if (!resolvedAssetUrl) assetSource = assetSource === "caller" ? "none" : assetSource;
    console.log("[quickPublish:server] asset resolution", {
      feed_item_id: data.feed_item_id ?? null,
      source: assetSource,
      has_asset_url: Boolean(resolvedAssetUrl),
    });

    // Validate asset URL before handing it to Facebook. Never log the URL or tokens.
    if (resolvedAssetUrl) {
      const isHttps = resolvedAssetUrl.startsWith("https://");
      const isHttp = resolvedAssetUrl.startsWith("http://");
      let extension: string | null = null;
      try {
        const pathname = new URL(resolvedAssetUrl).pathname;
        const match = pathname.match(/\.([a-zA-Z0-9]{2,5})(?:$)/);
        if (match) extension = match[1].toLowerCase();
      } catch {
        // ignore parse errors
      }
      let contentType: string | null = null;
      let reachable = false;
      let status: number | null = null;
      try {
        let probe = await fetch(resolvedAssetUrl, { method: "HEAD" });
        if (!probe.ok || !probe.headers.get("content-type")) {
          probe = await fetch(resolvedAssetUrl, { method: "GET", headers: { Range: "bytes=0-0" } });
        }
        status = probe.status;
        contentType = probe.headers.get("content-type");
        reachable = probe.ok && !!contentType && contentType.startsWith("image/");
      } catch (e) {
        console.error("[quickPublish:server] asset validation fetch failed", e instanceof Error ? e.message : String(e));
      }
      console.log("[quickPublish:server] asset validation", {
        is_https: isHttps,
        is_http: isHttp,
        extension,
        content_type: contentType,
        http_status: status,
        reachable,
      });
    }

    // 2. Validate article URL — Facebook article posts must always carry a link.
    //    For original KeepTXRed articles (daily_articles), the caller may pass a slug
    //    instead of an external source_url. Fall back to the canonical internal URL.
    let articleUrl = validateArticleUrl(data.source_url);
    if (!articleUrl && data.slug) {
      const safeSlug = String(data.slug).trim().replace(/^\/+|\/+$/g, "");
      if (safeSlug && /^[a-z0-9-]+$/i.test(safeSlug)) {
        articleUrl = `${SITE_URL}/news/${safeSlug}`;
      }
    }
    if (!articleUrl) {
      return {
        ok: false,
        error:
          "Cannot publish to Facebook: a valid http(s) article URL is required. This item has no article link attached.",
      };
    }

    // 2b. If we're linking to an internal KeepTXRed article, verify the row
    //     exists AND passes the same visibility gate that /news/{slug} uses.
    //     Otherwise Facebook would happily post a link that 404s on click.
    if (data.slug && articleUrl.startsWith(`${SITE_URL}/news/`)) {
      const safeSlug = String(data.slug).trim().replace(/^\/+|\/+$/g, "");
      const { data: articleRow } = await supabaseAdmin
        .from("daily_articles")
        .select("kind, body_json")
        .eq("slug", safeSlug)
        .maybeSingle();
      if (!articleRow) {
        return {
          ok: false,
          error:
            "Cannot publish: this item does not have a KeepTXRed article yet. Click 'Publish to Keep Texas Red' first.",
        };
      }
      if (!meetsArticleMainWordCount(articleRow.kind, articleRow.body_json as never)) {
        return {
          ok: false,
          error:
            "Cannot publish: the KeepTXRed article is below the minimum length and would 404. Regenerate the article before posting.",
        };
      }
    }

    // 3. Persist a lightweight content package (no AI).
    const rawCaption = data.caption?.trim() || buildDefaultCaption(data.headline, data.source);
    const caption = sanitizeCaption(rawCaption);

    // HARD GATE: dashboard-triggered Facebook posts REQUIRE a verified image.
    // No text-only or link-only fallback is allowed.
    const staticCheck = assessImageUrl(resolvedAssetUrl, "stored_featured_image");
    console.log("[quickPublish:server] facebook_image_check_started", {
      static_reason: staticCheck.reason,
      static_ready: staticCheck.ready,
    });
    if (!staticCheck.ready) {
      console.log("[quickPublish:server] facebook_publish_blocked_no_image", { reason: staticCheck.reason });
      return { ok: false, error: staticCheck.message };
    }
    const remoteCheck = await verifyImageIsReachable(staticCheck.imageUrl!);
    console.log("[quickPublish:server] facebook_image_check_result", {
      reason: remoteCheck.reason,
      ready: remoteCheck.ready,
    });
    if (!remoteCheck.ready) {
      console.log("[quickPublish:server] facebook_publish_blocked_no_image", { reason: remoteCheck.reason });
      return { ok: false, error: remoteCheck.message };
    }
    resolvedAssetUrl = staticCheck.imageUrl;

    const { data: pkg, error: pkgErr } = await supabaseAdmin
      .from("content_packages")
      .insert({
        source_title: data.headline,
        source_url: articleUrl,
        category: null,
        facebook_hook: data.headline,
        facebook_body: caption,
        facebook_cta: "",
        facebook_hashtags: "",
        asset_type: resolvedAssetUrl ? "IMAGE" : null,
        asset_url: resolvedAssetUrl,
        status: "DRAFT",
        workflow_status: "READY_TO_POST",
      })
      .select("id")
      .single();
    if (pkgErr || !pkg) return { ok: false, error: pkgErr?.message ?? "Failed to create package" };

    // 4. Real Meta Graph API publish.
    const pageId = String(conn.account_id);
    const pageToken = String(conn.access_token);
    const link = articleUrl;
    let externalId: string | null = null;
    let postUrl: string | null = null;
    let graphError: string | null = null;

    try {
      let endpoint: string;
      const body = new URLSearchParams();
      body.set("access_token", pageToken);
      // Hard-gated above: resolvedAssetUrl is guaranteed present and image-verified.
      endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`;
      body.set("url", resolvedAssetUrl!);
      // Graph /photos ignores `link`; append the article URL to the caption.
      body.set("caption", `${caption}\n\n${link}`);
      console.log("[quickPublish:server] publish mode", {
        mode: "PHOTO",
        asset_source: assetSource,
      });
      console.log("[quickPublish] Graph API request", {
        provider: "facebook",
        endpoint,
        pageId,
        pageName: conn.account_name ?? null,
        usesExpectedKeepTxRedPageId: pageId === KEEP_TX_RED_PAGE_ID,
        hasPageAccessToken: Boolean(pageToken),
        hasAsset: !!data.asset_url,
        hasLink: !!link,
        captionLength: caption.length,
      });
      const res = await fetch(endpoint, { method: "POST", body });
      const rawText = await res.text();
      let json: {
        id?: string;
        post_id?: string;
        error?: { message?: string };
      } = {};
      try {
        json = JSON.parse(rawText);
      } catch {
        // non-JSON body
      }
      console.log("[quickPublish] Graph API response", {
        status: res.status,
        ok: res.ok,
        body: rawText.slice(0, 1000),
      });
      if (!res.ok || json.error) {
        graphError = json.error?.message ?? `HTTP ${res.status}`;
      } else {
        externalId = json.post_id ?? json.id ?? null;
        if (externalId) postUrl = `https://www.facebook.com/${externalId}`;
        if (!externalId) {
          console.error("[quickPublish] Graph API returned no post id", { json });
        }
      }
    } catch (e) {
      graphError = e instanceof Error ? e.message : String(e);
      console.error("[quickPublish] Graph API fetch threw", e);
    }

    if (graphError || !externalId) {
      console.error("[quickPublish] Publish failed — not marking success", {
        graphError,
        externalId,
        package_id: pkg.id,
      });
      return {
        ok: false,
        error: graphError ?? "Facebook did not return a post id",
        package_id: pkg.id as string,
      };
    }

    // 4. Record publish + queue history.
    const postedAt = new Date().toISOString();
    const { error: updErr } = await supabaseAdmin
      .from("content_packages")
      .update({ workflow_status: "PUBLISHED", status: "PUBLISHED" })
      .eq("id", pkg.id);
    if (updErr) {
      console.error("[quickPublish] content_packages update failed", updErr);
    }
    const { data: q, error: qErr } = await supabaseAdmin
      .from("publishing_queue")
      .insert({
        content_package_id: pkg.id,
        platform: "facebook",
        status: "PUBLISHED",
        published_time: postedAt,
        notes: postUrl ?? null,
      })
      .select("id")
      .single();
    if (qErr || !q) {
      console.error("[quickPublish] publishing_queue insert failed", {
        error: qErr,
        package_id: pkg.id,
        external_id: externalId,
      });
      return {
        ok: false,
        error: `Posted to Facebook (${externalId}) but failed to record in publishing_queue: ${qErr?.message ?? "unknown error"}`,
        package_id: pkg.id as string,
      };
    }
    console.log("[quickPublish] Success", {
      package_id: pkg.id,
      queue_id: q.id,
      external_id: externalId,
      post_url: postUrl,
    });
    return {
      ok: true,
      package_id: pkg.id as string,
      queue_id: q.id as string,
      external_id: externalId,
      post_url: postUrl,
      posted_at: postedAt,
    };
  });