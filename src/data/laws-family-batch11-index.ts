import { FAMILY_BATCH11_ADOPTION_TERMINATION_GUIDES } from "@/data/laws-family-batch11-adoption-termination";
import { FAMILY_BATCH11_GRANDPARENT_EMANCIPATION_GUIDES } from "@/data/laws-family-batch11-grandparent-emancipation";
import { FAMILY_BATCH11_NAME_CHANGE_GUIDES } from "@/data/laws-family-batch11-name-changes";
import { FAMILY_BATCH11_MODIFICATION_GUIDES } from "@/data/laws-family-batch11-modification";
import { FAMILY_BATCH11_ENFORCEMENT_GUIDES } from "@/data/laws-family-batch11-enforcement";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH11_GUIDES: Record<string, CornerstoneGuide> = {
  ...FAMILY_BATCH11_ADOPTION_TERMINATION_GUIDES,
  ...FAMILY_BATCH11_GRANDPARENT_EMANCIPATION_GUIDES,
  ...FAMILY_BATCH11_NAME_CHANGE_GUIDES,
  ...FAMILY_BATCH11_MODIFICATION_GUIDES,
  ...FAMILY_BATCH11_ENFORCEMENT_GUIDES,
};
