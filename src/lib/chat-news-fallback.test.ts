import { describe, expect, it } from "vitest";
import { getChatNewsFallbackBySlug } from "./chat-news-fallback";

const seedStyleSlugs = [
  "2026-08-08-daniella-guzman-kprc-return-ticket-review",
  "2026-08-08-fdr-grandson-rolling-r-ranch-sale",
  "2026-08-08-houston-anime-threat-governor-office",
  "2026-08-08-kerr-county-federal-disaster-aid-delay",
  "2026-08-08-texas-childrens-pavilion-women-expansion",
  "2026-08-08-texas-measles-alert-montgomery-county",
  "2026-08-08-the-hop-webster-closes-preslees",
  "2026-08-08-victor-wembanyama-soccer-katy",
];

describe("chat news migration fallback", () => {
  it.each(seedStyleSlugs)("parses seed-style migration %s", (slug) => {
    const article = getChatNewsFallbackBySlug(slug);
    expect(article?.slug).toBe(slug);
    expect(article?.title).toBeTruthy();
    expect(article?.body.intro.length).toBeGreaterThan(0);
    expect(article?.featured_image_url).toBeTruthy();
  });
});
