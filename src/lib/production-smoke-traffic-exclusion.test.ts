import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
const politicalFiguresWorkflow = readFileSync(
  new URL("../../.github/workflows/verify-political-figures-production.yml", import.meta.url),
  "utf8",
);

describe("production smoke traffic exclusions", () => {
  it("keeps known smoke browsers out of GTM, AdSense, and Infolinks", () => {
    const guard = "u.indexOf('KeepTXRed-')!==-1&&/smoke/i.test(u)";
    expect(root.split(guard).length - 1).toBe(3);
    expect(root).toContain("https://www.googletagmanager.com/gtm.js");
    expect(root).toContain("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
    expect(root).toContain("https://resources.infolinks.com/js/infolinks_main.js");
  });

  it("continues to mark the political-figure browser verifier as smoke traffic", () => {
    expect(politicalFiguresWorkflow).toContain("KeepTXRed-production-smoke/4.0");
    expect(politicalFiguresWorkflow).toContain("headless: true");
  });
});
