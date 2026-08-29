import { describe, expect, it } from "vitest";
import {
  KTR_FACEBOOK_ATTENTION_POSTS,
  formatKtrFacebookAttentionMessage,
  selectKtrFacebookAttentionPost,
} from "@/lib/facebook-attention-posts";
import { shouldUseKtrFacebookAttentionSlot } from "@/lib/facebook-attention-publisher.server";

describe("KTR Facebook attention posts", () => {
  it("keeps a deep enough rotation for social publishing", () => {
    expect(KTR_FACEBOOK_ATTENTION_POSTS.length).toBeGreaterThanOrEqual(125);
  });

  it("does not contain duplicate titles or messages", () => {
    const titles = KTR_FACEBOOK_ATTENTION_POSTS.map((post) => post.title.toLowerCase().trim());
    const messages = KTR_FACEBOOK_ATTENTION_POSTS.map((post) => post.message.toLowerCase().trim());
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(messages).size).toBe(messages.length);
  });

  it("keeps traffic destinations internal and formats them only when present", () => {
    const linked = KTR_FACEBOOK_ATTENTION_POSTS.filter((post) => post.trafficPath);
    const unlinked = KTR_FACEBOOK_ATTENTION_POSTS.filter((post) => !post.trafficPath);
    expect(linked.length).toBeGreaterThanOrEqual(15);
    expect(unlinked.length).toBeGreaterThan(linked.length);

    for (const post of linked) {
      expect(post.trafficPath).toMatch(/^\/[a-z0-9][a-z0-9\-\/]*$/);
      const formatted = formatKtrFacebookAttentionMessage(post);
      expect(formatted).toContain("https://keeptxred.com");
      expect(formatted).toContain(post.trafficPath as string);
    }

    for (const post of unlinked.slice(0, 10)) {
      expect(formatKtrFacebookAttentionMessage(post)).toBe(post.message);
    }
  });

  it("selects deterministically and skips an exact recent post", () => {
    const args = {
      seed: "test-seed",
      dateKey: "2026-08-29",
      slot: 1,
      recentMessages: [] as string[],
    };
    const first = selectKtrFacebookAttentionPost(args);
    const again = selectKtrFacebookAttentionPost(args);
    expect(first).not.toBeNull();
    expect(again?.title).toBe(first?.title);

    const skipped = selectKtrFacebookAttentionPost({
      ...args,
      recentMessages: first ? [formatKtrFacebookAttentionMessage(first)] : [],
    });
    expect(skipped).not.toBeNull();
    expect(skipped?.title).not.toBe(first?.title);
  });

  it("reserves only the second and fourth daily KTR slots for attention posts", () => {
    expect([0, 1, 2, 3, 4].filter(shouldUseKtrFacebookAttentionSlot)).toEqual([1, 3]);
    expect(shouldUseKtrFacebookAttentionSlot(5)).toBe(false);
  });
});
