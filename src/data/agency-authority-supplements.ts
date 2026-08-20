export const AGENCY_AUTHORITY_SUPPLEMENTS: Record<string, string[]> = {
  "texas-department-public-safety": [
    "DPS also serves as a statewide coordination point when an incident crosses local boundaries or requires specialized capabilities that a local department may not maintain on its own. Assistance can include laboratory, intelligence, aviation, tactical, communications or investigative resources, but the requesting agency and the applicable criminal or emergency-management laws still determine who has legal responsibility for the underlying matter. That distinction is important when evaluating whether DPS is leading an operation, supporting another agency or simply maintaining a statewide system used by multiple jurisdictions.",
    "Administrative performance is separately measurable through public records such as driver-license service levels, criminal-history system operations, procurement, appropriations, staffing demand and commission proceedings. Those records let readers evaluate access, backlogs, technology reliability and spending without confusing civilian service performance with arrests, investigations or other enforcement outcomes.",
  ],
  "public-utility-commission": [
    "PUCT oversight is not identical across every electricity provider in Texas. Investor-owned utilities, retail electric providers and the competitive market operate under different statutory and commission rules, while municipally owned utilities and electric cooperatives retain substantial local or member governance where state law limits commission jurisdiction. ERCOT administers the grid and wholesale market under commission oversight, but the commission establishes and enforces the regulatory framework rather than operating the grid itself. That distinction matters when tracing responsibility for rates, market rules, reliability standards and customer complaints.",
  ],
  ercot: [
    "ERCOT accountability also depends on separating real-time operational decisions from longer-term market and reliability policy. Public operating data, protocol revisions, board materials, PUCT proceedings and post-event reports allow readers to trace whether a failure arose from dispatch, generation availability, transmission constraints, forecasting, market design or regulatory standards instead of assigning every grid problem to a single institution.",
  ],
  "texas-department-transportation": [
    "TxDOT's authority is strongest over the state highway system, but transportation responsibility in Texas is divided among several layers of government and specialized entities. Cities and counties control many local streets and roads, regional mobility and toll authorities can finance or operate particular facilities, and metropolitan planning organizations help set regional priorities for federally supported transportation spending. TxDOT may design, acquire right of way for, contract, build or maintain a project without controlling every connecting local road or land-use decision. Distinguishing project ownership, funding approval, environmental review, toll policy and day-to-day maintenance helps identify which public body is actually accountable for a delay, condition or policy choice.",
  ],
};

export function getAgencyAuthoritySupplement(slug: string) {
  return AGENCY_AUTHORITY_SUPPLEMENTS[slug] ?? [];
}
