import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20261014225500_hydrate_keep_tx_red_newsroom_plain_body.sql",
  "utf8",
);
const audit = readFileSync("scripts/news/audit-published-url-integrity.mjs", "utf8");

describe("permanent KeepTXRed newsroom text-body integrity", () => {
  it("fills only empty KTR news bodies from existing structured reporting", () => {
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.hydrate_keep_tx_red_newsroom_plain_body()");
    expect(migration).toContain("NEW.kind IS DISTINCT FROM 'news'");
    expect(migration).toContain("NEW.author IS DISTINCT FROM 'Keep TX Red Newsroom'");
    expect(migration).toContain("NULLIF(btrim(COALESCE(NEW.body, '')), '') IS NOT NULL");
    expect(migration).toContain("NEW.body := v_body");
    expect(migration).toContain("IF length(v_body) >= 200 THEN");
    expect(migration).toContain("BEFORE INSERT OR UPDATE OF body, body_json, kind, author");
    expect(migration).not.toMatch(/UPDATE\s+public\.daily_articles\s+SET\s+published_at/i);
  });

  it("retains structured content and attribution rather than regenerating an article", () => {
    expect(migration).toContain("NEW.body_json->'intro'");
    expect(migration).toContain("NEW.body_json->'sections'");
    expect(migration).toContain("v.section->'paragraphs'");
    expect(migration).toContain("NEW.body_json->'faq'");
    expect(migration).toContain("NEW.body_json->'keyTakeaways'");
    expect(migration).not.toContain("NEW.published_at :=");
    expect(migration).not.toContain("NEW.source_url :=");
  });

  it("does not let restored historical news escape the plain-text integrity audit", () => {
    expect(audit).toContain('readAll("daily_articles", "slug,created_at,kind,body"');
    expect(audit).toContain('query.gte("created_at", recentBodyAuditSince)');
    expect(audit).toContain('row.kind === "news" && String(row.body ?? "").trim().length === 0');
    expect(audit).toContain("recentlyCreatedNewsWithoutPlainTextBody");
    expect(audit).toContain("recentlyMissingPlainTextBody.length");
    expect(audit).not.toContain('query.gte("published_at", recentBodyAuditSince)');
  });
});
