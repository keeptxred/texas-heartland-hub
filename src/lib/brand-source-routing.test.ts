import { describe, expect, it } from "vitest";
import {
  isTexasDefinedOwnedSource,
  isTexasDefinedOwnedSourceRecord,
  TEXAS_DEFINED_OWNED_SOURCE_NAMES,
} from "./brand-source-ownership";
import { qualifiesForAutoRewrite, scoreFeedItem } from "./viral-score";

describe("TexasDefined source ownership", () => {
  it("recognizes exact source names and ownership notes", () => {
    for (const source of TEXAS_DEFINED_OWNED_SOURCE_NAMES) {
      expect(isTexasDefinedOwnedSource(source)).toBe(true);
      expect(isTexasDefinedOwnedSource(source.toUpperCase())).toBe(true);
    }

    expect(isTexasDefinedOwnedSource("Texas Tribune")).toBe(false);
    expect(
      isTexasDefinedOwnedSourceRecord(
        "Other Feed",
        "TexasDefined-owned lifestyle source",
      ),
    ).toBe(true);
    expect(
      isTexasDefinedOwnedSourceRecord(
        "Texas Tribune",
        "KeepTXRed statewide source",
      ),
    ).toBe(false);
  });

  it("blocks TexasDefined sources before KeepTXRed storage, article, and rewrite routing", () => {
    for (const source of TEXAS_DEFINED_OWNED_SOURCE_NAMES) {
      const result = scoreFeedItem({
        title: "Texas institution announces major statewide expansion",
        description: "A major development affects residents across Texas.",
        source,
        pub_date: new Date().toISOString(),
        has_video: true,
        source_reputation_score: 100,
        source_reputation_reason: "Database override must not bypass ownership",
      });

      expect(result.texasRelevanceScore).toBe(0);
      expect(result.sourceReputationScore).toBe(0);
      expect(result.sourceReputationReason).toContain("TexasDefined-owned");
      expect(result.routingType).toBe("FACEBOOK_ONLY");
      expect(qualifiesForAutoRewrite(result)).toBe(false);
    }
  });
});
