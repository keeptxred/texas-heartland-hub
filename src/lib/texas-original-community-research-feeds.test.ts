import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20261110022000_add_primary_city_and_veteran_study_discovery.sql",
  "utf8",
);

describe("original community and veteran-study source registration", () => {
  it("registers only verified original, dated RSS endpoints", () => {
    expect(migration).toContain("City of McKinney — Official News Flash RSS");
    expect(migration).toContain("https://www.mckinneytexas.org/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml");
    expect(migration).toContain("PenFed Foundation — Original Veteran Research Releases");
    expect(migration).toContain("https://penfedfoundation.org/feed/");
    expect(migration).toContain("NOT EXISTS");
    expect(migration).toContain("enabled");
    expect(migration).toContain("source_reputation_score");
  });

  it("keeps discovery separate from article approvals and publication", () => {
    expect(migration).not.toMatch(/INSERT INTO public\.(daily_articles|texasdefined_articles)/i);
    expect(migration).not.toMatch(/UPDATE public\.texas_news_feed/i);
    expect(migration).not.toMatch(/SET (ready_for_rewrite|internal_slug|texasdefined_slug|viral_signals)/i);
    expect(migration).not.toMatch(/news\.google\.com\/rss|bing\.com\/news\/search/i);
    expect(migration).not.toMatch(/UPDATE public\.content_sources/i);
    expect(migration).not.toMatch(/SECURITY DEFINER/i);
  });
});
