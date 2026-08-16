import { describe, expect, it } from "vitest";
import { CLOUDFLARE_VISION_MODEL } from "./featured-image-cloudflare";

describe("Cloudflare featured-image vision model", () => {
  it("uses the current non-gated Gemma 4 vision model", () => {
    expect(CLOUDFLARE_VISION_MODEL).toBe("@cf/google/gemma-4-26b-a4b-it");
    expect(CLOUDFLARE_VISION_MODEL).not.toContain("llama-3.2-11b-vision-instruct");
  });
});
