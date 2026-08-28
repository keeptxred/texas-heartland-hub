import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("featured-image quota-safe quality retries", () => {
  it("keeps Klein 4B as the production model for strict-validator retries", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");

    expect(source).toContain('CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b"');
    expect(source).toContain('CLOUDFLARE_IMAGE_QUALITY_MODEL = "@cf/black-forest-labs/flux-2-dev"');
    expect(source).toContain("let activeModel = model;");
    expect(source).not.toContain("isStrictValidatorRetry(prompt)");
    expect(source).not.toContain("? CLOUDFLARE_IMAGE_QUALITY_MODEL");
    expect(source).toContain('form.append("steps", "25")');
    expect(source).toContain("model === CLOUDFLARE_IMAGE_MODEL || model === CLOUDFLARE_IMAGE_QUALITY_MODEL");
  });

  it("falls back from Klein to Schnell on provider failure without auto-escalating to Dev", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const generateStart = source.indexOf("export async function generateImageBytes");
    const validatorStart = source.indexOf("export function extractCloudflareVisionOutput");
    const generateSource = source.slice(generateStart, validatorStart);

    expect(generateSource).toContain("if (!res.ok && activeModel === CLOUDFLARE_IMAGE_MODEL)");
    expect(generateSource).toContain("CLOUDFLARE_IMAGE_FALLBACK_MODEL");
    expect(generateSource).not.toContain("CLOUDFLARE_IMAGE_QUALITY_MODEL");
  });
});
