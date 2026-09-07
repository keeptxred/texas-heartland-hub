import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(HERE, "../routes/laws_.constitutional-amendments.tsx"), "utf8");

describe("Texas constitutional amendment authority page", () => {
  it("uses the canonical apex and a current verified date", () => {
    expect(source).toContain("const SITE_URL = 'https://keeptxred.com'");
    expect(source).toContain("const CANONICAL = `${SITE_URL}/laws/constitutional-amendments`");
    expect(source).toContain("verified September 6, 2026");
    expect(source).toContain("dateModified: '2026-09-06'");
  });

  it("grounds the amendment process in primary Texas sources", () => {
    expect(source).toContain("CN.17.pdf");
    expect(source).toContain("legislativeprocess.pdf");
    expect(source).toContain("2026-november-general-election.shtml");
    expect(source).toContain("constitutional-amendment-elections.shtml");
    expect(source).toContain("november-2025-ballot-language-17.pdf");
  });

  it("connects the page to the core law election and legislature authority graph", () => {
    for (const path of [
      "/elections/2026",
      "/texas-legislature",
      "/bills",
      "/laws",
      "texas-constitutional-amendments-guide",
      "texas-election-laws-explained",
    ]) {
      expect(source).toContain(path);
    }
  });

  it("answers the high-intent amendment questions directly", () => {
    expect(source).toContain("Two-thirds");
    expect(source).toContain("Governor approval");
    expect(source).toContain("Texas constitutional amendment FAQ");
    expect(source).toContain("mainEntity: FAQS.map");
  });
});
