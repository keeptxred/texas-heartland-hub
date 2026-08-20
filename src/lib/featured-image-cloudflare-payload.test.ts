import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Cloudflare featured-image payload", () => {
  it("uses FLUX with explicit anti-illustration prompt controls", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const start = source.indexOf("export async function generateImageBytes");
    const end = source.indexOf("export async function validateImageMatchesArticle");
    const generateImageSource = source.slice(start, end);

    expect(source).toContain('@cf/black-forest-labs/flux-1-schnell');
    expect(generateImageSource).toContain("Avoid all of the following");
    expect(generateImageSource).toContain("steps: 8");
    expect(generateImageSource).toContain("seed,");
    expect(generateImageSource).not.toMatch(/\bnegative_prompt\s*:/);
    expect(generateImageSource).not.toContain("dreamshaper-8-lcm");
    expect(generateImageSource).toContain('contentType.startsWith("image/")');
  });

  it("requests, normalizes, and parses a structured JSON verdict from Cloudflare vision", () => {
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
    expect(validatorSource).toContain("normalizeCloudflareVisionVerdictOutput(output)");
    expect(validatorSource).toContain("parseVisionVerdict(normalizedOutput)");
    expect(validatorSource).toContain("a believable photorealistic courthouse exterior or courtroom interior IS a valid direct story match");
  });

  it("accepts representative political editorial photography without demanding an exact event recreation", () => {
    const runtime = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const start = runtime.indexOf("export async function validateImageMatchesArticle");
    const validatorSource = runtime.slice(start);

    expect(validatorSource).toContain('subject.domain === "politics"');
    expect(validatorSource).toContain("do NOT require a recognizable likeness of a named politician");
    expect(validatorSource).toContain("the exact date");
    expect(validatorSource).toContain("policy-impact setting");
    expect(validatorSource).toContain("Do not require it to prove that it was captured at the exact historical event");
    expect(validatorSource).toContain("Judge topical relevance and photorealism, not whether a generated editorial image proves an exact historical moment");
  });
});
