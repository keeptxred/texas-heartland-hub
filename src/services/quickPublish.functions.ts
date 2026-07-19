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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Connection check first — cheapest exit, no writes.
    const { data: conn } = await supabaseAdmin
      .from("social_connections")
      .select("connection_status, account_id, access_token")
      .ilike("platform", "facebook")
      .maybeSingle();
    if (!conn || conn.connection_status !== "CONNECTED" || !conn.access_token || !conn.account_id) {
      return {
        ok: false,
        error:
          "Facebook is not connected. Connect your Meta account to enable one-click publishing.",
        requires_connection: true,
      };
    }

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
        asset_type: data.asset_url ? "IMAGE" : null,
        asset_url: data.asset_url ?? null,
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
      if (data.asset_url) {
        endpoint = `https://graph.facebook.com/v21.0/${pageId}/photos`;
        body.set("url", data.asset_url);
        body.set("caption", caption);
      } else {
        endpoint = `https://graph.facebook.com/v21.0/${pageId}/feed`;
        body.set("message", caption);
        if (link) body.set("link", link);
      }
      console.log("[quickPublish] Graph API request", {
        endpoint,
        pageId,
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