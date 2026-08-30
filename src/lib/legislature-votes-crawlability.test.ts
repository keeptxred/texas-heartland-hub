import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/routes/texas-legislature.votes.tsx", "utf8");

describe("legislative vote reference crawlability", () => {
  it("does not turn normalized-data query failures into route-level SSR errors", () => {
    expect(source).not.toContain("throw voteError");
    expect(source).not.toContain("throw billError");
    expect(source).toContain("dataUnavailable: true");
  });

  it("keeps source-backed static reference content available during data outages", () => {
    expect(source).toContain("Texas Legislative Committee Vote Records");
    expect(source).toContain("Live normalized vote records are temporarily unavailable");
    expect(source).toContain("Texas Legislature Online");
  });
});
