import { describe, expect, it } from "vitest";
import { EMPLOYMENT_WORKPLACE_LAW_TOPIC } from "@/data/law-topic-employment-workplace-authority";

describe("Texas Payday Law §61.018 wage deductions and final paycheck", () => {
  const topic = EMPLOYMENT_WORKPLACE_LAW_TOPIC;
  const framework = topic.framework.join(" ");
  const rules = topic.keyRules.join(" ");

  it("distinguishes court orders, statutory deductions and written lawful employee authorizations", () => {
    expect(framework).toContain("Section 61.018");
    expect(framework).toContain("ordered by a court");
    expect(framework).toContain("written authorization for a lawful purpose");
    expect(framework).toContain("minimum-wage or overtime requirements");
    expect(rules).toContain("§61.018");
  });

  it("does not let unreturned property defer §61.014 final wage deadlines", () => {
    expect(framework).toContain("cannot postpone the final paycheck");
    expect(framework).toContain("has not returned equipment");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("return company equipment") &&
      a.includes("sixth calendar day") &&
      a.includes("next regular payday") &&
      a.includes("separate lawful avenues")
    )).toBe(true);
  });

  it("conditions paid-leave cashouts on a written agreement and §821.25 policy", () => {
    expect(framework).toContain("Section 61.001(7)(B)");
    expect(framework).toContain("40 TAC Section 821.25(a) and (g)");
    expect(rules).toContain("40 TAC §821.25");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("unused PTO or vacation") &&
      a.includes("written agreement or employer policy") &&
      a.includes("Not automatically")
    )).toBe(true);
  });

  it("cites official TWC deduction, final-pay, PTO and administrative rule sources", () => {
    for (const url of [
      "https://efte.twc.texas.gov/deduction_problems_under_tpl.html",
      "https://efte.twc.texas.gov/final_pay.html",
      "https://efte.twc.texas.gov/accrued_leave_payouts.html",
      "https://www.twc.texas.gov/sites/default/files/ogc/docs/rules-chapter-821-payday-twc.pdf"
    ]) {
      expect(topic.sources.some((x) => x.url === url)).toBe(true);
    }
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
    expect(framework).toContain("Section 21.202");
  });
});
