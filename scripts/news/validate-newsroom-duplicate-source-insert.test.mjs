import { describe, expect, it } from "vitest";
import fs from "node:fs";

const migration = fs.readFileSync(
  "supabase/migrations/20260829170000_raise_on_suppressed_clustered_newsroom_duplicate.sql",
  "utf8",
);

describe("clustered newsroom duplicate source insert contract", () => {
  it("turns silent clustered-newsroom suppression into an explicit database error", () => {
    expect(migration).toContain("new.kind = 'news' and new.author = 'Keep TX Red Newsroom'");
    expect(migration).toContain("clustered_newsroom_duplicate_source_url");
    expect(migration).toContain("errcode = '23505'");
    expect(migration).toContain("return null");
  });

  it("repairs the observed false-published state only when no article exists", () => {
    expect(migration).toContain("a041b248-342f-4c5e-9a57-5bade95020d7");
    expect(migration).toContain("a1b6f583-9d1a-42eb-bc77-e6adc392ee91");
    expect(migration).toContain("not exists");
    expect(migration).toContain("status = 'HELD'");
    expect(migration).toContain("status = 'READY'");
  });
});
