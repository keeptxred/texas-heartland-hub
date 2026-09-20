import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateImageMatchesArticle } from "./featured-image-cloudflare";
import type { SubjectExtract } from "./featured-image-core";

const subject: SubjectExtract = {
  title: "Texas courthouse ruling",
  firstParagraph: "A Texas court issued a ruling in a civil case.",
  entities: [],
  locations: ["Texas"],
  domain: "legal",
  concreteSubject: "Texas courthouse exterior",
};

function apiResponse(result: unknown, status = 200) {
  return new Response(JSON.stringify(result), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Cloudflare vision validator request recovery", () => {
  beforeEach(() => {
    process.env.CLOUDFLARE_ACCOUNT_ID = "test-account";
    process.env.CLOUDFLARE_API_TOKEN = "test-token";
  });

  afterEach(() => {
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
    delete process.env.CLOUDFLARE_API_TOKEN;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("accepts a valid positive verdict without retrying", async () => {
    const fetchMock = vi.fn().mockResolvedValue(apiResponse({
      success: true,
      result: { response: { matches: true, photorealistic: true, reason: "Direct, photorealistic courthouse scene." } },
    }));
    vi.stubGlobal("fetch", fetchMock);

    const verdict = await validateImageMatchesArticle(new Uint8Array([1, 2, 3]), subject);

    expect(verdict).toEqual({ matches: true, reason: "Direct, photorealistic courthouse scene." });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries malformed model output once before accepting a valid verdict", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(apiResponse({ success: true, result: { response: "The picture looks appropriate." } }))
      .mockResolvedValueOnce(apiResponse({
        success: true,
        result: { response: { matches: true, photorealistic: true, reason: "Recovered structured verdict." } },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const verdict = await validateImageMatchesArticle(new Uint8Array([4, 5, 6]), subject);

    expect(verdict).toEqual({ matches: true, reason: "Recovered structured verdict." });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries transient HTTP failures without accepting the image by default", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(apiResponse({ success: false, errors: [{ message: "temporary model failure" }] }, 503))
      .mockResolvedValueOnce(apiResponse({
        success: true,
        result: { response: { matches: true, photorealistic: true, reason: "Second request passed the same gate." } },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const verdict = await validateImageMatchesArticle(new Uint8Array([7, 8, 9]), subject);

    expect(verdict.matches).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries a timeout-shaped network failure once", async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(abortError)
      .mockResolvedValueOnce(apiResponse({
        success: true,
        result: { response: { matches: true, photorealistic: true, reason: "Retry after timeout passed." } },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const verdict = await validateImageMatchesArticle(new Uint8Array([10, 11, 12]), subject);

    expect(verdict.matches).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry or override a parseable safety rejection", async () => {
    const fetchMock = vi.fn().mockResolvedValue(apiResponse({
      success: true,
      result: { response: { matches: false, photorealistic: false, reason: "Illustration rather than a truthful editorial photograph." } },
    }));
    vi.stubGlobal("fetch", fetchMock);

    const verdict = await validateImageMatchesArticle(new Uint8Array([13, 14, 15]), subject);

    expect(verdict).toEqual({ matches: false, reason: "Illustration rather than a truthful editorial photograph." });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails closed immediately on non-retryable authorization errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(apiResponse({
      success: false,
      errors: [{ message: "unauthorized" }],
    }, 401));
    vi.stubGlobal("fetch", fetchMock);

    const verdict = await validateImageMatchesArticle(new Uint8Array([16, 17, 18]), subject);

    expect(verdict.matches).toBe(false);
    expect(verdict.reason).toContain("Cloudflare vision HTTP 401");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
