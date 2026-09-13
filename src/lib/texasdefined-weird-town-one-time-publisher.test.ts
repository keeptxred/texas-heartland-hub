import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const routePath = path.join(
  process.cwd(),
  "src/routes/api/public/hooks/publish-texasdefined-weird-town-once.ts",
);
const source = fs.readFileSync(routePath, "utf8");

describe("one-time TexasDefined weird-town Facebook publisher", () => {
  it("accepts only the signed TexasDefined one-time push workflow", () => {
    for (const marker of [
      'const OIDC_AUDIENCE = "keeptxred-facebook"',
      'const REPOSITORY = "keeptxred/TexasDefined"',
      'const WORKFLOW_PATH = ".github/workflows/one-time-weird-town-facebook.yml"',
      'allowedEventNames: ["push"]',
      'typeof claims.run_id !== "string"',
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("hard-codes the approved article, image, and Facebook copy", () => {
    for (const marker of [
      "weirdest-town-names-in-texas-and-how-they-got-them",
      "weird-texas-town-names-facebook-2026-09-12.png",
      "Only in Texas can you leave Cut and Shoot, pass Dime Box, wonder if you’re really in Uncertain, and still have Bug Tussle on the map.",
      "We dug into 20 of Texas’s strangest place names.",
      "Which one have you actually been to—and what weird Texas town did we miss?",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("fails closed on duplicates or missing approved image and has no fallback", () => {
    for (const marker of [
      "facebookPostMatchesArticle(post",
      "TexasDefined Facebook duplicate verification failed",
      "Approved TexasDefined weird-town image could not be loaded",
      "text_only_fallback: false",
      "generic_fallback: false",
    ]) {
      expect(source).toContain(marker);
    }
  });
});
