import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  token: z.string().min(1),
  feed_item_id: z.number().int().positive(),
});

export type PublishArticleResult =
  | { ok: true; slug: string; alreadyPublished?: boolean }
  | { ok: false; error: string };

type UsageRow = {
  content_fingerprint: string;
  feed_item_id: number | null;
  claimed_at: string;
};

function explainPublishFailure(error: string, feedItemId: number): string {
  const message = error.trim() || "Publish failed without an error message";

  if (message === "AI rewrite failed") {
    return (
      `AI rewrite produced no usable article for feed item ${feedItemId}. ` +
      "The source passed extraction and preflight, but the AI gateway returned no valid draft after the editorial retry. " +
      "Possible stages are gateway HTTP failure, timeout, empty response, invalid JSON, or editorial validation rejection. " +
      "The failed attempt was not published and does not consume the automated daily rewrite allowance."
    );
  }

  return message;
}

function isTieredWordCountFailure(error: string | undefined): boolean {
  return Boolean(error && /rewrite below tiered minimum/i.test(error));
}

function isMissingBypassRpc(error: { message?: string } | null): boolean {
  return Boolean(
    error?.message &&
      /grant_manual_ai_rewrite_bypass|schema cache|could not find the function/i.test(error.message),
  );
}

export const publishFeedItemFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<PublishArticleResult> => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false, error: "Unauthorized" };

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const manualStartedAt = new Date().toISOString();
      let fallbackReleasedUsage: UsageRow | null = null;

      // Explicit admin publishing is intentionally outside the automated
      // daily AI allowance. Prefer the one-time database bypass marker. When
      // production has not applied the migration yet, use a backward-compatible
      // ledger fallback so the admin action still works without weakening cron.
      const { error: bypassError } = await supabaseAdmin.rpc(
        "grant_manual_ai_rewrite_bypass" as never,
        { p_feed_item_id: data.feed_item_id } as never,
      );

      if (bypassError && !isMissingBypassRpc(bypassError)) {
        return {
          ok: false,
          error: `Could not authorize manual rewrite bypass: ${bypassError.message}`,
        };
      }

      if (isMissingBypassRpc(bypassError)) {
        const utcDayStart = new Date();
        utcDayStart.setUTCHours(0, 0, 0, 0);

        const { data: usageRows, error: usageReadError } = await supabaseAdmin
          .from("ai_rewrite_usage")
          .select("content_fingerprint,feed_item_id,claimed_at")
          .gte("claimed_at", utcDayStart.toISOString())
          .order("claimed_at", { ascending: true })
          .limit(1);

        if (usageReadError) {
          return {
            ok: false,
            error: `Manual rewrite bypass migration is missing and the fallback ledger could not be read: ${usageReadError.message}`,
          };
        }

        fallbackReleasedUsage = ((usageRows ?? [])[0] as UsageRow | undefined) ?? null;
        if (fallbackReleasedUsage) {
          const { error: releaseError } = await supabaseAdmin
            .from("ai_rewrite_usage")
            .delete()
            .eq("content_fingerprint", fallbackReleasedUsage.content_fingerprint)
            .eq("claimed_at", fallbackReleasedUsage.claimed_at);

          if (releaseError) {
            return {
              ok: false,
              error: `Manual rewrite bypass migration is missing and the fallback slot could not be released: ${releaseError.message}`,
            };
          }
        }

        console.warn("[publishFeedItemFn] manual bypass RPC missing; using temporary ledger fallback", {
          feed_item_id: data.feed_item_id,
        });
      }

      const { publishSingleFeedItem } = await import(
        "@/routes/api/public/hooks/ingest-feeds"
      );
      let res = await publishSingleFeedItem(data.feed_item_id);

      // A source-ready item can still have a cached generated draft that lands
      // just below its 800- or 1,200-word publishing tier. Expand that cached
      // draft automatically and retry once instead of showing contradictory
      // source/rewrite messaging or requiring another manual publish attempt.
      if (!res.ok && isTieredWordCountFailure(res.error)) {
        const { expandCachedRewriteForFeedItem } = await import("@/lib/expand-cached-rewrite");
        const expanded = await expandCachedRewriteForFeedItem(data.feed_item_id);
        if (expanded) res = await publishSingleFeedItem(data.feed_item_id);
      }

      if (isMissingBypassRpc(bypassError)) {
        // Remove the manual attempt from the automated usage ledger whether it
        // succeeded or failed, then restore the automated slot temporarily
        // released above. This keeps the automated count exactly unchanged.
        await supabaseAdmin
          .from("ai_rewrite_usage")
          .delete()
          .eq("feed_item_id", data.feed_item_id)
          .gte("claimed_at", manualStartedAt);

        if (fallbackReleasedUsage) {
          const { error: restoreError } = await supabaseAdmin.from("ai_rewrite_usage").insert({
            content_fingerprint: fallbackReleasedUsage.content_fingerprint,
            feed_item_id: fallbackReleasedUsage.feed_item_id,
            claimed_at: fallbackReleasedUsage.claimed_at,
          });
          if (restoreError) {
            console.error("[publishFeedItemFn] failed to restore automated usage row", {
              feed_item_id: data.feed_item_id,
              error: restoreError.message,
            });
          }
        }
      }

      if (!res.ok) {
        return {
          ok: false,
          error: explainPublishFailure(res.error ?? "Publish failed", data.feed_item_id),
        };
      }
      return { ok: true, slug: res.slug!, alreadyPublished: res.alreadyPublished };
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error("[publishFeedItemFn] unhandled publish failure", {
        feed_item_id: data.feed_item_id,
        detail,
      });
      return {
        ok: false,
        error: `Publish request crashed for feed item ${data.feed_item_id}: ${detail}`,
      };
    }
  });
