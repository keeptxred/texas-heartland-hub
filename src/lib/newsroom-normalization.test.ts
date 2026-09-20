import { describe, expect, it } from "vitest";
import {
  addDeterministicDuplicateCandidate,
  canonicalizeNewsUrl,
  createDeterministicDuplicateIndex,
  findDeterministicDuplicate,
  findDeterministicDuplicateIndexed,
  normalizeNewsFeedItem,
  normalizeSourceKey,
  normalizeTitle,
  sameTimestamp,
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

  it("treats equivalent timestamp serializations as the same instant", () => {
    expect(sameTimestamp("2026-09-15T23:28:41.000Z", "2026-09-15 23:28:41+00:00")).toBe(true);
    expect(sameTimestamp("2026-09-15T23:28:41Z", "2026-09-15T18:28:41-05:00")).toBe(true);
    expect(sameTimestamp("2026-09-15T23:28:41Z", "2026-09-15T23:28:42Z")).toBe(false);
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

  it("matches legacy duplicate decisions with indexed lookup and self-exclusion", () => {
    const item = normalizeNewsFeedItem({
      id: 22,
      title: "Texas agency releases report",
      source: "Example News",
      link: "https://example.com/report",
      description: "Latest copy",
      pub_date: "2026-08-15T12:00:00Z",
    });
    const existing = [
      {
        feed_item_id: 22,
        canonical_url: item.canonicalUrl,
        source_key: item.sourceKey,
        title_fingerprint: item.titleFingerprint,
        observed_at: "2026-08-15T09:00:00Z",
      },
      {
        feed_item_id: 21,
        canonical_url: item.canonicalUrl,
        source_key: "other-source",
        title_fingerprint: "other-title",
        observed_at: "2026-08-15T10:00:00Z",
      },
      {
        feed_item_id: 20,
        canonical_url: item.canonicalUrl,
        source_key: item.sourceKey,
        title_fingerprint: item.titleFingerprint,
        observed_at: "2026-08-15T08:00:00Z",
      },
    ];
    const index = createDeterministicDuplicateIndex(existing);
    expect(findDeterministicDuplicateIndexed(item, index)).toEqual(findDeterministicDuplicate(item, existing));
    expect(findDeterministicDuplicateIndexed(item, index)).toEqual({
      feedItemId: 20,
      reason: "canonical-url",
      confidence: 1,
    });
  });

  it("updates the indexed matcher as new canonical rows are accepted", () => {
    const first = normalizeNewsFeedItem({
      id: 31,
      title: "Texas board posts agenda",
      source: "Example News",
      link: "https://example.com/agenda",
      description: "Agenda posted",
      pub_date: "2026-08-15T10:00:00Z",
    });
    const repeat = normalizeNewsFeedItem({
      id: 32,
      title: "Texas board posts agenda",
      source: "Example News",
      link: "https://example.com/agenda?utm_source=feed",
      description: "Agenda reposted",
      pub_date: "2026-08-15T11:00:00Z",
    });
    const index = createDeterministicDuplicateIndex([]);
    expect(findDeterministicDuplicateIndexed(first, index)).toBeNull();
    addDeterministicDuplicateCandidate(index, {
      feed_item_id: first.feedItemId,
      canonical_url: first.canonicalUrl,
      source_key: first.sourceKey,
      title_fingerprint: first.titleFingerprint,
      observed_at: first.observedAt,
    });
    expect(findDeterministicDuplicateIndexed(repeat, index)).toEqual({
      feedItemId: 31,
      reason: "canonical-url",
      confidence: 1,
    });
  });
});
