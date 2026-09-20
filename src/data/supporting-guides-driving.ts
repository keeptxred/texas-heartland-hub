import { DRIVING_SPEED_RESTRAINT_GUIDES } from "@/data/laws-driving-speed-restraints";
import { DRIVING_PHONE_MOVE_OVER_GUIDES } from "@/data/laws-driving-phone-move-over";
import { DRIVING_INSURANCE_GUIDES } from "@/data/laws-driving-insurance";
import { DRIVING_REGISTRATION_GUIDES } from "@/data/laws-driving-registration";
import { DRIVING_PLATE_PASSING_GUIDES } from "@/data/laws-driving-plates-passing";
import { DRIVING_SCHOOL_BUS_GUIDES } from "@/data/laws-driving-school-bus";
import { DRIVING_DWI_GUIDES } from "@/data/laws-driving-dwi";

export const DRIVING_SUPPORTING_GUIDES = {
  ...DRIVING_SPEED_RESTRAINT_GUIDES,
  ...DRIVING_PHONE_MOVE_OVER_GUIDES,
  ...DRIVING_INSURANCE_GUIDES,
  ...DRIVING_REGISTRATION_GUIDES,
  ...DRIVING_PLATE_PASSING_GUIDES,
  ...DRIVING_SCHOOL_BUS_GUIDES,
  ...DRIVING_DWI_GUIDES,
};
