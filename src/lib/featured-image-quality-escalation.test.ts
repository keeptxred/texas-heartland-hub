import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("featured-image quota-safe quality retries", () => {
  it("keeps Klein 4B primary and reserves enhanced Klein 9B for only the final strict retry", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");

    expect(source).toContain('CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b"');
    expect(source).toContain('CLOUDFLARE_IMAGE_QUALITY_MODEL = "@cf/black-forest-labs/flux-2-klein-9b"');
    expect(source).toContain("function isFinalStrictValidatorRetry(prompt: string)");
    expect(source).toContain("Validator rejection\\s+3:");
    expect(source).toContain("Retry\\s+3\\.");
    expect(source).toContain("model === CLOUDFLARE_IMAGE_MODEL && isFinalStrictValidatorRetry(prompt)");
    expect(source).toContain("? CLOUDFLARE_IMAGE_QUALITY_MODEL");
    expect(source).not.toContain('@cf/black-forest-labs/flux-2-dev');
    expect(source).not.toContain('form.append("steps", "25")');
  });

  it("uses Schnell only as the cheap provider fallback and drops safety retries back to Klein 4B", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const generateStart = source.indexOf("export async function generateImageBytes");
    const validatorStart = source.indexOf("export function extractCloudflareVisionOutput");
    const generateSource = source.slice(generateStart, validatorStart);

    expect(generateSource).toContain("else if (activeModel === CLOUDFLARE_IMAGE_MODEL)");
    expect(generateSource).toContain("activeModel = CLOUDFLARE_IMAGE_FALLBACK_MODEL");
    expect(generateSource).toContain("activeModel = CLOUDFLARE_IMAGE_MODEL");
    expect(generateSource).toContain("buildImageSafetyRetryPrompt(prompt)");
    expect(generateSource).toContain("isCloudflareImageSafetyRejection");
    expect(generateSource).not.toContain("activeModel === CLOUDFLARE_IMAGE_QUALITY_MODEL");
  });
});
