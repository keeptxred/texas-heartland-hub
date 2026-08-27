import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(HERE, "EntityCard.tsx"), "utf8");

describe("Explore destination card routing", () => {
  it("routes verified typed destination families directly to TexasDefined", () => {
    expect(source).toContain("https://texasdefined.com/explore/state-park/${entity.slug}");
    expect(source).toContain("https://texasdefined.com/explore/lake/${entity.slug}");
    expect(source).toContain("https://texasdefined.com/explore/river/${entity.slug}");
    expect(source).toContain("https://texasdefined.com/explore/cavern/${entity.slug}");
  });

  it("keeps unverified entity types on the existing KTR generic destination path", () => {
    expect(source).toContain("return `/explore/${entity.slug}`");
    expect(source).not.toContain('to="/explore/$slug"');
  });
});
