import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_MARRIAGE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-marriage-license-law": {
    slug: "texas-marriage-license-law",
    title: "Texas Marriage License Law: Requirements, Waiting Period and Ceremony Rules",
    dek: "A practical guide to Texas marriage-license requirements, identity and age proof, the 72-hour ceremony waiting period, authorized officiants, and important exceptions.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas marriage licenses are issued by county clerks under Family Code Chapter 2, and applicants must provide the information and proof required by the statute.",
      "A marriage ceremony generally may not occur during the 72 hours immediately after the license is issued, subject to statutory exceptions and a possible court waiver.",
      "Texas law specifies who may conduct a marriage ceremony, including certain religious officers and current, former, or retired federal and state judges.",
      "A recent divorce, age, an existing marriage, prohibited family relationships, and absent-applicant rules can affect whether a clerk may issue the license.",
    ],
    intro: [
      "Getting married in Texas is usually straightforward, but the Family Code separates the license application, waiting period, ceremony, and validity rules. Couples should not assume that obtaining a license means the ceremony can occur immediately.",
      "This guide focuses on the statewide statutory framework. County clerks administer the process locally, so office hours, appointment procedures, and payment methods can vary even though the legal requirements come from state law.",
    ],
    sections: [
      { heading: "The county clerk issues the marriage license", paragraphs: ["Family Code Chapter 2 governs the application and issuance process. Applicants must provide the information required by the statute, and the clerk must require proof of identity and age under Section 2.005."] },
      { heading: "Texas generally has a 72-hour ceremony waiting period", paragraphs: ["Section 2.204 generally bars the marriage ceremony during the 72 hours immediately following issuance of the license. The statute lists exceptions for specified military or Defense Department circumstances, completion of the qualifying premarital education course, and a written judicial waiver."] },
      { heading: "The officiant must fall within a statutory category", paragraphs: ["Section 2.202 lists persons authorized to conduct a marriage ceremony, including certain licensed or ordained ministers or priests, rabbis, authorized officers of religious organizations, and current, former, or retired federal or state judges."] },
      { heading: "Other eligibility rules can block issuance", paragraphs: ["The Family Code contains additional rules involving age, existing marriages, prohibited relationships, recent divorce, and absent applicants. A person with one of those complications should review the specific subsection rather than relying on the ordinary application checklist."] },
    ],
    faq: [
      { q: "Can a Texas wedding happen the same day the license is issued?", a: "Usually not. Section 2.204 imposes a 72-hour waiting period, but the statute contains specific exceptions and authorizes a qualifying judicial waiver." },
      { q: "Does Texas require a particular type of officiant?", a: "Yes. Section 2.202 identifies categories of people authorized to conduct a marriage ceremony." },
      { q: "Do both applicants always have to appear in person?", a: "Not in every circumstance. Chapter 2 contains absent-applicant procedures, but the requirements are specific and should be checked carefully with the statute and county clerk." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 2", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.2&code=FA&tab=1" },
      { label: "Texas Family Code § 2.005", url: "https://statutes.capitol.texas.gov/?artSec=2.005&chapter=FA.2&code=FA&tab=1" },
      { label: "Texas Family Code § 2.204", url: "https://statutes.capitol.texas.gov/?artSec=2.204&chapter=FA.2&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas common-law marriage", href: "/guides/texas-common-law-marriage-law" },
      { label: "Texas divorce law", href: "/guides/texas-divorce-law-guide" },
      { label: "Texas divorce name change", href: "/guides/texas-divorce-name-change-law" },
    ],
  },

  "texas-common-law-marriage-law": {
    slug: "texas-common-law-marriage-law",
    title: "Texas Common-Law Marriage: How Informal Marriage Is Proven",
    dek: "What Texas Family Code Section 2.401 requires to prove an informal marriage, how a declaration works, what the two-year rebuttable presumption means, and the 2025 privacy update for declarations.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas recognizes informal marriage, often called common-law marriage, under Family Code Section 2.401.",
      "Without a filed declaration, proof generally requires evidence that the parties agreed to be married, then lived together in Texas as spouses, and represented to others that they were married.",
      "If a proceeding to prove the marriage is not started before the second anniversary of separation and the end of cohabitation, the statute creates a rebuttable presumption that the parties did not agree to be married.",
      "Effective September 1, 2025, HB 1193 added a confidentiality option for identifying information on a declaration of informal marriage.",
    ],
    intro: [
      "Texas does not turn a couple into spouses merely because they lived together for a certain number of months or years. The statute uses specific proof requirements for an informal marriage.",
      "Couples may also execute a statutory declaration of informal marriage with the county clerk. That declaration can simplify proof, but it is not the only route recognized by Section 2.401.",
    ],
    sections: [
      { heading: "There is no automatic time-based common-law marriage", paragraphs: ["Section 2.401 focuses on agreement, cohabitation in Texas after the agreement, and representation to others as married. The statute does not create marriage simply because two people lived together for six months, seven years, or another fixed period."] },
      { heading: "A declaration is one statutory proof method", paragraphs: ["The parties may sign a declaration of informal marriage under Section 2.402. Once properly executed and recorded, the declaration or certificate is prima facie evidence of the marriage under Section 2.404."] },
      { heading: "The two-year rule is a rebuttable presumption, not an automatic divorce", paragraphs: ["Section 2.401(b) provides that if a proceeding to prove the marriage is not commenced before the second anniversary of the date the parties separated and ceased living together, it is rebuttably presumed that they did not enter an agreement to be married. That is an evidentiary presumption, not a rule that an existing marriage automatically expires after two years."] },
      { heading: "HB 1193 added declaration privacy protections in 2025", paragraphs: ["Effective September 1, 2025, HB 1193 amended Section 2.402 and added Section 2.406 so a party may request confidentiality for identifying information on the declaration. The parties' names remain public under the statutory rule, while other identifying information receives the specified protection."] },
    ],
    faq: [
      { q: "How long do you have to live together to be common-law married in Texas?", a: "Texas law does not set a minimum cohabitation period. The proof elements in Section 2.401 matter instead." },
      { q: "Do we have to file a declaration to have an informal marriage?", a: "No. A declaration is one proof method. Section 2.401 also allows proof through evidence of agreement, cohabitation in Texas, and representing to others that the parties were married." },
      { q: "Does separating for two years automatically end an informal marriage?", a: "No. Section 2.401(b) creates a rebuttable presumption about whether an agreement to marry existed if a proceeding is not timely started; it does not create an automatic divorce." },
    ],
    sources: [
      { label: "Texas Family Code § 2.401", url: "https://statutes.capitol.texas.gov/?artSec=2.401&chapter=FA.2&code=FA&tab=1" },
      { label: "Texas Family Code § 2.402", url: "https://statutes.capitol.texas.gov/?artSec=2.402&chapter=FA.2&code=FA&tab=1" },
      { label: "Texas Legislature HB 1193 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB01193F.HTM" },
    ],
    related: [
      { label: "Texas marriage license law", href: "/guides/texas-marriage-license-law" },
      { label: "Texas divorce law", href: "/guides/texas-divorce-law-guide" },
      { label: "Texas divorce waiting period", href: "/guides/texas-divorce-waiting-period-law" },
    ],
  },
};
