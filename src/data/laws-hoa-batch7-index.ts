import { HOA_WATER_GUIDES } from "@/data/laws-hoa-water";
import { HOA_CONSERVATION_GUIDES } from "@/data/laws-hoa-conservation";
import { HOA_ENERGY_GUIDES } from "@/data/laws-hoa-energy";
import { HOA_HOME_PROTECTION_GUIDES } from "@/data/laws-hoa-home-protections";
import { HOA_SECURITY_RENTAL_GUIDES } from "@/data/laws-hoa-security-rental";

export const HOA_BATCH7_GUIDES = {
  ...HOA_WATER_GUIDES,
  ...HOA_CONSERVATION_GUIDES,
  ...HOA_ENERGY_GUIDES,
  ...HOA_HOME_PROTECTION_GUIDES,
  ...HOA_SECURITY_RENTAL_GUIDES,
};
