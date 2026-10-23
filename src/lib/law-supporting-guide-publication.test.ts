import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";

const source = readFileSync(new URL("../components/cornerstone-guide-page.tsx", import.meta.url), "utf8");
const guideTypes = readFileSync(new URL("../data/cornerstone-guides.ts", import.meta.url), "utf8");

describe("legal supporting-guide publication date provenance", () => {
  it("does not misrepresent law-guide review dates as publication dates in Article schema", () => {
    expect(source).not.toContain("datePublished: guide.updated,");
    expect(source).toContain("guide.published ? { datePublished: guide.published } : {}");
    expect(source).toContain("dateModified: lawMeta?.lastVerified ?? guide.updated");
  });
  it("supports explicitly verified original publication dates for future guides", () => {
    expect(guideTypes).toContain("published?: string");
    expect(ALL_GUIDES["texas-child-support-guidelines-law"]?.updated).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
  });
});
