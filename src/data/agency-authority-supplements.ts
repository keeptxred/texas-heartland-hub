export const AGENCY_AUTHORITY_SUPPLEMENTS: Record<string, string[]> = {
  "texas-department-public-safety": [
    "DPS also serves as a statewide coordination point when an incident crosses local boundaries or requires specialized capabilities that a local department may not maintain on its own. Assistance can include laboratory, intelligence, aviation, tactical, communications or investigative resources, but the requesting agency and the applicable criminal or emergency-management laws still determine who has legal responsibility for the underlying matter. That distinction is important when evaluating whether DPS is leading an operation, supporting another agency or simply maintaining a statewide system used by multiple jurisdictions.",
    "Administrative performance is separately measurable through public records such as driver-license service levels, criminal-history system operations, procurement, appropriations and commission proceedings. Those records let readers evaluate access, backlogs, technology reliability and spending without confusing civilian service performance with arrests, investigations or other enforcement outcomes.",
  ],
};

export function getAgencyAuthoritySupplement(slug: string) {
  return AGENCY_AUTHORITY_SUPPLEMENTS[slug] ?? [];
}
