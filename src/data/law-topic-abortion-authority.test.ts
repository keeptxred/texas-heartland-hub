import { describe, expect, it } from "vitest";
import { ABORTION_LAW_TOPIC } from "@/data/law-topic-abortion-authority";
import { isLawTopicIndexable, MIN_LAW_TOPIC_WORDS } from "@/lib/law-topic-indexability";

describe("Texas abortion law authority", () => {
  it("independently clears the unchanged Law Library readiness gate", () => {
    expect(MIN_LAW_TOPIC_WORDS).toBe(700);
    expect(isLawTopicIndexable(ABORTION_LAW_TOPIC)).toBe(true);
    expect(ABORTION_LAW_TOPIC.updated).toBe("2026-09-06");
    expect(ABORTION_LAW_TOPIC.sources.length).toBeGreaterThanOrEqual(8);
  });

  it("preserves the post-2025 statutory layers", () => {
    const text = [ABORTION_LAW_TOPIC.quickAnswer, ...ABORTION_LAW_TOPIC.framework, ...ABORTION_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("Chapter 170A");
    expect(text).toContain("Chapter 171A");
    expect(text).toContain("Senate Bill 31");
    expect(text).toContain("December 4, 2025");
    expect(text).toContain("reasonable medical judgment");
  });

  it("keeps medical-emergency treatment distinctions explicit without giving medical advice", () => {
    const text = [ABORTION_LAW_TOPIC.quickAnswer, ...ABORTION_LAW_TOPIC.framework, ...ABORTION_LAW_TOPIC.questions.map((item) => item.a)].join(" ");
    expect(text).toContain("ectopic pregnancy");
    expect(text).toContain("spontaneous abortion");
    expect(text).toContain("not medical advice");
    expect(text).toContain("need not wait");
  });

  it("keeps enforcement mechanisms distinct", () => {
    const text = [...ABORTION_LAW_TOPIC.framework, ...ABORTION_LAW_TOPIC.keyRules].join(" ");
    expect(text).toContain("private civil-enforcement");
    expect(text).toContain("civil qui tam");
    expect(text).toContain("professional discipline");
    expect(text).toContain("criminal");
  });

  it("does not overstate the current Texas Supreme Court posture", () => {
    const weldon = ABORTION_LAW_TOPIC.questions.find((item) => item.q.includes("Weldon"));
    expect(weldon).toBeDefined();
    expect(weldon!.a).toContain("reversed");
    expect(weldon!.a).toContain("remanded");
    expect(weldon!.a).toContain("too broad");
  });

  it("uses official Texas primary or institutional sources", () => {
    expect(ABORTION_LAW_TOPIC.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    expect(ABORTION_LAW_TOPIC.sources.some((source) => source.url.includes("statutes.capitol.texas.gov"))).toBe(true);
    expect(ABORTION_LAW_TOPIC.sources.some((source) => source.url.includes("capitol.texas.gov"))).toBe(true);
    expect(ABORTION_LAW_TOPIC.sources.some((source) => source.url.includes("txcourts.gov"))).toBe(true);
    expect(ABORTION_LAW_TOPIC.sources.some((source) => source.url.includes("tmb.state.tx.us"))).toBe(true);
  });
});
