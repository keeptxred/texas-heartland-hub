import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures";
import { withPoliticalFigureDepthSupplements } from "@/data/texas-political-figure-depth-supplements";

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const renderedProfiles = TEXAS_POLITICAL_FIGURES.map(withPoliticalFigureDepthSupplements);

describe("Texas political figure evergreen depth", () => {
  expect(renderedProfiles).toHaveLength(10);

  it.each(renderedProfiles)("keeps $name substantive rather than thin", (figure) => {
    expect(figure.description.length, `${figure.slug}: description`).toBeGreaterThanOrEqual(100);
    expect(figure.sections.length, `${figure.slug}: section count`).toBeGreaterThanOrEqual(6);
    expect(figure.relatedLinks.length, `${figure.slug}: related links`).toBeGreaterThanOrEqual(3);

    const totalWords = figure.sections.reduce((sum, section) => sum + words(section.body), 0);
    expect(totalWords, `${figure.slug}: section word count`).toBeGreaterThanOrEqual(450);

    for (const section of figure.sections) {
      expect(section.heading.length, `${figure.slug}: heading`).toBeGreaterThanOrEqual(12);
      expect(words(section.body), `${figure.slug}: ${section.heading}`).toBeGreaterThanOrEqual(55);
    }
  });

  it.each(renderedProfiles)("keeps $name section headings unique", (figure) => {
    const headings = figure.sections.map((section) => section.heading.toLowerCase());
    expect(new Set(headings).size, figure.slug).toBe(headings.length);
  });
});
