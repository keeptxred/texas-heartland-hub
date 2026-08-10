import { CORNERSTONE_GUIDES, type CornerstoneGuide } from "@/data/cornerstone-guides";
import { AGRICULTURE_SUPPORTING_GUIDES } from "@/data/supporting-guides-agriculture";
import { VETERANS_SUPPORTING_GUIDES } from "@/data/supporting-guides-veterans";
import { LAW_ENFORCEMENT_SUPPORTING_GUIDES } from "@/data/supporting-guides-law-enforcement";
import { BORDER_SUPPORTING_GUIDES } from "@/data/supporting-guides-border";

export const SUPPORTING_GUIDES = {
  ...AGRICULTURE_SUPPORTING_GUIDES,
  ...VETERANS_SUPPORTING_GUIDES,
  ...LAW_ENFORCEMENT_SUPPORTING_GUIDES,
  ...BORDER_SUPPORTING_GUIDES,
};

export const ALL_GUIDES: Record<string, CornerstoneGuide> = {
  ...CORNERSTONE_GUIDES,
  ...SUPPORTING_GUIDES,
};

export const SUPPORTING_GUIDE_SLUGS = Object.keys(SUPPORTING_GUIDES);

export function supportingGuidesForPillar(pillarHref: string): CornerstoneGuide[] {
  return Object.values(SUPPORTING_GUIDES).filter((guide) => guide.pillarHref === pillarHref);
}
