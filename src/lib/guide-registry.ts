import {
  getLawGuideMeta as getCoreGuideMeta,
  isLawGuideIndexable as isCoreGuideIndexable,
  lawGuidesForTopic as coreGuidesForTopic,
  type LawGuideMeta,
  type LawTopic,
} from "@/lib/law-guides";
import { RENTER_LAW_GUIDES } from "@/lib/law-guides-renters";

const RENTER_BY_SLUG = new Map(RENTER_LAW_GUIDES.map((guide) => [guide.slug, guide] as const));

export function getGuideMeta(slug: string): LawGuideMeta | null {
  return RENTER_BY_SLUG.get(slug) ?? getCoreGuideMeta(slug);
}

export function guidesForTopic(topic: LawTopic): LawGuideMeta[] {
  return [...coreGuidesForTopic(topic), ...RENTER_LAW_GUIDES.filter((guide) => guide.topic === topic)];
}

export function isGuideIndexable(slug: string): boolean {
  const renter = RENTER_BY_SLUG.get(slug);
  if (renter) return renter.status === "verified" || renter.status === "legacy";
  return isCoreGuideIndexable(slug);
}
