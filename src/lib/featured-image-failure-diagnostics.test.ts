import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image failure diagnostics", () => {
  it("persists the generation or validation failure reason with failed status", () => {
    expect(source).toContain('image_generation_status: "failed",\n      image_validation_note: msg.slice(0, 1000),');
    expect(source).toContain('return { ok: false, error: msg };');
  });

  it("keeps Cloudflare story-match validation as a hard gate", () => {
    expect(source).toContain('if (!verdict.matches) throw new Error(`Generated image failed Cloudflare story-match/photorealism validation: ${verdict.reason}`);');
  });
});
