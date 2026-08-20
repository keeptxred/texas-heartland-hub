import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_SECURITY_DEPOSIT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-security-deposit-law": {
    slug: "texas-security-deposit-law",
    title: "Texas Security Deposit Law: 30-Day Refunds, Deductions and Normal Wear",
    dek: "Texas residential security-deposit rules explained, including the 30-day refund deadline, forwarding addresses, itemized deductions, normal wear and tear, and bad-faith withholding.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Section 92.103 generally requires a residential security deposit to be refunded on or before the 30th day after the tenant surrenders the premises, subject to Section 92.107.",
      "A landlord may deduct amounts the tenant is legally liable for, but Section 92.104 prohibits retaining a deposit for normal wear and tear.",
      "When deductions are made, the landlord generally must provide the remaining balance and a written description and itemized list, subject to the statutory unpaid-rent exception.",
      "A landlord's refund/accounting obligation is delayed until the tenant gives a written forwarding address, but failing to provide the address does not forfeit the deposit itself.",
    ],
    intro: [
      "Texas security-deposit law is concentrated in Subchapter C of Property Code Chapter 92. The statute sets a refund timeline, regulates deductions, and creates remedies for bad-faith withholding.",
      "The practical priorities are timing and documentation: tenants should provide a forwarding address in writing, and landlords should separate actual damage from normal wear and tear.",
    ],
    sections: [
      { heading: "The 30-day refund rule", paragraphs: ["Section 92.103 generally requires the landlord to refund the security deposit on or before the 30th day after the tenant surrenders the premises, except as provided by Section 92.107 regarding the forwarding address." ] },
      { heading: "What may be deducted", paragraphs: ["Section 92.104 allows deductions for damages and charges for which the tenant is legally liable under the lease or because of a lease breach. It expressly prohibits retaining any portion of the deposit for normal wear and tear." ] },
      { heading: "Forwarding address and itemization", paragraphs: ["Section 92.107 says the landlord is not obligated to return the deposit or provide the written description of deductions until the tenant gives a written forwarding address. Section 92.104 generally requires a written description and itemized list when money is withheld, subject to the unpaid-rent exception." ] },
      { heading: "Bad-faith withholding", paragraphs: ["Section 92.109 creates remedies for bad-faith retention and for bad-faith failure to provide the required itemization. Missing the statutory refund or accounting deadline can create a presumption of bad faith." ] },
    ],
    faq: [
      { q: "How long does a Texas landlord have to return a security deposit?", a: "Section 92.103 generally uses 30 days after the tenant surrenders the premises, subject to the forwarding-address rule in Section 92.107." },
      { q: "Can a landlord deduct for normal wear and tear?", a: "No. Section 92.104 says a landlord may not retain a security deposit to cover normal wear and tear." },
      { q: "Do I lose my deposit if I forget a forwarding address?", a: "No. Section 92.107 delays the landlord's obligation to send the refund or accounting until a written forwarding address is provided, but it does not forfeit the tenant's right to the deposit." },
    ],
    sources: [
      { label: "Texas Property Code § 92.103", url: "https://statutes.capitol.texas.gov/?artSec=92.103&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.104", url: "https://statutes.capitol.texas.gov/?artSec=92.104&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.107", url: "https://statutes.capitol.texas.gov/?artSec=92.107&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.109", url: "https://statutes.capitol.texas.gov/?artSec=92.109&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas rent late-fee law", href: "/guides/texas-rent-late-fee-law" },
      { label: "Breaking a Texas lease", href: "/guides/texas-breaking-lease-law" },
    ],
  },
};
