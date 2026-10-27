import { describe, expect, it } from "vitest";
import { PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC } from "@/data/law-topic-parental-rights-education-authority";

describe("Texas school district parental engagement enacted requirements", () => {
  const topic = PARENTAL_RIGHTS_EDUCATION_LAW_TOPIC;

  it("preserves the three specific SB12 section 26.0071 board duties", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 26.0071");
    expect(text).toContain("September 1, 2025");
    expect(text).toContain("Internet portal");
    expect(text).toContain("parents of enrolled students");
    expect(text).toContain("beginning of each board meeting");
    expect(text).toContain("outside typical work hours");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("comment portal") &&
      a.includes("Section 26.0071") &&
      a.includes("the beginning of board meetings") &&
      a.includes("outside typical work hours")
    )).toBe(true);
  });

  it("keeps school board public access distinct from parental participation and private schools", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 26.007");
    expect(text).toContain("lawfully closed sessions");
    expect(text).toContain("school-district board policies");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("comment portal") && a.includes("private schools")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=ED&Value=26.0071"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
