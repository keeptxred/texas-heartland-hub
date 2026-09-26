import { describe, expect, it } from "vitest";
import fs from "node:fs";

const sql = fs.readFileSync("supabase/migrations/20260926145000_finalize_pro_sports_duplicate_trigger.sql","utf8");

describe("final pro sports duplicate trigger", () => {
  it("fires on routing mutations and replays duplicates through the final guard", () => {
    for (const token of [
      "UPDATE OF title, trend_source, target_site, target_section, viral_signals",
      "zzzzzzzzzzzzz_guard_pro_sports_duplicate_title",
      "SET title = f.title",
      "internal_slug IS NULL",
      "texasdefined_slug IS NULL",
    ]) expect(sql).toContain(token);
    expect(sql.toLowerCase()).not.toContain("delete from public.texas_news_feed");
  });
});
