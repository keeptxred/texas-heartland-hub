import { afterEach, describe, expect, it, vi } from "vitest";
import { buildFluxImageRequest } from "./featured-image-cloudflare";

describe("buildFluxImageRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("includes an explicit supported FLUX seed", () => {
    expect(buildFluxImageRequest("Texas preparedness supplies", "people", 424242)).toMatchObject({
      steps: 8,
      seed: 424242,
    });
  });

  it("varies the default seed between generation attempts", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.2);

    const first = buildFluxImageRequest("Texas preparedness supplies", "people");
    const second = buildFluxImageRequest("Texas preparedness supplies", "people");

    expect(first.seed).toBe(100000001);
    expect(second.seed).toBe(200000001);
    expect(first.seed).not.toBe(second.seed);
  });
});
