import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("./explore.texas-dark-sky-stargazing.tsx", import.meta.url),
  "utf8",
);

describe("retired KeepTXRed Dark Sky route", () => {
  it("redirects the canonical lifestyle guide to TexasDefined", () => {
    expect(source).toContain('createFileRoute("/explore/texas-dark-sky-stargazing")');
    expect(source).toContain("https://texasdefined.com/explore/texas-dark-sky-stargazing");
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
    expect(source).not.toContain("buildSeo");
    expect(source).not.toContain("https://keeptxred.com/explore");
  });
});
