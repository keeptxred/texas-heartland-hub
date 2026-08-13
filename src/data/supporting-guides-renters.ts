import { LANDLORD_SECURITY_DEPOSIT_GUIDES } from "@/data/laws-landlord-security-deposit";
import { LANDLORD_LATE_FEE_GUIDES } from "@/data/laws-landlord-late-fees";
import { LANDLORD_REPAIR_GUIDES } from "@/data/laws-landlord-repairs";
import { LANDLORD_REPAIR_DEDUCT_GUIDES } from "@/data/laws-landlord-repair-deduct";
import { LANDLORD_APPLICATION_GUIDES } from "@/data/laws-landlord-applications";

export const RENTER_GUIDES = {
  ...LANDLORD_SECURITY_DEPOSIT_GUIDES,
  ...LANDLORD_LATE_FEE_GUIDES,
  ...LANDLORD_REPAIR_GUIDES,
  ...LANDLORD_REPAIR_DEDUCT_GUIDES,
  ...LANDLORD_APPLICATION_GUIDES,
};
