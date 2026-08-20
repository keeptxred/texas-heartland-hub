import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_LOCKOUT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-landlord-lockout-law": {
    slug: "texas-landlord-lockout-law",
    title: "Texas Landlord Lockout Law: When Locks May Be Changed and the Right to a Key",
    dek: "Texas residential lockout rules explained, including Property Code Sections 92.0081 and 92.009, rent-delinquency procedures, required notices, key access, and writs of reentry.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Section 92.0081 generally prohibits intentionally preventing a tenant from entering except through judicial process or the statute's limited exceptions.",
      "A rent-related lock change is allowed only under detailed statutory conditions, including lease authorization and advance notice.",
      "When a qualifying rent lockout occurs, the landlord must provide the new key at any hour without requiring payment of delinquent rent as a condition of receiving the key.",
      "Section 92.009 provides a justice-court writ-of-reentry procedure for an unlawful lockout.",
    ],
    intro: [
      "Texas does not treat a residential lockout as a substitute for the ordinary eviction process. Section 92.0081 sharply limits when a landlord may exclude a tenant and imposes detailed safeguards when locks are changed because rent is delinquent.",
      "A tenant who alleges an unlawful lockout may have access to the expedited reentry procedure in Section 92.009 in addition to other statutory remedies.",
    ],
    sections: [
      { heading: "Judicial process is the general rule", paragraphs: ["Section 92.0081 generally says a landlord may not intentionally prevent a tenant from entering the leased premises except by judicial process unless a listed exception applies, such as bona fide repairs, construction, an emergency, abandonment, or a qualifying rent-related lock change."] },
      { heading: "Rent-related lock changes have strict conditions", paragraphs: ["For a rent-delinquency lock change, the landlord's right must be stated in the lease, rent must actually be delinquent, and the advance written notice required by Section 92.0081 must be given. The statute also limits when and how often the locks may be changed."] },
      { heading: "The tenant is entitled to the new key", paragraphs: ["The statute requires the landlord to provide the new key without regard to whether the tenant pays the delinquent rent. Required notices must explain how the tenant can obtain the key, including after normal business hours."] },
      { heading: "Justice-court reentry remedy", paragraphs: ["Section 92.009 allows a tenant alleging an unlawful lockout to file a sworn complaint for reentry in the justice court for the precinct where the rental premises are located. The statute describes when a justice may issue a writ of reentry."] },
    ],
    faq: [
      { q: "Can a Texas landlord lock a tenant out for unpaid rent?", a: "Only under the detailed conditions in Section 92.0081. A rent-related lock change is not the same as a final eviction and the tenant must be given access to the new key as the statute requires." },
      { q: "Does the tenant have to pay all rent before getting the new key?", a: "No. Section 92.0081 requires the new key to be provided without regard to whether the tenant pays the delinquent rent." },
      { q: "What can a tenant do after an unlawful lockout?", a: "Section 92.009 provides a justice-court writ-of-reentry process, and Section 92.0081 provides additional statutory remedies." },
    ],
    sources: [
      { label: "Texas Property Code § 92.0081", url: "https://statutes.capitol.texas.gov/?artSec=92.0081&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.009", url: "https://statutes.capitol.texas.gov/?artSec=92.009&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas eviction process", href: "/guides/texas-eviction-process-timeline" },
      { label: "Texas utility shutoff law", href: "/guides/texas-landlord-utility-shutoff-law" },
    ],
  },
};
