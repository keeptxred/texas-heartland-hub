import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/laws.index.tsx", import.meta.url), "utf8");

describe("laws hub canonical discovery links", () => {
  it("links the Texas Laws Explained section directly to the canonical law library", () => {
    expect(source).toContain('hubHref: "/laws/topics"');
    expect(source).not.toContain('hubHref: "/texas-laws"');
  });
});
