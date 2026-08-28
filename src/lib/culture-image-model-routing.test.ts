import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLOUDFLARE_CULTURE_IMAGE_MODEL, CLOUDFLARE_IMAGE_FALLBACK_MODEL, CLOUDFLARE_IMAGE_MODEL, CLOUDFLARE_IMAGE_QUALITY_MODEL } from "./featured-image-cloudflare";

const functionsSource = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
const cloudflareSource = readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");

describe("featured image model routing", () => {
  it("uses quota-safe Klein 4B by default, Klein 9B only for final quality escalation, and Schnell as API fallback", () => {
    expect(CLOUDFLARE_IMAGE_MODEL).toBe("@cf/black-forest-labs/flux-2-klein-4b");
    expect(CLOUDFLARE_IMAGE_QUALITY_MODEL).toBe("@cf/black-forest-labs/flux-2-klein-9b");
    expect(CLOUDFLARE_IMAGE_FALLBACK_MODEL).toBe("@cf/black-forest-labs/flux-1-schnell");
    expect(CLOUDFLARE_CULTURE_IMAGE_MODEL).toBe(CLOUDFLARE_IMAGE_MODEL);
    expect(functionsSource).toContain('subject.domain === "culture" ? CLOUDFLARE_CULTURE_IMAGE_MODEL : undefined');
    expect(functionsSource).toContain("generateImageBytes(stronger, negativePrompt, imageModel)");
    expect(cloudflareSource).toContain("function isFinalStrictValidatorRetry(prompt: string)");
    expect(cloudflareSource).toContain("model === CLOUDFLARE_IMAGE_MODEL && isFinalStrictValidatorRetry(prompt)");
    expect(cloudflareSource).not.toContain("@cf/black-forest-labs/flux-2-dev");
  });

  it("uses shared FLUX 2 Klein multipart controls without Dev-specific steps and preserves supported Schnell fallback fields", () => {
    expect(cloudflareSource).toContain('form.append("guidance", "5.5")');
    expect(cloudflareSource).toContain('form.append("width", "1024")');
    expect(cloudflareSource).toContain('form.append("height", "768")');
    expect(cloudflareSource).toContain("model === CLOUDFLARE_IMAGE_MODEL || model === CLOUDFLARE_IMAGE_QUALITY_MODEL");
    expect(cloudflareSource).toContain("body: buildFlux2ImageRequest(prompt, negativePrompt, model)");
    expect(cloudflareSource).not.toContain('form.append("steps", "25")');
    expect(cloudflareSource).toContain("steps: 8");
    expect(cloudflareSource).toContain("buildFluxImagePrompt");
    expect(cloudflareSource).toContain("REAL CAMERA PHOTOGRAPH ONLY");
    expect(cloudflareSource).toContain("HARD EXCLUSIONS:");
    expect(cloudflareSource).not.toMatch(/^\s*seed\s*[:,]/m);
    expect(cloudflareSource).not.toContain("Math.random() * 1_000_000_000");
    expect(cloudflareSource).not.toContain("negative_prompt: negativePrompt");
    expect(cloudflareSource).not.toContain("dreamshaper-8-lcm");
  });
});
