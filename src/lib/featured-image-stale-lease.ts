const STALE_GENERATION_LEASE_MS = 20 * 60 * 1000;

export async function resetStaleFeaturedImageGenerationLeasesDirect(): Promise<{ reset: number; error?: string }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Generated Supabase types can lag internal image-generation audit fields.
  // Keep the reset narrowly scoped to published rows with no stored image that
  // have been stuck in `generating` beyond twice the guarded request timeout.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const staleBefore = new Date(Date.now() - STALE_GENERATION_LEASE_MS).toISOString();
  const { data, error } = await db
    .from("daily_articles")
    .update({
      image_generation_status: "failed",
      image_validation_note: "Image generation lease expired before completion; returned to guarded recovery backlog.",
    })
    .is("featured_image_url", null)
    .eq("image_generation_status", "generating")
    .not("published_at", "is", null)
    .lt("updated_at", staleBefore)
    .select("slug");

  if (error) return { reset: 0, error: error.message };
  return { reset: data?.length ?? 0 };
}

export const FEATURED_IMAGE_STALE_LEASE_MS = STALE_GENERATION_LEASE_MS;
