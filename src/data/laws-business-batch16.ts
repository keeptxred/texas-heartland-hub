import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-14",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

export const BUSINESS_BATCH16_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-llc-formation-law": {
    ...common,
    slug: "texas-llc-formation-law",
    title: "How to Form a Texas LLC: Certificate, Management and State Filing Rules",
    dek: "The Texas legal framework for forming an LLC, including the certificate of formation, registered agent, governing persons, management structure, purpose, and the difference between formation and tax compliance.",
    keyTakeaways: [
      "A Texas LLC is formed under Business Organizations Code Chapter 101 by filing a certificate of formation that satisfies the statewide filing requirements.",
      "The certificate must identify a registered agent and registered office and state whether the LLC will initially be manager-managed or member-managed.",
      "At least one initial governing person must be identified in the certificate: a manager for a manager-managed LLC or a member for a member-managed LLC.",
      "Secretary of State formation does not replace separate tax, permit, licensing, or local compliance obligations that may apply to the business.",
    ],
    intro: [
      "Forming a Texas LLC is a state-law filing process, but the filing is only the legal starting point. The business may still need tax accounts, permits, professional licenses, local approvals, contracts, and internal governance documents.",
      "This guide explains the statewide formation rules rather than recommending whether an LLC is the best tax or liability structure for a particular owner.",
    ],
    sections: [
      { heading: "The certificate of formation creates the Texas LLC", paragraphs: ["Texas Secretary of State Form 205 is designed around Business Organizations Code Chapter 101 and the general formation provisions in Chapter 3. The filing identifies the entity name, registered agent and office, governing authority, purpose, organizer, and any supplemental provisions." ] },
      { heading: "Management structure belongs in the filing", paragraphs: ["The certificate must state whether the LLC initially has managers. A manager-managed LLC lists its initial manager or managers; a member-managed LLC lists its initial member or members as governing persons." ] },
      { heading: "A registered agent is mandatory", paragraphs: ["The LLC must designate a qualifying registered agent and Texas registered office. The LLC itself cannot serve as its own registered agent, and the named agent must consent to serve." ] },
      { heading: "Formation is not the same as full compliance", paragraphs: ["The Secretary of State filing does not determine federal tax treatment, sales-tax obligations, franchise-tax filing, industry licensing, or local permitting. Those questions must be checked separately for the business's activities." ] },
    ],
    faq: [
      { q: "Does a Texas LLC need at least two members?", a: "No. Texas Secretary of State guidance states that an LLC may have one or more members." },
      { q: "Does the certificate have to say who manages the LLC?", a: "Yes. The filing must state whether the LLC initially has managers and identify the applicable initial governing person or persons." },
      { q: "Does forming the LLC automatically register every tax account and license?", a: "No. Formation and tax or regulatory compliance are separate processes." },
    ],
    sources: [
      { label: "Texas Business Organizations Code Chapter 101", url: "https://statutes.capitol.texas.gov/Docs/BO/htm/BO.101.htm" },
      { label: "Texas Secretary of State — Form 205 LLC instructions", url: "https://www.sos.state.tx.us/corp/instructions/205.shtml" },
    ],
    related: [
      { label: "Texas registered agent law", href: "/guides/texas-registered-agent-law" },
      { label: "Texas LLC management and company agreements", href: "/guides/texas-llc-management-company-agreement-law" },
      { label: "Texas franchise tax filing", href: "/guides/texas-franchise-tax-filing-law" },
    ],
  },

  "texas-registered-agent-law": {
    ...common,
    slug: "texas-registered-agent-law",
    title: "Texas Registered Agent Law: Who Can Serve and What Address Is Required",
    dek: "Texas registered-agent rules for domestic and foreign filing entities, including consent, eligible agents, the physical-office requirement, service of process, and updating an agent after changes.",
    keyTakeaways: [
      "Texas filing entities must continuously maintain a registered agent and registered office in Texas.",
      "The agent may be a Texas resident individual or a qualifying organization other than the represented entity itself.",
      "The registered office must be a physical Texas street address where service of process can be made during normal business hours; a stand-alone mailbox service is not enough.",
      "A person designated as registered agent must consent in written or electronic form, although that consent generally is not filed with the certificate of formation.",
    ],
    intro: ["The registered agent is the person or organization designated to receive legal process and official notices for a filing entity. Losing a reliable registered agent can create serious notice and default risks.", "Texas treats the agent and registered office as continuing compliance requirements, not merely formation-day information."],
    sections: [
      { heading: "Every filing entity needs a Texas agent and office", paragraphs: ["Business Organizations Code Section 5.201 requires domestic and foreign filing entities to maintain a registered agent and registered office in this state." ] },
      { heading: "The represented entity cannot simply name itself", paragraphs: ["Secretary of State guidance allows a Texas resident individual or an eligible organization to serve, but the represented entity itself cannot act as its own registered agent." ] },
      { heading: "The office must support personal service", paragraphs: ["The registered office must be a Texas street address where the agent can be personally served during normal business hours. A commercial mailbox or answering-service address by itself does not satisfy the rule unless the qualifying business is itself the registered agent." ] },
      { heading: "Consent is required", paragraphs: ["Section 5.201 and Secretary of State guidance require the agent to have consented in written or electronic form. Naming someone without consent can create filing and liability problems." ] },
    ],
    faq: [
      { q: "Can my Texas LLC be its own registered agent?", a: "No. The represented entity cannot serve as its own registered agent." },
      { q: "Can I use only a P.O. box as the registered office?", a: "No. The registered office must be a physical Texas location where service can occur during normal business hours." },
      { q: "Does the registered agent have to consent?", a: "Yes. Texas requires written or electronic consent, although the consent document generally is retained rather than filed with the formation certificate." },
    ],
    sources: [
      { label: "Texas Business Organizations Code § 5.201", url: "https://statutes.capitol.texas.gov/?artSec=5.201&chapter=BO.5&code=BO&tab=1" },
      { label: "Texas Secretary of State — Registered Agents", url: "https://www.sos.state.tx.us/corp/registeredagents.shtml" },
    ],
    related: [
      { label: "Texas LLC formation", href: "/guides/texas-llc-formation-law" },
      { label: "Texas business ownership changes", href: "/guides/texas-business-ownership-change-law" },
      { label: "Texas entity termination", href: "/guides/texas-business-termination-law" },
    ],
  },

  "texas-business-name-availability-law": {
    ...common,
    slug: "texas-business-name-availability-law",
    title: "Texas Business Name Availability: Entity Names, Distinguishability and Trademark Limits",
    dek: "How Texas decides whether a business-entity name is available for filing, what distinguishability means, why preliminary clearance is not final approval, and why formation does not create trademark rights.",
    keyTakeaways: [
      "A Texas filing-entity name generally must be distinguishable in the Secretary of State's records from existing protected names and registrations.",
      "Texas administrative rules determine when names are distinguishable, the same, or available with consent.",
      "A preliminary name-availability response is not a final determination; final acceptance occurs when the filing is processed.",
      "Acceptance of an entity name does not authorize infringement of another person's trademark or other name rights.",
    ],
    intro: ["Texas name availability is a filing-screening rule, not a complete brand-rights clearance. A name can pass the Secretary of State's records test and still create trademark or unfair-competition risk.", "Businesses should separate three questions: state entity-name availability, assumed-name filing, and trademark rights."],
    sections: [
      { heading: "State records must show a distinguishable name", paragraphs: ["Business Organizations Code Section 5.053 and Secretary of State rules require qualifying names to be distinguishable in the records from existing filing entities, registered foreign entities, registered series, reservations, and registrations." ] },
      { heading: "Administrative rules control the comparison", paragraphs: ["Texas Administrative Code name-availability rules specify which differences in wording, punctuation, entity designators, or other features matter for filing purposes." ] },
      { heading: "Preliminary clearance is not final", paragraphs: ["The Secretary of State can provide a preliminary determination, but its own guidance warns against making expenditures or executing documents solely because of that preliminary clearance." ] },
      { heading: "Entity-name acceptance is not trademark permission", paragraphs: ["The Secretary of State expressly warns that preclearance or issuance of a certificate under a name does not authorize use of that name in violation of another person's rights." ] },
    ],
    faq: [
      { q: "If SOSDirect shows a name available, is it guaranteed?", a: "No. The Secretary of State says a final determination is made when the filing is received and processed." },
      { q: "Does an accepted LLC name give me a trademark?", a: "No. Entity-name acceptance and trademark rights are different legal questions." },
      { q: "Can two names be similar but still accepted?", a: "Texas uses statutory and administrative distinguishability rules, so the exact comparison depends on those rules and the existing record." },
    ],
    sources: [
      { label: "Texas Business Organizations Code § 5.053", url: "https://statutes.capitol.texas.gov/?artSec=5.053&chapter=BO.5&code=BO&tab=1" },
      { label: "Texas Secretary of State — Name Filings FAQs", url: "https://www.sos.state.tx.us/corp/namefilingsfaqs.shtml" },
    ],
    related: [
      { label: "Texas assumed name / DBA", href: "/guides/texas-assumed-name-dba-law" },
      { label: "Texas LLC formation", href: "/guides/texas-llc-formation-law" },
      { label: "Texas business ownership changes", href: "/guides/texas-business-ownership-change-law" },
    ],
  },

  "texas-assumed-name-dba-law": {
    ...common,
    slug: "texas-assumed-name-dba-law",
    title: "Texas Assumed Name and DBA Law: When a Business Must File",
    dek: "Texas assumed-name filing rules for entities doing business under a name other than their legal name, including where filing occurs, what notice does, and why a DBA does not create trademark priority.",
    keyTakeaways: [
      "A covered Texas or foreign filing entity that regularly conducts business or professional services under a name other than its legal name generally must file an assumed-name certificate with the Secretary of State.",
      "Texas Business & Commerce Code Chapter 71 governs assumed names, with different filing paths for certain non-filing businesses and local circumstances.",
      "An assumed-name filing gives public notice; it does not by itself establish priority in the name.",
      "A DBA does not override trademark, unfair-competition, or other superior rights held by someone else.",
    ],
    intro: ["A DBA is a name-use filing, not a new legal entity. The underlying company remains the same entity unless a separate entity is actually formed.", "The correct filing location depends on the business type, so owners should identify whether the business is a Secretary-of-State filing entity before relying on a county-only process."],
    sections: [
      { heading: "Filing entities use the Secretary of State process", paragraphs: ["Secretary of State Form 503 guidance states that corporations, LLCs, limited partnerships, LLPs, and other covered foreign filing entities using a different business name must file under Business & Commerce Code Section 71.103." ] },
      { heading: "A DBA does not create another LLC or corporation", paragraphs: ["An assumed name describes how the existing person or entity transacts business. It does not itself create a separate liability shield, ownership structure, or taxpayer." ] },
      { heading: "The filing is notice, not name priority", paragraphs: ["Section 71.157 states that assumed-name filing provides public notice but does not constitute actual use for determining priority in the name." ] },
      { heading: "Other name rights still apply", paragraphs: ["The filing does not authorize use that violates trademark, unfair-competition, copyright-like, or other legal rights. Businesses should perform separate brand-rights diligence." ] },
    ],
    faq: [
      { q: "Does filing a DBA create a new business entity?", a: "No. It is an assumed-name filing for the existing person or entity." },
      { q: "Does a Texas DBA give me exclusive rights to the name?", a: "No. The statute says filing does not establish actual use for priority and does not defeat superior legal rights." },
      { q: "Does every Texas DBA go only to the county clerk?", a: "No. Covered filing entities generally file with the Secretary of State; other business types can have different Chapter 71 filing requirements." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code Chapter 71", url: "https://statutes.capitol.texas.gov/Docs/BC/htm/BC.71.htm" },
      { label: "Texas Secretary of State — Form 503 assumed-name instructions", url: "https://www.sos.state.tx.us/corp/instructions/503.shtml" },
    ],
    related: [
      { label: "Texas business-name availability", href: "/guides/texas-business-name-availability-law" },
      { label: "Texas LLC formation", href: "/guides/texas-llc-formation-law" },
      { label: "Texas sales-tax permits", href: "/guides/texas-sales-tax-permit-law" },
    ],
  },

  "texas-llc-management-company-agreement-law": {
    ...common,
    slug: "texas-llc-management-company-agreement-law",
    title: "Texas LLC Management and Company Agreements: Member-Managed vs. Manager-Managed",
    dek: "How Texas LLC governance works, including member-managed and manager-managed structures, the role of a company agreement, internal documents, and what is or is not filed with the Secretary of State.",
    keyTakeaways: [
      "A Texas LLC can be member-managed or manager-managed, and the certificate of formation identifies the initial management structure.",
      "The company agreement is the LLC's principal internal governance contract and can address management, economics, voting, transfers, and other internal matters subject to statutory limits.",
      "Internal company agreements are kept by the entity and are not filed with the Texas Secretary of State.",
      "Changing ownership or internal governance does not automatically require the same filing as changing the registered agent, legal name, or certificate provisions.",
    ],
    intro: ["Texas LLC law gives owners substantial flexibility to define governance internally. The certificate tells the state the basic management structure, while the company agreement can carry much of the detailed relationship among owners and managers.", "Because governance provisions can materially affect control and economics, a generic form should not be assumed to fit every company."],
    sections: [
      { heading: "Texas recognizes two basic management structures", paragraphs: ["Secretary of State guidance explains that an LLC may be managed by its members or by a separate group of managers. Managers do not have to be members." ] },
      { heading: "The company agreement governs internal affairs", paragraphs: ["Business Organizations Code Chapter 101 gives the company agreement a central role in governing the LLC's internal affairs and relations among members, managers, and the company, subject to provisions that cannot be waived." ] },
      { heading: "Internal documents are not filed with the Secretary of State", paragraphs: ["The Secretary of State states that bylaws, company agreements, and similar internal governing documents are kept at the entity's principal office and are not accepted for filing." ] },
      { heading: "State filings and internal changes are different", paragraphs: ["A transfer of ownership or internal voting arrangement can be governed by the company agreement without itself creating a Secretary of State ownership filing, while changes to filed certificate information can require a separate amendment or other filing." ] },
    ],
    faq: [
      { q: "Can a Texas LLC have managers who are not members?", a: "Yes. Secretary of State guidance says managers may or may not also be members." },
      { q: "Do I file my operating agreement with Texas?", a: "No. Texas refers to the document as a company agreement, and the Secretary of State does not accept it for filing." },
      { q: "Does a one-member LLC still have a management structure?", a: "Yes. The formation filing still identifies whether the LLC initially has managers or is managed by its member or members." },
    ],
    sources: [
      { label: "Texas Business Organizations Code Chapter 101", url: "https://statutes.capitol.texas.gov/Docs/BO/htm/BO.101.htm" },
      { label: "Texas Secretary of State — Formation of Texas Entities FAQs", url: "https://www.sos.state.tx.us/corp/formationfaqs.shtml" },
    ],
    related: [
      { label: "Texas LLC formation", href: "/guides/texas-llc-formation-law" },
      { label: "Texas business ownership changes", href: "/guides/texas-business-ownership-change-law" },
      { label: "Texas registered-agent law", href: "/guides/texas-registered-agent-law" },
    ],
  },

  "texas-business-ownership-change-law": {
    ...common,
    slug: "texas-business-ownership-change-law",
    title: "Texas Business Ownership Changes: LLC Interests, Corporate Shares and State Filings",
    dek: "What happens when ownership of a Texas LLC or corporation changes, including internal governing documents, Secretary of State filings, management records, registered-agent updates, and securities-law caution.",
    keyTakeaways: [
      "Texas generally does not require a Secretary of State filing merely because LLC membership interests or corporate shares change owners.",
      "LLC ownership transfers are governed by Chapter 101 and the company's governing documents, including the company agreement.",
      "A change in ownership can still trigger separate updates if the registered agent, office, certificate provisions, managers, tax records, permits, licenses, or contracts also change.",
      "The offer or sale of ownership interests can raise state and federal securities-law issues even when no ownership-change filing is required with the Secretary of State.",
    ],
    intro: ["Texas business records do not function like a vehicle title registry that records every ownership transfer. Much ownership information lives in internal records, governing documents, tax filings, and securities-law documentation.", "A sale of the business should therefore be treated as more than a simple name change in a state database."],
    sections: [
      { heading: "Ownership change alone usually is not an SOS filing", paragraphs: ["Texas Secretary of State FAQs explain that corporations and LLCs generally handle ownership changes under the governing statute and internal documents rather than filing an ownership-transfer document with the Secretary of State." ] },
      { heading: "LLC transfers depend on Chapter 101 and the company agreement", paragraphs: ["The legal and economic effect of assigning an LLC interest can depend on the statute and the LLC's governing documents, including whether the transferee becomes a member with governance rights." ] },
      { heading: "Related facts may require separate updates", paragraphs: ["A transaction can still require filings when it changes registered-agent information, certificate provisions, assumed names, franchise-tax information, licenses, or other regulated facts." ] },
      { heading: "Selling interests can implicate securities law", paragraphs: ["Secretary of State guidance cautions that offering or selling shares or ownership interests can be regulated by Texas and federal securities law even though the ownership transfer itself is not filed with the Secretary of State." ] },
    ],
    faq: [
      { q: "Do I file a form with the Texas Secretary of State every time an LLC member changes?", a: "Generally no. Ownership changes are ordinarily handled under the statute and governing documents, though related filed information may need updating." },
      { q: "Does a buyer automatically become a voting LLC member?", a: "Not necessarily. The effect of a transfer depends on Chapter 101 and the company agreement." },
      { q: "Can selling LLC interests create securities issues?", a: "Yes. State and federal securities laws can apply independently of Secretary of State filing requirements." },
    ],
    sources: [
      { label: "Texas Business Organizations Code Chapter 101", url: "https://statutes.capitol.texas.gov/Docs/BO/htm/BO.101.htm" },
      { label: "Texas Secretary of State — Amendments and Corrections FAQs", url: "https://www.sos.state.tx.us/corp/amendmentsfaqs.shtml" },
      { label: "Texas Secretary of State — Formation FAQs", url: "https://www.sos.state.tx.us/corp/formationfaqs.shtml" },
    ],
    related: [
      { label: "Texas LLC management", href: "/guides/texas-llc-management-company-agreement-law" },
      { label: "Texas registered-agent law", href: "/guides/texas-registered-agent-law" },
      { label: "Texas entity termination", href: "/guides/texas-business-termination-law" },
    ],
  },

  "texas-sales-tax-permit-law": {
    ...common,
    slug: "texas-sales-tax-permit-law",
    title: "Texas Sales Tax Permit: Who Needs One and What Permit Holders Must Do",
    dek: "When Texas businesses need a sales and use tax permit, taxable goods and services, out-of-state seller thresholds, permit cost, display requirements, returns, collection, and recordkeeping.",
    keyTakeaways: [
      "A business engaged in Texas generally needs a sales and use tax permit when it sells taxable tangible personal property, leases or rents taxable property, or sells taxable services.",
      "Comptroller guidance also requires qualifying out-of-state sellers with at least $500,000 in Texas revenue during the preceding 12 months to obtain a permit for taxable Texas sales.",
      "Texas does not charge a fee for the sales-tax permit, although the Comptroller may require a security bond in some cases.",
      "Permit holders must collect tax on taxable sales, file required returns even when a filing period has no taxable sales, remit tax, and keep adequate records.",
    ],
    intro: ["A Texas sales-tax permit is tied to taxable activity, not merely to having an LLC. Some businesses need one immediately; others may not sell any taxable item or service at all.", "Businesses should classify what they sell before collecting tax, because collecting tax on the wrong transaction and failing to collect tax can both create compliance problems."],
    sections: [
      { heading: "Taxable sellers generally need the permit", paragraphs: ["Comptroller guidance lists sales of tangible personal property, rentals or leases of tangible property, and taxable services as common triggers for a Texas sales and use tax permit." ] },
      { heading: "Remote sellers can have a Texas obligation", paragraphs: ["The Comptroller states that an out-of-state seller of taxable items or services generally must obtain a permit when Texas revenue reaches $500,000 or more in the preceding 12 months, subject to the detailed nexus rules." ] },
      { heading: "The permit itself has no state fee", paragraphs: ["The Comptroller says there is no fee to obtain the permit, although a security bond can be required in some circumstances." ] },
      { heading: "A permit creates ongoing filing and collection duties", paragraphs: ["Permit holders must post the permit, collect tax on taxable sales, pay use tax on taxable purchases when required, timely file and pay, keep adequate records, and file returns even for zero-activity periods when a return is due." ] },
    ],
    faq: [
      { q: "Does every Texas LLC need a sales-tax permit?", a: "No. The need for a permit depends on taxable sales, leases, rentals, services, use-tax activity, and nexus—not merely entity type." },
      { q: "How much does a Texas sales-tax permit cost?", a: "The Comptroller says there is no permit fee, although a security bond may be required in some cases." },
      { q: "Do I file a return if I made no taxable sales?", a: "Yes, if a return is due for your assigned filing period, the Comptroller says permit holders must file even when there are no taxable sales or purchases to report." },
    ],
    sources: [
      { label: "Texas Tax Code Chapter 151", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.151.htm" },
      { label: "Texas Comptroller — Sales Tax Permit FAQ", url: "https://comptroller.texas.gov/taxes/sales/faq/permit.php" },
    ],
    related: [
      { label: "Texas franchise tax filing", href: "/guides/texas-franchise-tax-filing-law" },
      { label: "Texas Public Information Report", href: "/guides/texas-public-information-report-law" },
      { label: "Texas assumed names", href: "/guides/texas-assumed-name-dba-law" },
    ],
  },

  "texas-franchise-tax-filing-law": {
    ...common,
    slug: "texas-franchise-tax-filing-law",
    title: "Texas Franchise Tax Filing: Annual Reports, Thresholds and May 15",
    dek: "Texas franchise-tax filing basics for taxable entities, including the May 15 due date, the no-tax-due threshold, information reports, EZ Computation eligibility, and why a zero tax bill does not always mean no annual filing.",
    keyTakeaways: [
      "Texas franchise-tax annual reports are generally due May 15, subject to the next-business-day rule when the date falls on a weekend or legal holiday.",
      "For 2024 report years and later, entities at or below the no-tax-due threshold generally do not file the old No Tax Due Report, but most still must file the applicable Public Information Report or Ownership Information Report.",
      "The no-tax-due threshold is report-year specific and should be verified from the Comptroller rather than hard-coded into long-term planning.",
      "For the 2026 report year, the Comptroller lists a $2.65 million no-tax-due threshold and allows eligible entities with annualized total revenue of $20 million or less to choose EZ Computation, subject to the method's restrictions.",
    ],
    intro: ["Texas has no individual state income tax, but many legal entities are subject to the franchise-tax system. The annual compliance question is not only whether tax is owed; information-report obligations can remain even below the tax threshold.", "Because rates and thresholds change by report year, this guide emphasizes the filing structure and directs readers to the current Comptroller instructions for numerical thresholds."],
    sections: [
      { heading: "May 15 is the standard annual due date", paragraphs: ["The Comptroller states that annual franchise-tax reports are due May 15, moving to the next business day when May 15 falls on a Saturday, Sunday, or legal holiday." ] },
      { heading: "Below-threshold entities no longer file the old No Tax Due Report", paragraphs: ["Beginning with 2024 report years, a taxable entity at or below the no-tax-due threshold generally does not file a No Tax Due Report, but it usually must continue filing the required information report." ] },
      { heading: "Thresholds are report-year specific", paragraphs: ["The Comptroller publishes current thresholds each report year. For 2026 it lists $2.65 million as the no-tax-due threshold, so older threshold figures should not be reused automatically." ] },
      { heading: "EZ Computation is optional for qualifying entities", paragraphs: ["For 2026, the Comptroller says an entity or combined group with annualized total revenue of $20 million or less may qualify to use EZ Computation, but that election limits deductions and credits compared with the long form." ] },
    ],
    faq: [
      { q: "When is Texas franchise tax generally due?", a: "May 15, with the next-business-day rule when that date falls on a weekend or legal holiday." },
      { q: "If my company owes no franchise tax, can I ignore the annual filing?", a: "Not necessarily. Many entities below the no-tax-due threshold still must file a PIR or OIR." },
      { q: "What is the 2026 no-tax-due threshold?", a: "The Comptroller lists $2.65 million for the 2026 report year. Future years should be checked separately." },
    ],
    sources: [
      { label: "Texas Tax Code Chapter 171", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.171.htm" },
      { label: "Texas Comptroller — Franchise Tax Filing Requirements", url: "https://comptroller.texas.gov/taxes/franchise/filing-requirements.php" },
      { label: "Texas Comptroller — 2026 Franchise Tax Forms", url: "https://comptroller.texas.gov/taxes/franchise/forms/2026-franchise.php" },
    ],
    related: [
      { label: "Texas Public Information Report", href: "/guides/texas-public-information-report-law" },
      { label: "Texas sales-tax permits", href: "/guides/texas-sales-tax-permit-law" },
      { label: "Texas LLC formation", href: "/guides/texas-llc-formation-law" },
    ],
  },

  "texas-public-information-report-law": {
    ...common,
    slug: "texas-public-information-report-law",
    title: "Texas Public Information Report: Who Files the Franchise Tax PIR",
    dek: "Which Texas entities file the annual Public Information Report, what management and ownership information it carries, the filing deadline, and why the PIR can still be required when no franchise tax is due.",
    keyTakeaways: [
      "Texas corporations, LLCs, limited partnerships, professional associations, and financial institutions with the required Texas organization or nexus generally file the Public Information Report rather than the Ownership Information Report.",
      "The PIR is due on the annual franchise-tax report due date and generally identifies officers, directors, managers, members, partners, registered-agent information, and related ownership information as applicable.",
      "For 2024 report years and later, a qualifying entity can be below the no-tax-due threshold and still have to file the PIR.",
      "PIR management information can feed public Texas entity records, while OIR ownership information has different confidentiality treatment.",
    ],
    intro: ["The Public Information Report is part of Texas franchise-tax compliance but is not itself the franchise-tax calculation. It is the annual information filing used by many corporations, LLCs, LPs, professional associations, and financial institutions.", "Owners often overlook it after learning that their revenue is below the no-tax-due threshold; the Comptroller specifically warns that the information report can still be required."],
    sections: [
      { heading: "Entity type determines PIR versus OIR", paragraphs: ["Comptroller guidance assigns corporations, LLCs, limited partnerships, professional associations, and financial institutions to the Public Information Report, while other legally formed taxable entities generally use the Ownership Information Report." ] },
      { heading: "The PIR follows the annual franchise-tax due date", paragraphs: ["The Comptroller states that the PIR is due on the annual franchise-tax report due date, which is generally May 15." ] },
      { heading: "The report carries management and related-entity information", paragraphs: ["The form can require principal-office information and names and addresses for applicable officers, directors, managers, members, general partners, registered agents, and certain entities owned or owning specified interests." ] },
      { heading: "Below-threshold does not mean no PIR", paragraphs: ["The Comptroller expressly states that a PIR or OIR can remain due even when annualized total revenue is at or below the no-tax-due threshold and no franchise-tax report is required." ] },
    ],
    faq: [
      { q: "Does a Texas LLC file a PIR or OIR?", a: "A Texas LLC generally files the Public Information Report when subject to the franchise-tax information-report requirement." },
      { q: "When is the PIR due?", a: "It is due on the annual franchise-tax report due date, generally May 15." },
      { q: "Do I still file a PIR if I am below the no-tax-due threshold?", a: "Usually yes for an otherwise covered entity; the Comptroller specifically says the information report remains required in that situation." },
    ],
    sources: [
      { label: "Texas Tax Code Chapter 171", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.171.htm" },
      { label: "Texas Comptroller — PIR and OIR Filing Requirements", url: "https://comptroller.texas.gov/taxes/franchise/pir-oir-filing-req.php" },
    ],
    related: [
      { label: "Texas franchise tax filing", href: "/guides/texas-franchise-tax-filing-law" },
      { label: "Texas business ownership changes", href: "/guides/texas-business-ownership-change-law" },
      { label: "Texas registered-agent law", href: "/guides/texas-registered-agent-law" },
    ],
  },

  "texas-business-termination-law": {
    ...common,
    slug: "texas-business-termination-law",
    title: "Closing a Texas Business Entity: Termination, Winding Up and Tax Clearance",
    dek: "The Texas state-law framework for ending a domestic for-profit entity, including winding up, certificate of termination, governing-person information, tax-clearance requirements, and why simply stopping operations is not the same as terminating the entity.",
    keyTakeaways: [
      "A Texas domestic entity generally must complete the legally required winding-up process before filing its certificate of termination.",
      "Secretary of State Form 651 is used for termination of many domestic for-profit entities but is not the termination form for every entity type.",
      "The termination filing identifies the entity and governing persons and requires the statutory basis for winding up and termination.",
      "Tax clearance or other Comptroller documentation can be required before the Secretary of State will complete termination for entities subject to Texas franchise-tax clearance rules.",
    ],
    intro: ["Stopping sales, closing a bank account, or letting a website expire does not necessarily end a Texas legal entity. Formal termination follows the Business Organizations Code's winding-up and filing process.", "The correct shutdown sequence depends on entity type, taxes, contracts, employees, creditors, assets, permits, and pending claims, so owners should distinguish operational closure from legal termination."],
    sections: [
      { heading: "Winding up comes before final termination", paragraphs: ["Texas Business Organizations Code Chapter 11 governs winding up and termination. Winding up addresses the entity's affairs before the legal existence is terminated." ] },
      { heading: "The Secretary of State uses a certificate of termination", paragraphs: ["Form 651 is the Secretary of State form for terminating many domestic for-profit entities and asks for the entity's identifying information, event requiring winding up, governing persons, and other statutory statements." ] },
      { heading: "Governing persons must be identified", paragraphs: ["The termination instructions require names and addresses of governing persons, with the applicable category depending on whether the entity is a corporation, LLC, limited partnership, or another covered form." ] },
      { heading: "Tax status is part of the shutdown", paragraphs: ["For entities subject to franchise-tax clearance requirements, ending state tax obligations and obtaining the required Comptroller documentation is a separate step from merely ceasing business operations." ] },
    ],
    faq: [
      { q: "Is a Texas LLC terminated if I just stop using it?", a: "No. Operational inactivity is not the same as completing the statutory winding-up and termination process." },
      { q: "Does every entity use Form 651?", a: "No. The Secretary of State states that Form 651 is not used for certain entity types, including nonprofit corporations and cooperative associations." },
      { q: "Can taxes affect termination?", a: "Yes. Franchise-tax clearance requirements can apply before the state completes termination." },
    ],
    sources: [
      { label: "Texas Business Organizations Code Chapter 11", url: "https://statutes.capitol.texas.gov/Docs/BO/htm/BO.11.htm" },
      { label: "Texas Secretary of State — Form 651 termination instructions", url: "https://www.sos.state.tx.us/corp/instructions/651.shtml" },
    ],
    related: [
      { label: "Texas franchise tax filing", href: "/guides/texas-franchise-tax-filing-law" },
      { label: "Texas Public Information Report", href: "/guides/texas-public-information-report-law" },
      { label: "Texas business ownership changes", href: "/guides/texas-business-ownership-change-law" },
    ],
  },
};
