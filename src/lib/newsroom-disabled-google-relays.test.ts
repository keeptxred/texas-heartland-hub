import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const sql = readFileSync("supabase/migrations/20261110193000_pause_zero_yield_google_news_discovery_relays.sql", "utf8");
const activeNames = [
  "Texas Attorney General Actions — Google News",
  "Texas Awards Contests and Recognition — Google News",
  "Texas Corporate Partnerships and Expansions — Google News",
  "Texas Courts and Judicial Appointments — Google News",
  "Texas Education Primary Sources — Google News",
  "Texas Executive Actions — Google News",
  "Texas Grants and Workforce Investments — Google News",
  "Texas Human Interest — Caught on Camera",
  "Texas Sports Records and Honors — Google News",
];

describe("only nine proven zero-yield Google discovery transports are paused", () => {
  it("uses a named, idempotent, zero-recent-items and exact-trusted-relay guard", () => {
    for (const name of activeNames) expect(sql).toContain(`'${name}'`);
    expect(sql).toContain("cs.enabled is true");
    expect(sql).toContain("and cs.source_name in (");
    expect(sql).toContain("f.created_at >= now()-interval '24 hours'");
    expect(sql).toContain("cs.rss_url like 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay%'");
    expect(sql).toContain("set enabled=false");
  });

  it("leaves the active governor relay and original publishers untouched", () => {
    const selected = sql.slice(sql.indexOf("and cs.source_name in ("), sql.indexOf("and cs.rss_url like"));
    expect(selected).not.toContain("Texas Governor Primary Source — Google News");
    expect(selected).not.toContain("Office of the Governor");
    expect(selected).not.toContain("Texas DPS");
    expect(sql).not.toMatch(/delete from public\.texas_news_feed/i);
    expect(sql).not.toMatch(/TEXAS_RELEVANCE_MIN\s*=\s*0/i);
  });
});
