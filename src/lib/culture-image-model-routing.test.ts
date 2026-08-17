import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLOUDFLARE_CULTURE_IMAGE_MODEL, CLOUDFLARE_IMAGE_MODEL } from "./featured-image-cloudflare";

const functionsSource = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
const cloudflareSource = readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");

describe("culture image model routing", () => {
  it("keeps DreamShaper as the general default and uses hosted FLUX for culture", () => {
    expect(CLOUDFLARE_IMAGE_MODEL).toBe("@cf/lykon/dreamshaper-8-lcm");
    expect(CLOUDFLARE_CULTURE_IMAGE_MODEL).toBe("@cf/black-forest-labs/flux-1-schnell");
    expect(functionsSource).toContain('subject.domain === "culture" ? CLOUDFLARE_CULTURE_IMAGE_MODEL : undefined');
    expect(functionsSource).toContain("generateImageBytes(stronger, negativePrompt, imageModel)");
  });

  it("uses FLUX native steps schema instead of DreamShaper-only fields", () => {
    expect(cloudflareSource).toContain("model === CLOUDFLARE_CULTURE_IMAGE_MODEL");
    expect(cloudflareSource).toContain("steps: 8");
    expect(cloudflareSource).toContain("Avoid all of the following");
    expect(cloudflareSource).toContain("negative_prompt: negativePrompt");
  });
});
