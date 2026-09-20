import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH15_REPOSSESSION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-vehicle-repossession-law": {
    slug: "texas-vehicle-repossession-law",
    title: "Texas Vehicle Repossession Law: Default, Self-Help and Breach of the Peace",
    dek: "How Texas Business & Commerce Code Article 9 allows a secured auto lender to repossess collateral after default, why self-help cannot breach the peace, and when redemption remains available.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Business & Commerce Code Section 9.609 allows a secured party, after default, to take possession of collateral through judicial process or without judicial process if the repossession proceeds without breach of the peace.",
      "Whether a borrower is in default depends principally on the security agreement and applicable law; missed payments and failure to maintain required insurance are common contractual defaults.",
      "Texas does not generally require an ordinary auto lender to file a lawsuit before using peaceful self-help repossession after default.",
      "Section 9.623 generally allows redemption of collateral before the secured party has collected, disposed of, or contracted to dispose of it, by satisfying the secured obligations and reasonable expenses as the statute requires.",
    ],
    intro: [
      "Texas auto repossession law is built around secured-credit rules. A lender with a valid security interest can have remedies that an ordinary unsecured creditor does not.",
      "The right to repossess is not a license to use force. Article 9 expressly conditions nonjudicial self-help repossession on avoiding a breach of the peace.",
    ],
    sections: [
      { heading: "Repossession rights arise after default", paragraphs: ["Section 9.609 gives a secured party possession rights after default. The contract should be reviewed to determine what events constitute default and whether the lender accelerated the debt or invoked other contractual remedies."] },
      { heading: "Self-help must avoid a breach of the peace", paragraphs: ["A secured party may proceed without judicial process only if it does so without breach of the peace. Article 9 does not define every factual scenario, so disputes involving confrontation, force, locked areas, threats, or entry onto property can require case-specific legal analysis."] },
      { heading: "Advance notice of the physical repossession is not the ordinary Article 9 requirement", paragraphs: ["Section 9.609 authorizes peaceful possession after default without first obtaining a court order. Separate notices become important before disposition of the repossessed collateral, and specific contracts or specialized laws can create additional requirements."] },
      { heading: "Redemption can remain available before disposition", paragraphs: ["Section 9.623 generally permits a debtor or other entitled party to redeem collateral before the secured party has collected, disposed of, contracted for disposition, or accepted the collateral in full or partial satisfaction, by tendering the required secured obligation and reasonable expenses and attorney's fees described by the statute."] },
    ],
    faq: [
      { q: "Can a Texas lender repossess a car without suing first?", a: "Generally yes after default if the lender has a valid security interest and the nonjudicial repossession can be completed without breach of the peace." },
      { q: "Can a repo agent use force to take the vehicle?", a: "Section 9.609 allows self-help only without breach of the peace. Forceful or confrontational conduct can create serious legal issues." },
      { q: "Can I get a repossessed car back before it is sold?", a: "Section 9.623 generally provides a right of redemption before specified disposition events if the debtor tenders the obligations and reasonable expenses required by the statute." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code Chapter 9", url: "https://statutes.capitol.texas.gov/Docs/BC/htm/BC.9.htm" },
      { label: "Texas Business & Commerce Code § 9.609", url: "https://statutes.capitol.texas.gov/?artSec=9.609&chapter=BC.9&code=BC&tab=1" },
      { label: "Texas Business & Commerce Code § 9.623", url: "https://statutes.capitol.texas.gov/?artSec=9.623&chapter=BC.9&code=BC&tab=1" },
      { label: "Texas Office of Consumer Credit Commissioner — Debt Collection Practices", url: "https://occc.texas.gov/consumers/debt-collection-practices/" },
    ],
    related: [
      { label: "Texas repossession sale and deficiency", href: "/guides/texas-repossession-sale-deficiency-law" },
      { label: "Texas judgment exemptions", href: "/guides/texas-judgment-exempt-property-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
    ],
  },

  "texas-repossession-sale-deficiency-law": {
    slug: "texas-repossession-sale-deficiency-law",
    title: "Texas Repossession Sale and Deficiency Law: Notice, Commercial Reasonableness and Remaining Debt",
    dek: "What happens after a Texas lender repossesses collateral, including disposition notices, commercially reasonable sales, application of proceeds, surplus, and possible deficiency balances under Article 9.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "After default, Article 9 permits a secured party to sell, lease, license, or otherwise dispose of collateral, but every aspect of the disposition must be commercially reasonable under Section 9.610.",
      "Sections 9.611 through 9.614 generally require reasonable authenticated notice of disposition to the debtor and specified other parties, with consumer-goods transactions receiving detailed notice-content rules.",
      "Section 9.615 generally applies cash proceeds first to reasonable disposition expenses and secured obligations, then to subordinate interests when required, with any surplus paid as the statute directs.",
      "If sale proceeds are insufficient, a deficiency can remain, but failure to comply with Article 9 can affect a secured party's ability to recover that deficiency and can create debtor remedies.",
    ],
    intro: [
      "Repossession does not automatically cancel the loan. The lender must deal with the collateral under Article 9, and the sale price and legally chargeable expenses determine whether money remains owed or a surplus is due.",
      "Notice and commercial reasonableness are central protections. Consumers should keep the post-repossession notices, sale information, account history, and any deficiency demand.",
    ],
    sections: [
      { heading: "The disposition must be commercially reasonable", paragraphs: ["Section 9.610 requires every aspect of a disposition—including method, manner, time, place, and other terms—to be commercially reasonable. The collateral may be sold publicly or privately if Article 9's requirements are met."] },
      { heading: "The debtor generally receives advance notice of disposition", paragraphs: ["Section 9.611 generally requires reasonable authenticated notification before disposition. Sections 9.613 and 9.614 specify content rules, including a consumer-goods notice form and information about liability for a deficiency and entitlement to surplus when applicable."] },
      { heading: "Sale proceeds follow a statutory order", paragraphs: ["Section 9.615 applies proceeds to reasonable repossession and disposition expenses and the secured obligation, then to qualifying subordinate interests. A surplus generally goes to the debtor, while a deficiency can remain when proceeds do not cover the amount secured."] },
      { heading: "Noncompliance can affect deficiency recovery", paragraphs: ["Article 9 provides remedies for a secured party's failure to comply and rules governing deficiency calculations. The effect can depend on whether the transaction is a consumer transaction and on the particular violation, so a deficiency demand should be reviewed against the full disposition record."] },
    ],
    faq: [
      { q: "Do I still owe money after my car is repossessed and sold?", a: "Possibly. If lawful sale proceeds and credits do not cover the secured balance and allowable expenses, a deficiency can remain." },
      { q: "Does the lender have to notify me before selling the repossessed vehicle?", a: "Article 9 generally requires reasonable authenticated notice of disposition to the debtor, subject to the statute's exceptions and detailed consumer-goods rules." },
      { q: "What if the car is sold for much less than expected?", a: "Article 9 requires a commercially reasonable disposition. A low price alone is not necessarily decisive, but the sale method, timing, notice, market conditions, and other circumstances can matter to deficiency and remedy questions." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code § 9.610", url: "https://statutes.capitol.texas.gov/?artSec=9.610&chapter=BC.9&code=BC&tab=1" },
      { label: "Texas Business & Commerce Code § 9.611", url: "https://statutes.capitol.texas.gov/?artSec=9.611&chapter=BC.9&code=BC&tab=1" },
      { label: "Texas Business & Commerce Code § 9.614", url: "https://statutes.capitol.texas.gov/?artSec=9.614&chapter=BC.9&code=BC&tab=1" },
      { label: "Texas Business & Commerce Code § 9.615", url: "https://statutes.capitol.texas.gov/?artSec=9.615&chapter=BC.9&code=BC&tab=1" },
    ],
    related: [
      { label: "Texas vehicle repossession law", href: "/guides/texas-vehicle-repossession-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
      { label: "Texas judgment exemptions", href: "/guides/texas-judgment-exempt-property-law" },
    ],
  },
};
