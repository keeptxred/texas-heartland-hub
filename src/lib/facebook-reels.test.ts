import { describe, expect, it } from "vitest";
import {
  isSupportedReelContentType,
  isSupportedReelFilename,
  MAX_REEL_BYTES,
  normalizeHostedReelUrl,
  validateReelFile,
} from "@/lib/facebook-reels";

describe("facebook reels", () => {
  it("accepts only credential-free HTTPS hosted URLs", () => {
    expect(normalizeHostedReelUrl("https://cdn.example.com/reel.mp4")).toBe("https://cdn.example.com/reel.mp4");
    expect(normalizeHostedReelUrl("http://cdn.example.com/reel.mp4")).toBeNull();
    expect(normalizeHostedReelUrl("https://user:pass@cdn.example.com/reel.mp4")).toBeNull();
    expect(normalizeHostedReelUrl("not a url")).toBeNull();
  });

  it("accepts MP4 and MOV content types and filenames", () => {
    expect(isSupportedReelContentType("video/mp4")).toBe(true);
    expect(isSupportedReelContentType("video/mp4; charset=binary")).toBe(true);
    expect(isSupportedReelContentType("video/quicktime")).toBe(true);
    expect(isSupportedReelContentType("video/webm")).toBe(false);
    expect(isSupportedReelFilename("reel.MP4")).toBe(true);
    expect(isSupportedReelFilename("reel.mov")).toBe(true);
    expect(isSupportedReelFilename("reel.webm")).toBe(false);
  });

  it("rejects empty, oversized, and unsupported uploads", () => {
    expect(validateReelFile(new File([], "empty.mp4", { type: "video/mp4" }))).toBe("Reel file is empty.");
    expect(
      validateReelFile(
        new File([new Uint8Array(1)], "reel.webm", { type: "video/webm" }),
      ),
    ).toBe("Reel must be an MP4 or MOV video.");

    const oversized = {
      size: MAX_REEL_BYTES + 1,
      type: "video/mp4",
      name: "huge.mp4",
    } as File;
    expect(validateReelFile(oversized)).toContain("publisher limit");
  });
});
