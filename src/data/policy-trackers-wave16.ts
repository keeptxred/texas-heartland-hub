import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE16: PolicyTracker[] = [
  {
    slug: "scope-act-online-minors",
    shortTitle: "SCOPE Act",
    title: "Texas SCOPE Act and Online Minors Policy Tracker",
    description: "Track the Texas SCOPE Act, digital-service duties involving minors, parental controls, harmful-content provisions, advertising restrictions, age requirements, Attorney General enforcement, and current federal litigation.",
    updated: reviewed,
    quickAnswer: "Texas HB 18, the Securing Children Online through Parental Empowerment (SCOPE) Act, took effect September 1, 2024 except for its school-device article, which took effect earlier. Current Business & Commerce Code Chapter 509 regulates covered digital services used by minors, but multiple provisions have been litigated and the law cannot accurately be described as either fully blocked or fully upheld.",
    currentStatus: "On July 24, 2026, the Fifth Circuit issued a consolidated decision in challenges to HB 18. The court affirmed the preliminary injunction against the monitoring-and-filtering requirement in the CCIA/NetChoice case on federal Section 230 preemption grounds. In the separate SEAT case, it vacated and remanded portions of the preliminary injunction because the plaintiffs had not established standing for several challenged provisions, while describing the age-verification challenge as foreclosed by subsequent Supreme Court precedent. Other unchallenged or non-enjoined portions of Chapter 509 remain a separate question from those specific rulings.",
    keyFacts: [
      "HB 18 created the SCOPE Act and current Business & Commerce Code Chapter 509 governing use of certain digital services by minors.",
      "The statute includes parental-management duties, restrictions involving known minors and advertising, and provisions addressing harmful material and specified age verification.",
      "The Fifth Circuit's July 24, 2026 decision left a preliminary injunction in place against the CCIA plaintiffs' challenged monitoring-and-filtering requirement because the panel majority held it preempted by 47 U.S.C. Section 230.",
      "The same appellate decision vacated and remanded the SEAT plaintiffs' preliminary injunction in part for standing deficiencies and said their age-verification challenge was foreclosed by later Supreme Court precedent; that procedural result is not a blanket merits ruling on every SCOPE Act provision.",
    ],
    context: [
      "KTR's editorial position favors meaningful parental authority and child-safety protections online while recognizing that state mandates must comply with the First Amendment, federal preemption rules, and privacy constraints. The factual tracker therefore separates enacted text from provisions affected by specific court orders.",
      "The SCOPE Act is broader than Texas's pornography-site age-verification law and different from the App Store Accountability Act. Each law has different triggers, regulated entities, duties, and litigation.",
    ],
    watchFor: [
      "Further Fifth Circuit or U.S. Supreme Court proceedings in the HB 18 challenges",
      "District-court proceedings on remand following the July 24, 2026 appellate decision",
      "Attorney General enforcement of provisions not subject to an operative injunction",
      "Legislation amending Chapter 509 in response to litigation, technology changes, or federal law",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 18 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00018F.htm", primary: true },
      { label: "Texas Legislature Online — HB 18 bill stages", url: "https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=HB18&LegSess=88R", primary: true },
      { label: "Fifth Circuit — CCIA / SEAT v. Paxton, July 24, 2026 (opinion mirror)", url: "https://law.justia.com/cases/federal/appellate-courts/ca5/24-50721/24-50721-2026-07-24.html" },
      { label: "Texas Business & Commerce Code", url: "https://statutes.capitol.texas.gov/?link=BC", primary: true },
    ],
    related: [
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Online Age Verification tracker", href: "/policy/online-age-verification", kind: "reference" },
      { label: "App Store Parental Controls tracker", href: "/policy/app-store-parental-controls", kind: "reference" },
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
    ],
    keywords: ["Texas SCOPE Act", "HB 18", "Chapter 509", "online minors", "social media minors", "parental controls", "Section 230", "child online safety"],
  },
  {
    slug: "texas-cyber-command",
    shortTitle: "Texas Cyber Command",
    title: "Texas Cyber Command and State Cybersecurity Policy Tracker",
    description: "Track Texas Cyber Command implementation, statewide incident response, threat intelligence, digital forensics, cybersecurity standards and training, network-security services, critical-infrastructure coordination, and the transfer of functions from DIR.",
    updated: reviewed,
    quickAnswer: "Texas HB 150 created the Texas Cyber Command as a state agency under Government Code Chapter 2063, effective September 1, 2025. The command is responsible for major statewide cybersecurity functions, including standards, training, threat intelligence, incident response, digital forensics, and network-security services. In April 2026, the Department of Information Resources announced that cybersecurity functions had transitioned to the command and described it as the state's centralized cybersecurity authority.",
    currentStatus: "Texas Cyber Command is operational in 2026 while the statutory transfer framework continues to mature. DIR says services, incident-reporting procedures, service levels, and access to cybersecurity resources continued without interruption during the transition. HB 150 also sets a December 31, 2026 outer deadline for specified functions, staff, assets, contracts, and responsibilities to transfer from DIR to the command.",
    keyFacts: [
      "HB 150 took effect September 1, 2025 and added Government Code Chapter 2063 establishing Texas Cyber Command as a state agency.",
      "The command's statutory duties include statewide cybersecurity standards and best practices, training, a threat-intelligence center, an incident-response unit, and a digital-forensics laboratory.",
      "HB 150 transfers network-security and other cybersecurity functions previously assigned to DIR and allows specified services and agreements involving state agencies, local governments, higher education, and critical infrastructure.",
      "DIR announced on April 9, 2026 that cybersecurity functions had transitioned to Texas Cyber Command and that existing stakeholder access and incident-reporting procedures remained unchanged at that time.",
    ],
    context: [
      "KTR's editorial position favors stronger protection of Texas government and critical infrastructure from cyberattacks while requiring clear accountability for spending, authority, privacy, and measurable security outcomes. The factual tracker follows the actual transfer and operational milestones rather than treating creation of a new agency as proof of success.",
      "Cybersecurity policy intersects with consumer privacy and critical infrastructure but is distinct from laws that regulate private data collection or AI systems.",
    ],
    watchFor: [
      "Completion of statutory transfers from DIR by the end of 2026",
      "Texas Cyber Command incident-response, threat-intelligence, training, and digital-forensics activity",
      "State cybersecurity standards, reporting requirements, appropriations, staffing, and procurement",
      "Major cyber incidents affecting Texas government, schools, local governments, utilities, or critical infrastructure",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 150 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB150&LegSess=89R", primary: true },
      { label: "HB 150 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00150F.htm", primary: true },
      { label: "Texas DIR — Cybersecurity Functions Transition to Texas Cyber Command", url: "https://dir.texas.gov/news/cybersecurity-functions-transition-texas-cyber-command", primary: true },
    ],
    related: [
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "AI Governance tracker", href: "/policy/ai-governance", kind: "reference" },
      { label: "Critical Minerals tracker", href: "/policy/critical-minerals-rare-earths", kind: "reference" },
      { label: "Texas Government", href: "/texas-government", kind: "government" },
    ],
    keywords: ["Texas Cyber Command", "HB 150", "Chapter 2063", "Texas cybersecurity", "cyber incident response", "critical infrastructure", "DIR cybersecurity"],
  },
  {
    slug: "genetic-data-privacy",
    shortTitle: "Genetic Data Privacy",
    title: "Texas Genetic Data and Direct-to-Consumer DNA Privacy Policy Tracker",
    description: "Track Texas direct-to-consumer genetic-testing privacy, DNA ownership, consent, deletion and sample-destruction rights, security duties, law-enforcement access, employer and insurer disclosure restrictions, and Attorney General enforcement.",
    updated: reviewed,
    quickAnswer: "Texas Business & Commerce Code Chapter 503A gives Texans specific rights involving direct-to-consumer genetic testing. The law recognizes an individual's property right and exclusive control over covered biological samples and DNA test results, requires specified consent for secondary uses or disclosures, requires security and consumer access/deletion processes, and restricts disclosure to government, insurers, and employers except under stated conditions.",
    currentStatus: "Chapter 503A has been in effect since September 1, 2023. It applies to covered direct-to-consumer genetic-testing companies serving Texas residents or handling qualifying genetic data supplied by Texas consumers, while excluding specified research, HIPAA-covered data, higher education, health-care-provider testing, and other contexts listed in the statute.",
    keyFacts: [
      "HB 2545 created Business & Commerce Code Chapter 503A and took effect September 1, 2023.",
      "The law recognizes an individual's property right in and exclusive control over a covered biological sample and the results of genetic testing or analysis of the individual's DNA.",
      "Covered companies must maintain a security program and provide processes for consumers to access genetic data, delete accounts and genetic data, and destroy or require destruction of biological samples.",
      "The statute requires specified forms of consent for transfers, secondary uses, sample retention, research, and marketing; it also restricts disclosure to law enforcement without consent or valid legal process and disclosure to insurers or employers without written consent.",
    ],
    context: [
      "KTR's editorial position favors strong individual control over DNA and genetic information because these data are uniquely identifying, persistent, and can reveal information about relatives as well as the customer. The factual tracker also states the law's exclusions so direct-to-consumer rules are not incorrectly generalized to every medical or research setting.",
      "This tracker complements biometric privacy and consumer data privacy but focuses on a separate statute with distinct rights involving biological samples, DNA test results, research consent, and law-enforcement access.",
    ],
    watchFor: [
      "Attorney General enforcement involving direct-to-consumer genetic-testing companies",
      "Bankruptcy, acquisition, or data-transfer events involving genetic-testing businesses",
      "Legislation changing consent, deletion, sample destruction, law-enforcement access, insurance, or employer rules",
      "Federal genetic-privacy, health-data, or consumer-privacy rules that interact with Chapter 503A",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 2545 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB02545F.htm", primary: true },
      { label: "Texas Business & Commerce Code — Chapter 503A", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=BC.503A&code=BC&tab=1", primary: true },
    ],
    related: [
      { label: "Biometric Privacy tracker", href: "/policy/biometric-privacy", kind: "reference" },
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "Data Brokers tracker", href: "/policy/data-brokers", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["Texas genetic privacy", "DNA privacy", "Chapter 503A", "HB 2545", "23andMe Texas", "genetic testing", "DNA ownership", "genetic data"],
  },
];
