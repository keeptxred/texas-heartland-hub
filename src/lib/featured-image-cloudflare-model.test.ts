import { describe, expect, it } from "vitest";
import { CLOUDFLARE_VISION_MODEL } from "./featured-image-cloudflare";

describe("Cloudflare featured-image vision model", () => {
  it("uses the non-reasoning Mistral vision model", () => {
    expect(CLOUDFLARE_VISION_MODEL).toBe("@cf/mistralai/mistral-small-3.1-24b-instruct");
    expect(CLOUDFLARE_VISION_MODEL).not.toContain("llama-3.2-11b-vision-instruct");
    expect(CLOUDFLARE_VISION_MODEL).not.toContain("gemma-4-26b-a4b-it");
  });
});
