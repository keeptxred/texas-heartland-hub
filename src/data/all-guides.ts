import { CORNERSTONE_GUIDES, type CornerstoneGuide } from "@/data/cornerstone-guides";
import { AGRICULTURE_SUPPORTING_GUIDES } from "@/data/supporting-guides-agriculture";
import { VETERANS_SUPPORTING_GUIDES } from "@/data/supporting-guides-veterans";
import { LAW_ENFORCEMENT_SUPPORTING_GUIDES } from "@/data/supporting-guides-law-enforcement";
import { BORDER_SUPPORTING_GUIDES } from "@/data/supporting-guides-border";
import { DRIVING_SUPPORTING_GUIDES } from "@/data/supporting-guides-driving";
import { RENTER_GUIDES } from "@/data/supporting-guides-renters";
import { RENTER_GUIDES_B } from "@/data/supporting-guides-renters-b";
import { LANDLORD_SMOKE_ALARM_GUIDES } from "@/data/laws-landlord-smoke-alarm";
import { LANDLORD_BATCH4_GUIDES } from "@/data/laws-landlord-batch4-index";
import { HOA_BATCH6_GUIDES } from "@/data/laws-hoa-batch6-index";
import { HOA_BATCH7_GUIDES } from "@/data/laws-hoa-batch7-index";
import { FIREARMS_BATCH8_GUIDES } from "@/data/laws-firearms-batch8-index";
import { CRIMINAL_BATCH9_GUIDES } from "@/data/laws-criminal-batch9-index";
import { FAMILY_BATCH10_GUIDES } from "@/data/laws-family-batch10-index";
import { FAMILY_BATCH11_GUIDES } from "@/data/laws-family-batch11-index";
import { EMPLOYMENT_BATCH12_GUIDES } from "@/data/laws-employment-batch12-index";
import { EMPLOYMENT_BATCH13_GUIDES } from "@/data/laws-employment-batch13-index";

export const SUPPORTING_GUIDES = {
  ...AGRICULTURE_SUPPORTING_GUIDES,
  ...VETERANS_SUPPORTING_GUIDES,
  ...LAW_ENFORCEMENT_SUPPORTING_GUIDES,
  ...BORDER_SUPPORTING_GUIDES,
  ...DRIVING_SUPPORTING_GUIDES,
  ...RENTER_GUIDES,
  ...RENTER_GUIDES_B,
  ...LANDLORD_SMOKE_ALARM_GUIDES,
  ...LANDLORD_BATCH4_GUIDES,
  ...HOA_BATCH6_GUIDES,
  ...HOA_BATCH7_GUIDES,
  ...FIREARMS_BATCH8_GUIDES,
  ...CRIMINAL_BATCH9_GUIDES,
  ...FAMILY_BATCH10_GUIDES,
  ...FAMILY_BATCH11_GUIDES,
  ...EMPLOYMENT_BATCH12_GUIDES,
  ...EMPLOYMENT_BATCH13_GUIDES,
};

export const ALL_GUIDES: Record<string, CornerstoneGuide> = {
  ...CORNERSTONE_GUIDES,
  ...SUPPORTING_GUIDES,
};

export const SUPPORTING_GUIDE_SLUGS = Object.keys(SUPPORTING_GUIDES);

export function supportingGuidesForPillar(pillarHref: string): CornerstoneGuide[] {
  return Object.values(SUPPORTING_GUIDES).filter((guide) => guide.pillarHref === pillarHref);
}