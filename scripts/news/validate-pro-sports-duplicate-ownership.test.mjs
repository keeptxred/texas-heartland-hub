import { describe, expect, it } from "vitest";
import fs from "node:fs";

const path = "supabase/migrations/20260926144000_align_pro_sports_duplicate_quarantine.sql";
const sql = fs.readFileSync(path, "utf8");

describe("pro sports duplicate quarantine ownership", () => {
  it("preserves one TexasDefined Sports survivor and locks duplicates to review", () => {
    for (const token of [
      "target_site = 'texasdefined'",
      "target_section = 'Sports'",
      "'duplicate_title_quarantine', true",
      "'auto_publish_eligible', false",
      "'routing_lock', true",
      "'routing_locked_site', 'review'",
      "zzzzzzzzzzzzz_guard_pro_sports_duplicate_title",
      "texasdefined_slug IS NULL",
    ]) expect(sql).toContain(token);
    expect(sql.toLowerCase()).not.toContain("delete from public.texas_news_feed");
  });
});
