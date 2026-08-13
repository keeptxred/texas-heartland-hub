import { LANDLORD_RENT_INCREASE_GUIDES } from "@/data/laws-landlord-rent-increase";
import { LANDLORD_ENTRY_GUIDES } from "@/data/laws-landlord-entry";
import { LANDLORD_LEASE_COPY_GUIDES } from "@/data/laws-landlord-lease-copy";

export const RENTER_GUIDES_B = {
  ...LANDLORD_RENT_INCREASE_GUIDES,
  ...LANDLORD_ENTRY_GUIDES,
  ...LANDLORD_LEASE_COPY_GUIDES,
};
