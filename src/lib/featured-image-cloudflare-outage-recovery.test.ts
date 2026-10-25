import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CLOUDFLARE_IMAGE_MODEL,
  CLOUDFLARE_IMAGE_QUALITY_MODEL,
  generateImageBytes,
  isRetryableImageModelOutage,
} from "./featured-image-cloudflare";

const image = () => new Response(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), {
  status: 200,
  headers: { "content-type": "image/jpeg" },
});
const failure = (status: number, message = "AiError: Internal server error") =>
  new Response(JSON.stringify({ success: false, errors: [{ message }] }), {
    status,
    headers: { "content-type": "application/json" },
  });

beforeEach(() => {
  vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
  vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("bounded recovery from Cloudflare image-model outages", () => {
  it("recovers a transient Klein 9B 500 using one Klein 4B generation", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(failure(500)).mockResolvedValueOnce(image());
    vi.stubGlobal("fetch", fetcher);

    const bytes = await generateImageBytes("Texas election administration", "no readable text", CLOUDFLARE_IMAGE_QUALITY_MODEL);
    expect([...bytes]).toEqual([0xff, 0xd8, 0xff, 0xd9]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(String(fetcher.mock.calls[0][0])).toContain(CLOUDFLARE_IMAGE_QUALITY_MODEL);
    expect(String(fetcher.mock.calls[1][0])).toContain(CLOUDFLARE_IMAGE_MODEL);
  });

  it("tries Klein 4B at most once after both original and quality provider 5xx failures", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(failure(502))
      .mockResolvedValueOnce(failure(500))
      .mockResolvedValueOnce(image());
    vi.stubGlobal("fetch", fetcher);

    const bytes = await generateImageBytes("Texan grid facilities", "no readable text");
    expect(bytes.length).toBe(4);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(String(fetcher.mock.calls[0][0])).toContain(CLOUDFLARE_IMAGE_MODEL);
    expect(String(fetcher.mock.calls[1][0])).toContain(CLOUDFLARE_IMAGE_QUALITY_MODEL);
    expect(String(fetcher.mock.calls[2][0])).toContain(CLOUDFLARE_IMAGE_MODEL);
  });

  it("fails closed when both models remain unavailable, without a polling loop", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(failure(500)).mockResolvedValueOnce(failure(503));
    vi.stubGlobal("fetch", fetcher);

    await expect(generateImageBytes("Texas Capitol", "no logos", CLOUDFLARE_IMAGE_QUALITY_MODEL))
      .rejects.toThrow(/recovery failed after/);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not interpret quota exhaustion or bad requests as transient outages", async () => {
    expect(isRetryableImageModelOutage(500)).toBe(true);
    expect(isRetryableImageModelOutage(503)).toBe(true);
    expect(isRetryableImageModelOutage(429)).toBe(false);
    expect(isRetryableImageModelOutage(403)).toBe(false);

    const fetcher = vi.fn().mockResolvedValueOnce(failure(429, "free allocation exhausted"));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateImageBytes("Texas Capitol", "no logos", CLOUDFLARE_IMAGE_QUALITY_MODEL))
      .rejects.toThrow(/429/);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("retains the existing safety reframe and uses no unchecked image fallback", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(failure(403, "output has been flagged"))
      .mockResolvedValueOnce(image());
    vi.stubGlobal("fetch", fetcher);

    const bytes = await generateImageBytes("Texas civic voting place", "no text", CLOUDFLARE_IMAGE_QUALITY_MODEL);
    expect(bytes.length).toBe(4);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(String(fetcher.mock.calls[1][0])).toContain(CLOUDFLARE_IMAGE_MODEL);
    const form = fetcher.mock.calls[1][1]?.body;
    expect(form?.get("prompt")).toContain("PROVIDER-SAFETY REFRAME");
  });
});
