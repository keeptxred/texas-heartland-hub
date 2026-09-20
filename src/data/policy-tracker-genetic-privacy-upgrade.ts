import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE16 } from "@/data/policy-trackers-wave16";

const geneticBase = POLICY_TRACKERS_WAVE16.find((tracker) => tracker.slug === "genetic-data-privacy");
if (!geneticBase) throw new Error("Missing genetic-data-privacy policy tracker");

export const GENETIC_DATA_PRIVACY_UPGRADE: PolicyTracker = {
  ...geneticBase,
  updated: "2026-08-29",
  currentStatus:
    "Business & Commerce Code Chapter 503A has been in effect since September 1, 2023. In June 2025, the Texas Attorney General intervened in the 23andMe bankruptcy to assert Texans' property and consent rights in genetic information and to require compliance with Texas privacy law during any transfer of customer data. In July 2026, the Attorney General announced a $150 million multistate settlement of bankruptcy claims arising from the 2023 23andMe breach. Those matters provide concrete enforcement and implementation evidence without changing Chapter 503A's statutory text or its stated exemptions.",
  keyFacts: [
    ...geneticBase.keyFacts,
    "Chapter 503A authorizes the Texas Attorney General to seek civil penalties of up to $2,500 per violation, injunctive relief, attorney's fees, and court costs for violations by covered direct-to-consumer genetic-testing companies.",
    "In the 23andMe bankruptcy, the Texas Attorney General specifically asserted that a transfer or disclosure of Texans' genetic information to a buyer requires compliance with Texas consent and data-rights law; a bankruptcy asset sale should not be reported as automatically extinguishing those rights.",
    "The 2026 23andMe settlement is evidence of real enforcement and breach consequences, but it should not be described as a final appellate interpretation of every Chapter 503A provision; the tracker separates settlements, bankruptcy claims, statutory duties, and future judicial holdings.",
  ],
  context: [
    ...geneticBase.context,
    "Coverage begins with the type of company and data involved. Chapter 503A focuses on direct-to-consumer genetic-testing companies that offer products or services to Texas residents or handle qualifying genetic data supplied by Texas consumers. It contains exclusions for specified research, HIPAA-covered information, higher education, and testing performed by or at the direction of health-care providers. KTR will identify the company, data source, consumer relationship, and applicable exclusion before describing an incident as a Chapter 503A violation. That keeps a statute aimed at consumer DNA-testing businesses from being generalized to every hospital laboratory, university research project, or medical record containing genetic information.",
    "Property rights and consent rights are related but distinct. Texas law recognizes an individual's property right and exclusive control over a covered biological sample and the results of genetic testing or analysis, while separate provisions require particular forms of consent for transfers, secondary uses, retained samples, research, and marketing. A company can therefore face one question about who controls a sample and another about whether a particular use or disclosure was authorized. The tracker will name the exact activity and consent standard instead of treating a generic privacy policy or terms-of-service acceptance as proof that every downstream genetic-data use was permitted.",
    "The consumer-rights lifecycle extends beyond collection. Covered companies must provide processes for access, account and genetic-data deletion, and destruction or required destruction of biological samples. Those rights become especially important when a company is acquired, reorganized, shuts down, or enters bankruptcy because consumers may no longer be dealing with the same corporate operator that collected the sample. KTR will track whether a successor or bankruptcy buyer proposes to receive genetic information, what consent the company claims to have, what deletion or destruction options remain available, and what a court or regulator actually requires before describing the transfer as lawful or unlawful.",
    "Government, insurer, and employer access should also remain separate. Chapter 503A restricts disclosure of genetic data to law-enforcement or other governmental entities without express written consent or valid legal process and restricts disclosure to specified insurers or an employer without written consent. A subpoena, warrant, consumer authorization, internal company use, insurer request, and commercial sale are not interchangeable events. The tracker will identify the requesting party, legal process, consent record, and data category so readers can tell which statutory restriction is actually implicated.",
    "Security obligations are part of the same law but require different evidence from consent disputes. A covered company must maintain a comprehensive security program for genetic data. A breach can expose ancestry information, relatives, account information, or other sensitive records and can trigger separate Texas privacy, identity-theft, deceptive-practices, or federal issues depending on the facts. KTR will distinguish the security failure alleged, the information actually exposed, the legal claims asserted, and the remedy obtained. The existence of a breach does not by itself establish every alleged statutory violation, while the existence of a privacy policy does not prove that reasonable security was maintained.",
    "The 23andMe bankruptcy provides the clearest Texas implementation record so far. In June 2025, the Attorney General sought a judgment confirming Texans' rights in genetic information and requiring compliance with Texas privacy law before transfer to a purchaser. In July 2026, the Attorney General announced a multistate settlement of bankruptcy claims related to the company's 2023 breach. KTR will preserve those procedural distinctions: an Attorney General complaint or bankruptcy filing states legal claims, a negotiated settlement resolves specified claims under its terms, and only a judicial opinion interpreting Chapter 503A establishes a precedential holding on disputed statutory language.",
    "The durable accountability test is whether Texans can exercise meaningful control over genetic information across the full business lifecycle. Useful evidence includes deletion and sample-destruction processes, consent interfaces, privacy notices, security incidents, bankruptcy sale terms, Attorney General filings, settlements, court decisions, and statutory amendments. Genetic information is unusually persistent and can reveal information about biological relatives, so KTR's editorial preference favors strong individual control. The factual tracker will nevertheless keep advocacy separate from what the current statute, enforcement record, and final legal outcomes actually establish.",
  ],
  watchFor: [
    ...geneticBase.watchFor,
    "Final bankruptcy or court orders clarifying how Chapter 503A property, consent, deletion, and sample-destruction rights apply to asset sales or successor companies",
    "Texas Attorney General enforcement that identifies the specific Chapter 503A duty, alleged conduct, procedural stage, penalty or remedy, and final outcome",
  ],
  sources: [
    ...geneticBase.sources,
    {
      label: "Texas Attorney General — 23andMe bankruptcy genetic-information action, June 12, 2025",
      url: "https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-takes-legal-action-against-23andme-protect-texans-rights-their-genetic",
      primary: true,
    },
    {
      label: "Texas Attorney General — 23andMe breach settlement, July 15, 2026",
      url: "https://www.texasattorneygeneral.gov/news/releases/attorney-general-paxton-secures-150-million-settlement-against-23andme-over-data-breach-exposed",
      primary: true,
    },
  ],
};

export const GENETIC_DATA_PRIVACY_INDEXABLE_SLUG = GENETIC_DATA_PRIVACY_UPGRADE.slug;
