import type { AgencyAuthorityProfile } from "@/data/agency-authority";

export const MIN_AGENCY_AUTHORITY_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function agencyAuthorityWordCount(profile: AgencyAuthorityProfile) {
  return words([
    profile.name,
    profile.dek,
    profile.quickAnswer,
    profile.authority,
    ...profile.responsibilities,
    ...profile.notResponsibleFor,
    ...profile.accountability,
    ...profile.programs,
    ...profile.sources.map((source) => source.label),
  ].join(" "));
}

export function isAgencyAuthorityIndexable(profile: AgencyAuthorityProfile | null | undefined): profile is AgencyAuthorityProfile {
  return Boolean(profile)
    && agencyAuthorityWordCount(profile!) >= MIN_AGENCY_AUTHORITY_WORDS
    && profile!.sources.length >= 3
    && profile!.sources.filter((source) => source.primary).length >= 2
    && profile!.responsibilities.length >= 4
    && profile!.notResponsibleFor.length >= 3
    && profile!.accountability.length >= 3;
}
