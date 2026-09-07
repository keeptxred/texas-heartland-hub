import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const route = readFileSync(
  resolve(process.cwd(), "src/routes/api/public/texasdefined-government-search.ts"),
  "utf8",
);

describe("TexasDefined Keep TX Red government-search contract", () => {
  it("keeps the cross-site API read-only, bounded and public-only", () => {
    expect(route).toContain('createFileRoute("/api/public/texasdefined-government-search")');
    expect(route).toContain('"access-control-allow-methods": "GET, OPTIONS"');
    expect(route).toContain('const MAX_QUERY_LENGTH = 300;');
    expect(route).toContain('const MAX_LIMIT = 10;');
    expect(route).toContain('.not("published_at", "is", null)');
    expect(route).toContain('.lte("published_at", new Date().toISOString())');
    expect(route).toContain('candidate.publicationStatus !== "published"');
    expect(route).toContain('candidate.verificationStatus !== "verified"');
    expect(route).toContain('race.publicationStatus !== "published"');
    expect(route).toContain('race.verificationStatus !== "verified"');
    expect(route).toContain('poll.publicationStatus !== "published"');
    expect(route).toContain('poll.verificationStatus !== "verified"');
  });

  it("never exposes private newsroom, admin, credential or raw operational tables", () => {
    for (const forbidden of [
      'publishing_queue',
      'news_research_packets',
      'news_publish_candidates',
      'newsroom_generation_drafts',
      'ai_rewrite_cache',
      'ai_rewrite_failures',
      'user_roles',
      'texasdefined_admin_access_keys',
      'social_connections',
      'orders',
    ]) {
      expect(route).not.toContain(`.from("${forbidden}"`);
      expect(route).not.toContain(`.from('${forbidden}'`);
    }
  });

  it("labels source semantics so Texas Defined can remain neutral", () => {
    expect(route).toContain('"government-record"');
    expect(route).toContain('"election-record"');
    expect(route).toContain('"poll"');
    expect(route).toContain('"news-report"');
    expect(route).toContain('scope: "Public-facing Keep TX Red government, elections, legislation and published reporting only; private operational data is excluded."');
  });
});
