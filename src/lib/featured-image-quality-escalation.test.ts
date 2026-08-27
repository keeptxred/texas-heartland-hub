import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("featured-image quality escalation", () => {
  it("keeps Klein 4B as the cheap first pass and escalates strict-validator retries to FLUX.2 Dev", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");

    expect(source).toContain('CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b"');
    expect(source).toContain('CLOUDFLARE_IMAGE_QUALITY_MODEL = "@cf/black-forest-labs/flux-2-dev"');
    expect(source).toContain("isStrictValidatorRetry(prompt)");
    expect(source).toContain("? CLOUDFLARE_IMAGE_QUALITY_MODEL");
    expect(source).toContain('form.append("steps", "25")');
    expect(source).toContain("model === CLOUDFLARE_IMAGE_MODEL || model === CLOUDFLARE_IMAGE_QUALITY_MODEL");
  });

  it("does not silently downgrade a quality retry to Schnell", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const generateStart = source.indexOf("export async function generateImageBytes");
    const validatorStart = source.indexOf("export function extractCloudflareVisionOutput");
    const generateSource = source.slice(generateStart, validatorStart);

    expect(generateSource).toContain("if (!res.ok && activeModel === CLOUDFLARE_IMAGE_MODEL)");
    expect(generateSource).not.toContain("activeModel === CLOUDFLARE_IMAGE_QUALITY_MODEL) {");
    expect(generateSource).toContain("CLOUDFLARE_IMAGE_FALLBACK_MODEL");
  });
});
