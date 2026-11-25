type ReferenceContext = { heading: string; paragraphs: string[] };
const CONTEXT: Record<string, ReferenceContext> = {
  "live-2026-07-07-governor-abbott-orders-prompt-investigation-into-birth-tourism-package-wf40tc": {
    heading: "Trace the regulatory process",
    paragraphs: [
      "The state's July announcements describe a directive, a referral and an executive order. To evaluate subsequent official action, identify which body has jurisdiction, and distinguish complaint intake, agency investigation, enforcement proceedings and final decisions. Our [HHSC authority and records guide](/texas-government/agencies/health-human-services-commission) and [attorney general powers guide](/news/texas-attorney-general-powers) explain the different responsibilities.",
      "Where disclosable, request the particular records held by the relevant agency. The [Texas public information guide](/news/texas-open-meetings-public-info) explains the process. These reference links do not claim a subsequent finding or establish wrongdoing."
    ]
  },
  "live-2026-07-02-governor-abbott-selects-don-huffines-to-serve-as-new-texas-comptroller-whlu3f": {
    heading: "Follow the office's official fiscal records",
    paragraphs: [
      "The July appointment and August swearing-in are distinct from an election and a new term. The [comptroller office guide](/texas-government/comptroller) links current officeholder information, official revenue estimates and property-tax records. To examine the fiscal consequences of a proposed bill, consult the [fiscal note guide](/texas-government/reference/texas-bill-fiscal-notes).",
      "A proposed tax change, an enacted law, a revenue forecast and actual collections are separate records. These links provide continuing reference context without representing a historical appointment as breaking news."
    ]
  },
  "live-2026-06-28-governor-abbott-announces-axiom-space-redomiciles-in-texas-gcfyg": {
    heading: "Distinguish corporate filings from economic outcomes",
    paragraphs: [
      "The [Texas secretary of state guide](/texas-government/secretary-of-state) explains the role of official business filings. A corporate domicile filing can establish a change in legal jurisdiction but does not itself verify added jobs, investment or a new operational location.",
      "Use [Texas economic records and reporting](/texas-economy) to evaluate separately documented employment and investment claims. Preserve the June announcement as historical evidence rather than treating its publicity as a current economic measurement."
    ]
  }
};
export function historicalNewsReferenceContext(slug: string): ReferenceContext | undefined {
  return CONTEXT[slug];
}
