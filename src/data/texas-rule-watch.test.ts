import { describe, expect, it } from "vitest";
import { RULE_WATCH_SOURCES, RULE_WATCH_STAGES } from "@/data/texas-rule-watch";

describe("Texas Rule Watch source registry", () => {
  it("covers the major Texas rulemaking lifecycle stages", () => {
    const stages = RULE_WATCH_STAGES.map((item) => item.stage);
    expect(stages).toContain("Proposed rule");
    expect(stages).toContain("Adopted rule");
    expect(stages).toContain("Emergency rule");
    expect(stages).toContain("Withdrawn rule");
    expect(stages).toContain("Agency rule review");
  });

  it("uses Secretary of State sources for the Register and current code", () => {
    expect(RULE_WATCH_SOURCES.length).toBeGreaterThanOrEqual(4);
    for (const source of RULE_WATCH_SOURCES) {
      const url = new URL(source.url);
      expect(["www.sos.state.tx.us", "texreg.sos.state.tx.us"]).toContain(url.hostname);
    }
  });
});
