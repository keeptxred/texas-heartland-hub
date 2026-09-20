import { describe, expect, it } from "vitest";
import { extractCloudflareVisionOutput } from "./featured-image-cloudflare";

describe("Gemma vision response parsing", () => {
  it("extracts structured content from chat-completion choices", () => {
    const verdict = { matches: true, photorealistic: true, reason: "Direct courthouse match" };
    const result = extractCloudflareVisionOutput({
      choices: [{ finish_reason: "stop", message: { content: verdict, reasoning_content: "internal reasoning" } }],
    });

    expect(result.output).toEqual(verdict);
    expect(result.finishReason).toBe("stop");
  });

  it("preserves the finish reason when completion content is empty", () => {
    const result = extractCloudflareVisionOutput({
      choices: [{ finish_reason: "length", message: { content: "", reasoning_content: "reasoning used the budget" } }],
    });

    expect(result.output).toBe("");
    expect(result.finishReason).toBe("length");
  });
});