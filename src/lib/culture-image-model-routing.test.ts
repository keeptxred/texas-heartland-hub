import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLOUDFLARE_CULTURE_IMAGE_MODEL, CLOUDFLARE_IMAGE_MODEL } from "./featured-image-cloudflare";

const functionsSource = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
const cloudflareSource = readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");

describe("featured image model routing", () => {
  it("uses hosted FLUX as the default for every image category", () => {
    expect(CLOUDFLARE_IMAGE_MODEL).toBe("@cf/black-forest-labs/flux-1-schnell");
    expect(CLOUDFLARE_CULTURE_IMAGE_MODEL).toBe(CLOUDFLARE_IMAGE_MODEL);
    expect(functionsSource).toContain('subject.domain === "culture" ? CLOUDFLARE_CULTURE_IMAGE_MODEL : undefined');
    expect(functionsSource).toContain("generateImageBytes(stronger, negativePrompt, imageModel)");
  });

  it("uses FLUX native schema, a varying seed, and bounded negative constraints in the prompt", () => {
    expect(cloudflareSource).toContain("steps: 8");
    expect(cloudflareSource).toContain("seed = Math.floor(Math.random() * 1_000_000_000) + 1");
    expect(cloudflareSource).toContain("buildFluxImageRequest(prompt, negativePrompt)");
    expect(cloudflareSource).toContain("buildFluxImagePrompt");
    expect(cloudflareSource).toContain("REAL CAMERA PHOTOGRAPH ONLY");
    expect(cloudflareSource).toContain("HARD EXCLUSIONS:");
    expect(cloudflareSource).not.toContain("negative_prompt: negativePrompt");
    expect(cloudflareSource).not.toContain("dreamshaper-8-lcm");
  });
});
