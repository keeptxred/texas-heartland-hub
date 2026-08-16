import { describe, expect, it } from "vitest";
import {
  canonicalizeNewsUrl,
  findDeterministicDuplicate,
  normalizeNewsFeedItem,
  normalizeSourceKey,
  normalizeTitle,
} from "./newsroom-normalization";

describe("newsroom zero-AI normalization", () => {
  it("normalizes titles deterministically without an AI call", () => {
    expect(normalizeTitle("  Texas’ New Plan: What’s Next?  ")).toBe("texas new plan what s next");
    expect(normalizeSourceKey("The Texas Tribune")).toBe("the-texas-tribune");
  });

  it("removes tracking parameters but keeps meaningful query parameters", () => {
    expect(canonicalizeNewsUrl("https://Example.com/story/?utm_source=x&id=42&fbclid=abc#top"))
      .toBe("https://example.com/story?id=42");
  });

  it("marks exact canonical URL repeats as duplicates even when tracking URLs differ", () => {
    const item = normalizeNewsFeedItem({
      id: 2,
      title: "Texas agency releases report",
      source: "Outlet B",
      link: "https://example.com/report?utm_source=social",
      description: "New report",
      pub_date: "2026-08-15T12:00:00Z",
    });
    expect(findDeterministicDuplicate(item, [{
      feed_item_id: 1,
      canonical_url: "https://example.com/report",
      source_key: "outlet-a",
      title_fingerprint: "different",
      observed_at: "2026-08-15T11:00:00Z",
    }])).toEqual({ feedItemId: 1, reason: "canonical-url", confidence: 1 });
  });

  it("collapses same-source title repeats", () => {
    const item = normalizeNewsFeedItem({
      id: 9,
      title: "Governor signs Texas bill",
      source: "Example News",
      link: "https://example.com/new-url",
      description: "Description",
      pub_date: "2026-08-15T12:00:00Z",
    });
    expect(findDeterministicDuplicate(item, [{
      feed_item_id: 8,
      canonical_url: "https://example.com/old-url",
      source_key: item.sourceKey,
      title_fingerprint: item.titleFingerprint,
      observed_at: "2026-08-15T10:00:00Z",
    }])?.reason).toBe("same-source-title");
  });

  it("preserves same-event coverage from different outlets for later MERGE clustering", () => {
    const item = normalizeNewsFeedItem({
      id: 12,
      title: "Texas agency releases drought plan",
      source: "Outlet B",
      link: "https://outlet-b.example/drought-plan",
      description: "Independent coverage",
      pub_date: "2026-08-15T12:00:00Z",
    });
    expect(findDeterministicDuplicate(item, [{
      feed_item_id: 11,
      canonical_url: "https://outlet-a.example/drought-plan",
      source_key: "outlet-a",
      title_fingerprint: item.titleFingerprint,
      observed_at: "2026-08-15T11:00:00Z",
    }])).toBeNull();
  });
});
