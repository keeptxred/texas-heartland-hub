import fs from "node:fs";
import { describe, expect, it } from "vitest";

const files = [
  "../components/city-page.tsx",
  "../routes/texas-government.$entitySlug.tsx",
  "../routes/representatives.$representativeSlug.tsx",
] as const;

describe("authority-page static news indexability", () => {
  it.each(files)("requires static retirement policy in %s", (path) => {
    const source = fs.readFileSync(new URL(path, import.meta.url), "utf8");
    expect(source).toContain('isStaticArticleIndexable');
  });
});
