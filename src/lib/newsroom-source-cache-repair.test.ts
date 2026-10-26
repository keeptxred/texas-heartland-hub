import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("KTR synthetic-source cache repair is precisely scoped and idempotent", () => {
  const migration = readFileSync(
    "supabase/migrations/20261026150000_repair_ktr_synthetic_news_source_cache.sql",
    "utf8",
  );
  it("only clears KNOWN synthetic packets for KTR's unlinked, unpublished feeds", () => {
    expect(migration).toContain("UPDATE public.texas_news_feed");
    expect(migration).toContain("SET extracted_body = NULL");
    expect(migration).toContain("target_site = 'keeptxred'");
    expect(migration).toContain("internal_slug IS NULL");
    expect(migration).toContain("MULTI-SOURCE STORY PACKET.");
    expect(migration).toContain("PRIMARY-RECORD-AUGMENTED SOURCE PACKET.");
    expect(migration).toContain("RELATED OFFICIAL RELEASE SERIES:");
    expect(migration).toContain("RETURNING id");
    expect(migration).not.toContain("UPDATE public.daily_articles");
    expect(migration).not.toContain("DELETE FROM public.texas_news_feed");
  });
  it("resets only affected hydration cooldowns instead of bypassing source fetch and verification", () => {
    expect(migration).toContain("DELETE FROM public.newsroom_source_page_fetch_state");
    expect(migration).toContain("USING invalidated");
    expect(migration).toContain("fetch_state.feed_item_id = invalidated.id");
    const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    expect(builder).toContain("fetchReadableNewsroomSource(feed.link)");
    expect(builder).toContain("const SOURCE_PAGE_FETCH_LIMIT = 40");
    expect(builder).toContain("shouldFetchNewsroomSourcePage");
    const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(generator).toContain("newsroomHasPublisherDiversity(sources)");
    expect(generator).toContain("researchPacketEvidenceChars");
    expect(generator).toContain("prepareFeaturedImageForUnpublishedNewsroomArticle");
  });
});
