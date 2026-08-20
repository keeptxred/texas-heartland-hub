import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS, getTexasCasePosition } from "@/data/texas-case-all";
import { TEXAS_CASE_FACTS } from "@/data/texas-case-facts";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

describe("AdSense Texas Case and agency readiness inventory", () => {
  it("keeps sitemap-advertised Texas Case editorial positions substantive and sourced", () => {
    const violations = TEXAS_CASE_POSITIONS.flatMap((position) => {
      const count = words([
        position.title, position.dek, position.stance,
        ...position.keyPoints, ...position.intro,
        ...position.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
      ].join(" "));
      const blockers = [
        count < 1000 ? `words=${count}<1000` : "",
        position.sources.length < 3 ? `sources=${position.sources.length}<3` : "",
        position.sections.length < 4 ? `sections=${position.sections.length}<4` : "",
      ].filter(Boolean);
      return blockers.length ? [`${position.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });

  it("keeps sitemap-advertised Texas Case factual companions substantive and source-backed", () => {
    const violations = TEXAS_CASE_FACTS.flatMap((facts) => {
      const position = getTexasCasePosition(facts.slug);
      const count = words([facts.title, facts.dek, ...facts.overview, ...facts.framework, ...facts.keyQuestions].join(" "));
      const sourceCount = position?.sources.length ?? 0;
      const blockers = [
        count < 700 ? `words=${count}<700` : "",
        sourceCount < 3 ? `sources=${sourceCount}<3` : "",
        facts.overview.length < 2 ? `overview=${facts.overview.length}<2` : "",
        facts.framework.length < 4 ? `framework=${facts.framework.length}<4` : "",
        facts.keyQuestions.length < 3 ? `questions=${facts.keyQuestions.length}<3` : "",
      ].filter(Boolean);
      return blockers.length ? [`${facts.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });

  it("keeps sitemap-advertised agency authority profiles substantive and primary-source backed", () => {
    const violations = AGENCY_AUTHORITY_PROFILES.flatMap((profile) => {
      const count = words([
        profile.name, profile.dek, profile.quickAnswer, profile.authority,
        ...profile.responsibilities, ...profile.notResponsibleFor,
        ...profile.accountability, ...profile.programs,
      ].join(" "));
      const primarySources = profile.sources.filter((source) => source.primary).length;
      const blockers = [
        count < 700 ? `words=${count}<700` : "",
        primarySources < 3 ? `primarySources=${primarySources}<3` : "",
        profile.responsibilities.length < 4 ? `responsibilities=${profile.responsibilities.length}<4` : "",
        profile.notResponsibleFor.length < 3 ? `notResponsibleFor=${profile.notResponsibleFor.length}<3` : "",
        profile.accountability.length < 3 ? `accountability=${profile.accountability.length}<3` : "",
      ].filter(Boolean);
      return blockers.length ? [`${profile.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
