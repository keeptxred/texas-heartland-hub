import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  token: z.string().min(1),
  feed_item_id: z.number().int().positive(),
});

export type PublishArticleResult =
  | { ok: true; slug: string; alreadyPublished?: boolean }
  | { ok: false; error: string };

function explainPublishFailure(error: string, feedItemId: number): string {
  const message = error.trim() || "Publish failed without an error message";

  if (message === "AI rewrite failed") {
    return (
      `AI rewrite produced no usable article for feed item ${feedItemId}. ` +
      "The source passed extraction and preflight, but the AI gateway returned no valid draft after the editorial retry. " +
      "Possible stages are gateway HTTP failure, timeout, empty response, invalid JSON, or editorial validation rejection. " +
      "The failed attempt was not published; retry after the next deployment to capture the specific server-side reason."
    );
  }

  return message;
}

function isTieredWordCountFailure(error: string | undefined): boolean {
  return Boolean(error && /rewrite below tiered minimum/i.test(error));
}

export const publishFeedItemFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<PublishArticleResult> => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false, error: "Unauthorized" };

    try {
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
