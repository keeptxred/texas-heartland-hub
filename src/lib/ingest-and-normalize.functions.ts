// Supabase-backed job queue for story ingestion.
//
// The user's original sketch used an external `queue.send()`. On Keep TX Red
// there is no external queue service — instead, `daily_articles` doubles as
// the queue: rows are inserted with `is_ingested=false` and a downstream
// worker (src/routes/api/public/hooks/ingest-feeds.ts) picks them up, runs
// the editorial rewrite, and flips `is_ingested=true`. This keeps the same
// producer contract as the sketch but reuses infra we already run.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractEntities, inferCategory } from "./nlp";

const RawStorySchema = z.object({
  title: z.string().min(4).max(240),
  content: z.string().min(1),
  source: z.string().min(1).max(120),
  url: z.string().url(),
  publishedAt: z.string().datetime().optional(),
});

export type RawStory = z.infer<typeof RawStorySchema>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const ingestStory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RawStorySchema.parse(input))
  .handler(async ({ data: story }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      throw new Error("Supabase credentials not configured");
    }
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const entities = extractEntities(`${story.title} ${story.content}`);
    const category = inferCategory(entities);
    const publishedAt = story.publishedAt ?? new Date().toISOString();
    const datePrefix = publishedAt.slice(0, 10);
    const slug = `${datePrefix}-${slugify(story.title)}`;

    // "queue.send" equivalent: insert as pending-ingestion. The existing
    // ingest-feeds worker picks up rows where is_ingested=false and rewrites
    // them into the Keep TX Red editorial voice.
    const { error } = await supabase.from("daily_articles").upsert(
      {
        slug,
        internal_url: `/news/${slug}`,
        is_ingested: false,
        kind: "ingested",
        category,
        title: story.title.slice(0, 200),
        dek: story.content.slice(0, 320),
        body: story.content,
        source_name: story.source,
        source_url: story.url,
        published_at: publishedAt,
        keywords: entities,
      },
      { onConflict: "slug" },
    );

    if (error) throw new Error(`enqueue failed: ${error.message}`);

    return {
      slug,
      category,
      entities,
      topics: entities,
      queued: true,
    };
  });