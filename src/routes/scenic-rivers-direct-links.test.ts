import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(HERE, "explore.scenic-rivers.tsx"), "utf8");

describe("scenic-rivers ownership handoffs", () => {
  it("links Explore navigation directly to TexasDefined", () => {
    expect(source).toContain("https://texasdefined.com/explore");
    expect(source).toContain("https://texasdefined.com/explore/search?activities=paddling");
    expect(source).toContain("https://texasdefined.com/explore/trip-planner");
    expect(source).not.toContain('to="/explore"');
    expect(source).not.toContain('to="/explore/search"');
    expect(source).not.toContain('to="/explore/trip-planner"');
  });
});
