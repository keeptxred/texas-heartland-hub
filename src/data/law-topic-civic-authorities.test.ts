import { describe, expect, it } from "vitest";
import { ELECTION_LAW_TOPIC } from "@/data/law-topic-election-authority";
import { OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC } from "@/data/law-topic-open-records-authority";
import { ADMINISTRATIVE_RULEMAKING_LAW_TOPIC } from "@/data/law-topic-administrative-rulemaking-authority";
import { LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC } from "@/data/law-topic-local-government-authority";
import { LAW_TOPIC_AUTHORITIES } from "@/data/law-topic-authorities";
import { isLawTopicIndexable, MIN_LAW_TOPIC_WORDS } from "@/lib/law-topic-indexability";

const civicAuthorities = [
  ELECTION_LAW_TOPIC,
  OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC,
  ADMINISTRATIVE_RULEMAKING_LAW_TOPIC,
  LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC,
] as const;

describe("civic Law Library authorities", () => {
  it("promotes all four civic topics through the unchanged readiness gate", () => {
    expect(MIN_LAW_TOPIC_WORDS).toBe(700);
    expect(civicAuthorities).toHaveLength(4);
    for (const topic of civicAuthorities) {
      expect(isLawTopicIndexable(topic)).toBe(true);
      expect(LAW_TOPIC_AUTHORITIES.some((authority) => authority.slug === topic.slug)).toBe(true);
    }
  });

  it("preserves current 2026 election-law anchors", () => {
    const text = [ELECTION_LAW_TOPIC.quickAnswer, ...ELECTION_LAW_TOPIC.framework, ...ELECTION_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("October 19");
    expect(text).toContain("October 30");
    expect(text).toContain("October 23");
    expect(text).toContain("7:00 a.m. to 7:00 p.m.");
    expect(text).toContain("Chapter 221");
  });

  it("keeps the Public Information Act ruling deadline distinct from production timing", () => {
    const text = [OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC.quickAnswer, ...OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC.framework, ...OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("ten business days");
    expect(text).toContain("not a universal rule");
    expect(text).toContain("existing information");
    expect(text).toContain("Section 552.301");
  });

  it("keeps proposal, adoption, effectiveness and codification distinct", () => {
    const text = [ADMINISTRATIVE_RULEMAKING_LAW_TOPIC.quickAnswer, ...ADMINISTRATIVE_RULEMAKING_LAW_TOPIC.framework, ...ADMINISTRATIVE_RULEMAKING_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("proposed rule is not");
    expect(text).toContain("20 days after filing");
    expect(text).toContain("Texas Administrative Code");
    expect(text).toContain("Section 2001.039");
  });

  it("keeps home-rule, general-law, county and special-district authority separate", () => {
    const text = [LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.quickAnswer, ...LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.framework, ...LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("Section 51.072");
    expect(text).toContain("general-law");
    expect(text).toContain("counties");
    expect(text).toContain("special districts");
    expect(text).toContain("preemption");
  });

  it("uses primary Texas government sources throughout the batch", () => {
    for (const topic of civicAuthorities) {
      expect(topic.sources.length).toBeGreaterThanOrEqual(5);
      expect(topic.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(topic.updated).toBe("2026-09-06");
    }
  });
});
