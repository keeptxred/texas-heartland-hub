import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { buildFlux2ImageRequest, buildFluxImagePrompt, buildFluxImageRequest } from "./featured-image-cloudflare";

describe("Cloudflare featured-image payload", () => {
  it("uses FLUX 2 multipart generation with a supported Schnell fallback", () => {
    const source = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const requestStart = source.indexOf("export function buildFluxImageRequest");
    const generateStart = source.indexOf("export async function generateImageBytes");
    const validatorStart = source.indexOf("export async function validateImageMatchesArticle");
    const requestSource = source.slice(requestStart, generateStart);
    const generateImageSource = source.slice(generateStart, validatorStart);
    const fallbackRequest = buildFluxImageRequest("Texas preparedness supplies", "people, illustration");
    const qualityRequest = buildFlux2ImageRequest("Texas preparedness supplies", "people, illustration");

    expect(source).toContain('@cf/black-forest-labs/flux-2-klein-4b');
    expect(source).toContain('@cf/black-forest-labs/flux-1-schnell');
    expect(requestSource).toContain("buildFluxImagePrompt");
    expect(requestSource).toContain('form.append("guidance", "5.5")');
    expect(requestSource).toContain('form.append("width", "1024")');
    expect(requestSource).toContain('form.append("height", "768")');
    expect(qualityRequest.get("guidance")).toBe("5.5");
    expect(qualityRequest.get("width")).toBe("1024");
    expect(qualityRequest.get("height")).toBe("768");
    expect(fallbackRequest).toEqual(expect.objectContaining({ steps: 8 }));
    expect(fallbackRequest).not.toHaveProperty("seed");
    expect(generateImageSource).toContain("CLOUDFLARE_IMAGE_FALLBACK_MODEL");
    expect(generateImageSource).not.toMatch(/\bnegative_prompt\s*:/);
    expect(generateImageSource).not.toContain("dreamshaper-8-lcm");
    expect(generateImageSource).toContain('contentType.startsWith("image/")');
  });

  it("reserves prompt space for photographic lock and hard exclusions", () => {
    const longStoryPrompt = `Story-specific material ${"details ".repeat(500)}`;
    const negativePrompt = "illustration, cartoon, vector art, graphic design, infographic, poster, text, headline, caption, watermark, logo, collage, CGI, concept art";
    const prompt = buildFluxImagePrompt(longStoryPrompt, negativePrompt);

    expect(prompt.length).toBeLessThanOrEqual(2048);
    expect(prompt).toMatch(/^REAL CAMERA PHOTOGRAPH ONLY\./);
    expect(prompt).toContain("No readable text");
    expect(prompt).toContain("EDITORIAL ASSIGNMENT:");
    expect(prompt).toContain("HARD EXCLUSIONS:");
    expect(prompt).toContain("illustration");
    expect(prompt).toContain("graphic design");
    expect(prompt).toContain("logo");
  });

  it("requests, normalizes, and parses a structured JSON verdict from Cloudflare vision", () => {
    const runtime = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const core = fs.readFileSync(new URL("./featured-image-core.ts", import.meta.url), "utf8");
    const start = runtime.indexOf("export async function validateImageMatchesArticle");
    const validatorSource = runtime.slice(start);

    expect(core).toContain("export function parseVisionVerdict");
    expect(validatorSource).toContain("guided_json: verdictSchema");
    expect(validatorSource).toContain('matches: { type: "boolean" }');
    expect(validatorSource).toContain('photorealistic: { type: "boolean" }');
    expect(validatorSource).toContain('required: ["matches", "photorealistic", "reason"]');
    expect(validatorSource).toContain("max_tokens: 256");
    expect(validatorSource).toContain("normalizeCloudflareVisionVerdictOutput(output)");
    expect(validatorSource).toContain("parseVisionVerdict(normalizedOutput)");
    expect(validatorSource).toContain("imageValidationDomainGuidance(subject)");
    expect(runtime).toContain("a believable photorealistic courthouse exterior or courtroom interior IS a valid direct story match");
  });

  it("accepts representative political editorial photography without demanding an exact event recreation", () => {
    const runtime = fs.readFileSync(new URL("./featured-image-cloudflare.ts", import.meta.url), "utf8");
    const start = runtime.indexOf("export async function validateImageMatchesArticle");
    const validatorSource = runtime.slice(start);

    expect(runtime).toContain('subject.domain === "politics"');
    expect(runtime).toContain("do NOT require a recognizable likeness of a named politician");
    expect(runtime).toContain("the exact date");
    expect(runtime).toContain("policy-impact setting");
    expect(validatorSource).toContain("Do not require it to prove that it was captured at the exact historical event");
    expect(validatorSource).toContain("Judge topical relevance and photorealism, not whether a generated editorial image proves an exact historical moment");
  });
});
