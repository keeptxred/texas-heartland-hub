import { ALL_GUIDES } from "@/data/all-guides";
import { getLawGuideMeta, lawGuideCanonicalPath } from "@/lib/law-guides";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

export type DurableFacebookGuideCandidate = {
  slug: string;
  title: string;
  category: string;
  kind: "evergreen-guide";
  is_breaking: false;
  score: number;
  published_at: string;
  url: string;
  image_url: string;
};

export function durableGuideCanonicalUrl(slug: string): string {
  const path = getLawGuideMeta(slug)
    ? lawGuideCanonicalPath(slug)
    : `/guides/${encodeURIComponent(slug)}`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * KTR's guide library is intentionally date-independent for Facebook.
 * `updated` is carried only because the shared editorial ranker expects a date;
 * eligibility never filters on it. Only guides that already pass the site's
 * production indexability/quality gate enter this pool.
 */
export const KTR_DURABLE_FACEBOOK_GUIDES: DurableFacebookGuideCandidate[] = Object.values(ALL_GUIDES)
  .filter(isSupportingGuideIndexable)
  .map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    category: guide.pillarLabel,
    kind: "evergreen-guide" as const,
    is_breaking: false as const,
    score: 20,
    published_at: guide.updated,
    url: durableGuideCanonicalUrl(guide.slug),
    image_url: DEFAULT_OG_IMAGE,
  }));
