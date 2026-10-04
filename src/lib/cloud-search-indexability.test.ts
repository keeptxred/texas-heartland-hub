import { describe, expect, it } from "vitest";
import {
  isCloudArticleSearchEligibleByKind,
  isSearchRecoveryPrimarySourceUrl,
} from "./cloud-search-indexability";

describe("cloud search recovery policy", () => {
  it("recognizes only official public-source hosts used by the automated lane", () => {
    expect(isSearchRecoveryPrimarySourceUrl("https://www.sos.texas.gov/elections/" )).toBe(true);
    expect(isSearchRecoveryPrimarySourceUrl("https://data.census.gov/table/example")).toBe(true);
    expect(isSearchRecoveryPrimarySourceUrl("https://www.austintexas.gov/health/news/example")).toBe(true);
    expect(isSearchRecoveryPrimarySourceUrl("https://www.ercot.com/gridinfo/resource")).toBe(true);
    expect(isSearchRecoveryPrimarySourceUrl("https://newsroom.ercot.com/example")).toBe(true);

    expect(isSearchRecoveryPrimarySourceUrl("https://www.reuters.com/world/us/example")).toBe(false);
    expect(isSearchRecoveryPrimarySourceUrl("https://apnews.com/article/example")).toBe(false);
    expect(isSearchRecoveryPrimarySourceUrl("https://www.aarp.org/example")).toBe(false);
    expect(isSearchRecoveryPrimarySourceUrl("not-a-url")).toBe(false);
    expect(isSearchRecoveryPrimarySourceUrl(null)).toBe(false);
  });

  it("keeps ordinary news suppressed while allowing only governed exceptions", () => {
    expect(isCloudArticleSearchEligibleByKind("news", [])).toBe(false);
    expect(isCloudArticleSearchEligibleByKind("ingested", [])).toBe(false);
    expect(isCloudArticleSearchEligibleByKind("evergreen", [])).toBe(true);

    expect(isCloudArticleSearchEligibleByKind("news", ["search_recovery_source_first"])).toBe(true);
    expect(isCloudArticleSearchEligibleByKind("news", [
      "search_recovery_authority",
      "editorial_reviewed",
      "primary_sources",
    ])).toBe(true);
    expect(isCloudArticleSearchEligibleByKind("news", [
      "search_recovery_authority",
      "primary_sources",
    ])).toBe(false);
  });
});
