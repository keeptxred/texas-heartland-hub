import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import {
  KTR_FACEBOOK_ATTENTION_POSTS,
  formatKtrFacebookAttentionMessage,
  selectKtrFacebookAttentionPost,
} from "@/lib/facebook-attention-posts";
import {
  buildKtrFacebookAttentionImagePrompt,
  decodeSuppliedKtrFacebookAttentionImage,
} from "@/lib/facebook-attention-image.server";
import {
  formatKtrFacebookPublishedAttentionMessage,
  ktrFacebookAttentionTrafficUrl,
  selectKtrFacebookAttentionPostForSlot,
  shouldUseKtrFacebookAttentionSlot,
} from "@/lib/facebook-attention-publisher.server";

const STATIC_TRAFFIC_PATHS = new Set([
  "/texas-politics",
  "/texas-government",
  "/texas-political-figures",
]);

describe("KTR Facebook attention posts", () => {
  it("keeps a deep enough rotation for social publishing", () => {
    expect(KTR_FACEBOOK_ATTENTION_POSTS.length).toBeGreaterThanOrEqual(125);
  });

  it("builds the exact ChatGPT-style image instruction from the post text", () => {
    const postText = "What should youth sports teach first: winning, discipline, teamwork, resilience, or something else?";
    const prompt = buildKtrFacebookAttentionImagePrompt(postText);
    expect(prompt.startsWith(`Generate an image for this Facebook post.\n${postText}`)).toBe(true);
    expect(prompt).toContain("magazine-ready social graphic");
    expect(prompt).toContain("Do not use a generic Texas background");
    expect(prompt).not.toContain("og/default.jpg");
  });

  it("accepts only real raster image payloads from the ChatGPT/OpenAI job", () => {
    const encoded = btoa("fake-image-bytes-for-contract-test");
    const decoded = decodeSuppliedKtrFacebookAttentionImage({ base64: encoded, contentType: "image/png" });
    expect(decoded.contentType).toBe("image/png");
    expect(decoded.bytes.byteLength).toBeGreaterThan(0);
    expect(() => decodeSuppliedKtrFacebookAttentionImage({ base64: encoded, contentType: "image/svg+xml" })).toThrow();
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

  it("only links issue prompts to existing issue-guide slugs", () => {
    const issuePaths = new Set(issueGuides.map((guide) => `/issues/${guide.slug}`));
    for (const post of KTR_FACEBOOK_ATTENTION_POSTS) {
      if (!post.trafficPath) continue;
      if (post.trafficPath.startsWith("/issues/")) {
        expect(issuePaths.has(post.trafficPath), `${post.title}: ${post.trafficPath}`).toBe(true);
      } else {
        expect(STATIC_TRAFFIC_PATHS.has(post.trafficPath), `${post.title}: ${post.trafficPath}`).toBe(true);
      }
    }
  });

  it("adds campaign attribution only to traffic posts", () => {
    const linked = KTR_FACEBOOK_ATTENTION_POSTS.find((post) => post.trafficPath);
    const unlinked = KTR_FACEBOOK_ATTENTION_POSTS.find((post) => !post.trafficPath);
    expect(linked).toBeTruthy();
    expect(unlinked).toBeTruthy();

    const trafficUrl = linked ? ktrFacebookAttentionTrafficUrl(linked) : null;
    expect(trafficUrl).toContain("utm_source=facebook");
    expect(trafficUrl).toContain("utm_medium=social");
    expect(trafficUrl).toContain("utm_campaign=ktr_attention");
    expect(trafficUrl).toContain("utm_content=");
    if (linked) expect(formatKtrFacebookPublishedAttentionMessage(linked)).toContain(trafficUrl as string);
    if (unlinked) {
      expect(ktrFacebookAttentionTrafficUrl(unlinked)).toBeNull();
      expect(formatKtrFacebookPublishedAttentionMessage(unlinked)).toBe(unlinked.message);
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

  it("uses the earlier attention slot for reach and the later one for traffic", () => {
    const reach = selectKtrFacebookAttentionPostForSlot({
      seed: "test-seed",
      dateKey: "2026-08-29",
      slot: 1,
      recentMessages: [],
    });
    const traffic = selectKtrFacebookAttentionPostForSlot({
      seed: "test-seed",
      dateKey: "2026-08-29",
      slot: 3,
      recentMessages: [],
    });
    expect(reach).not.toBeNull();
    expect(reach?.trafficPath).toBeUndefined();
    expect(traffic).not.toBeNull();
    expect(traffic?.trafficPath).toBeTruthy();
  });

  it("does not immediately reuse the same traffic destination", () => {
    const first = selectKtrFacebookAttentionPostForSlot({
      seed: "traffic-seed",
      dateKey: "2026-08-29",
      slot: 3,
      recentMessages: [],
    });
    expect(first?.trafficPath).toBeTruthy();
    const next = selectKtrFacebookAttentionPostForSlot({
      seed: "traffic-seed",
      dateKey: "2026-08-29",
      slot: 3,
      recentMessages: first ? [formatKtrFacebookPublishedAttentionMessage(first)] : [],
    });
    expect(next).not.toBeNull();
    expect(next?.trafficPath).not.toBe(first?.trafficPath);
  });

  it("reserves only the second and fourth daily KTR slots for attention posts", () => {
    expect([0, 1, 2, 3, 4].filter(shouldUseKtrFacebookAttentionSlot)).toEqual([1, 3]);
    expect(shouldUseKtrFacebookAttentionSlot(5)).toBe(false);
  });
});
