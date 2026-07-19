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
      .select("connection_status")
      .ilike("platform", "facebook")
      .maybeSingle();
    if (!conn || conn.connection_status !== "CONNECTED") {
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

    // 3. Meta Graph API call — stub until OAuth is wired.
    // TODO: replace with real Graph API POST once Facebook OAuth is completed.
    const graphOk = false as boolean;
    if (!graphOk) {
      return {
        ok: false,
        error: "Meta Graph API not enabled. Complete Facebook connection to publish.",
        requires_connection: true,
        package_id: pkg.id as string,
      };
    }

    // 4. On real success: record publish + queue history.
    const postedAt = new Date().toISOString();
    const externalId: string | null = null;
    const postUrl: string | null = null;
    await supabaseAdmin
      .from("content_packages")
      .update({ workflow_status: "PUBLISHED", status: "PUBLISHED" })
      .eq("id", pkg.id);
    const { data: q } = await supabaseAdmin
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
    return {
      ok: true,
      package_id: pkg.id as string,
      queue_id: (q?.id as string) ?? "",
      external_id: externalId,
      post_url: postUrl,
      posted_at: postedAt,
    };
  });