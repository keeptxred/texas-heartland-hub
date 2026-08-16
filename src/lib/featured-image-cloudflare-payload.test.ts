import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Cloudflare featured-image payload", () => {
  it("does not send unsupported seed input to flux-1-schnell", () => {
    const source = fs.readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
    const start = source.indexOf("async function generateImageBytes");
    const end = source.indexOf("async function validateImageMatchesArticle");
    const generateImageSource = source.slice(start, end);

    expect(generateImageSource).toContain("prompt: prompt.slice(0, 2048)");
    expect(generateImageSource).toContain("steps: 4");
    expect(generateImageSource).not.toMatch(/\bseed\s*:/);
  });
});
