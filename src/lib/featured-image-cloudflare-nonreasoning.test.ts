import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Cloudflare featured-image vision validator", () => {
  it("uses the non-reasoning Mistral vision model with direct JSON guidance", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const start = source.indexOf("export async function validateImageMatchesArticle");
    const validator = source.slice(start);

    expect(source).toContain('@cf/mistralai/mistral-small-3.1-24b-instruct');
    expect(source).not.toContain('@cf/google/gemma-4-26b-a4b-it');
    expect(validator).toContain("guided_json: verdictSchema");
    expect(validator).toContain("max_tokens: 256");
    expect(validator).not.toContain("reasoning_effort");
    expect(validator).not.toContain("max_completion_tokens");
  });
});
