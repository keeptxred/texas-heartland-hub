import { describe, expect, it } from "vitest";
import { SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC } from "@/data/law-topic-self-defense-authority";

describe("Texas Penal Code Chapter 9 threats, bystanders, and civil immunity", () => {
  const topic = SELF_DEFENSE_USE_OF_FORCE_LAW_TOPIC;
  const framework = topic.framework.join(" ");
  const keyRules = topic.keyRules.join(" ");

  it("requires justified force and a limited threat-only purpose under §9.04", () => {
    expect(framework).toContain("Section 9.04");
    expect(framework).toContain("solely to make another fear");
    expect(framework).toContain("does not, by itself, constitute the use of deadly force");
    expect(keyRules).toContain("Penal Code §9.04");
    expect(topic.questions.some(({ q, a }) =>
      q.startsWith("Is showing a gun or threatening") &&
      a.includes("force would be justified") &&
      a.includes("not itself constitute using deadly force")
    )).toBe(true);
  });

  it("preserves the §9.05 reckless bystander exception from Chapter 9 protection", () => {
    expect(framework).toContain("Section 9.05");
    expect(framework).toContain("recklessly injuring or killing an innocent third person");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("innocent bystander") &&
      a.includes("unavailable in a prosecution") &&
      a.includes("recklessly injuring")
    )).toBe(true);
  });

  it("separates §9.06 civil remedies from §83.001 conditional civil immunity", () => {
    expect(framework).toContain("Section 9.06");
    expect(framework).toContain("Section 83.001");
    expect(framework).toContain("actually justified conduct");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("eliminate civil liability") &&
      a.includes("§9.06") &&
      a.includes("§83.001") &&
      a.includes("personal injury or death")
    )).toBe(true);
  });

  it("keeps the official source, existing baseline claims and old update date", () => {
    expect(topic.sources.some((s) =>
      s.url === "https://tcss.legis.texas.gov/resources/PE/htm/PE.9.htm"
    )).toBe(true);
    expect(framework).toContain("Section 9.42");
    expect(framework).toContain("Section 9.43");
    expect(topic.updated).toBe("2026-09-06");
  });
});
