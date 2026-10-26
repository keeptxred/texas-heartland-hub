import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const directory = "src/data";
const authorityPaths = readdirSync(directory)
  .filter((name) => /^law-topic-[a-z0-9-]+-authority\.ts$/.test(name))
  .sort();

describe("Texas law authority reader-facing content", () => {
  it("keeps the complete public module inventory free of editor instructions", () => {
    expect(authorityPaths.length).toBeGreaterThanOrEqual(18);
    for (const filename of authorityPaths) {
      const source = readFileSync(`${directory}/${filename}`, "utf8");
      expect(source, filename).not.toMatch(/\b(?:KTR|Keep TX Red)[^."\n]{0,180}\bshould\b/i);
      expect(source, filename).not.toMatch(/\b(?:Permanent KTR|When KTR reports|For permanent KTR coverage|A complete KTR rule history)\b/i);
    }
  });

  it("states all three statutory exceptions to the usual 20-day agency rule filing clock", () => {
    const source = readFileSync(
      `${directory}/law-topic-administrative-rulemaking-authority.ts`, "utf8",
    );
    expect(source).toContain("Government Code Section 2001.036");
    expect(source).toContain("20 days after filing");
    expect(source).toMatch(/later effective date/i);
    expect(source).toMatch(/emergency\/imminent-peril/);
    expect(source).toMatch(/federal law requires a different date/);
    expect(source).toContain("https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2001.htm");
  });
});
