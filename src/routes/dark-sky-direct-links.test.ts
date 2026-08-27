import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(HERE, "explore.texas-dark-sky-stargazing.tsx"), "utf8");

describe("dark-sky Explore ownership handoffs", () => {
  it("routes lifestyle planning links directly to TexasDefined", () => {
    for (const href of [
      "https://texasdefined.com/explore/trip-planner",
      "https://texasdefined.com/explore/search?activities=camping",
      "https://texasdefined.com/explore/texas-scenic-drives",
      "https://texasdefined.com/explore/texas-state-parks-guide",
      "https://texasdefined.com/explore/caverns",
      "https://texasdefined.com/explore/texas-wildflower-seasons",
    ]) expect(source).toContain(href);

    expect(source).not.toContain('to="/explore/trip-planner"');
    expect(source).not.toContain('to="/explore/search"');
    expect(source).not.toContain('to="/explore/texas-scenic-drives"');
    expect(source).not.toContain('to="/explore/texas-state-parks-guide"');
    expect(source).not.toContain('to="/explore/caverns"');
    expect(source).not.toContain('to="/explore/texas-wildflower-seasons"');
  });
});
