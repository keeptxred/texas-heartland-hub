import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const relays = [
  "ktr-rss-relay",
  "ktr-rss-relay-north",
  "ktr-rss-relay-sports",
  "ktr-rss-relay-priority",
];

describe("RSS relay upstream failure cache policy", () => {
  for (const relay of relays) {
    it(`${relay} caches only successful upstream responses, never 4xx/5xx`, () => {
      const source = readFileSync(`supabase/functions/${relay}/index.ts`, "utf8");
      expect(source).toContain('status: upstream.status');
      expect(source).toContain('"Cache-Control": upstream.ok ? "public, max-age=120, s-maxage=120" : "no-store"');
      expect(source).not.toContain('"Cache-Control": "public, max-age=120, s-maxage=120"');
      expect(source).toContain('"Cache-Control": "no-store"');
    });
  }
});
