import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  token: z.string().min(1),
  feed_item_id: z.number().int().positive(),
});

export type PublishArticleResult =
  | { ok: true; slug: string; alreadyPublished?: boolean }
  | { ok: false; error: string };

export const publishFeedItemFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<PublishArticleResult> => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false, error: "Unauthorized" };
    const { publishSingleFeedItem } = await import(
      "@/routes/api/public/hooks/ingest-feeds"
    );
    const res = await publishSingleFeedItem(data.feed_item_id);
    if (!res.ok) return { ok: false, error: res.error ?? "Publish failed" };
    return { ok: true, slug: res.slug!, alreadyPublished: res.alreadyPublished };
  });
