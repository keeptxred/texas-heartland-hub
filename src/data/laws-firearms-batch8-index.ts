import { FIREARMS_FOUNDATION_GUIDES } from "@/data/laws-firearms-foundation";
import { FIREARMS_CARRY_GUIDES } from "@/data/laws-firearms-carry";
import { FIREARMS_PLACES_VEHICLE_GUIDES } from "@/data/laws-firearms-places-vehicle";
import { FIREARMS_CAMPUS_RECIPROCITY_GUIDES } from "@/data/laws-firearms-campus-reciprocity";
import { SELF_DEFENSE_CORE_GUIDES } from "@/data/laws-self-defense-core";

export const FIREARMS_BATCH8_GUIDES = {
  ...FIREARMS_FOUNDATION_GUIDES,
  ...FIREARMS_CARRY_GUIDES,
  ...FIREARMS_PLACES_VEHICLE_GUIDES,
  ...FIREARMS_CAMPUS_RECIPROCITY_GUIDES,
  ...SELF_DEFENSE_CORE_GUIDES,
};
