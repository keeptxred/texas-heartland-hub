import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/issue-guides[.]txt.ts", import.meta.url), "utf8");

describe("issue guide machine-readable manifest", () => {
  it("uses the canonical issue registry and preserves authority-layer separation", () => {
    expect(source).toContain('import { issueGuides } from "@/data/issue-guides"');
    expect(source).toContain('createFileRoute("/issue-guides.txt")');
    expect(source).toContain("Current-status policy trackers");
    expect(source).toContain("Transparent policy arithmetic");
    expect(source).toContain("Primary-source navigation");
    expect(source).toContain("Editorial positions");
  });

  it("publishes a plain-text response with short shared-cache freshness", () => {
    expect(source).toContain('Content-Type": "text/plain; charset=utf-8"');
    expect(source).toContain('Cache-Control": "public, max-age=300, s-maxage=300"');
    expect(source).toContain("...issueGuides.map");
  });
});
