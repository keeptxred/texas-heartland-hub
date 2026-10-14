import { describe, expect, it } from "vitest";
import { approvedPublishedEvergreen, type PublishedFacebookEvergreenRow } from "@/lib/facebook-durable-guides";
import fs from "node:fs";

const base: PublishedFacebookEvergreenRow = {
  slug: "texas-redistricting-explained-history-2026-map",
  title: "Texas Redistricting Explained",
  category: "Elections",
  kind: "evergreen",
  published_at: "2026-08-29T18:45:00Z",
  content_quality_score: 96,
  quality_flags: ["evergreen_authority", "primary_sources", "multi_source", "image_rights_verified", "editorial_reviewed"],
  image_generation_status: "ready",
  featured_image_url: "/api/public/article-image/texas-redistricting-explained-history-2026-map.jpg",
};

describe("published evergreen Facebook guide fallback", () => {
  it("accepts substantive image-governed evergreen backed by daily_articles", () => {
    expect(approvedPublishedEvergreen(base)).toMatchObject({
      slug: base.slug,
      source_pool: "published-evergreen",
      url: "https://keeptxred.com/news/texas-redistricting-explained-history-2026-map",
      image_url: base.featured_image_url,
    });
  });
  it("permits vetted evergreen with a canonical licensed HTTPS photograph", () => {
    const guide = approvedPublishedEvergreen({
      ...base,
      slug: "texas-policing-agencies-compared",
      featured_image_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Operaton_Triple_Beam_Houston_2018-01.jpg",
    });
    expect(guide?.kind).toBe("evergreen-guide");
  });
  it("rejects press releases, lost historical articles and unrelated thumbnails", () => {
    expect(approvedPublishedEvergreen({ ...base, kind: "news" })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, quality_flags: [...base.quality_flags!, "legacy_url_restored"] })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, quality_flags: [...base.quality_flags!, "seo_noindex"] })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, featured_image_url: "https://keeptxred.com/og/default.jpg" })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, image_generation_status: "failed" })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, content_quality_score: 80 })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, quality_flags: ["evergreen_authority", "editorial_reviewed"] })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, featured_image_url: "http://insecure.test/bad.jpg" })).toBeNull();
    expect(approvedPublishedEvergreen({ ...base, featured_image_url: "data:image/svg+xml;base64,SGVsbG8=" })).toBeNull();
  });
  it("does not select unbacked static pillar URLs in the production publisher", () => {
    const production = fs.readFileSync("src/lib/facebook-durable-guide-publisher.server.ts", "utf8");
    expect(production).toContain("loadApprovedPublishedEvergreenGuides(args.db)");
    expect(production).not.toContain("const pool = KTR_DURABLE_FACEBOOK_GUIDES");
    expect(production).toContain('.eq("kind", "evergreen")');
    expect(production).toContain('.eq("image_generation_status", "ready")');
  });
});
