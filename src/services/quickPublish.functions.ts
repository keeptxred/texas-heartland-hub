import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
});

const GRAPH_VERSION = "v21.0";
const KEEP_TX_RED_PAGE_ID = "1211420085383129";

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
  const src = source ? `\n\nSource: ${source}` : "";
  return `${headline}${src}\n\nRead more at KeepTXRed.com`;
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
        if (articleRow?.featured_image_url) {
          resolvedAssetUrl = articleRow.featured_image_url;
          assetSource = "daily_articles";
        }
      }
    }
    console.log("[quickPublish:server] asset resolution", {
      feed_item_id: data.feed_item_id ?? null,
      source: assetSource,
      has_asset_url: Boolean(resolvedAssetUrl),
    });

    // 2. Persist a lightweight content package (no AI).
    const caption = data.caption?.trim() || buildDefaultCaption(data.headline, data.source);
    const { data: pkg, error: pkgErr } = await supabaseAdmin
      .from("content_packages")
      .insert({
        source_title: data.headline,
        source_url: data.source_url ?? null,
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

    // 3. Real Meta Graph API publish.
    const pageId = String(conn.account_id);
    const pageToken = String(conn.access_token);
    const link = data.source_url ?? null;
    let externalId: string | null = null;
    let postUrl: string | null = null;
    let graphError: string | null = null;

    try {
      let endpoint: string;
      const body = new URLSearchParams();
      body.set("access_token", pageToken);
      if (resolvedAssetUrl) {
        endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`;
        body.set("url", resolvedAssetUrl);
        body.set("caption", caption);
      } else {
        endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`;
        body.set("message", caption);
        if (link) body.set("link", link);
      }
      console.log("[quickPublish:server] publish mode", {
        mode: resolvedAssetUrl ? "PHOTO" : link ? "LINK" : "TEXT",
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