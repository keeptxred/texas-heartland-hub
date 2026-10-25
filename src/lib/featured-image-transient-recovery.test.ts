import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CLOUDFLARE_IMAGE_MODEL,
  generateImageBytes,
  isTransientCloudflareImageFailure,
} from "./featured-image-cloudflare";

describe("Cloudflare premium image provider outage recovery", () => {
  beforeEach(() => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "fake-test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "fake-test-token");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("classifies server outages as temporary without treating quota or safety errors as outages", () => {
    expect(isTransientCloudflareImageFailure(500)).toBe(true);
    expect(isTransientCloudflareImageFailure(503)).toBe(true);
    expect(isTransientCloudflareImageFailure(408)).toBe(true);
    expect(isTransientCloudflareImageFailure(429)).toBe(false);
    expect(isTransientCloudflareImageFailure(403)).toBe(false);
    expect(isTransientCloudflareImageFailure(422)).toBe(false);
  });

  it("falls back exactly once from Klein 9B HTTP 500 to Klein 4B on final strict retry", async () => {
    const image = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const fetched = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        errors: [{ message: "AiError: Internal server error" }],
      }), { status: 500, headers: { "content-type": "application/json" } }))
      .mockResolvedValueOnce(new Response(image, { status: 200, headers: { "content-type": "image/jpeg" } }));
    vi.stubGlobal("fetch", fetched);
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const output = await generateImageBytes(
      "Correction from rejected attempt: Retry 3. Photograph a Texas election office",
      "no typography",
      CLOUDFLARE_IMAGE_MODEL,
    );
    expect(Array.from(output)).toEqual(Array.from(image));
    expect(fetched).toHaveBeenCalledTimes(2);
    expect(String(fetched.mock.calls[0][0])).toContain("flux-2-klein-9b");
    expect(String(fetched.mock.calls[1][0])).toContain("flux-2-klein-4b");
  });

  it("never retries quota failures and holds the image when both models fail", async () => {
    const quota = vi.fn().mockResolvedValue(
      new Response("quota exceeded", { status: 429 }),
    );
    vi.stubGlobal("fetch", quota);
    await expect(generateImageBytes(
      "Correction from rejected attempt: Retry 3. Real Texas newsroom",
      "",
    )).rejects.toThrow("429");
    expect(quota).toHaveBeenCalledTimes(1);

    const outage = vi.fn().mockResolvedValue(
      new Response("provider down", { status: 500 }),
    );
    vi.stubGlobal("fetch", outage);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(generateImageBytes(
      "Correction from rejected attempt: Retry 3. Real Texas newsroom",
      "",
    )).rejects.toThrow("500");
    expect(outage).toHaveBeenCalledTimes(2);
  });
});
