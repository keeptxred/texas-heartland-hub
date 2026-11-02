import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EVERGREEN_EVIDENCE_ADDENDUM, fatalEvergreenEditorialReasons } from "./evergreen-editorial-prompt";

const routeSource = readFileSync(new URL("../routes/api/public/hooks/generate-evergreen.ts", import.meta.url), "utf8");

describe("non-news evergreen editorial evidence contract", () => {
  it("does not require a fabricated breaking-news event or an empty article", () => {
    expect(EVERGREEN_EVIDENCE_ADDENDUM).toContain('"hasClearNewsEvent": false');
    expect(EVERGREEN_EVIDENCE_ADDENDUM).toContain("Produce the COMPLETE explainer");
    expect(EVERGREEN_EVIDENCE_ADDENDUM).toContain("must NOT cause empty article");
    expect(EVERGREEN_EVIDENCE_ADDENDUM).toContain("3–6");
    expect(routeSource).toContain("system: system + EVERGREEN_EVIDENCE_ADDENDUM");
    expect(routeSource).not.toContain("system: system + EDITORIAL_SYSTEM_ADDENDUM");
  });

  it("ignores only the inapplicable news-event signal, preserving strict factual and prose gates", () => {
    const errors = [
      "brief_no_clear_news_event",
      "headline_does_not_match_body",
      "tiered_main_word_count:105/800",
      "missing_direct_answer_summary",
      "banned_phrase:analysts say",
    ];
    expect(fatalEvergreenEditorialReasons(errors)).toEqual(errors.slice(1));
    expect(fatalEvergreenEditorialReasons(["brief_no_clear_news_event"])).toEqual([]);
  });

  it("keeps original 2-attempt AI budget and no-publication-on-duplicate/short-content rules", () => {
    expect(routeSource).toContain("maxAttempts: 2");
    expect(routeSource).toContain("articleMainWordCount(cleanBody)");
    expect(routeSource).toContain("if (mainWordCount < EVERGREEN_MIN_MAIN_WORDS)");
    expect(routeSource).toContain("if (hasDuplicateContent(cleanBody))");
    expect(routeSource).toContain("return Response.json({ error: \"AI failed\"");
  });
});
