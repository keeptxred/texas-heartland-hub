import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Cloudflare featured-image payload", () => {
  it("uses DreamShaper with explicit photorealism controls", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const start = source.indexOf("export async function generateImageBytes");
    const end = source.indexOf("export async function validateImageMatchesArticle");
    const generateImageSource = source.slice(start, end);

    expect(source).toContain('@cf/lykon/dreamshaper-8-lcm');
    expect(generateImageSource).toContain("negative_prompt");
    expect(generateImageSource).toContain("width: 1024");
    expect(generateImageSource).toContain("height: 576");
    expect(generateImageSource).toContain("num_steps: 20");
    expect(generateImageSource).toContain("guidance: 7.5");
    expect(generateImageSource).toMatch(/\bseed\s*:/);
    expect(generateImageSource).toContain('contentType.startsWith("image/")');
  });

  it("requests and parses a structured JSON verdict from Cloudflare vision", () => {
    const runtime = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const core = fs.readFileSync(new URL("./featured-image-core.ts", import.meta.url), "utf8");
    const start = runtime.indexOf("export async function validateImageMatchesArticle");
    const validatorSource = runtime.slice(start);

    expect(core).toContain("export function parseVisionVerdict");
    expect(validatorSource).toContain("guided_json: verdictSchema");
    expect(validatorSource).toContain('matches: { type: "boolean" }');
    expect(validatorSource).toContain('photorealistic: { type: "boolean" }');
    expect(validatorSource).toContain('required: ["matches", "photorealistic", "reason"]');
    expect(validatorSource).toContain("max_tokens: 256");
    expect(validatorSource).toContain("parseVisionVerdict(output)");
    expect(validatorSource).toContain("a believable photorealistic courthouse exterior or courtroom interior IS a valid direct story match");
  });
});