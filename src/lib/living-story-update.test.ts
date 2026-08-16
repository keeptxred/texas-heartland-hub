import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assessStoryNovelty } from "@/lib/story-novelty";

const updater = readFileSync("src/lib/living-story-update.ts", "utf8");
const publisher = readFileSync("src/lib/multi-source-publish.ts", "utf8");
const migration = readFileSync("supabase/migrations/20260816154500_add_living_story_updates.sql", "utf8");

describe("living story canonical updates", () => {
  it("treats a genuinely new action as a material follow-up", () => {
    const novelty = assessStoryNovelty(
      {
        title: "Court orders Texas agency to release records",
        description: "A judge ordered the agency to release the records by Friday.",
        source: "Outlet B",
        link: "https://example.com/update",
        pub_date: "2026-08-16T20:00:00Z",
      },
      "The lawsuit was filed last week and the agency said it would respond in court.",
    );
    expect(novelty.material).toBe(true);
    expect(novelty.newActions.length).toBeGreaterThan(0);
  });

  it("updates daily_articles in place instead of upserting a replacement slug", () => {
    expect(updater).toContain('.from("daily_articles")');
    expect(updater).toContain('.update({');
    expect(updater).toContain('.eq("id", existing.id)');
    expect(updater).toContain('.eq("slug", slug)');
    expect(updater).not.toContain('.upsert(');
    expect(updater).not.toContain("slugifyNewsroomTitle");
  });

  it("preserves canonical identity and original publication time by omission", () => {
    expect(updater).toContain('select("id,slug,title,dek,body,body_json,published_at');
    expect(updater).not.toMatch(/\.update\(\{[\s\S]{0,500}published_at:/);
    expect(updater).not.toMatch(/\.update\(\{[\s\S]{0,500}internal_url:/);
  });

  it("uses Cloudflare structured newsroom generation rather than Lovable", () => {
    expect(updater).toContain("runCloudflareJson<NewsroomDraft>");
    expect(updater).toContain("NEWSROOM_DRAFT_JSON_SCHEMA");
    expect(updater).toContain("validateNewsroomDraft");
    expect(updater).not.toContain("lovable.dev");
    expect(updater).not.toContain("LOVABLE_API_KEY");
  });

  it("keeps an auditable material-update history", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.news_event_article_updates");
    expect(migration).toContain("canonical_slug text NOT NULL");
    expect(migration).toContain("prior_title text");
    expect(migration).toContain("new_title text");
    expect(migration).toContain("title_changed boolean");
    expect(updater).toContain('.from("news_event_article_updates").insert({');
  });

  it("claims published clusters atomically before an in-place update", () => {
    expect(migration).toContain("claim_news_event_cluster_update");
    expect(migration).toContain("status = 'published'");
    expect(migration).toContain("published_slug IS NOT NULL");
    expect(migration).toContain("publish_claim_token IS NULL");
    expect(updater).toContain('db.rpc("claim_news_event_cluster_update"');
  });

  it("routes material follow-ups to the canonical updater instead of legacy minting", () => {
    expect(publisher).toContain("updateCanonicalLivingStory");
    expect(publisher).toContain("acquireLivingStoryUpdateClaim");
    expect(publisher).toContain('developingStory: "follow_up"');
    expect(publisher).toContain("existing.internal_slug");
  });
});
