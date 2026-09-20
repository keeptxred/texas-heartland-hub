import { EMPLOYMENT_BATCH12_PAY_GUIDES } from "@/data/laws-employment-batch12-pay";
import { EMPLOYMENT_BATCH12_WAGE_CLAIM_GUIDES } from "@/data/laws-employment-batch12-wage-claims";
import { EMPLOYMENT_BATCH12_WAGE_HOUR_GUIDES } from "@/data/laws-employment-batch12-wage-hour";
import { EMPLOYMENT_BATCH12_BREAKS_ATWILL_GUIDES } from "@/data/laws-employment-batch12-breaks-atwill";
import { EMPLOYMENT_BATCH12_RIGHTS_COMP_GUIDES } from "@/data/laws-employment-batch12-rights-comp";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH12_GUIDES: Record<string, CornerstoneGuide> = {
  ...EMPLOYMENT_BATCH12_PAY_GUIDES,
  ...EMPLOYMENT_BATCH12_WAGE_CLAIM_GUIDES,
  ...EMPLOYMENT_BATCH12_WAGE_HOUR_GUIDES,
  ...EMPLOYMENT_BATCH12_BREAKS_ATWILL_GUIDES,
  ...EMPLOYMENT_BATCH12_RIGHTS_COMP_GUIDES,
};
