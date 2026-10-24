import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/components/law-topic-page.tsx", "utf8");
const sections = [
  "law-quick-answer", "law-who-affected", "law-framework", "law-key-rules",
  "law-questions", "law-sources", "law-related",
];

describe("accessible law topic in-page contents navigation", () => {
  it("uses an accessible navigation landmark with real matching section targets", () => {
    expect(page).toContain('aria-label="On this page"');
    for (const id of sections) {
      expect(page).toContain('#' + id);
      expect(page).toContain('id="' + id + '"');
    }
  });
  it("keeps official sources directly navigable without Javascript", () => {
    expect(page).toContain('href={source.url}');
    expect(page).toContain('id="law-sources"');
    expect(page).toContain("focus-visible:outline");
  });
});
