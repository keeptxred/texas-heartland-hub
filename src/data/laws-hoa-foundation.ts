import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_FOUNDATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-laws-guide": {
    slug: "texas-hoa-laws-guide",
    title: "Texas HOA Laws: A Homeowner's Guide to Chapter 209",
    dek: "A plain-English guide to the Texas Residential Property Owners Protection Act, HOA governing documents, owner rights, enforcement, records, meetings, elections, liens, and the limits state law places on associations.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Chapter 209 establishes statewide rules for many mandatory-membership residential property owners' associations, but it generally does not govern condominiums.",
      "An HOA's declaration, bylaws, recorded rules, and other dedicatory instruments remain important because many association powers come from those documents rather than from Chapter 209 alone.",
      "State law creates specific owner protections involving records, meetings, voting, enforcement notices, fines, assessment liens, and foreclosure procedure.",
      "Texas does not have a single state agency that generally supervises HOA disputes, so enforcement of owner rights may require use of the procedures and remedies provided by statute or court action.",
    ],
    intro: [
      "Texas HOA disputes usually involve two layers of rules: the association's recorded governing documents and state statutes that limit or regulate how those documents may be enforced.",
      "Chapter 209 is the main starting point for many subdivision HOAs. Chapter 202 also limits certain restrictive covenants, including rules involving flags and other homeowner activities.",
    ],
    sections: [
      { heading: "When Chapter 209 applies", paragraphs: ["Section 209.003 generally applies Chapter 209 to residential subdivisions with recorded restrictions that authorize a property owners' association to collect assessments and require mandatory membership for all or a majority of owners. The chapter states that it does not apply to a condominium as defined by Chapters 81 or 82."] },
      { heading: "Governing documents still matter", paragraphs: ["Chapter 209 defines a 'dedicatory instrument' broadly to include recorded restrictions, bylaws, properly adopted rules and regulations, and lawful amendments. Homeowners should read both state law and the documents recorded for their own subdivision."] },
      { heading: "State law regulates HOA procedure", paragraphs: ["Chapter 209 contains detailed requirements for association records, board meetings, elections, enforcement notices, fine policies, hearings, collection practices, assessment liens, foreclosure, and other association operations."] },
      { heading: "Not every HOA dispute has the same rule", paragraphs: ["Applicability can depend on the type of development, the association's governing documents, whether the subdivision remains in a development period, and the particular statutory section involved. A rule that applies to a Chapter 209 subdivision may not apply the same way to a condominium regime."] },
    ],
    faq: [
      { q: "What is the main Texas HOA law?", a: "For many mandatory-membership residential subdivision associations, the principal statute is Property Code Chapter 209, the Texas Residential Property Owners Protection Act." },
      { q: "Does Chapter 209 apply to Texas condominiums?", a: "Generally no. Section 209.003 states that Chapter 209 does not apply to a condominium as defined by Section 81.002 or 82.003." },
      { q: "Do HOA bylaws and deed restrictions still matter?", a: "Yes. State law regulates and sometimes overrides HOA documents, but many association powers and owner obligations still depend on the subdivision's valid dedicatory instruments." },
    ],
    sources: [
      { label: "Texas Property Code Chapter 209", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 202", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PR.202&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas HOA powers", href: "/guides/texas-hoa-powers-guide" },
      { label: "Texas HOA records", href: "/guides/texas-hoa-records-law" },
    ],
  },
  "texas-hoa-powers-guide": {
    slug: "texas-hoa-powers-guide",
    title: "What Can a Texas HOA Do? Powers, Restrictions and Homeowner Limits",
    dek: "How Texas HOA authority works: governing documents, assessments, covenant enforcement, access rights, board discretion, and statutory limits on what an association may require.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A Texas HOA's authority is not unlimited; the association must act within its valid dedicatory instruments and applicable state law.",
      "Property Code Section 202.004 generally presumes an HOA's discretionary covenant-enforcement decision reasonable unless a court finds it arbitrary, capricious, or discriminatory by a preponderance of the evidence.",
      "Chapter 209 recognizes association assessments and enforcement procedures but also imposes notice, hearing, meeting, collection, lien, and foreclosure safeguards.",
      "Section 209.012 bars an HOA from amending its documents to create an easement through or over an owner's lot without that owner's consent, while preserving properly authorized access to remedy a covenant violation.",
    ],
    intro: [
      "Texas law does not give every HOA the same blanket list of powers. The association's declaration and other governing documents supply much of the authority, while state statutes define procedures and place limits on enforcement.",
      "The practical question is usually not simply whether HOAs have a certain power, but whether this HOA has that authority in its governing documents and is exercising it in a way Texas law permits.",
    ],
    sections: [
      { heading: "Authority begins with the governing documents", paragraphs: ["Chapter 209 defines the association's dedicatory instruments to include the governing restrictions, bylaws, rules, regulations, and lawful amendments. Assessment and enforcement authority commonly depends on those documents."] },
      { heading: "Discretion is not absolute", paragraphs: ["Section 202.004 provides a presumption of reasonableness for an exercise of discretionary authority concerning a restrictive covenant unless a court determines that the exercise was arbitrary, capricious, or discriminatory."] },
      { heading: "State law adds procedural limits", paragraphs: ["Even when an HOA has substantive authority, Chapter 209 may require specific notices, an enforcement policy, an owner hearing opportunity, open-board consideration, or collection and lien steps before the association may act."] },
      { heading: "Some homeowner rights cannot simply be written away", paragraphs: ["Texas statutes invalidate or limit certain HOA restrictions involving subjects such as records access, voting rights, protected flag displays, solar devices, security measures, religious items, and other activities. The exact statute and exceptions should be checked for the issue involved."] },
    ],
    faq: [
      { q: "Can a Texas HOA make any rule it wants?", a: "No. HOA rules must be supported by valid governing authority and must comply with state and federal law. Some restrictions are expressly prohibited or limited by Texas statutes." },
      { q: "Can an HOA enter my lot?", a: "It depends on the governing documents and circumstances. Section 209.012 prevents an HOA from amending its documents to grant itself an easement through or over an owner's lot without consent, but does not prohibit a valid restriction allowing access to remedy a violation." },
      { q: "Are HOA decisions presumed valid?", a: "Section 202.004 gives an HOA's discretionary restrictive-covenant decision a presumption of reasonableness unless a court finds the exercise arbitrary, capricious, or discriminatory by a preponderance of the evidence." },
    ],
    sources: [
      { label: "Texas Property Code § 202.004", url: "https://statutes.capitol.texas.gov/?artSec=202.004&chapter=PR.202&code=PR&tab=1" },
      { label: "Texas Property Code § 209.012", url: "https://statutes.capitol.texas.gov/?artSec=209.012&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 209", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PR.209&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" },
      { label: "Texas HOA fines", href: "/guides/texas-hoa-fines-law" },
      { label: "Texas HOA board meetings", href: "/guides/texas-hoa-board-meetings-law" },
    ],
  },
};
