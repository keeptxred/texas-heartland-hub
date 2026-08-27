import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const extraProfiles = readFileSync(new URL("../data/agency-authority-extra.ts", import.meta.url), "utf8");

describe("agency authority canonical links", () => {
  it("links TPWD directly to the canonical Texas water policy guide", () => {
    expect(extraProfiles).not.toContain('href: "/texas-water"');
    expect(extraProfiles).toContain('href: "/issues/texas-water-policy"');
  });
});
