export const VOTER_REGISTRATION_STATUSES = [
  "active",
  "inactive",
  "pending",
  "cancelled",
  "rejected",
  "unknown",
] as const;
export type VoterRegistrationStatus = (typeof VOTER_REGISTRATION_STATUSES)[number];

export const VOTER_REGISTRATION_METHODS = [
  "online",
  "mail",
  "in_person",
  "deputy_registrar",
  "agency",
  "other",
] as const;
export type VoterRegistrationMethod = (typeof VOTER_REGISTRATION_METHODS)[number];

export const VOTER_ELIGIBILITY_STATUSES = [
  "eligible",
  "ineligible",
  "needs_review",
  "unknown",
] as const;
export type VoterEligibilityStatus = (typeof VOTER_ELIGIBILITY_STATUSES)[number];

export const VOTER_REGISTRATION_CHANGE_TYPES = [
  "new_registration",
  "address_change",
  "name_change",
  "county_transfer",
  "replacement_certificate",
  "cancellation",
] as const;
export type VoterRegistrationChangeType = (typeof VOTER_REGISTRATION_CHANGE_TYPES)[number];
