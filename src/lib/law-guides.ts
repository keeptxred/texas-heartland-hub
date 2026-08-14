import * as core from "@/lib/law-guides-core";
import { RENTER_LAW_GUIDES } from "@/lib/law-guides-renters";
import { RENTER_BATCH4_LAW_GUIDES } from "@/lib/law-guides-renters-batch4";

export { LAW_TOPICS, createDraftLawGuideMeta, isLawGuideMetaIndexable, validateLawGuideMeta } from "@/lib/law-guides-core";
export type { LawGuideMeta, LawGuideStatus, LawSource, LawTopic } from "@/lib/law-guides-core";

export const LAW_GUIDES = [...core.LAW_GUIDES, ...RENTER_LAW_GUIDES, ...RENTER_BATCH4_LAW_GUIDES] as const;

const GUIDE_BY_SLUG = new Map(LAW_GUIDES.map((guide) => [guide.slug, guide] as const));

export function getLawGuideMeta(slug: string): core.LawGuideMeta | null {
  return GUIDE_BY_SLUG.get(slug) ?? null;
}

export function lawGuideCanonicalPath(slug: string): string {
  return getLawGuideMeta(slug)?.canonicalPath ?? `/news/${slug}`;
}

export function lawGuidesForTopic(topic: core.LawTopic): core.LawGuideMeta[] {
  return LAW_GUIDES.filter((guide) => guide.topic === topic);
}

export function isLawGuideIndexable(slug: string): boolean {
  const guide = getLawGuideMeta(slug);
  if (!guide) return true;
  return core.isLawGuideMetaIndexable(guide);
}
