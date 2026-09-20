import { describe, expect, it } from "vitest";
import { GUN_CARRY_LAW_TOPIC } from "@/data/law-topic-gun-carry-authority";
import { SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC } from "@/data/law-topic-self-defense-authority";
import { PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC } from "@/data/law-topic-parental-rights-education-authority";
import { EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC } from "@/data/law-topic-eminent-domain-authority";
import { LAW_TOPIC_AUTHORITIES } from "@/data/law-topic-authorities";
import { isLawTopicIndexable, MIN_LAW_TOPIC_WORDS } from "@/lib/law-topic-indexability";

const rightsAuthorities = [
  GUN_CARRY_LAW_TOPIC,
  SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC,
  PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC,
  EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC,
] as const;

describe("rights and property Law Library authorities", () => {
  it("promotes all four topics through the unchanged readiness gate", () => {
    expect(MIN_LAW_TOPIC_WORDS).toBe(700);
    expect(rightsAuthorities).toHaveLength(4);
    for (const topic of rightsAuthorities) {
      expect(isLawTopicIndexable(topic)).toBe(true);
      expect(LAW_TOPIC_AUTHORITIES.some((authority) => authority.slug === topic.slug)).toBe(true);
    }
  });

  it("keeps permitless carry, licensed carry, location rules and use of force separate", () => {
    const text = [GUN_CARRY_LAW_TOPIC.quickAnswer, ...GUN_CARRY_LAW_TOPIC.framework, ...GUN_CARRY_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("did not repeal the LTC program");
    expect(text).toContain("Section 46.03");
    expect(text).toContain("Section 411.2031");
    expect(text.toLowerCase()).toContain("use of force");
  });

  it("preserves the conditions and limits of Texas self-defense law", () => {
    const text = [SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC.quickAnswer, ...SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC.framework, ...SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("Section 9.31");
    expect(text).toContain("Section 9.32");
    expect(text).toContain("Verbal provocation alone");
    expect(text).toContain("duty to retreat");
    expect(text).toContain("Section 9.42");
  });

  it("anchors parental-rights coverage to current Chapter 26 and TEA implementation", () => {
    const text = [PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC.quickAnswer, ...PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC.framework, ...PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("Section 26.0025");
    expect(text).toContain("Parental Rights Handbook");
    expect(text).toContain("SB 12");
    expect(text).toContain("federal law");
  });

  it("keeps condemnation authority, offer procedure and compensation stages distinct", () => {
    const text = [EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC.quickAnswer, ...EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC.framework, ...EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("Section 2206.001");
    expect(text).toContain("bona fide offer");
    expect(text).toContain("30 days");
    expect(text).toContain("seven days");
    expect(text).toContain("special commissioners");
  });

  it("uses current primary and official Texas sources throughout the batch", () => {
    for (const topic of rightsAuthorities) {
      expect(topic.sources.length).toBeGreaterThanOrEqual(5);
      expect(topic.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(topic.updated).toBe("2026-09-06");
    }
  });
});
