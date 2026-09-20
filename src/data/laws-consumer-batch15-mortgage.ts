import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH15_MORTGAGE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-mortgage-foreclosure-notice-law": {
    slug: "texas-mortgage-foreclosure-notice-law",
    title: "Texas Mortgage Foreclosure Notice Law: 20-Day Cure and 21-Day Sale Notice",
    dek: "The Texas Property Code notice framework for nonjudicial foreclosure of a residence, including the default-and-cure notice, sale notice, certified mail, first-Tuesday sale schedule, and why federal mortgage-servicing rules can add protections.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "For real property used as the debtor's residence, Property Code Section 51.002(d) generally requires the mortgage servicer to send written notice of default by certified mail and give at least 20 days to cure before notice of sale can be given.",
      "Section 51.002(b) generally requires notice of the foreclosure sale at least 21 days before the sale, including certified-mail notice to debtors shown in the servicer's records as obligated on the debt.",
      "Texas nonjudicial foreclosure sales under a power of sale generally occur between 10 a.m. and 4 p.m. on the first Tuesday of the month, subject to the January 1 and July 4 Wednesday exception in Section 51.002(a-1).",
      "Federal mortgage-servicing and bankruptcy rules can create additional loss-mitigation, timing, or stay protections beyond the Texas minimum notice framework.",
    ],
    intro: [
      "Texas allows many mortgage foreclosures to proceed without a lawsuit when the deed of trust contains a power of sale, but the lender and servicer must follow the contract and applicable state and federal law.",
      "The familiar 20-day and 21-day periods are separate steps. The cure period for a residence comes before the notice of sale, and federal servicing rules can make the practical timeline longer in qualifying cases.",
    ],
    sections: [
      { heading: "A residence generally receives at least 20 days to cure", paragraphs: ["Section 51.002(d) requires the mortgage servicer to send a debtor in default on real property used as the debtor's residence a certified-mail notice stating the default and allowing at least 20 days to cure before the sale notice can be given."] },
      { heading: "The sale notice generally comes at least 21 days before foreclosure", paragraphs: ["Section 51.002(b) requires notice of sale at least 21 days before the date of sale through the statutory posting, county-clerk filing, and certified-mail service procedures. The notice states the earliest time at which the sale will begin."] },
      { heading: "Texas uses a first-Tuesday foreclosure calendar", paragraphs: ["Section 51.002(a) generally schedules power-of-sale foreclosures for the first Tuesday of a month between 10 a.m. and 4 p.m. If that Tuesday is January 1 or July 4, subsection (a-1) moves the sale to the first Wednesday."] },
      { heading: "State notice rules are not the only possible protection", paragraphs: ["A mortgage loan can also be governed by federal servicing regulations, bankruptcy law, military protections, contractual requirements, and specialized Texas provisions. A borrower facing foreclosure should identify every applicable source rather than treating Section 51.002 as the entire legal framework."] },
    ],
    faq: [
      { q: "How much time does a Texas homeowner get to cure a mortgage default?", a: "For property used as the debtor's residence, Section 51.002(d) generally requires at least 20 days to cure before notice of sale can be given." },
      { q: "How much notice is required before a Texas foreclosure sale?", a: "Section 51.002(b) generally requires at least 21 days' notice of sale through the statute's posting, filing, and certified-mail procedures." },
      { q: "Are Texas foreclosure sales always on the first Tuesday?", a: "Generally yes for a power-of-sale foreclosure, subject to the statutory exception when the first Tuesday is January 1 or July 4 and to other applicable law." },
    ],
    sources: [
      { label: "Texas Property Code § 51.002", url: "https://statutes.capitol.texas.gov/?artSec=51.002&chapter=PR.51&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 51", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.51.htm" },
      { label: "Consumer Financial Protection Bureau — Mortgage Servicing", url: "https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/mortserv/" },
    ],
    related: [
      { label: "Texas foreclosure deficiency law", href: "/guides/texas-foreclosure-deficiency-law" },
      { label: "Texas judgment lien and homestead law", href: "/guides/texas-judgment-lien-homestead-law" },
      { label: "Texas judgment exemptions", href: "/guides/texas-judgment-exempt-property-law" },
    ],
  },

  "texas-foreclosure-deficiency-law": {
    slug: "texas-foreclosure-deficiency-law",
    title: "Texas Foreclosure Deficiency Law: Two-Year Deadline and Fair-Market-Value Offset",
    dek: "How Texas Property Code Section 51.003 governs a deficiency after a nonjudicial foreclosure sale, including the two-year suit deadline and a debtor's right to request a fair-market-value determination.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "When a Section 51.002 foreclosure sale price is less than the unpaid secured debt, Section 51.003 governs an action to recover the resulting deficiency.",
      "A deficiency action governed by Section 51.003 generally must be brought within two years after the foreclosure sale.",
      "A person against whom the deficiency is sought may move for the court to determine the property's fair market value as of the foreclosure-sale date.",
      "If the court finds fair market value exceeded the foreclosure sale price, Section 51.003 can provide an offset against the deficiency as the statute calculates it; if no qualifying request or evidence is made, the sale price is used in the statutory calculation.",
    ],
    intro: [
      "A foreclosure sale does not always satisfy the full mortgage debt. When a lender seeks the remaining balance after a nonjudicial foreclosure, Texas law supplies a special deficiency framework.",
      "The fair-market-value procedure is especially important when the foreclosure bid was substantially below the property's alleged market value. The protection is procedural and should be raised in the deficiency case as Section 51.003 requires.",
    ],
    sections: [
      { heading: "Section 51.003 governs qualifying post-foreclosure deficiencies", paragraphs: ["The section applies when property is sold under Section 51.002 for less than the unpaid balance of the debt secured by the property, creating a deficiency. Liability for the debt itself comes from the note, guaranty, or other governing obligation; Section 51.003 regulates the deficiency recovery."] },
      { heading: "The statutory deficiency suit deadline is two years", paragraphs: ["Section 51.003(a) states that an action to recover the deficiency must be brought within two years of the foreclosure sale. Other contract limitations periods should not be substituted for this specific post-foreclosure rule without analyzing the obligation and any enforceable waiver issues."] },
      { heading: "The debtor can request a fair-market-value finding", paragraphs: ["Under Section 51.003(b), a person against whom recovery is sought may move for the court to determine the fair market value of the real property on the foreclosure-sale date. The statute lists examples of competent valuation evidence."] },
      { heading: "Fair market value can reduce the claimed deficiency", paragraphs: ["If the court determines that fair market value exceeded the sale price, subsection (c) provides an offset calculated under the statute. If no party requests the determination or no competent evidence is introduced, the foreclosure sale price is used to compute the deficiency."] },
    ],
    faq: [
      { q: "Can a lender sue for money after a Texas foreclosure?", a: "Potentially. If the foreclosure proceeds do not satisfy the secured debt and the borrower or guarantor remains liable, a deficiency claim may exist subject to Section 51.003 and other applicable law." },
      { q: "How long does the lender have to file a Texas foreclosure deficiency suit?", a: "Section 51.003 generally requires the deficiency action to be brought within two years after the foreclosure sale." },
      { q: "Can I challenge a very low foreclosure sale price when the lender seeks a deficiency?", a: "Section 51.003 allows a person against whom a deficiency is sought to request a court determination of fair market value, which can produce a statutory offset if fair market value exceeded the sale price." },
    ],
    sources: [
      { label: "Texas Property Code § 51.003", url: "https://statutes.capitol.texas.gov/?artSec=51.003&chapter=PR.51&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 51", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.51.htm" },
    ],
    related: [
      { label: "Texas mortgage foreclosure notice", href: "/guides/texas-mortgage-foreclosure-notice-law" },
      { label: "Texas judgment lien and homestead law", href: "/guides/texas-judgment-lien-homestead-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
    ],
  },
};
