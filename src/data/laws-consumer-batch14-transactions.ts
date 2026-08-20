import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH14_TRANSACTION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-door-to-door-cancellation-law": {
    slug: "texas-door-to-door-cancellation-law",
    title: "Texas Door-to-Door Sales Law: The Three-Business-Day Cancellation Right",
    dek: "When Texas Business & Commerce Code Chapter 601 gives a consumer three business days to cancel certain off-premises sales, required notices, thresholds, exclusions, and how to preserve proof of cancellation.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Chapter 601 covers certain consumer transactions solicited and agreed to at a place other than the merchant's place of business, subject to statutory thresholds and exclusions.",
      "For a covered transaction, Section 601.051 gives the consumer a right to cancel within three business days.",
      "The merchant must provide a contract or receipt and written notice explaining the cancellation right in the language principally used in the sales presentation.",
      "The Texas three-day rule is not a universal buyer's-remorse right for every purchase or contract; the transaction must fall within Chapter 601 or another specific cancellation law.",
    ],
    intro: [
      "Texas consumers often hear that every contract can be cancelled within three days. That is not the rule. Chapter 601 creates a targeted cancellation right for qualifying off-premises consumer transactions, including many traditional door-to-door sales.",
      "The place and manner of solicitation matter, as do the purchase amount and statutory exclusions. Consumers should identify the transaction type before assuming the cooling-off period applies.",
    ],
    sections: [
      { heading: "Chapter 601 applies to specified off-premises transactions", paragraphs: ["Texas Attorney General guidance explains that Chapter 601 applies when a merchant solicits away from the merchant's place of business, the consumer agrees to buy there, and the transaction exceeds the statutory threshold—generally more than $25 in goods or services or more than $100 in real estate—unless an exclusion applies."] },
      { heading: "Covered consumers get three business days to cancel", paragraphs: ["Section 601.051 gives a consumer in a covered transaction until midnight of the third business day after the transaction to cancel. The statutory method and timing should be followed carefully."] },
      { heading: "The merchant must disclose the cancellation right", paragraphs: ["Sections 601.052 and 601.053 require specified contract, receipt, and cancellation disclosures. The documents must be provided in the same language principally used in the sales presentation."] },
      { heading: "Keep proof that cancellation was timely", paragraphs: ["The Attorney General recommends keeping the contract, receipt, cancellation form, and proof that the notice was sent before the deadline. Certified mail or another traceable method can help establish when a cancellation notice was sent."] },
    ],
    faq: [
      { q: "Can I cancel any Texas contract within three days?", a: "No. The three-day rule applies to specific transaction categories such as qualifying off-premises sales under Chapter 601; it is not a universal cancellation right." },
      { q: "How much must the purchase be for Chapter 601 to apply?", a: "Texas Attorney General guidance describes the Chapter 601 thresholds as more than $25 for goods or services or more than $100 for real estate, subject to the statute's exclusions." },
      { q: "Does the seller have to tell me about the right to cancel?", a: "Yes, for a covered transaction Chapter 601 requires specified written notice and contract or receipt disclosures." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code Chapter 601", url: "https://statutes.capitol.texas.gov/Docs/BC/htm/BC.601.htm" },
      { label: "Texas Business & Commerce Code § 601.051", url: "https://statutes.capitol.texas.gov/?artSec=601.051&chapter=BC.601&code=BC&tab=1" },
      { label: "Texas Attorney General — Door-to-Door Sales & 3-Day Right of Rescission", url: "https://www.texasattorneygeneral.gov/consumer-protection/home-real-estate-and-travel/door-door-sales-3-day-right-rescission" },
    ],
    related: [
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
      { label: "Texas price gouging law", href: "/guides/texas-price-gouging-law" },
      { label: "Texas gift card law", href: "/guides/texas-gift-card-law" },
    ],
  },

  "texas-gift-card-law": {
    slug: "texas-gift-card-law",
    title: "Texas Gift Card Law: Fees, Disclosures and Cash Back Under $2.50",
    dek: "Texas stored-value-card protections in Business & Commerce Code Chapter 604, including covered gift cards, balance-reducing fees, expiration disclosures, low-balance cash refunds, and important exclusions.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Business & Commerce Code Chapter 604 regulates many stored-value cards and expressly includes gift cards and gift certificates in its definition.",
      "A periodic fee that reduces the unredeemed balance generally may not be assessed until after the first anniversary of sale or issuance and must satisfy the Chapter 604 reasonableness and disclosure requirements.",
      "Expiration and periodic balance-reducing fee disclosures covered by Section 604.102 must be legibly printed on the card, in addition to the required pre-sale disclosures.",
      "When a covered stored-value card is redeemed in person and less than $2.50 remains, Section 604.152 requires the seller to refund the remaining balance in cash at the consumer's request, subject to the exclusions in Section 604.151.",
    ],
    intro: [
      "Texas calls gift cards a type of stored-value card and regulates fees, disclosures, and some low-balance redemptions. Federal gift-card law also applies to many cards and can provide additional protections.",
      "Chapter 604 contains significant exclusions, including certain financial-institution cards, promotional cards, prepaid calling cards, and other categories. Consumers should determine what kind of card they hold before applying a specific rule.",
    ],
    sections: [
      { heading: "Chapter 604 includes many gift cards and gift certificates", paragraphs: ["Section 604.001 defines a stored-value card and expressly includes a gift card or gift certificate. Section 604.002 then removes specified categories from some or all of the chapter's protections."] },
      { heading: "Balance-reducing fees are restricted", paragraphs: ["Section 604.052 permits a periodic fee or charge that reduces the unredeemed balance only if it is reasonable, is not assessed until after the first anniversary of sale or issuance, and is disclosed as required by Subchapter C."] },
      { heading: "Expiration and fee disclosures must be visible", paragraphs: ["Section 604.102 requires disclosures about expiration or periodic balance-reducing fees to be legibly printed on the card, in addition to the applicable disclosure requirements at sale."] },
      { heading: "Some low balances must be refunded in cash", paragraphs: ["Under Section 604.152, if a covered card is redeemed in person for a purchase and less than $2.50 remains, the seller must refund the balance in cash when the consumer asks. Section 604.151 excludes certain cards, including specified financial-institution, promotional, return-credit, and low-initial-value cards."] },
    ],
    faq: [
      { q: "Can I get cash back from a Texas gift card with a tiny remaining balance?", a: "For a card covered by Subchapter D, if an in-person redemption leaves less than $2.50, Section 604.152 requires a cash refund at the consumer's request." },
      { q: "Can a Texas gift card charge an inactivity fee right away?", a: "Chapter 604 generally bars a periodic fee that reduces the balance until after the first anniversary and requires the fee to satisfy reasonableness and disclosure rules; federal law can provide additional restrictions." },
      { q: "Do all prepaid and promotional cards have the same protections?", a: "No. Chapter 604 contains exclusions for several categories, so the type and issuer of the card matter." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code Chapter 604", url: "https://statutes.capitol.texas.gov/Docs/BC/htm/BC.604.htm" },
      { label: "Texas Business & Commerce Code § 604.052", url: "https://statutes.capitol.texas.gov/?artSec=604.052&chapter=BC.604&code=BC&tab=1" },
      { label: "Texas Business & Commerce Code § 604.152", url: "https://statutes.capitol.texas.gov/?artSec=604.152&chapter=BC.604&code=BC&tab=1" },
    ],
    related: [
      { label: "Texas door-to-door cancellation", href: "/guides/texas-door-to-door-cancellation-law" },
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
      { label: "Texas consumer data privacy law", href: "/guides/texas-consumer-data-privacy-law" },
    ],
  },
};
