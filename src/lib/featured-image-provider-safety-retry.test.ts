import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildImageSafetyRetryPrompt,
  generateImageBytes,
  isCloudflareImageSafetyRejection,
} from "./featured-image-cloudflare";

const originalAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const originalApiToken = process.env.CLOUDFLARE_API_TOKEN;

beforeEach(() => {
  process.env.CLOUDFLARE_ACCOUNT_ID = "test-account";
  process.env.CLOUDFLARE_API_TOKEN = "test-token";
});

afterEach(() => {
  if (originalAccountId == null) delete process.env.CLOUDFLARE_ACCOUNT_ID;
  else process.env.CLOUDFLARE_ACCOUNT_ID = originalAccountId;
  if (originalApiToken == null) delete process.env.CLOUDFLARE_API_TOKEN;
  else process.env.CLOUDFLARE_API_TOKEN = originalApiToken;
  vi.unstubAllGlobals();
});

describe("featured-image provider safety retry", () => {
  it("recognizes Cloudflare moderation rejections without treating ordinary client errors as safety events", () => {
    expect(isCloudflareImageSafetyRejection(400, "AiError: Your output has been flagged. Please choose another prompt / input image combination")).toBe(true);
    expect(isCloudflareImageSafetyRejection(422, "content filter blocked the request")).toBe(true);
    expect(isCloudflareImageSafetyRejection(400, "invalid width parameter")).toBe(false);
    expect(isCloudflareImageSafetyRejection(429, "safety filter")).toBe(false);
  });

  it("reframes a flagged public-figure broadcast story as a neutral physical broadcast scene", () => {
    const safe = buildImageSafetyRetryPrompt(
      "Jimmy Kimmel won't air James Talarico interview due to FCC threats after discussion of the assassination of Charlie Kirk",
    );

    expect(safe).toContain("broadcast studio");
    expect(safe).toContain("Show no named, recognizable, or identifiable person");
    expect(safe).not.toMatch(/Jimmy Kimmel|James Talarico|Charlie Kirk|assassination|threats?/i);
    expect(safe).not.toMatch(/logo|seal/i);
  });

  it("automatically retries a provider-flagged generation with the sanitized topical prompt", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(
        JSON.stringify({ errors: [{ message: "AiError: Your output has been flagged. Please choose another prompt / input image combination" }] }),
        { status: 400, headers: { "content-type": "application/json" } },
      ))
      .mockResolvedValueOnce(new Response(
        new Uint8Array([0xff, 0xd8, 0xff, 0xd9]),
        { status: 200, headers: { "content-type": "image/jpeg" } },
      ));
    vi.stubGlobal("fetch", fetchMock);

    const bytes = await generateImageBytes(
      "Jimmy Kimmel won't air James Talarico interview due to FCC threats after discussion of the assassination of Charlie Kirk",
      "logos, readable text",
    );

    expect([...bytes]).toEqual([0xff, 0xd8, 0xff, 0xd9]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const secondInit = fetchMock.mock.calls[1]?.[1] as RequestInit | undefined;
    expect(secondInit?.body).toBeInstanceOf(FormData);
    const submittedPrompt = String((secondInit?.body as FormData).get("prompt"));
    expect(submittedPrompt).toContain("broadcast studio");
    expect(submittedPrompt).not.toMatch(/Jimmy Kimmel|James Talarico|Charlie Kirk|assassination|threats?/i);
  });
});
