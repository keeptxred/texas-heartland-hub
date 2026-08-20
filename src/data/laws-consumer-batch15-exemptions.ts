import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH15_EXEMPTION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-judgment-exempt-property-law": {
    slug: "texas-judgment-exempt-property-law",
    title: "Texas Judgment Exemptions: Property Ordinary Creditors Usually Cannot Take",
    dek: "How Texas Property Code Chapter 42 protects specified personal property from ordinary judgment collection, including the $100,000 family and $50,000 single-adult value limits, current wages, vehicles, tools, furnishings, and secured-credit exceptions.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 42.001 generally exempts listed personal property with aggregate fair-market value up to $100,000 for a family or $50,000 for a single adult who is not a member of a family, excluding liens and other encumbrances from the value calculation.",
      "Section 42.002 identifies protected categories including home furnishings, clothing, tools of a trade, specified vehicles, two firearms, certain livestock, household pets, and other listed property.",
      "Current wages, prescribed health aids, and specified support payments are separately exempt and are not counted toward the ordinary aggregate limit.",
      "The exemption does not erase a valid security interest or other qualifying lien in the same property; secured creditors can have rights ordinary unsecured judgment creditors do not.",
    ],
    intro: [
      "Winning a money judgment does not give a creditor the right to take everything a Texas debtor owns. Chapter 42 protects categories of personal property needed for ordinary life and work.",
      "The exemptions are category- and value-based and interact differently with secured debt, bankruptcy, tax collection, and support obligations. A debtor should identify both the property and the type of creditor before assuming an exemption applies.",
    ],
    sections: [
      { heading: "Texas uses $100,000 and $50,000 aggregate limits", paragraphs: ["Section 42.001 protects qualifying personal property up to an aggregate fair-market value of $100,000 for a family or $50,000 for a single adult who is not a member of a family. Liens and security interests encumbering the property are excluded when the statutory aggregate is calculated."] },
      { heading: "Only listed categories qualify for the Chapter 42 basket", paragraphs: ["Section 42.002 lists the personal property that can use the aggregate exemption, including home furnishings, food provisions, farming or ranching equipment, tools and equipment used in a trade or profession, clothing, limited jewelry, two firearms, sporting equipment, qualifying vehicles, specified animals, and household pets."] },
      { heading: "Some property sits outside the aggregate cap", paragraphs: ["Current wages for personal services, professionally prescribed health aids, and qualifying alimony, support, or separate maintenance are separately exempt under Section 42.001(b). The statute also contains additional specialized exemptions for certain savings plans and other property."] },
      { heading: "A security interest can survive the exemption", paragraphs: ["Section 42.002(b) makes clear that exempt personal property can still be subject to a valid security interest or lien when other law allows the encumbrance. A vehicle lender, for example, is not placed in the same position as an unsecured credit-card judgment creditor merely because the vehicle fits an exempt category."] },
    ],
    faq: [
      { q: "Can a Texas judgment creditor take all of my household property?", a: "No. Chapter 42 exempts listed categories of personal property within the statutory value limits, although nonexempt property and valid secured liens require separate analysis." },
      { q: "How much personal property is protected?", a: "Section 42.001 generally uses a $100,000 aggregate limit for a family and $50,000 for a single adult who is not a family member, calculated as the statute directs." },
      { q: "Is a financed car protected from repossession because cars can be exempt?", a: "Not necessarily. Chapter 42 does not invalidate a valid security interest; a secured auto lender can have contractual and UCC repossession rights after default." },
    ],
    sources: [
      { label: "Texas Property Code Chapter 42", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.42.htm" },
      { label: "Texas Property Code § 42.001", url: "https://statutes.capitol.texas.gov/?artSec=42.001&chapter=PR.42&code=PR&tab=1" },
      { label: "Texas Property Code § 42.002", url: "https://statutes.capitol.texas.gov/?artSec=42.002&chapter=PR.42&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas wage garnishment law", href: "/guides/texas-wage-garnishment-law" },
      { label: "Texas judgment lien and homestead law", href: "/guides/texas-judgment-lien-homestead-law" },
      { label: "Texas vehicle repossession law", href: "/guides/texas-vehicle-repossession-law" },
    ],
  },

  "texas-judgment-lien-homestead-law": {
    slug: "texas-judgment-lien-homestead-law",
    title: "Texas Judgment Liens and Homesteads: What an Abstract of Judgment Attaches To",
    dek: "How Texas Property Code Chapter 52 creates judgment liens on nonexempt real property, why a qualifying homestead is generally excluded, the 10-year ordinary lien period, and the statutory homestead-release affidavit process.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A properly recorded and indexed abstract of a nondormant judgment generally creates a lien on the debtor's nonexempt real property in that county under Property Code Section 52.001.",
      "Section 52.001 expressly excludes real property exempt from seizure or forced sale under Chapter 41, the Texas Constitution, or other law, which ordinarily includes a qualifying Texas homestead against an ordinary judgment creditor.",
      "An ordinary judgment lien generally continues for 10 years after the abstract is recorded and indexed, unless the judgment becomes dormant or another statutory rule applies.",
      "Section 52.0012 provides a specific affidavit-and-mailing procedure that can release the record of a judgment lien as to qualifying homestead property, subject to the creditor's statutory opportunity to file a contradicting affidavit.",
    ],
    intro: [
      "A judgment and a judgment lien are related but not identical. A creditor generally creates the real-property lien by recording and indexing an abstract of judgment in the county records.",
      "Texas homestead protection is powerful, but a recorded abstract can still create title problems that must be addressed. Chapter 52 supplies a statutory release procedure for qualifying homestead property.",
    ],
    sections: [
      { heading: "The abstract creates a county-level lien on nonexempt real property", paragraphs: ["Section 52.001 states that a properly recorded and indexed abstract of a nondormant judgment attaches to the defendant's nonexempt real property in that county, including qualifying property acquired after recording."] },
      { heading: "Exempt homestead property is excluded from the ordinary lien", paragraphs: ["Section 52.001 excludes real property exempt from seizure or forced sale under Chapter 41, the Texas Constitution, or other law. Property Code Section 41.001 separately protects the homestead from ordinary creditor seizure except for specified encumbrances that may be properly fixed on homestead property."] },
      { heading: "The ordinary Chapter 52 lien lasts up to 10 years", paragraphs: ["Section 52.006 generally provides that a judgment lien continues for 10 years following recording and indexing of the abstract, except that a dormant judgment can cause the lien to cease. State judgments have a separate statutory duration rule."] },
      { heading: "Section 52.0012 creates a homestead release procedure", paragraphs: ["A judgment debtor can file the statutory homestead affidavit and certificate of mailing and provide the required notice to the judgment creditor. If the creditor does not timely file a qualifying contradicting affidavit, the statute gives the filed affidavit specified release and reliance effects for the homestead record."] },
    ],
    faq: [
      { q: "Does a recorded judgment automatically attach to my Texas homestead?", a: "Section 52.001 excludes real property that is exempt from seizure or forced sale. A qualifying homestead is generally protected from an ordinary judgment lien, although special liens and exceptions must be analyzed separately." },
      { q: "How long does an ordinary Texas judgment lien last?", a: "Section 52.006 generally provides a 10-year period after recording and indexing, subject to judgment dormancy and special rules." },
      { q: "How can a homestead owner clear a judgment-lien record?", a: "Section 52.0012 provides a detailed affidavit, mailing, and creditor-response procedure for qualifying homestead property. The statutory form and deadlines should be followed carefully." },
    ],
    sources: [
      { label: "Texas Property Code Chapter 52", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.52.htm" },
      { label: "Texas Property Code § 52.001", url: "https://statutes.capitol.texas.gov/?artSec=52.001&chapter=PR.52&code=PR&tab=1" },
      { label: "Texas Property Code § 52.0012", url: "https://statutes.capitol.texas.gov/?artSec=52.0012&chapter=PR.52&code=PR&tab=1" },
      { label: "Texas Property Code § 41.001", url: "https://statutes.capitol.texas.gov/?artSec=41.001&chapter=PR.41&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas judgment exemptions", href: "/guides/texas-judgment-exempt-property-law" },
      { label: "Texas mortgage foreclosure notice", href: "/guides/texas-mortgage-foreclosure-notice-law" },
      { label: "Texas wage garnishment law", href: "/guides/texas-wage-garnishment-law" },
    ],
  },
};
