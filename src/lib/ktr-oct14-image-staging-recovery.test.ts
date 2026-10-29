import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20261029195600_requeue_two_visual_rejected_news_heroes.sql",
  "utf8",
);

describe("bounded recovery of two failed October 14 visual-rejected news images", () => {
  it("targets only both exact failed slugs and previously rejected URLs", () => {
    expect(migration).toContain("2026-10-14-house-republicans-pull-3-million-reserved-for-ads-against-henry-cuellar");
    expect(migration).toContain("2026-10-14-texas-penalties-for-data-center-violations-are-light-despite-tough-talk-from-abb");
    expect(migration).toContain("Henry_Cuellar,_official_portrait.jpg");
    expect(migration).toContain("2026-08-20-multiple-data-centers");
    expect(migration).toContain("article.image_candidate_url = rejected.expected_candidate_url");
    expect(migration).toContain("article.image_validation_note LIKE 'stored-cloudflare-vision-v5 rejected:%'");
    expect(migration).toContain("article.published_at IS NOT NULL");
    expect(migration).toContain("article.kind = 'news'");
  });

  it("preserves rejection provenance and never approves an image", () => {
    expect(migration).toContain("specific_rejected_candidate_retired_for_vision_gated_replacement");
    expect(migration).toContain("'url', article.image_candidate_url");
    expect(migration).toContain("'note', left(coalesce(article.image_validation_note, ''), 1000)");
    expect(migration).toContain("image_candidate_url = NULL");
    expect(migration).toContain("image_generation_status = 'failed'");
    expect(migration).toContain("article.featured_image_url IS NULL");
    expect(migration).not.toMatch(/SET featured_image_url\s*=/);
    expect(migration).not.toMatch(/image_generation_status\s*=\s*'ready'/);
    expect(migration).not.toContain("cloudflare-vision-v5 ok:");
  });
});
