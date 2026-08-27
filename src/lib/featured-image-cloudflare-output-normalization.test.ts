import { describe, expect, it } from "vitest";
import { parseVisionVerdict } from "./featured-image-core";
import { normalizeCloudflareVisionVerdictOutput } from "./featured-image-cloudflare";

describe("Cloudflare vision verdict normalization", () => {
  it("accepts the exact Markdown-labeled positive verdict seen in production", () => {
    const normalized = normalizeCloudflareVisionVerdictOutput(
      "**Matches:** Yes **Photorealistic:** Yes **Reason:** The image depicts a believable courtroom scene tied directly to the ruling.",
    );
    expect(parseVisionVerdict(normalized)).toEqual({
      matches: true,
      photorealistic: true,
      reason: "The image depicts a believable courtroom scene tied directly to the ruling.",
    });
  });

  it("accepts equals-style positive verdicts seen in production without weakening the gate", () => {
    const normalized = normalizeCloudflareVisionVerdictOutput(
      "matches=true photorealistic=true reason=The image depicts a realistic courthouse exterior directly representing the judicial story.",
    );
    expect(parseVisionVerdict(normalized)).toEqual({
      matches: true,
      photorealistic: true,
      reason: "The image depicts a realistic courthouse exterior directly representing the judicial story.",
    });
  });

  it("accepts the compact positive production verdict without broadly accepting unlabeled prose", () => {
    const normalized = normalizeCloudflareVisionVerdictOutput(
      "matches, photorealistic, A punter in a football uniform is kicking a football in a stadium setting.",
    );
    expect(parseVisionVerdict(normalized)).toEqual({
      matches: true,
      photorealistic: true,
      reason: "A punter in a football uniform is kicking a football in a stadium setting.",
    });
  });

  it("does not approve contradictory compact verdict prose", () => {
    const mismatch = normalizeCloudflareVisionVerdictOutput(
      "matches, photorealistic, The scene does not match the article subject.",
    );
    const nonPhoto = normalizeCloudflareVisionVerdictOutput(
      "matches, photorealistic, The image is not photorealistic and looks illustrated.",
    );
    expect(parseVisionVerdict(mismatch)).toBeNull();
    expect(parseVisionVerdict(nonPhoto)).toBeNull();
  });

  it("converts numeric and N/A labels into a conservative parseable rejection", () => {
    const normalized = normalizeCloudflareVisionVerdictOutput(
      "Matches: 0 Photorealistic: N/A Reason: The image is not an adequate editorial photograph for this story.",
    );
    expect(parseVisionVerdict(normalized)).toEqual({
      matches: false,
      photorealistic: false,
      reason: "The image is not an adequate editorial photograph for this story.",
    });
  });
});