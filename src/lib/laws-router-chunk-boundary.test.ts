import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const vite = readFileSync("vite.config.ts", "utf8");

describe("KeepTXRed client route bundle boundaries", () => {
  it("enables TanStack's default noncritical route component splitting", () => {
    expect(vite).toContain("autoCodeSplitting: true");
    expect(vite).toContain('routeFileIgnorePattern:');
    // No global loader split: keep SSR/data loading in the initial route config.
    expect(vite).not.toContain("codeSplittingOptions:");
    expect(vite).not.toContain("cssCodeSplit: false");
  });
});
