import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
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

  it("separates the statewide proposition neutrality rule from limited SOS home-rule review", () => {
    const election = ELECTION_LAW_TOPIC;
    const text = [election.quickAnswer, ...election.framework, ...election.keyRules].join(" ");
    expect(text).toContain("Senate Bill 506");
    expect(text).toContain("September 1, 2025");
    expect(text).toContain("Section 52.072(g)");
    expect(text).toContain("Section 273.101");
    expect(text).toContain("seventh day");
    expect(text).toContain("Section 277.005");
    expect(text).toContain("January 1, 2026");
    expect(election.questions.some((q) =>
      q.q.includes("review every ballot proposition") &&
      q.a.includes("home-rule city") &&
      q.a.includes("Section 1.006")
    )).toBe(true);
    expect(election.sources.some((s) =>
      s.url === "https://www.sos.texas.gov/elections/laws/advisory2026-06.shtml"
    )).toBe(true);
    expect(election.updated).toBe("2026-09-06");
  });

  it("keeps the Public Information Act ruling deadline distinct from production timing", () => {
    const text = [OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC.quickAnswer, ...OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC.framework, ...OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("ten business days");
    expect(text).toContain("15th business day");
    expect(text).toContain("Section 552.301(e) and (e-1)");
    expect(text).toContain("not a universal rule");
    expect(text).toContain("existing information");
    expect(text).toContain("Section 552.301");
  });

  it("covers the enacted 2025 Public Information Act response and request-channel amendments", () => {
    const topic = OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC;
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.221(f)");
    expect(text).toContain("Section 552.221(g)");
    expect(text).toContain("House Bill 4219");
    expect(text).toContain("September 1, 2025");
    expect(text).toContain("no later than the 10th business day");
    expect(text).toContain("House Bill 4214");
    expect(text).toContain("June 20, 2025");
    expect(text).toContain("Section 552.234(e) and (f)");
    expect(text).toContain("October 1");
    expect(text).toContain("not a new universal ten-day deadline");
    expect(topic.questions.some((q) =>
      q.q.includes("no records") && q.a.includes("Attorney General directory")
    )).toBe(true);
    expect(topic.sources.some((s) =>
      s.url === "https://statutes.capitol.texas.gov/Docs/GV/pdf/GV.552.pdf"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });

  it("distinguishes precise online public-records production from a generic agency homepage", () => {
    const topic = OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC;
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.221(b-1)");
    expect(text).toContain("exact Internet location");
    expect(text).toContain("identifiable and readily available");
    expect(text).toContain("general home page");
    expect(topic.questions.some((item) =>
      item.q.includes("website link") && item.a.includes("Section 552.221(b-1)")
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });

  it("keeps proposal, adoption, effectiveness and codification distinct", () => {
    const text = [ADMINISTRATIVE_RULEMAKING_LAW_TOPIC.quickAnswer, ...ADMINISTRATIVE_RULEMAKING_LAW_TOPIC.framework, ...ADMINISTRATIVE_RULEMAKING_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("proposed rule is not");
    expect(text).toContain("20 days after filing");
    expect(text).toContain("Texas Administrative Code");
    expect(text).toContain("Section 2001.039");
  });

  it("states the distinct four-year agency rule review clock and limited reset exception", () => {
    const topic = ADMINISTRATIVE_RULEMAKING_LAW_TOPIC;
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 2001.039(b)");
    expect(text).toContain("fourth anniversary");
    expect(text).toContain("every four years thereafter");
    expect(text).toContain("amendment does not automatically reset");
    expect(topic.questions.some((item) =>
      item.q.includes("four-year legal review deadline") &&
      item.a.includes("formal")
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });

  it("keeps home-rule, general-law, county and special-district authority separate", () => {
    const text = [LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.quickAnswer, ...LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.framework, ...LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("Section 51.072");
    expect(text).toContain("Article XI, Section 5");
    expect(text).toContain("more than 5,000 inhabitants");
    expect(text).toContain("Section 5.004");
    expect(text).toContain("automatically revoke");
    expect(LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC.questions.some((item) =>
      item.q.includes("automatically become home-rule") && item.a.includes("majority vote")
    )).toBe(true);
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
  it("does not assign general ordinance-making authority to every Texas county", () => {
    const topic = LOCAL_GOVERNMENT_AUTHORITY_LAW_TOPIC;
    const text = [topic.quickAnswer, ...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("lack general ordinance-making");
    expect(text).toContain("Section 826.014");
    expect(topic.questions.some((entry) =>
      entry.q.includes("pass any ordinance") &&
      entry.a.includes("Opinion KP-0491")
    )).toBe(true);
    expect(topic.sources.some((source) =>
      source.url === "https://www.texasattorneygeneral.gov/sites/default/files/opinion-files/opinion/2025/kp-0491.pdf"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
    const hub = readFileSync(new URL("../routes/laws.index.tsx", import.meta.url), "utf8");
    expect(hub).not.toContain("ordinances of 254 counties");
    expect(hub).toMatch(/municipal ordinances, legally authorized county orders, and\s+special-district rules/);
  });

});
