import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE15: PolicyTracker[] = [
  {
    slug: "ai-governance",
    shortTitle: "AI Governance",
    title: "Texas Artificial Intelligence Governance Policy Tracker",
    description: "Track the Texas Responsible Artificial Intelligence Governance Act, AI disclosures and prohibited uses, Attorney General enforcement, the regulatory sandbox, Texas Artificial Intelligence Council, and related state legislation.",
    updated: reviewed,
    quickAnswer: "The Texas Responsible Artificial Intelligence Governance Act, enacted through HB 149, took effect January 1, 2026. It establishes statewide rules for certain development and deployment of artificial-intelligence systems in Texas, including disclosure duties in specified government and health-care uses, prohibited harmful or unlawful uses, Attorney General enforcement, a regulatory sandbox, and the Texas Artificial Intelligence Council.",
    currentStatus: "TRAIGA is in force and the Texas Attorney General now provides a consumer AI-rights complaint path. The law does not impose one universal preapproval requirement on every AI system; it combines targeted prohibitions and disclosures with enforcement, exemptions, an innovation sandbox, and state oversight structures.",
    keyFacts: [
      "HB 149 became effective January 1, 2026 and created the Texas Responsible Artificial Intelligence Governance Act.",
      "TRAIGA prohibits specified intentional AI uses involving self-harm or criminal encouragement, unlawful discrimination, constitutional-rights impairment, certain government social scoring and biometric uses, and specified illegal sexually explicit material.",
      "Government agencies using consumer-facing AI and health-care providers using AI in covered services have disclosure duties under the act.",
      "The Attorney General has exclusive enforcement authority unless additional agency enforcement is recommended, and the act also establishes an AI regulatory sandbox and the Texas Artificial Intelligence Council.",
    ],
    context: [
      "KTR's editorial position favors rapid AI innovation while protecting constitutional rights, privacy, children, and consumers from demonstrably harmful uses. The factual tracker separates that policy preference from the exact statutory duties, exemptions, enforcement thresholds, and litigation.",
      "Texas AI policy intersects with consumer privacy, biometric identifiers, health care, state government, education, cybersecurity, and free speech. Those adjacent issues should be cross-linked rather than collapsed into a claim that TRAIGA regulates every use identically.",
    ],
    watchFor: [
      "Attorney General TRAIGA enforcement actions and complaint guidance",
      "Rules and participation in the AI regulatory sandbox",
      "Appointments, reports, and recommendations from the Texas Artificial Intelligence Council",
      "Legislation or litigation changing prohibited uses, disclosures, exemptions, penalties, or preemption",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 149 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB149&LegSess=89R", primary: true },
      { label: "HB 149 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm", primary: true },
      { label: "Texas Attorney General — Consumer AI Rights", url: "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint/consumer-ai-rights", primary: true },
    ],
    related: [
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "Biometric Privacy tracker", href: "/policy/biometric-privacy", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["Texas AI law", "TRAIGA", "HB 149", "artificial intelligence", "AI governance", "AI regulation", "AI rights", "Texas AI Council"],
  },
  {
    slug: "data-brokers",
    shortTitle: "Data Brokers",
    title: "Texas Data Broker Registration and Privacy Policy Tracker",
    description: "Track Texas data-broker registration, consumer-rights notices, information-security duties, statutory coverage thresholds, Secretary of State registry administration, Attorney General enforcement, and related privacy legislation.",
    updated: reviewed,
    quickAnswer: "Texas data brokers are currently governed by Business & Commerce Code Chapter 510 and Secretary of State rules. Covered data brokers must register with the Secretary of State before conducting business in Texas, renew registration annually, post required notices, and maintain a comprehensive information-security program. The Secretary of State maintains the registry but does not investigate or enforce data-broker business-practice violations.",
    currentStatus: "The Texas data-broker framework is active and was materially updated in 2025. SB 2121 broadened and clarified who can qualify as a data broker and the revenue/data-volume thresholds used for coverage, while SB 1343 strengthened website and registration notices directing consumers to exercise privacy rights. Current Texas codification places the data-broker chapter at Chapter 510 even though the 2025 enrolled bills refer to the former Chapter 509 numbering before code harmonization.",
    keyFacts: [
      "Current Texas law places data brokers in Business & Commerce Code Chapter 510, and the Secretary of State maintains a searchable central registry.",
      "A covered data broker must register to conduct business in Texas, pay the statutory registration fee, and renew the certificate annually.",
      "Data brokers with a website or mobile application must post a conspicuous notice, and 2025 legislation added instructions or links explaining how consumers may exercise applicable Chapter 541 privacy rights.",
      "The Secretary of State is the filing office rather than the enforcement agency; Texas Attorney General enforcement and separate consumer-privacy law remain distinct from registry administration.",
    ],
    context: [
      "KTR's editorial position favors transparency about businesses that aggregate and monetize personal information people did not provide directly. The factual tracker also recognizes that Texas law uses defined thresholds and exemptions rather than treating every business that receives third-party data as a regulated data broker.",
      "This page complements the broader Consumer Data Privacy tracker by focusing on the registration, notice, and security regime for businesses whose operations fit the data-broker statute.",
    ],
    watchFor: [
      "Secretary of State registry and administrative-rule changes",
      "Attorney General enforcement against unregistered or noncompliant data brokers",
      "Changes to statutory definitions, thresholds, exemptions, fees, notices, or security duties",
      "Federal data-broker or privacy legislation affecting Texas requirements",
    ],
    sources: [
      { label: "Texas Secretary of State — Data Brokers", url: "https://www.sos.state.tx.us/statdoc/data-brokers.shtml", primary: true },
      { label: "Texas Secretary of State — Data Broker FAQs", url: "https://www.sos.state.tx.us/statdoc/faqs4000.shtml", primary: true },
      { label: "Texas Legislature Online — SB 2121 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02121F.htm", primary: true },
      { label: "Texas Legislature Online — SB 1343 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01343F.htm", primary: true },
    ],
    related: [
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "Biometric Privacy tracker", href: "/policy/biometric-privacy", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["Texas data broker", "Chapter 510", "data broker registry", "SB 2105", "SB 2121", "SB 1343", "personal data", "privacy"],
  },
  {
    slug: "biometric-privacy",
    shortTitle: "Biometric Privacy",
    title: "Texas Biometric Identifier Privacy Policy Tracker",
    description: "Track Texas CUBI biometric-identifier consent, commercial capture and disclosure rules, data protection and destruction duties, Attorney General enforcement, artificial-intelligence amendments, and biometric privacy litigation.",
    updated: reviewed,
    quickAnswer: "Texas Business & Commerce Code Chapter 503 protects biometric identifiers through the Capture or Use of Biometric Identifier law, commonly called CUBI. For commercial capture of covered biometric identifiers, a person generally must inform the individual and obtain consent before capture, must use reasonable care to protect the information, faces limits on sale or disclosure, and must destroy captured identifiers within the statutory retention period unless an exception applies.",
    currentStatus: "CUBI remains an actively enforced Texas privacy law. The Attorney General has exclusive enforcement authority and may seek civil penalties up to $25,000 per violation. HB 149, effective January 1, 2026, also amended Section 503.001 to address how biometric capture interacts with artificial-intelligence systems, including limits on treating publicly available images or media as consent and specified AI-development or security exceptions.",
    keyFacts: [
      "CUBI defines biometric identifiers to include retina or iris scans, fingerprints, voiceprints, and records of hand or face geometry.",
      "Commercial capture generally requires notice and consent before the biometric identifier is captured, and the statute separately restricts sale, lease, or disclosure subject to listed exceptions.",
      "A person possessing covered biometric identifiers must use reasonable care to protect them and generally destroy them within a reasonable time, no later than one year after the collection purpose expires unless an exception applies.",
      "The Attorney General has exclusive enforcement authority and may seek civil penalties up to $25,000 per violation; Texas has already used CUBI in major technology-company enforcement.",
    ],
    context: [
      "KTR's editorial position favors meaningful consent before commercial biometric capture and strong protection for identifiers that cannot simply be changed like a password. The factual tracker also records statutory exceptions and the newer AI provisions rather than assuming every facial image or machine-learning use automatically violates CUBI.",
      "Biometric privacy intersects with AI governance, consumer data privacy, law enforcement, security, fraud prevention, and identity verification, but each area can operate under different statutes and exceptions.",
    ],
    watchFor: [
      "Attorney General biometric-privacy investigations, lawsuits, and settlements",
      "Implementation and interpretation of the 2026 HB 149 amendments to Section 503.001",
      "Litigation over consent, facial geometry, voiceprints, AI training, security exceptions, or retention",
      "Legislation changing definitions, private remedies, penalties, retention, or covered technologies",
    ],
    sources: [
      { label: "Texas Attorney General — Biometric Identifier Act", url: "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint/consumer-privacy-rights/biometric-identifier-act", primary: true },
      { label: "Texas Business & Commerce Code — Chapter 503", url: "https://statutes.capitol.texas.gov/?artSec=503.001&chapter=BC.503&code=BC&tab=1", primary: true },
      { label: "HB 149 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm", primary: true },
    ],
    related: [
      { label: "AI Governance tracker", href: "/policy/ai-governance", kind: "reference" },
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "Data Brokers tracker", href: "/policy/data-brokers", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["Texas biometric privacy", "CUBI", "Chapter 503", "facial recognition", "face geometry", "fingerprint", "voiceprint", "biometric consent"],
  },
];
