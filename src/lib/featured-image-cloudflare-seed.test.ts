import { describe, expect, it } from "vitest";
import { buildFluxImageRequest } from "./featured-image-cloudflare";

describe("buildFluxImageRequest", () => {
  it("uses only fields accepted by the live FLUX Workers AI schema", () => {
    const request = buildFluxImageRequest("Texas preparedness supplies", "people");

    expect(request).toMatchObject({
      steps: 8,
    });
    expect(request.prompt).toContain("REAL CAMERA PHOTOGRAPH ONLY");
    expect(request).not.toHaveProperty("seed");
    expect(request).not.toHaveProperty("negative_prompt");
  });

  it("keeps retry variation in prompt input rather than unsupported request fields", () => {
    const first = buildFluxImageRequest("Texas preparedness supplies, first composition", "people");
    const second = buildFluxImageRequest("Texas preparedness supplies, alternate composition", "people");

    expect(first.prompt).not.toBe(second.prompt);
    expect(Object.keys(first).sort()).toEqual(["prompt", "steps"]);
    expect(Object.keys(second).sort()).toEqual(["prompt", "steps"]);
  });
});
