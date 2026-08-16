import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Cloudflare featured-image payload", () => {
  it("uses SDXL Lightning with explicit photorealism controls", () => {
    const source = fs.readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
    const start = source.indexOf("async function generateImageBytes");
    const end = source.indexOf("async function validateImageMatchesArticle");
    const generateImageSource = source.slice(start, end);

    expect(source).toContain('@cf/bytedance/stable-diffusion-xl-lightning');
    expect(generateImageSource).toContain("negative_prompt");
    expect(generateImageSource).toContain("width: 1024");
    expect(generateImageSource).toContain("height: 576");
    expect(generateImageSource).toContain("num_steps: 8");
    expect(generateImageSource).toContain("guidance: 9.5");
    expect(generateImageSource).toMatch(/\bseed\s*:/);
    expect(generateImageSource).toContain('contentType.startsWith("image/")');
  });

  it("requests and parses a structured JSON verdict from Cloudflare vision", () => {
    const source = fs.readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
    const start = source.indexOf("async function validateImageMatchesArticle");
    const end = source.indexOf("async function serviceClient");
    const validatorSource = source.slice(start, end);

    expect(source).toContain("function parseVisionVerdict");
    expect(validatorSource).toContain("response_format");
    expect(validatorSource).toContain('type: "json_schema"');
    expect(validatorSource).toContain('matches: { type: "boolean" }');
    expect(validatorSource).toContain('photorealistic: { type: "boolean" }');
    expect(validatorSource).toContain('required: ["matches", "photorealistic", "reason"]');
    expect(validatorSource).toContain("parseVisionVerdict(output)");
  });
});