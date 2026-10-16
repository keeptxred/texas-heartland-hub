import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image failure diagnostics", () => {
  it("persists the generation or validation failure reason with failed status", () => {
    expect(source).toMatch(/if \(!opts\.beforePublish\) \{\s*await supabase\.from\("daily_articles"\)\.update\(\{\s*image_generation_status: "failed",\s*image_validation_note: msg\.slice\(0, 1000\)/);
    expect(source).toContain('if (!opts.beforePublish) {');
    expect(source).toContain('return generateAndStore(row, { beforePublish: true })');
    expect(source).toContain('return { ok: false, error: msg };');
  });

  it("keeps Cloudflare story-match validation as a hard gate", () => {
    expect(source).toContain('if (!verdict.matches) throw new Error(`Generated image failed Cloudflare story-match/photorealism validation: ${verdict.reason}`);');
  });
});
