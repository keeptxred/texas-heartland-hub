import type { TexasCasePosition } from "@/data/texas-case";
import type { AgencyAuthorityProfile } from "@/data/agency-authority";

export const MIN_TEXAS_CASE_POSITION_WORDS = 700;
export const MIN_AGENCY_AUTHORITY_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function texasCasePositionWordCount(position: TexasCasePosition) {
  return words([
    position.title,
    position.dek,
    position.stance,
    ...position.keyPoints,
    ...position.intro,
    ...position.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
  ].join(" "));
}

export function isTexasCasePositionIndexable(position: TexasCasePosition | null | undefined): position is TexasCasePosition {
  return Boolean(position)
    && texasCasePositionWordCount(position!) >= MIN_TEXAS_CASE_POSITION_WORDS
    && position!.sources.length >= 3
    && position!.sections.length >= 4
    && position!.keyPoints.length >= 4
    && position!.intro.length >= 2;
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
  ].join(" "));
}

export function isAgencyAuthorityIndexable(profile: AgencyAuthorityProfile | null | undefined): profile is AgencyAuthorityProfile {
  if (!profile) return false;
  const primarySources = profile.sources.filter((source) => source.primary).length;
  return agencyAuthorityWordCount(profile) >= MIN_AGENCY_AUTHORITY_WORDS
    && primarySources >= 3
    && profile.responsibilities.length >= 4
    && profile.notResponsibleFor.length >= 3
    && profile.accountability.length >= 3;
}
