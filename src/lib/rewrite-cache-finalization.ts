export type RewriteCacheFinalizationClient = {
  from: (table: "ai_rewrite_cache") => {
    update: (values: Record<string, unknown>) => {
      eq: (
        column: string,
        value: unknown,
      ) => {
        eq: (
          column: string,
          value: unknown,
        ) => PromiseLike<{ error: { message: string } | null }>;
      };
    };
  };
};

export async function failPendingRewriteClaimsForFeedItem(
  client: RewriteCacheFinalizationClient,
  feedItemId: number,
  detail: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const failureReason = `Publish request crashed before rewrite cache finalization: ${detail}`.slice(
    0,
    1_000,
  );
  const { error } = await client
    .from("ai_rewrite_cache")
    .update({
      status: "failed",
      result_json: null,
      failure_reason: failureReason,
      completed_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("feed_item_id", feedItemId)
    .eq("status", "pending");

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
