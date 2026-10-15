import { describe, expect, it } from "vitest";
import { retainNewsroomEditorialFlags } from "./newsroom-quality-flag-refresh";

describe("newsroom recomputed-quality flags", () => {
  it("clears prior generated repetition/low-value markers for a repaired body", () => {
    expect(retainNewsroomEditorialFlags([
      "missing_image", "internal_repetition", "seo_low_value_commodity",
      "search_recovery_source_first", "weak_dek",
    ])).toEqual([]);
  });

  it("preserves independently assigned low-value quarantine and other editorial blocks", () => {
    expect(retainNewsroomEditorialFlags([
      "seo_low_value_commodity", "seo_noindex", "seo_off_topic", "duplicate_story", "missing_image",
    ])).toEqual(["seo_low_value_commodity", "seo_noindex", "seo_off_topic", "duplicate_story"]);
  });

  it("rechecks source-integrity failures without erasing an explicit noindex", () => {
    expect(retainNewsroomEditorialFlags(["seo_false_multisource", "seo_noindex", "internal_repetition"]))
      .toEqual(["seo_noindex"]);
  });

  it("rejects malformed and duplicate flag entries", () => {
    expect(retainNewsroomEditorialFlags(null)).toEqual([]);
    expect(retainNewsroomEditorialFlags(["seo_off_topic", 123, "seo_off_topic", null]))
      .toEqual(["seo_off_topic"]);
  });
});
