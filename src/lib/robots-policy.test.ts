import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const dynamicRobotsPath = join(ROOT, "src/routes/robots[.]txt.ts");
const staticRobotsPath = join(ROOT, "public/robots.txt");

describe("robots policy", () => {
  it("has one repository source of truth", () => {
    expect(existsSync(dynamicRobotsPath)).toBe(true);
    expect(existsSync(staticRobotsPath)).toBe(false);
  });

  it("explicitly names Google Merchant crawlers in the shared group", () => {
    const source = readFileSync(dynamicRobotsPath, "utf8");
    expect(source).toContain('"Googlebot"');
    expect(source).toContain('"Googlebot-Image"');
    expect(source).toContain('"Storebot-Google"');
    expect(source).toContain('"User-agent: *"');
    expect(source).toContain('"Allow: /"');
  });

  it("explicitly names AI discovery, training, and user-fetch crawlers in the shared group", () => {
    const source = readFileSync(dynamicRobotsPath, "utf8");
    for (const agent of [
      "OAI-SearchBot",
      "GPTBot",
      "ChatGPT-User",
      "ClaudeBot",
      "Claude-Web",
      "anthropic-ai",
      "PerplexityBot",
      "Perplexity-User",
      "Google-Extended",
      "Applebot-Extended",
      "Bytespider",
      "Meta-ExternalAgent",
    ]) {
      expect(source).toContain(`"${agent}"`);
    }
  });

  it("keeps the first-party Merchant image endpoint crawlable", () => {
    const source = readFileSync(dynamicRobotsPath, "utf8");
    expect(source).not.toContain("Disallow: /merchant-image");
  });
});