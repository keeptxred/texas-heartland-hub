import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("checkout runtime bindings", () => {
  it("keeps the public Supabase checkout bindings in Wrangler", () => {
    const source = fs.readFileSync(new URL("../../wrangler.jsonc", import.meta.url), "utf8");
    const config = JSON.parse(source) as { vars?: Record<string, string> };

    expect(config.vars?.SUPABASE_URL).toBeTruthy();
    expect(config.vars?.SUPABASE_PUBLISHABLE_KEY).toMatch(/^sb_publishable_/);
  });
});
