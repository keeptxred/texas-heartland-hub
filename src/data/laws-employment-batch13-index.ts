import { EMPLOYMENT_BATCH13_UNEMPLOYMENT_GUIDES } from "@/data/laws-employment-batch13-unemployment";
import { EMPLOYMENT_BATCH13_APPEALS_WORKERSCOMP_GUIDES } from "@/data/laws-employment-batch13-appeals-workerscomp";
import { EMPLOYMENT_BATCH13_RETALIATION_JURY_GUIDES } from "@/data/laws-employment-batch13-retaliation-jury";
import { EMPLOYMENT_BATCH13_CHILD_FMLA_GUIDES } from "@/data/laws-employment-batch13-child-fmla";
import { EMPLOYMENT_BATCH13_COMPLAINT_PTO_GUIDES } from "@/data/laws-employment-batch13-complaints-pto";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH13_GUIDES: Record<string, CornerstoneGuide> = {
  ...EMPLOYMENT_BATCH13_UNEMPLOYMENT_GUIDES,
  ...EMPLOYMENT_BATCH13_APPEALS_WORKERSCOMP_GUIDES,
  ...EMPLOYMENT_BATCH13_RETALIATION_JURY_GUIDES,
  ...EMPLOYMENT_BATCH13_CHILD_FMLA_GUIDES,
  ...EMPLOYMENT_BATCH13_COMPLAINT_PTO_GUIDES,
};
