import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./explore.scenic-rivers.tsx", import.meta.url), "utf8");

describe("retired KeepTXRed Scenic Rivers route", () => {
  it("redirects the canonical lifestyle guide to TexasDefined", () => {
    expect(source).toContain('createFileRoute("/explore/scenic-rivers")');
    expect(source).toContain("https://texasdefined.com/explore/scenic-rivers");
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
    expect(source).not.toContain("buildSeo");
    expect(source).not.toContain("https://keeptxred.com/explore");
  });
});
