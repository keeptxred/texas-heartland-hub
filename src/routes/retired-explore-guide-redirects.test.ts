import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const CASES = [
  ["explore.texas-state-parks-guide.tsx", "/explore/texas-state-parks-guide"],
  ["explore.texas-lakes-guide.tsx", "/explore/texas-lakes-guide"],
  ["explore.texas-camping-guide.tsx", "/explore/texas-camping-guide"],
  ["explore.texas-scenic-drives.tsx", "/explore/texas-scenic-drives"],
] as const;

describe("retired KeepTXRed Explore guide routes", () => {
  it.each(CASES)("redirects %s to the same canonical path on TexasDefined", (file, route) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(`createFileRoute(\"${route}\")`);
    expect(source).toContain(`https://texasdefined.com${route}`);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
    expect(source).not.toContain("buildSeo");
  });
});
