import { LANDLORD_BATCH5_LEASE_GUIDES } from "@/data/laws-landlord-batch5-lease";
import { LANDLORD_BATCH5_UTILITIES_PROPERTY_GUIDES } from "@/data/laws-landlord-batch5-utilities-property";
import { LANDLORD_BATCH5_ANIMALS_RENT_CONTROL_GUIDES } from "@/data/laws-landlord-batch5-animals-rent-control";
import { LANDLORD_BATCH5_FAMILY_VIOLENCE_GUIDES } from "@/data/laws-landlord-batch5-family-violence";
import { LANDLORD_BATCH5_SEX_OFFENSE_STALKING_GUIDES } from "@/data/laws-landlord-batch5-sex-offense-stalking";
import { LANDLORD_BATCH5_EMERGENCY_ASSISTANCE_GUIDES } from "@/data/laws-landlord-batch5-emergency-assistance";
import { LANDLORD_BATCH5_EMERGENCY_PHONE_GUIDES } from "@/data/laws-landlord-batch5-emergency-phone";

export const LANDLORD_BATCH5_GUIDES = {
  ...LANDLORD_BATCH5_LEASE_GUIDES,
  ...LANDLORD_BATCH5_UTILITIES_PROPERTY_GUIDES,
  ...LANDLORD_BATCH5_ANIMALS_RENT_CONTROL_GUIDES,
  ...LANDLORD_BATCH5_FAMILY_VIOLENCE_GUIDES,
  ...LANDLORD_BATCH5_SEX_OFFENSE_STALKING_GUIDES,
  ...LANDLORD_BATCH5_EMERGENCY_ASSISTANCE_GUIDES,
  ...LANDLORD_BATCH5_EMERGENCY_PHONE_GUIDES,
};
