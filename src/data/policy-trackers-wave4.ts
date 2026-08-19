import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE4: PolicyTracker[] = [
  {
    slug: "religious-liberty",
    shortTitle: "Religious Liberty",
    title: "Texas Religious Liberty Policy Tracker",
    description: "Track Texas constitutional and statutory protections for religious exercise, conscience, places of worship, government burdens, schools, employment, and religious organizations.",
    updated: reviewed,
    quickAnswer: "Texas protects religious liberty through both the state constitution and statute. Article I, Section 6 protects freedom of worship and conscience, Section 6-a protects religious services from state or local orders that prohibit or limit them, and Civil Practice and Remedies Code Chapter 110 generally bars government from substantially burdening sincere religious exercise unless it satisfies a compelling-interest and least-restrictive-means test.",
    currentStatus: "Texas religious-liberty disputes are usually about how constitutional and statutory protections apply to a particular government action, not whether religious liberty exists at all. Chapter 110 supplies a state-law framework in addition to federal constitutional protections and includes procedural rules, defenses, remedies, and specific protections for places of worship.",
    keyFacts: [
      "Texas Constitution Article I, Section 6 protects worship and rights of conscience and prohibits legal preference for a religious society or mode of worship.",
      "Article I, Section 6-a bars the state and political subdivisions from issuing measures that prohibit or limit religious services conducted by qualifying religious organizations.",
      "Civil Practice and Remedies Code Section 110.003 generally prohibits a government agency from substantially burdening a person's free exercise of religion unless the burden furthers a compelling governmental interest by the least restrictive means.",
      "Chapter 110 contains procedural requirements and limits; it is not a rule that every sincerely asserted religious objection automatically defeats every generally applicable law.",
    ],
    context: [
      "KTR's editorial position favors robust protection of conscience and religious exercise without government establishing a preferred religion. The factual tracker separates that viewpoint from the legal tests courts apply in individual disputes.",
      "Religious-liberty coverage should distinguish government action from purely private disputes and should identify the specific constitutional provision, statute, civil-rights rule, contract, or employment law that controls the issue.",
    ],
    watchFor: [
      "Texas Supreme Court and federal court decisions applying state or federal free-exercise protections",
      "Legislation affecting religious organizations, schools, adoption, employment, health care, or public accommodations",
      "Government emergency orders or local regulations affecting places of worship",
      "Conflicts involving conscience protections and other civil-rights obligations",
    ],
    sources: [
      { label: "Texas Constitution — Article I", url: "https://statutes.capitol.texas.gov/SOTWDocs/CN/htm/CN.1.htm", primary: true },
      { label: "Texas Religious Freedom Restoration Act — Chapter 110", url: "https://statutes.capitol.texas.gov/Docs/CP/htm/CP.110.htm", primary: true },
      { label: "Texas Attorney General — Religious Liberty", url: "https://www.texasattorneygeneral.gov/civil/religious-liberty", primary: true },
    ],
    related: [
      { label: "The Texas Case for Religious Liberty", href: "/texas-case/religious-liberty", kind: "editorial" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas courts", href: "/texas-courts", kind: "government" },
    ],
    keywords: ["religious liberty", "religious freedom", "freedom of worship", "conscience", "Texas RFRA", "Chapter 110", "free exercise", "church"],
  },
  {
    slug: "state-federal-power",
    shortTitle: "State-Federal Power",
    title: "Texas State and Federal Power Policy Tracker",
    description: "Track Texas federalism disputes, state sovereignty, federal preemption, constitutional limits, lawsuits against federal agencies, and conflicts over which level of government controls a policy question.",
    updated: reviewed,
    quickAnswer: "Texas has broad sovereign authority within the federal system, but it is expressly subject to the U.S. Constitution. Texas Constitution Article I, Section 1 calls Texas a free and independent state subject to the U.S. Constitution and emphasizes local self-government. In an actual dispute, the controlling question is whether the Constitution assigns the power federally, reserves it to states or the people, or allows valid federal law to preempt conflicting state law.",
    currentStatus: "Federalism is a recurring Texas policy issue across immigration, elections, energy, environmental regulation, firearms, health care, education, and infrastructure. The legal result depends on the source of federal and state authority and on controlling court precedent, not simply on which government asserts sovereignty more strongly.",
    keyFacts: [
      "Texas Constitution Article I, Section 1 describes Texas as a free and independent state while expressly making that status subject to the Constitution of the United States.",
      "The U.S. Constitution's Supremacy Clause gives controlling effect to valid federal law when it conflicts with state law; the Tenth Amendment reserves powers not delegated to the United States nor prohibited to the states.",
      "Federal preemption can be express or arise from the structure and operation of federal law, and its scope is frequently litigated.",
      "State sovereignty within the Union is a federalism principle; it should not be confused with a claim that Texas may unilaterally disregard the U.S. Constitution or binding federal court judgments.",
    ],
    context: [
      "KTR's editorial perspective favors meaningful state sovereignty, limited federal power, and decisions made as close to Texans as constitutional authority permits. The tracker separately identifies where federal law validly controls and where Texas retains room to act.",
      "This framework is especially useful for stories about border enforcement or federal regulation because it prevents political rhetoric about jurisdiction from being mistaken for a legal holding.",
    ],
    watchFor: [
      "U.S. Supreme Court and Fifth Circuit rulings involving Texas and federal authority",
      "Texas Attorney General litigation challenging federal rules or executive actions",
      "Federal preemption disputes involving immigration, energy, firearms, health care, or elections",
      "Texas legislation designed to test or preserve state regulatory authority",
    ],
    sources: [
      { label: "Texas Constitution — Article I, Section 1", url: "https://statutes.capitol.texas.gov/SOTWDocs/CN/htm/CN.1.htm", primary: true },
      { label: "U.S. Constitution — Constitution Annotated", url: "https://constitution.congress.gov/constitution/", primary: true },
      { label: "Texas Attorney General", url: "https://www.texasattorneygeneral.gov/", primary: true },
      { label: "U.S. Court of Appeals for the Fifth Circuit", url: "https://www.ca5.uscourts.gov/", primary: true },
    ],
    related: [
      { label: "Border Security tracker", href: "/policy/border-security", kind: "reference" },
      { label: "Immigration tracker", href: "/policy/immigration", kind: "reference" },
      { label: "Energy & ERCOT tracker", href: "/policy/energy-ercot", kind: "reference" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["state sovereignty", "federalism", "federal overreach", "preemption", "Tenth Amendment", "Supremacy Clause", "Texas federal lawsuit", "states rights"],
  },
  {
    slug: "right-to-work",
    shortTitle: "Right to Work",
    title: "Texas Right-to-Work and Labor Freedom Policy Tracker",
    description: "Track Texas right-to-work law, union membership rules, public-sector bargaining, employment freedom, labor legislation, and disputes over worker and employer rights.",
    updated: reviewed,
    quickAnswer: "Texas is a right-to-work state. Texas Workforce Commission guidance points to Labor Code Sections 101.052 and 101.053, under which employment may not be conditioned or denied because of union membership or nonmembership. Right-to-work is different from at-will employment and does not eliminate labor organizations, collective activity, federal labor law, contracts, or all public-sector bargaining rules.",
    currentStatus: "Texas right-to-work protections remain part of state labor law. The broader labor-policy debate includes federal labor law, public-employee bargaining statutes, local meet-and-confer systems, union dues and representation, workplace rules, and the distinction between voluntary association and compulsory membership as a condition of employment.",
    keyFacts: [
      "The Texas Workforce Commission identifies Texas as a right-to-work state under Labor Code Sections 101.052 and 101.053.",
      "Right-to-work means employment cannot be conditioned or denied based on membership or nonmembership in a labor union; it is not the same concept as employment at will.",
      "Federal labor law governs many private-sector organizing and collective-bargaining questions, so Texas right-to-work law is only one part of the legal framework.",
      "Texas public-sector labor rules differ from private-sector rules and can include statutory exceptions or meet-and-confer systems for particular public employees and local governments.",
    ],
    context: [
      "KTR's editorial position favors voluntary association and opposes making union membership a condition of employment. The factual tracker also distinguishes that principle from disputes over organizing rights, contracts, representation, wages, benefits, and public-sector statutes.",
      "Public-sector unions deserve separate analysis because taxpayers, elected officials, civil-service rules, public safety, and statutory bargaining authority can create different incentives and legal questions from private employment.",
    ],
    watchFor: [
      "Texas legislation altering right-to-work or public-sector bargaining rules",
      "Federal labor-law and National Labor Relations Board changes affecting Texas employers and workers",
      "Municipal meet-and-confer or collective-bargaining agreements authorized by specific statutes",
      "Litigation involving union membership, dues, representation, retaliation, or organizing rights",
    ],
    sources: [
      { label: "Texas Workforce Commission — Pay and Policies", url: "https://efte.twc.texas.gov/pay_and_policies_general.html", primary: true },
      { label: "Texas Labor Code — Chapter 101", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.101.htm", primary: true },
      { label: "Texas Government Code — Chapter 617", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.617.htm", primary: true },
    ],
    related: [
      { label: "Texas Economy", href: "/texas-economy", kind: "reference" },
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Texas Legislature", href: "/texas-legislature", kind: "government" },
    ],
    keywords: ["right to work", "Texas right to work", "labor unions", "union membership", "Labor Code 101", "at-will employment", "collective bargaining", "public sector unions"],
  },
];
