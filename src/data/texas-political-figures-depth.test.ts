import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures";

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

describe("Texas political figure evergreen depth", () => {
  it("keeps the original profiles substantive rather than thin", () => {
    expect(TEXAS_POLITICAL_FIGURES).toHaveLength(10);

    for (const figure of TEXAS_POLITICAL_FIGURES) {
      expect(figure.description.length, `${figure.slug}: description`).toBeGreaterThanOrEqual(100);
      expect(figure.sections.length, `${figure.slug}: section count`).toBeGreaterThanOrEqual(6);
      expect(figure.relatedLinks.length, `${figure.slug}: related links`).toBeGreaterThanOrEqual(3);

      const totalWords = figure.sections.reduce((sum, section) => sum + words(section.body), 0);
      expect(totalWords, `${figure.slug}: section word count`).toBeGreaterThanOrEqual(450);

      for (const section of figure.sections) {
        expect(section.heading.length, `${figure.slug}: heading`).toBeGreaterThanOrEqual(12);
        expect(words(section.body), `${figure.slug}: ${section.heading}`).toBeGreaterThanOrEqual(55);
      }
    }
  });

  it("does not duplicate section headings within a profile", () => {
    for (const figure of TEXAS_POLITICAL_FIGURES) {
      const headings = figure.sections.map((section) => section.heading.toLowerCase());
      expect(new Set(headings).size, figure.slug).toBe(headings.length);
    }
  });
});
