import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { ARTICLES } from "@/data/articles";
import { issueGuides } from "@/data/issue-guides";
import {
  KTR_DURABLE_FACEBOOK_GUIDES,
  durableGuideCanonicalUrl,
} from "@/lib/facebook-durable-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

function eligiblePillarArticles(now = new Date()) {
  return ARTICLES.filter((article) => {
    if (!article.pillar || !isStaticArticleIndexable(article)) return false;
    if (!article.publishAt) return true;
    const publishAt = Date.parse(article.publishAt);
    return Number.isFinite(publishAt) && publishAt <= now.getTime();
  });
}

describe("KTR durable Facebook content pool", () => {
  it("includes every production-indexable guide without an age cutoff", () => {
    const candidateUrls = new Set(KTR_DURABLE_FACEBOOK_GUIDES.map((candidate) => candidate.url));
    const expected = Object.values(ALL_GUIDES).filter(isSupportingGuideIndexable);
    expect(expected.length).toBeGreaterThan(0);
    for (const guide of expected) {
      expect(candidateUrls.has(durableGuideCanonicalUrl(guide.slug))).toBe(true);
    }
  });

  it("includes published, indexable static pillar articles regardless of age", () => {
    const candidateUrls = new Set(KTR_DURABLE_FACEBOOK_GUIDES.map((candidate) => candidate.url));
    const expected = eligiblePillarArticles();
    expect(expected.length).toBeGreaterThan(0);
    for (const article of expected) {
      expect(candidateUrls.has(`https://keeptxred.com/news/${encodeURIComponent(article.slug)}`)).toBe(true);
    }
  });

  it("includes production-indexable issue guides regardless of age", () => {
    const candidateUrls = new Set(KTR_DURABLE_FACEBOOK_GUIDES.map((candidate) => candidate.url));
    const expected = issueGuides.filter(isIssueGuideIndexable);
    expect(expected.length).toBeGreaterThan(0);
    for (const guide of expected) {
      expect(candidateUrls.has(`https://keeptxred.com/issues/${encodeURIComponent(guide.slug)}`)).toBe(true);
    }
  });

  it("keeps only canonical KTR URLs and deduplicates overlapping registries", () => {
    const urls = KTR_DURABLE_FACEBOOK_GUIDES.map((candidate) => candidate.url);
    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls).size).toBe(urls.length);
    for (const candidate of KTR_DURABLE_FACEBOOK_GUIDES) {
      expect(candidate.url).toMatch(/^https:\/\/keeptxred\.com\//);
      expect(candidate.image_url).toBeTruthy();
      expect(candidate.kind).toBe("evergreen-guide");
      expect(candidate.is_breaking).toBe(false);
    }
  });
});
