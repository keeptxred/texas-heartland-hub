import { FAMILY_MARRIAGE_GUIDES } from "@/data/laws-family-marriage";
import { FAMILY_DIVORCE_GUIDES } from "@/data/laws-family-divorce";
import { FAMILY_NAME_CUSTODY_GUIDES } from "@/data/laws-family-name-custody";
import { FAMILY_POSSESSION_SUPPORT_GUIDES } from "@/data/laws-family-possession-support";
import { FAMILY_PATERNITY_PROTECTIVE_GUIDES } from "@/data/laws-family-paternity-protective";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH10_GUIDES: Record<string, CornerstoneGuide> = {
  ...FAMILY_MARRIAGE_GUIDES,
  ...FAMILY_DIVORCE_GUIDES,
  ...FAMILY_NAME_CUSTODY_GUIDES,
  ...FAMILY_POSSESSION_SUPPORT_GUIDES,
  ...FAMILY_PATERNITY_PROTECTIVE_GUIDES,
};
