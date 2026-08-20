import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-15",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const wills = { label: "Texas Estates Code Chapter 251 — Wills", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.251.htm" };
const intestacy = { label: "Texas Estates Code Chapter 201 — Descent and Distribution", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.201.htm" };
const heirship = { label: "Texas Estates Code Chapter 202 — Determination of Heirship", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.202.htm" };
const probate = { label: "Texas Estates Code Chapter 256 — Probate of Wills", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.256.htm" };
const muniment = { label: "Texas Estates Code Chapter 257 — Muniment of Title", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.257.htm" };
const smallEstate = { label: "Texas Estates Code Chapter 205 — Small Estate Affidavit", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.205.htm" };
const personalRep = { label: "Texas Estates Code Chapter 351 — Personal Representative Duties", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.351.htm" };
const independent = { label: "Texas Estates Code Chapter 401 — Independent Administration", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.401.htm" };
const todd = { label: "Texas Estates Code Chapter 114 — Transfer on Death Deed", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.114.htm" };
const sllProbate = { label: "Texas State Law Library — Probate Guide", url: "https://www.sll.texas.gov/spotlight/2024/04/new-improved-probate-guide/" };

export const PROBATE_BATCH21_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-will-requirements-guide": {
    ...common,
    slug: "texas-will-requirements-guide",
    title: "Texas Will Requirements: Writing, Signatures, Witnesses and Self-Proving Wills",
    dek: "The core Texas rules for executing a written will, including signature and witness requirements, self-proving affidavits, capacity, and why notarization alone does not replace the statutory formalities.",
    keyTakeaways: [
      "Texas Estates Code Chapter 251 governs the fundamental requirements for wills, including capacity and execution formalities.",
      "A non-holographic written will generally must be signed by the testator, or by another person for the testator in the testator's presence and under the testator's direction, and attested by two or more credible witnesses who are at least 14 years old and sign in the testator's presence.",
      "A will can be made self-proved through the statutory affidavit or other authorized self-proving procedure, which can simplify proof when the will is later offered for probate.",
      "Notarizing a document does not by itself turn a defective non-holographic document into a valid Texas will; the applicable Chapter 251 execution rules still control.",
    ],
    intro: ["Texas recognizes several ways to create a valid will, but formalities matter. The safest analysis separates the basic validity of the will from whether it is self-proved for a later probate proceeding."],
    sections: [
      { heading: "Chapter 251 sets the execution rules", paragraphs: ["Texas law distinguishes attested written wills from holographic wills. A conventional typed or printed will ordinarily uses the witness formalities in Section 251.051."] },
      { heading: "Two credible witnesses are the ordinary rule", paragraphs: ["For a non-holographic will, Section 251.051 generally requires at least two credible witnesses age 14 or older who sign in the testator's presence, along with the required testator signature."] },
      { heading: "Self-proving is useful but separate from validity", paragraphs: ["A self-proving affidavit or authorized self-proving declaration can reduce the need to locate witnesses later. Failure to self-prove does not automatically mean an otherwise valid will is invalid, but probate proof can become more cumbersome."] },
      { heading: "Capacity and voluntariness remain important", paragraphs: ["Execution formalities do not resolve every dispute. Testamentary capacity, undue influence, fraud, revocation, and later instruments can affect whether a will is admitted or how it operates."] },
    ],
    faq: [
      { q: "Does a Texas will need two witnesses?", a: "A conventional non-holographic will generally does. Holographic wills use a different statutory rule." },
      { q: "Does a Texas will have to be notarized?", a: "Notarization is commonly used for a self-proving affidavit, but notarization is not a substitute for the execution formalities that apply to the will itself." },
      { q: "What does self-proved mean?", a: "It means the will includes a statutory proof mechanism intended to establish execution without later live testimony from subscribing witnesses in the ordinary case." },
    ],
    sources: [wills, { label: "Texas State Law Library — Official Texas Supreme Court Will Forms", url: "https://www.sll.texas.gov/spotlight/2023/06/new-official-will-forms-from-the-texas-supreme-court/" }],
    related: [
      { label: "Texas holographic wills", href: "/guides/texas-holographic-will-law" },
      { label: "Texas probate deadline", href: "/guides/texas-probate-four-year-deadline" },
      { label: "Texas intestate succession", href: "/guides/texas-intestate-succession-guide" },
    ],
  },

  "texas-holographic-will-law": {
    ...common,
    slug: "texas-holographic-will-law",
    title: "Texas Holographic Will Law: Handwritten Wills and Witness Rules",
    dek: "When a handwritten will can qualify as a holographic will in Texas, the wholly-in-the-testator's-handwriting rule, witness differences, self-proving options and common proof problems.",
    keyTakeaways: [
      "Estates Code Section 251.052 recognizes a holographic will when it is written wholly in the testator's handwriting.",
      "A qualifying holographic will is not required to be attested by subscribing witnesses in the same manner as a conventional written will.",
      "A holographic will may still be made self-proved using the procedure authorized by Chapter 251.",
      "A handwritten document can still create probate disputes over whether it was intended as a will, whether all material testamentary provisions are in the testator's handwriting, whether it was revoked, and whether the testator had capacity.",
    ],
    intro: ["Texas permits handwritten wills, but 'handwritten' is not enough by itself. The holographic-will statute uses a specific wholly-in-the-testator's-handwriting requirement and does not eliminate the ordinary questions of intent, capacity, and revocation."],
    sections: [
      { heading: "The will must be wholly in the testator's handwriting", paragraphs: ["Section 251.052 is the central execution rule for holographic wills. Mixing preprinted testamentary language with handwritten dispositive provisions can create questions that a purely handwritten document avoids."] },
      { heading: "Subscribing witnesses are not required for a qualifying holographic will", paragraphs: ["The two-witness attestation rule that applies to conventional wills does not apply in the same way when the instrument qualifies as holographic under Section 251.052."] },
      { heading: "Self-proving remains available", paragraphs: ["Texas law provides a self-proving route for holographic wills. Self-proof concerns the later evidence needed in probate and should not be confused with the threshold handwriting requirement."] },
      { heading: "Proof issues can still arise", paragraphs: ["The probate court may need evidence establishing handwriting, testamentary intent, capacity, lack of revocation, or other contested facts. A short handwritten note is not automatically admitted simply because it contains inheritance language."] },
    ],
    faq: [
      { q: "Does a handwritten Texas will need witnesses?", a: "A will that qualifies as holographic under Section 251.052 does not require the same subscribing-witness attestation as a conventional will." },
      { q: "Can I type part of a holographic will?", a: "The statute requires the holographic will to be wholly in the testator's handwriting, so mixed-format documents can create validity problems." },
      { q: "Can a holographic will be self-proved?", a: "Yes. Texas law provides a self-proving procedure for holographic wills." },
    ],
    sources: [wills, sllProbate],
    related: [
      { label: "Texas will requirements", href: "/guides/texas-will-requirements-guide" },
      { label: "Texas probate deadline", href: "/guides/texas-probate-four-year-deadline" },
      { label: "Texas intestate succession", href: "/guides/texas-intestate-succession-guide" },
    ],
  },

  "texas-intestate-succession-guide": {
    ...common,
    slug: "texas-intestate-succession-guide",
    title: "Texas Intestate Succession: Who Inherits When There Is No Will",
    dek: "How Texas Estates Code Chapter 201 distributes probate property when a person dies without a valid will, including spouses, children, community property, separate property and more remote heirs.",
    keyTakeaways: [
      "Texas Estates Code Chapter 201 supplies default inheritance rules for probate property when a person dies intestate.",
      "The distribution depends on family relationships and on whether property is community or separate property; a surviving spouse does not automatically receive every asset in every intestate estate.",
      "The community-property result can depend on whether all of the decedent's descendants are also descendants of the surviving spouse.",
      "Nonprobate assets such as property passing by beneficiary designation, survivorship arrangement, or a valid transfer-on-death deed can pass outside Chapter 201 even when the decedent had no will.",
    ],
    intro: ["Intestacy is a default statutory estate plan, not a simple 'everything goes to the spouse' rule. Chapter 201 works through property character and family relationships, while nonprobate transfers operate under their own instruments and statutes."],
    sections: [
      { heading: "Chapter 201 controls intestate probate property", paragraphs: ["When no valid will governs an asset in the probate estate, the Estates Code identifies the heirs and their shares. Different provisions address community property and separate real and personal property."] },
      { heading: "A surviving spouse's share depends on the family structure", paragraphs: ["Whether the decedent had descendants, whether those descendants were also descendants of the surviving spouse, and whether the property was community or separate can materially change the result."] },
      { heading: "Children and descendants can inherit by statutory rules", paragraphs: ["Chapter 201 contains rules for descendants, parents, siblings, and more remote kindred, along with special rules for adopted children and other relationship questions."] },
      { heading: "Not every asset passes through intestacy", paragraphs: ["Life-insurance beneficiaries, payable-on-death accounts, survivorship property and Chapter 114 transfer-on-death deeds can pass outside the probate estate. Those arrangements should be inventoried before calculating an intestate distribution."] },
    ],
    faq: [
      { q: "Does a surviving spouse inherit everything in Texas if there is no will?", a: "Not always. The result depends on property character and the decedent's family relationships under Chapter 201." },
      { q: "Do stepchildren automatically inherit under intestacy?", a: "Not merely because they are stepchildren. Legal parent-child relationships and the specific Chapter 201 rules control." },
      { q: "Does intestacy control a life-insurance policy with a named beneficiary?", a: "Usually the beneficiary designation controls that nonprobate asset, subject to other applicable law, rather than Chapter 201's default probate distribution." },
    ],
    sources: [intestacy, sllProbate],
    related: [
      { label: "Texas determination of heirship", href: "/guides/texas-determination-of-heirship-law" },
      { label: "Texas small estate affidavit", href: "/guides/texas-small-estate-affidavit-law" },
      { label: "Texas transfer-on-death deeds", href: "/guides/texas-transfer-on-death-deed-law" },
    ],
  },

  "texas-probate-four-year-deadline": {
    ...common,
    slug: "texas-probate-four-year-deadline",
    title: "Texas Probate Four-Year Rule: Deadline to Admit a Will",
    dek: "The Estates Code Section 256.003 four-year rule for admitting a will to probate, the applicant-default exception, late probate consequences and why waiting can affect title and administration.",
    keyTakeaways: [
      "Estates Code Section 256.003 generally bars admitting a will to probate after the fourth anniversary of the testator's death unless the applicant proves the applicant was not in default for failing to present it earlier.",
      "The four-year rule is not an absolute statement that every late will is worthless; the statute expressly recognizes the not-in-default exception.",
      "When a will is admitted after the fourth anniversary under the exception, the availability of letters testamentary and the rights of good-faith purchasers can be affected by the statute.",
      "Other probate deadlines—including will-contest, creditor, notice and administration deadlines—are separate from Section 256.003 and should not be collapsed into a single four-year rule.",
    ],
    intro: ["Texas's four-year probate rule is one of the most consequential estate deadlines. It is a rule about admitting a will, with a statutory exception and specific consequences, not a universal four-year limitations period for every probate issue."],
    sections: [
      { heading: "Section 256.003 starts with a four-year bar", paragraphs: ["A will generally may not be admitted after the fourth anniversary of death. Families who locate a will should not assume there is no urgency simply because estate property has not yet been sold."] },
      { heading: "The statute contains a not-in-default exception", paragraphs: ["A late applicant may seek probate by proving the applicant was not in default for failing to present the will within four years. Whether that standard is met is a fact-specific judicial question."] },
      { heading: "Late probate can change the remedy", paragraphs: ["Section 256.003 separately addresses letters testamentary after late probate and protects specified good-faith purchasers from heirs after the four-year anniversary."] },
      { heading: "Do not confuse this rule with every other probate deadline", paragraphs: ["Creditor claims, notices, inventory duties, contests and fiduciary obligations can have their own deadlines. The date of death and procedural history should be reviewed for each issue separately."] },
    ],
    faq: [
      { q: "Can a Texas will ever be probated more than four years after death?", a: "Yes, potentially, if the applicant proves the statutory not-in-default exception in Section 256.003." },
      { q: "Does a late-probated will automatically produce letters testamentary?", a: "No. Section 256.003 separately limits letters testamentary when a will is admitted after the fourth anniversary." },
      { q: "Is four years the deadline for every probate dispute?", a: "No. It is the principal deadline for admitting a will under Section 256.003; other claims and proceedings have separate rules." },
    ],
    sources: [probate, sllProbate],
    related: [
      { label: "Texas will requirements", href: "/guides/texas-will-requirements-guide" },
      { label: "Texas muniment of title", href: "/guides/texas-muniment-of-title-law" },
      { label: "Texas executor duties", href: "/guides/texas-executor-duties-law" },
    ],
  },

  "texas-small-estate-affidavit-law": {
    ...common,
    slug: "texas-small-estate-affidavit-law",
    title: "Texas Small Estate Affidavit: $75,000 Limit, 30-Day Wait and Eligibility Rules",
    dek: "When Estates Code Chapter 205 may allow heirs of an intestate Texas estate to use a small estate affidavit, including the $75,000 cap, 30-day waiting period, debts, signatures and homestead limits.",
    keyTakeaways: [
      "A Texas small estate affidavit under Chapter 205 is for an intestate estate; it is not the ordinary procedure for an estate governed by a valid will.",
      "The statutory procedure generally requires that at least 30 days have elapsed since death and that no petition for appointment of a personal representative is pending or has been granted.",
      "The value of the estate assets, excluding homestead and exempt property, must not exceed $75,000, and the qualifying asset-and-liability comparison must satisfy Chapter 205.",
      "Real-property use is especially limited: the affidavit's effect on a homestead is tied to the heirs and occupancy rules in Chapter 205, so it should not be treated as a universal shortcut for transferring any Texas real estate.",
    ],
    intro: ["The small-estate affidavit is a streamlined statutory option, but it has several cumulative requirements. The $75,000 figure alone does not establish eligibility."],
    sections: [
      { heading: "The decedent must have died intestate", paragraphs: ["Chapter 205 is designed for estates where the decedent died without a will governing the probate estate. A discovered valid will can change the correct procedure."] },
      { heading: "Wait at least 30 days and confirm no administration is pending", paragraphs: ["The statute requires the waiting period and addresses whether a personal representative has been sought or appointed. Filing early can result in rejection even if the estate is small."] },
      { heading: "The $75,000 test excludes homestead and exempt property", paragraphs: ["The value calculation excludes homestead and exempt property and works together with the statutory debt comparison. Secured debts associated with excluded property receive special treatment in the calculation."] },
      { heading: "The affidavit requires detailed heir and asset information", paragraphs: ["Chapter 205 requires sworn information about the decedent, heirs, assets and liabilities and includes signature and disinterested-witness requirements. Court approval is part of the process."] },
    ],
    faq: [
      { q: "Can I use a Texas small estate affidavit if there is a will?", a: "The Chapter 205 procedure is for an intestate estate, so a valid will generally points to a different probate procedure." },
      { q: "Is the Texas small-estate limit $75,000?", a: "Yes for the statutory asset calculation, excluding homestead and exempt property and subject to the rest of Chapter 205." },
      { q: "Can I file immediately after the death?", a: "No. Chapter 205 requires at least 30 days to have elapsed before the affidavit procedure is available." },
    ],
    sources: [smallEstate, { label: "TexasLawHelp — Small Estate Affidavits", url: "https://texaslawhelp.org/article/small-estate-affidavits" }],
    related: [
      { label: "Texas intestate succession", href: "/guides/texas-intestate-succession-guide" },
      { label: "Texas determination of heirship", href: "/guides/texas-determination-of-heirship-law" },
      { label: "Texas muniment of title", href: "/guides/texas-muniment-of-title-law" },
    ],
  },

  "texas-muniment-of-title-law": {
    ...common,
    slug: "texas-muniment-of-title-law",
    title: "Texas Muniment of Title: Probating a Will Without Full Estate Administration",
    dek: "When a Texas court may admit a will as a muniment of title, the no-unpaid-debt and no-administration-necessity framework, how the order transfers title, and post-order filing duties.",
    keyTakeaways: [
      "Estates Code Chapter 257 authorizes probate of a will as a muniment of title when the statutory conditions are satisfied.",
      "The court generally must be satisfied that the estate does not owe an unpaid debt other than a debt secured by a lien on real estate and that there is no necessity for administration of the estate.",
      "A muniment-of-title order can provide legal authority for transferring property under the will without appointing an executor to conduct a full administration.",
      "Chapter 257 includes a later affidavit requirement concerning compliance with the will and court order, so obtaining the order is not necessarily the final filing step.",
    ],
    intro: ["Muniment of title is a distinctly Texas probate tool. It can avoid a full administration in appropriate estates, but it is not simply a deed-recording shortcut and requires court admission of the will."],
    sections: [
      { heading: "The will is still admitted to probate", paragraphs: ["The court determines whether the will should be admitted and whether Chapter 257's muniment conditions are met. The procedure is probate even though no ordinary administration follows."] },
      { heading: "Debt and necessity-of-administration conditions matter", paragraphs: ["Chapter 257 focuses on whether unpaid debts exist other than qualifying real-estate lien debt and whether an estate administration is necessary. An estate requiring active creditor management may not fit the procedure."] },
      { heading: "The order can serve as authority for title transfer", paragraphs: ["Once admitted as a muniment, the will and order can be used to establish ownership in accordance with the devise, including in appropriate real-property records and transactions."] },
      { heading: "A compliance affidavit follows the order", paragraphs: ["Section 257.103 requires the applicant, within the statutory period, to file a sworn affidavit stating whether the terms of the will and the order have been fulfilled, subject to the statutory details and exceptions."] },
    ],
    faq: [
      { q: "Does muniment of title appoint an executor?", a: "Ordinarily the point is to admit the will without a full administration or issuance of ordinary letters, when Chapter 257's conditions are satisfied." },
      { q: "Can an estate with debts use muniment of title?", a: "Chapter 257 generally requires no unpaid debt other than qualifying debt secured by a lien on real estate." },
      { q: "Is there paperwork after the muniment order?", a: "Yes. Chapter 257 includes a later sworn compliance affidavit requirement in applicable cases." },
    ],
    sources: [muniment, sllProbate],
    related: [
      { label: "Texas probate four-year rule", href: "/guides/texas-probate-four-year-deadline" },
      { label: "Texas independent administration", href: "/guides/texas-independent-administration-law" },
      { label: "Texas executor duties", href: "/guides/texas-executor-duties-law" },
    ],
  },

  "texas-independent-administration-law": {
    ...common,
    slug: "texas-independent-administration-law",
    title: "Texas Independent Administration: Executor Authority With Less Court Supervision",
    dek: "How Texas Estates Code Chapters 401–405 create independent estate administration through a will or distributee agreement, what independence changes, and which duties still remain.",
    keyTakeaways: [
      "Texas law strongly accommodates independent administration, which allows an independent executor or administrator to handle many estate matters without repeated court orders.",
      "Independent administration may be created by a will that authorizes it or, in qualifying cases, through the distributee agreement and court procedures in Chapter 401.",
      "Independent does not mean unregulated: the fiduciary still must identify and protect estate property, address creditors, provide required notices and inventories or affidavits, account when required, and distribute the estate according to law and the will.",
      "Court involvement remains available for specified disputes, accountings, removal, creditor issues and other remedies even when the estate is independently administered.",
    ],
    intro: ["Texas independent administration reduces routine court supervision but does not eliminate fiduciary law. It changes the administrator's need for advance court approval, not the obligation to administer the estate correctly."],
    sections: [
      { heading: "A will can authorize independent administration", paragraphs: ["Chapter 401 recognizes testamentary directions for independent administration and independent executors, subject to statutory qualification and court admission of the will."] },
      { heading: "Distributees can sometimes agree to independence", paragraphs: ["When the will does not provide the needed authority or the decedent died intestate, Chapter 401 provides mechanisms under which all distributees may agree to independent administration and selection of an administrator, subject to the statute and court findings."] },
      { heading: "Independent administration reduces repeated permission requests", paragraphs: ["Chapters 401 through 405 let the representative perform many acts without obtaining the advance orders required in a dependent administration. The exact authority depends on the Code and the estate's circumstances."] },
      { heading: "Fiduciary and statutory duties remain", paragraphs: ["Independent representatives still owe duties to the estate and interested persons, remain subject to creditor and distribution rules, and can face accounting, removal or other remedies for misconduct."] },
    ],
    faq: [
      { q: "Does independent administration mean there is no probate court?", a: "No. The estate is still opened through probate, but many later acts can be handled without repeated court approval." },
      { q: "Can heirs agree to independent administration?", a: "In qualifying cases, Chapter 401 provides a procedure based on agreement of all distributees and required court findings." },
      { q: "Can an independent executor ignore creditor and beneficiary rules?", a: "No. Independence reduces supervision; it does not erase fiduciary, notice, claim, accounting or distribution duties." },
    ],
    sources: [independent, sllProbate],
    related: [
      { label: "Texas executor duties", href: "/guides/texas-executor-duties-law" },
      { label: "Texas muniment of title", href: "/guides/texas-muniment-of-title-law" },
      { label: "Texas probate deadline", href: "/guides/texas-probate-four-year-deadline" },
    ],
  },

  "texas-executor-duties-law": {
    ...common,
    slug: "texas-executor-duties-law",
    title: "Texas Executor Duties: Estate Property, Creditors, Beneficiaries and Fiduciary Responsibility",
    dek: "Core duties of Texas executors and administrators, including taking possession of estate property, preserving assets, notices, claims, inventories and distribution, with independent-administration distinctions.",
    keyTakeaways: [
      "A Texas executor or administrator is a personal representative with statutory and fiduciary responsibilities to administer estate property for the purposes authorized by law.",
      "Estates Code Chapter 351 generally requires the personal representative to take care of estate property, collect and preserve assets, and recover property or debts owed to the estate when appropriate.",
      "Separate Estates Code chapters impose notice, inventory, creditor-claim, accounting, sale, tax and distribution duties; Chapter 351 is not the representative's entire checklist.",
      "An independent executor may act with less advance court supervision, but independence does not remove fiduciary duties or exposure to removal, surcharge, accounting or other remedies for breach.",
    ],
    intro: ["Being named executor in a will does not immediately grant unlimited control over another person's property. The will must be admitted and the representative must qualify, after which the Estates Code supplies an extensive administration framework."],
    sections: [
      { heading: "The representative protects and gathers estate property", paragraphs: ["Chapter 351 addresses possession, care and recovery of estate assets. The representative should separate estate property from personal property and preserve records of receipts, expenses and transactions."] },
      { heading: "Notices, inventories and creditor claims have separate rules", paragraphs: ["Chapters 308, 309 and 355 contain important obligations involving beneficiaries, creditors, inventory information and claims. The exact deadlines depend on the type of administration and event triggering the duty."] },
      { heading: "Estate money is not the executor's personal money", paragraphs: ["A representative acts in a fiduciary capacity and must use estate assets for lawful estate purposes. Self-dealing, undocumented transfers, preferential treatment contrary to law or failure to safeguard assets can create personal exposure."] },
      { heading: "Distribution follows the will and governing law", paragraphs: ["After claims, expenses, taxes and other administration matters are addressed, the representative distributes the remaining estate according to the admitted will or intestacy rules and applicable court orders."] },
    ],
    faq: [
      { q: "Does being named executor in a will let me act immediately?", a: "No. The probate court generally must admit the will and the executor must qualify before letters testamentary issue." },
      { q: "Can an executor use estate funds personally and repay them later?", a: "Estate assets are fiduciary property, not a personal line of credit. Transactions must be authorized and properly documented." },
      { q: "Does an independent executor still owe duties?", a: "Yes. Independent administration reduces routine court supervision but leaves fiduciary and statutory duties in place." },
    ],
    sources: [personalRep, { label: "Texas Estates Code Chapter 308 — Notices", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.308.htm" }, sllProbate],
    related: [
      { label: "Texas independent administration", href: "/guides/texas-independent-administration-law" },
      { label: "Texas probate deadline", href: "/guides/texas-probate-four-year-deadline" },
      { label: "Texas muniment of title", href: "/guides/texas-muniment-of-title-law" },
    ],
  },

  "texas-determination-of-heirship-law": {
    ...common,
    slug: "texas-determination-of-heirship-law",
    title: "Texas Determination of Heirship: Court Proceedings to Identify Legal Heirs",
    dek: "When a Texas heirship proceeding may be used, who may apply, citation and evidence, attorney-ad-litem involvement, and how the judgment establishes heirs and ownership interests.",
    keyTakeaways: [
      "Estates Code Chapter 202 provides a judicial procedure for determining the heirs of a decedent and each heir's share when heirship has not already been conclusively established.",
      "The procedure is commonly important in intestate estates, but Chapter 202 also identifies other circumstances in which heirship may need to be determined.",
      "Heirship proceedings require notice and evidence; Texas probate practice commonly includes an attorney ad litem for unknown heirs as required by the Estates Code.",
      "A judgment declaring heirship identifies the heirs and their respective interests, but separate administration, title, creditor or transfer steps may still be necessary depending on the estate.",
    ],
    intro: ["Family consensus about who the heirs are is not always enough for banks, title companies or probate administration. Chapter 202 creates a court process to establish heirship through evidence and a judgment."],
    sections: [
      { heading: "Chapter 202 authorizes a formal heirship determination", paragraphs: ["An authorized applicant asks the probate court to determine the decedent's heirs and their shares. Venue and jurisdiction follow the Estates Code's probate rules."] },
      { heading: "The application identifies family history and potential heirs", paragraphs: ["The pleading must provide detailed facts needed to determine the statutory line of succession, including marital and descendant information and other relatives where relevant."] },
      { heading: "Notice, evidence and representation of unknown heirs matter", paragraphs: ["The proceeding is not merely an uncontested form. Citation requirements apply, and the court receives evidence supporting family history and heirship. Unknown heirs receive statutory protections, including attorney-ad-litem procedures in applicable cases."] },
      { heading: "The judgment establishes heirship interests", paragraphs: ["The court's judgment declares the heirs and their respective shares. Whether additional administration or transfer instruments are needed depends on the property, debts and procedural posture of the estate."] },
    ],
    faq: [
      { q: "Why would a family need an heirship proceeding if everyone agrees?", a: "A judicial heirship judgment can provide the formal legal determination needed for probate administration, title and third-party reliance." },
      { q: "Is heirship the same as a small estate affidavit?", a: "No. Chapter 202 heirship and Chapter 205 small-estate affidavits are different procedures with different requirements and effects." },
      { q: "Does an heirship judgment automatically close every estate issue?", a: "No. It identifies heirs and shares, but debts, administration and property-transfer steps may remain." },
    ],
    sources: [heirship, sllProbate],
    related: [
      { label: "Texas intestate succession", href: "/guides/texas-intestate-succession-guide" },
      { label: "Texas small estate affidavit", href: "/guides/texas-small-estate-affidavit-law" },
      { label: "Texas independent administration", href: "/guides/texas-independent-administration-law" },
    ],
  },

  "texas-transfer-on-death-deed-law": {
    ...common,
    slug: "texas-transfer-on-death-deed-law",
    title: "Texas Transfer on Death Deed: Recording, Revocation and Beneficiary Rules",
    dek: "How a Texas transfer on death deed can transfer real property outside probate, including execution and pre-death recording, revocation, lifetime ownership, beneficiary survival and creditor exposure.",
    keyTakeaways: [
      "Estates Code Chapter 114 authorizes a revocable transfer on death deed that transfers the owner's Texas real-property interest to designated beneficiaries at death.",
      "To be effective, the deed must contain the required deed formalities, state that transfer occurs at the transferor's death, and be recorded before the transferor's death in the deed records of the county where the property is located.",
      "During the transferor's life, the deed does not give the beneficiary a present ownership interest and does not prevent the owner from selling, mortgaging or otherwise dealing with the property.",
      "A will does not revoke or supersede a transfer on death deed; revocation must comply with Chapter 114's instrument, acknowledgment and recording rules.",
    ],
    intro: ["A Texas TODD is a nonprobate real-property transfer created by statute. It can simplify title transfer in some estates, but recording, beneficiary survival, liens, creditor liability and revocation rules make formality important."],
    sections: [
      { heading: "The deed must be recorded before death", paragraphs: ["Section 114.055 requires the instrument to satisfy the essential formalities of a recordable deed, state that the transfer is effective at death, and be recorded before death in the proper county deed records."] },
      { heading: "The owner keeps control during life", paragraphs: ["Section 114.101 preserves the transferor's ownership rights during life. The beneficiary receives no present legal or equitable interest merely because the TODD was recorded."] },
      { heading: "Revocation has its own formalities", paragraphs: ["Chapter 114 requires a qualifying later TODD or revocation instrument to be acknowledged and recorded before death. Section 114.057 expressly states that a will may not revoke or supersede a TODD."] },
      { heading: "The beneficiary can receive property subject to existing burdens", paragraphs: ["At death, the beneficiary's rights are subject to Chapter 114's survival rules and to mortgages, liens and other interests. Transferred property can also face statutory liability for estate claims when the probate estate is insufficient."] },
    ],
    faq: [
      { q: "Does a Texas TODD have to be recorded before the owner dies?", a: "Yes. Recording before death in the deed records of the county where the property is located is an express Section 114.055 requirement." },
      { q: "Can the owner sell the property after recording a TODD?", a: "Yes. The transferor retains ownership rights during life, including the ability to transfer or encumber the property." },
      { q: "Can a later will cancel a Texas TODD?", a: "No. Section 114.057 states that a will may not revoke or supersede a transfer on death deed." },
    ],
    sources: [todd, { label: "Texas State Law Library — Lady Bird Deeds and TODDs", url: "https://www.sll.texas.gov/faqs/what-is-a-lady-bird-deed/" }],
    related: [
      { label: "Texas intestate succession", href: "/guides/texas-intestate-succession-guide" },
      { label: "Texas will requirements", href: "/guides/texas-will-requirements-guide" },
      { label: "Texas small estate affidavit", href: "/guides/texas-small-estate-affidavit-law" },
    ],
  },
};
