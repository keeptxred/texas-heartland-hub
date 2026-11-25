import type { AgencyAuthorityProfile } from "@/data/agency-authority";
import { upgradeAgencyAuthorityProfile } from "@/data/agency-authority-upgrades";
import { getAgencyPracticalGuide } from "@/data/agency-practical-guides";
import { getAgencyAuthoritySupplement } from "@/data/agency-authority-supplements";

export const MIN_AGENCY_AUTHORITY_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function effectiveProfile(profile: AgencyAuthorityProfile) {
  return upgradeAgencyAuthorityProfile(profile);
}

export function agencyAuthorityWordCount(profile: AgencyAuthorityProfile) {
  const effective = effectiveProfile(profile);
  return words([
    effective.name,
    effective.dek,
    effective.quickAnswer,
    effective.authority,
    ...effective.responsibilities,
    ...effective.notResponsibleFor,
    ...effective.accountability,
    ...effective.programs,
    ...getAgencyAuthoritySupplement(effective.slug),
    ...getAgencyPracticalGuide(effective.slug).flatMap((item) => [item.question, item.explanation]),
    ...effective.sources.map((source) => source.label),
  ].join(" "));
}

export function isAgencyAuthorityIndexable(profile: AgencyAuthorityProfile | null | undefined): profile is AgencyAuthorityProfile {
  if (!profile) return false;
  const effective = effectiveProfile(profile);
  return agencyAuthorityWordCount(effective) >= MIN_AGENCY_AUTHORITY_WORDS
    && effective.sources.length >= 3
    && effective.sources.filter((source) => source.primary).length >= 2
    && effective.responsibilities.length >= 4
    && effective.notResponsibleFor.length >= 3
    && effective.accountability.length >= 3;
}
