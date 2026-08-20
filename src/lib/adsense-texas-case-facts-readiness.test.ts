import { describe, expect, it } from "vitest";
import { TEXAS_CASE_FACTS } from "@/data/texas-case-facts";
import { getTexasCasePosition } from "@/data/texas-case-all";

const MIN_RENDERED_WORDS = 700;
const FIXED_RENDERED_COPY = `
Facts first. This page is the factual companion to a separately labeled KTR editorial position. It summarizes the legal and administrative framework, identifies questions worth verifying, and links to primary sources. It does not ask the reader to adopt KTR's editorial conclusion.
Primary sources. Start with the official record.
Separate editorial. Read KTR's position. The opinion page states KTR's conclusion and argument. This facts page remains the reference layer underneath it.
Reference library. Browse all Facts & Framework pages. Compare the legal and administrative frameworks behind all of The Texas Case topics.
Reference standard: Laws, agency roles, court rulings, eligibility rules, and program details can change. Follow the linked primary sources for the current controlling record and treat this page as an orientation layer rather than legal advice.
`;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function renderedWordCount(slug: string) {
  const facts = TEXAS_CASE_FACTS.find((item) => item.slug === slug)!;
  const position = getTexasCasePosition(slug);
  return words([
    facts.title,
    facts.dek,
    ...facts.overview,
    ...facts.framework,
    ...facts.keyQuestions,
    ...(position?.sources.map((source) => source.label) ?? []),
    FIXED_RENDERED_COPY,
  ].join(" "));
}

describe("AdSense Texas Case facts readiness inventory", () => {
  it("keeps every sitemap-advertised facts page substantive and source-backed", () => {
    const violations = TEXAS_CASE_FACTS.flatMap((facts) => {
      const position = getTexasCasePosition(facts.slug);
      const blockers: string[] = [];
      const count = renderedWordCount(facts.slug);
      if (count < MIN_RENDERED_WORDS) blockers.push(`words=${count}<${MIN_RENDERED_WORDS}`);
      if (!position) blockers.push("missing-position");
      else if (position.sources.length < 3) blockers.push(`sources=${position.sources.length}<3`);
      if (facts.overview.length < 3) blockers.push(`overview=${facts.overview.length}<3`);
      if (facts.framework.length < 4) blockers.push(`framework=${facts.framework.length}<4`);
      if (facts.keyQuestions.length < 4) blockers.push(`questions=${facts.keyQuestions.length}<4`);
      return blockers.length ? [`${facts.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
