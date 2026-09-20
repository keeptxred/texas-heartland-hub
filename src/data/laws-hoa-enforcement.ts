import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_ENFORCEMENT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-fines-law": {
    slug: "texas-hoa-fines-law",
    title: "Texas HOA Fines: Notice, Fine Policies and Homeowner Hearings",
    dek: "Texas HOA fine rules explained, including authority in the governing documents, required enforcement policies, notice, cure opportunities, hearings, and limits on foreclosure for fine-only debt.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 209.0061 applies only when the HOA's dedicatory instrument authorizes the association to levy fines.",
      "An HOA board that may levy fines must adopt an enforcement policy listing violation categories, a fine schedule, and information about Section 209.007 hearings.",
      "Chapter 209 separately requires notice before many enforcement actions and gives qualifying owners a right to request a board hearing.",
      "Section 209.009 prohibits foreclosure when the debt securing the assessment lien consists solely of HOA fines, attorney's fees solely tied to those fines, or specified records/recount charges.",
    ],
    intro: ["Texas law regulates both whether an HOA may fine and the process it must follow.", "The association's governing documents remain the first place to check because Section 209.0061 does not create fine authority where the dedicatory instrument does not already authorize it."],
    sections: [
      { heading: "The HOA must have authority to fine", paragraphs: ["Section 209.0061 expressly says its fine-policy requirements do not apply to an association that is not authorized by its dedicatory instrument to levy a fine. The statute regulates existing fine authority rather than creating it from nothing."] },
      { heading: "A written enforcement policy is required", paragraphs: ["The board's enforcement policy must include general categories of restrictive covenants for which fines may be assessed, a schedule of fines for each category, and information about the hearing process under Section 209.007. The policy must also be made available to owners as the statute requires."] },
      { heading: "Notice and hearing rights matter", paragraphs: ["Section 209.006 contains notice requirements before enforcement action, including cure-related information where applicable. Section 209.007 gives an owner who qualifies under the statute a right to request a hearing before the board to discuss and verify the facts and try to resolve the issue."] },
      { heading: "Fine-only debt cannot support foreclosure", paragraphs: ["Section 209.009 states that an association may not foreclose its assessment lien when the debt consists solely of fines and the other fine-related amounts listed in that section. Other unpaid assessments can present a different foreclosure issue."] },
    ],
    faq: [
      { q: "Can every Texas HOA issue fines?", a: "No. Section 209.0061 applies only if the association's dedicatory instrument authorizes fines." },
      { q: "Does a Texas HOA need a published fine policy?", a: "Yes, if it is authorized to levy fines. Section 209.0061 requires an enforcement policy with categories, a fine schedule, and hearing information, and requires the policy to be made available to owners." },
      { q: "Can a Texas HOA foreclose solely because of unpaid fines?", a: "No. Section 209.009 prohibits foreclosure when the debt securing the lien consists solely of the fine-related categories listed in that section." },
    ],
    sources: [
      { label: "Texas Property Code § 209.006", url: "https://statutes.capitol.texas.gov/?artSec=209.006&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.0061", url: "https://statutes.capitol.texas.gov/?artSec=209.0061&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.007", url: "https://statutes.capitol.texas.gov/?artSec=209.007&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.009", url: "https://statutes.capitol.texas.gov/?artSec=209.009&chapter=PR.209&code=PR&tab=1" },
    ],
    related: [{ label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }, { label: "Texas HOA liens", href: "/guides/texas-hoa-lien-law" }, { label: "Texas HOA foreclosure", href: "/guides/texas-hoa-foreclosure-law" }],
  },
  "texas-hoa-foreclosure-law": {
    slug: "texas-hoa-foreclosure-law",
    title: "Can a Texas HOA Foreclose? Assessment-Lien and Court Rules Explained",
    dek: "When a Texas HOA may pursue foreclosure, when foreclosure is prohibited, the court-order requirement, lien prerequisites, and the statutory right of redemption after an HOA foreclosure sale.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "An HOA does not obtain unlimited foreclosure power merely because an owner owes money; the association's governing documents and Chapter 209 both matter.",
      "Section 209.0092 generally requires a court order before a property owners' association forecloses an assessment lien, subject to the statute's stated exceptions and alternatives.",
      "Section 209.009 prohibits foreclosure when the lien debt consists solely of fines and specified fine-related or records-related charges.",
      "Texas law also provides notice protections before an assessment lien is filed and a statutory redemption process after an HOA foreclosure sale.",
    ],
    intro: ["Texas HOA foreclosure is a real remedy, but it is surrounded by statutory prerequisites and limits.", "Homeowners should distinguish between an association's ability to collect a debt, file an assessment lien, and ultimately foreclose that lien; those are separate steps."],
    sections: [
      { heading: "Foreclosure authority must exist", paragraphs: ["Section 209.0093 addresses adoption or removal of foreclosure authority in an association's dedicatory instruments. Section 209.0092 also ties expedited foreclosure to liens described by the association's governing documents and applicable law."] },
      { heading: "A court order is generally required", paragraphs: ["Section 209.0092 generally bars foreclosure of an association assessment lien unless the association first obtains a court order through the expedited procedure, while also allowing the association in specified circumstances to elect judicial foreclosure under a court judgment."] },
      { heading: "Some debts cannot support foreclosure by themselves", paragraphs: ["Section 209.009 prohibits foreclosure if the debt securing the assessment lien consists solely of fines, attorney's fees solely associated with those fines, or the other listed charges. Unpaid regular or special assessments are treated differently."] },
      { heading: "Foreclosure is not the first collection step", paragraphs: ["Before an assessment lien is filed, Section 209.0094 requires staged delinquency notices and waiting periods. Other sections address notice to certain lienholders and provide a homeowner redemption right after foreclosure."] },
    ],
    faq: [
      { q: "Can a Texas HOA foreclose on a home?", a: "Potentially, if foreclosure authority exists and the association satisfies the governing documents and Chapter 209 procedures. The answer depends on the debt and the association's valid lien and foreclosure rights." },
      { q: "Does an HOA need a court order to foreclose?", a: "Section 209.0092 generally requires a court order before foreclosure of an association assessment lien, subject to the section's stated exceptions and procedures." },
      { q: "Can an HOA foreclose for fines alone?", a: "No. Section 209.009 prohibits foreclosure where the lien debt consists solely of fines and the related categories specified by that section." },
    ],
    sources: [
      { label: "Texas Property Code § 209.009", url: "https://statutes.capitol.texas.gov/?artSec=209.009&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.0092", url: "https://statutes.capitol.texas.gov/?artSec=209.0092&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.0093", url: "https://statutes.capitol.texas.gov/?artSec=209.0093&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.011", url: "https://statutes.capitol.texas.gov/?artSec=209.011&chapter=PR.209&code=PR&tab=1" },
    ],
    related: [{ label: "Texas HOA liens", href: "/guides/texas-hoa-lien-law" }, { label: "Texas HOA fines", href: "/guides/texas-hoa-fines-law" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
};
