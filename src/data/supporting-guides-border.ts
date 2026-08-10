import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const commonRelated = [
  { label: "Texas Border & Immigration", href: "/texas-border-security" },
  { label: "Texas Laws & Legislature", href: "/laws" },
  { label: "Texas Politics & Government", href: "/texas-politics" },
];

export const BORDER_SUPPORTING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-border-security-funding-guide": {
    slug: "texas-border-security-funding-guide",
    title: "Texas Border Security Funding: What the State Pays For and Who Controls It",
    dek: "A practical guide to Texas border-security appropriations, Operation Lone Star spending, agency budgets, grants, facilities, deployments, and how to verify current costs.",
    updated: "2026-08-09",
    pillarLabel: "Texas Border & Immigration",
    pillarHref: "/texas-border-security",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas border-security spending is spread across multiple agencies and appropriations rather than one permanent budget line.",
      "Operation Lone Star costs can include personnel, National Guard deployments, transportation, barriers, grants, facilities, technology, and law-enforcement support.",
      "Appropriations authorize spending, but actual expenditures can differ; current totals should be checked against state budget and agency records.",
      "Federal immigration enforcement and Texas state border spending are separate systems even when they operate in the same region.",
    ],
    intro: [
      "Texas border-security spending is large enough to be a recurring political issue, but the number attached to it depends on what is being counted. A legislative appropriation, an agency budget, a supplemental transfer, and an actual expenditure are not the same thing.",
      "This guide explains the major buckets of Texas spending and the records readers can use to verify current figures. It does not freeze one dollar total into an evergreen page because border appropriations and actual expenditures change across budget cycles and emergency actions.",
    ],
    sections: [
      { heading: "Why there is no single permanent border-security number", paragraphs: [
        "The Texas Legislature can appropriate border-related money to several agencies and programs. The governor may also use authorities available under state law to direct emergency resources, while agencies spend appropriated funds through their own operating budgets and contracts.",
        "That means two accurate reports can cite different totals if one is discussing appropriations and another is discussing money actually spent. Readers should always identify the period, agencies, and accounting basis behind a border-cost claim.",
      ]},
      { heading: "The major spending categories", bullets: [
        "Department of Public Safety personnel, overtime, equipment, vehicles, intelligence, and enforcement operations.",
        "Texas Military Department and National Guard deployment costs, including personnel and logistics.",
        "Border barriers, land agreements, construction, maintenance, and related infrastructure.",
        "Local-government grants and reimbursements for law enforcement, prosecution, detention, emergency response, or other border impacts.",
        "Transportation, facilities, technology, cameras, communications, aviation, and other operational support.",
      ]},
      { heading: "Appropriated is not the same as spent", paragraphs: [
        "An appropriation gives an agency legal authority to spend up to specified limits and purposes. It does not necessarily mean every appropriated dollar has already been paid out. Contracts can also span fiscal years, and some programs may spend faster or slower than anticipated.",
        "For current cost questions, state budget documents, Legislative Budget Board materials, agency financial reports, and state contracting records are more reliable than repeating a cumulative number from an old news story.",
      ]},
      { heading: "How to evaluate a border-spending claim", bullets: [
        "Ask whether the number is an appropriation, obligation, contract value, or actual expenditure.",
        "Identify the fiscal years included.",
        "Check which agencies and programs are included or excluded.",
        "Separate state spending from federal Border Patrol, CBP, ICE, or other federal expenditures.",
        "Use the newest official budget or expenditure record available when the exact total matters.",
      ]},
    ],
    faq: [
      { q: "Does Operation Lone Star have one permanent annual budget?", a: "No. Texas border-security funding is assembled through legislative appropriations and agency budgets that can change between biennia and through supplemental actions. Current totals should be verified for the specific fiscal period being discussed." },
      { q: "Is Texas border spending the same as federal immigration-enforcement spending?", a: "No. Texas appropriations fund state agencies and state-directed programs. Federal agencies such as CBP and ICE operate under separate federal appropriations and authority." },
      { q: "Where can I verify current Texas border appropriations?", a: "Start with the Texas General Appropriations Act, Legislative Budget Board materials, and the current financial or budget documents of the Texas Department of Public Safety and Texas Military Department." },
    ],
    sources: [
      { label: "Texas Legislative Budget Board", url: "https://www.lbb.texas.gov/" },
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/" },
      { label: "Texas Military Department", url: "https://tmd.texas.gov/" },
      { label: "Texas Comptroller — State Spending", url: "https://comptroller.texas.gov/transparency/spending/" },
    ],
    related: [...commonRelated, { label: "Operation Lone Star", href: "/news/operation-lone-star" }],
  },

  "texas-national-guard-border-guide": {
    slug: "texas-national-guard-border-guide",
    title: "Texas National Guard at the Border: Authority, Missions and Limits",
    dek: "How Texas National Guard border deployments work, who commands the force, what missions Guard members perform, and where state military authority differs from federal immigration authority.",
    updated: "2026-08-09",
    pillarLabel: "Texas Border & Immigration",
    pillarHref: "/texas-border-security",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "The legal status of a National Guard member matters: state active duty, Title 32, and federal Title 10 service operate under different command and funding structures.",
      "Texas can deploy state military forces for state missions, but immigration admission and removal remain primarily federal legal functions.",
      "Border missions can include observation, logistics, engineering, barrier work, communications, transportation, and support to law enforcement.",
      "A deployment announcement should be read together with the stated mission, legal status, command authority, and duration.",
    ],
    intro: [
      "National Guard coverage often compresses several legal concepts into one phrase: 'troops at the border.' In practice, the authority and mission of Guard personnel depend on the status under which they are serving and the orders governing the deployment.",
      "Texas has used the Texas National Guard extensively in border operations. Understanding those deployments requires separating state military authority from federal immigration authority and distinguishing support missions from law-enforcement powers.",
    ],
    sections: [
      { heading: "Who commands the Texas National Guard", paragraphs: [
        "When Guard personnel serve under state authority, the governor is the commander in chief of the state's military forces, subject to Texas and federal law. The Texas Military Department administers the Texas Army National Guard, Texas Air National Guard, and Texas State Guard.",
        "Guard units can also serve in federally funded or federally commanded statuses. The exact legal status affects command, funding, benefits, and the authorities available to personnel.",
      ]},
      { heading: "What Guard members can do on a border mission", paragraphs: [
        "A border deployment can include surveillance and observation, engineering, construction and barrier support, transportation, logistics, communications, aviation, medical support, and assistance to state law-enforcement operations.",
        "The mission statement matters. A Guard presence should not automatically be described as the Guard independently administering federal immigration law. State personnel may support enforcement activity while federal immigration decisions remain within federal systems.",
      ]},
      { heading: "Why duty status matters", bullets: [
        "State active duty generally places personnel under state command and state funding rules.",
        "Title 32 status is federally funded while Guard members remain under state command for authorized missions.",
        "Title 10 federal service places forces under federal command.",
        "Benefits, legal protections, command relationships, and mission authorities can differ by status.",
      ]},
      { heading: "Questions to ask when a new deployment is announced", bullets: [
        "How many personnel are actually being activated or extended?",
        "What legal duty status will they serve under?",
        "What is the stated mission and geographic area?",
        "Which agency or commander directs day-to-day operations?",
        "How long is the deployment expected to last and how is it funded?",
      ]},
    ],
    faq: [
      { q: "Can the Texas National Guard enforce federal immigration law on its own?", a: "Federal immigration admission and removal authority is primarily federal. Guard personnel can perform state missions and support law-enforcement operations, but the exact authority depends on duty status, mission orders, and applicable law." },
      { q: "Is every Texas Guard border deployment federally funded?", a: "No. Guard personnel can serve in different legal statuses. State active duty is distinct from federally funded Title 32 or federally commanded Title 10 service." },
      { q: "Where can I verify a Texas Guard border mission?", a: "Use Texas Military Department releases and orders or official statements, then check the stated duty status and mission rather than assuming all Guard deployments operate under the same authority." },
    ],
    sources: [
      { label: "Texas Military Department", url: "https://tmd.texas.gov/" },
      { label: "Texas Constitution", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm" },
      { label: "National Guard Bureau", url: "https://www.nationalguard.mil/" },
      { label: "U.S. Code — National Guard", url: "https://uscode.house.gov/" },
    ],
    related: [...commonRelated, { label: "State vs. federal border authority", href: "/news/border-security-state-role" }],
  },

  "texas-border-litigation-guide": {
    slug: "texas-border-litigation-guide",
    title: "Texas Border Court Fights: A Guide to the Lawsuits, Injunctions and Appeals",
    dek: "How to follow Texas border litigation without getting lost in temporary orders, appeals, federal supremacy questions, standing disputes, and rapidly changing court rulings.",
    updated: "2026-08-09",
    pillarLabel: "Texas Border & Immigration",
    pillarHref: "/texas-border-security",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "A temporary restraining order, preliminary injunction, final judgment, appellate stay, and Supreme Court order are different procedural events.",
      "Many Texas border lawsuits turn on federal supremacy, preemption, state property rights, federal statutory authority, or access to the international boundary.",
      "A court allowing a law to take effect temporarily does not necessarily mean the law has been finally upheld on the merits.",
      "The safest way to report a fast-moving case is to identify the court, procedural posture, operative order, and next scheduled step.",
    ],
    intro: [
      "Texas border policy repeatedly reaches federal court because state and federal governments exercise different powers in the same geographic space. Disputes can involve immigration statutes, federal supremacy, state criminal laws, barriers in or near the Rio Grande, access to land, federal property, or the authority of state officers.",
      "The hardest part for readers is often not the legal theory but the procedural posture. A case can move through several orders in a few days, and headlines can make a temporary stay sound like a final constitutional ruling. This guide provides a framework for reading those developments accurately.",
    ],
    sections: [
      { heading: "The five court terms that change the meaning of a headline", bullets: [
        "Temporary restraining order: short-term relief intended to preserve the situation while a court considers a request for longer relief.",
        "Preliminary injunction: an order that can block or require conduct while the lawsuit proceeds, issued before a final merits judgment.",
        "Final judgment: the trial court's final resolution of claims before any appeal.",
        "Stay: an order pausing the effect of another order or judgment, often while an appeal is considered.",
        "Remand: an appellate court sends a matter back to a lower court for additional proceedings.",
      ]},
      { heading: "Why federal supremacy is central", paragraphs: [
        "The U.S. Constitution makes federal law supreme when valid federal law conflicts with state law. Immigration and foreign-affairs cases can therefore turn on whether Congress has occupied a field, whether state law conflicts with a federal scheme, or whether the state is exercising a traditional state power in a permissible way.",
        "Those questions are fact- and statute-specific. A ruling in one border case does not automatically resolve every other Texas border policy because the challenged law, government action, plaintiffs, and requested relief may differ.",
      ]},
      { heading: "How appeals create confusing short-term outcomes", paragraphs: [
        "After a trial-court ruling, an appellate court may issue an administrative stay or a longer stay pending appeal. The Supreme Court can also act on emergency applications without deciding the full merits of the underlying lawsuit.",
        "That can produce periods in which a law is enforceable, blocked, enforceable again, and blocked again while courts decide jurisdiction and merits questions. Reporting should always state what is legally operative at the time of publication and avoid describing interim relief as the final outcome.",
      ]},
      { heading: "A checklist for following any Texas border case", bullets: [
        "Identify the exact law, barrier, property, or government action being challenged.",
        "Identify the plaintiffs and defendants and what each is asking the court to do.",
        "Name the court and whether it is a trial or appellate court.",
        "State whether the latest order is temporary, preliminary, final, or a stay.",
        "Check whether another hearing, briefing deadline, or appeal is already scheduled.",
      ]},
    ],
    faq: [
      { q: "If the Supreme Court declines emergency relief, has it upheld the Texas law?", a: "Not necessarily. Emergency-order decisions can address whether an order remains in effect while litigation continues without resolving every legal issue on the merits." },
      { q: "What is preemption?", a: "Preemption is the constitutional doctrine under which valid federal law can displace conflicting state law. The analysis depends on the federal statute, state action, and type of conflict." },
      { q: "Where can I read federal court filings?", a: "Federal dockets are available through PACER, and major orders are often posted by the courts, the U.S. Department of Justice, the Texas Attorney General, or legal-document repositories." },
    ],
    sources: [
      { label: "U.S. Courts", url: "https://www.uscourts.gov/" },
      { label: "PACER", url: "https://pacer.uscourts.gov/" },
      { label: "U.S. Department of Justice", url: "https://www.justice.gov/" },
      { label: "Texas Attorney General", url: "https://www.texasattorneygeneral.gov/" },
    ],
    related: [...commonRelated, { label: "State vs. federal border authority", href: "/news/border-security-state-role" }],
  },

  "texas-ports-of-entry-trade-guide": {
    slug: "texas-ports-of-entry-trade-guide",
    title: "Texas Ports of Entry and Border Trade: How People and Goods Move Through the System",
    dek: "A guide to Texas land ports of entry, international bridges, customs inspections, commercial traffic, infrastructure, local ownership, and why border security and border commerce often share the same facilities.",
    updated: "2026-08-09",
    pillarLabel: "Texas Border & Immigration",
    pillarHref: "/texas-border-security",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Ports of entry are lawful crossing points where federal officers inspect people, vehicles, and cargo; the land between ports is a different operational environment.",
      "Texas border infrastructure can involve federal agencies, state transportation agencies, cities, counties, bridge authorities, and Mexican counterparts.",
      "Security measures that slow a commercial crossing can have economic consequences for manufacturers, agriculture, retailers, logistics firms, and border communities.",
      "Trade volumes and wait times change, so current operational claims should be verified with official port and transportation data.",
    ],
    intro: [
      "Texas's border with Mexico is both a security boundary and one of the country's most important commercial corridors. Trucks, railcars, passenger vehicles, pedestrians, and lawful travelers move through designated ports of entry while federal agencies inspect admissibility and cargo.",
      "That distinction matters because many border debates use the word 'border' to describe very different places. A remote stretch of river, an international bridge carrying thousands of trucks, a rail crossing, and a pedestrian port each involve different infrastructure, agencies, risks, and economic consequences.",
    ],
    sections: [
      { heading: "What a port of entry is", paragraphs: [
        "A port of entry is a designated location where federal officers process lawful entry into the United States. U.S. Customs and Border Protection performs immigration, customs, agricultural, and cargo-inspection functions at land ports, airports, and seaports.",
        "Land ports can include passenger lanes, pedestrian facilities, commercial truck inspection areas, rail facilities, and specialized cargo systems. The physical bridge or approach infrastructure may involve other public entities even though federal officers control federal inspection functions.",
      ]},
      { heading: "Why so many governments are involved", paragraphs: [
        "A Texas international crossing can involve CBP, the General Services Administration, the Texas Department of Transportation, local governments or bridge authorities, law enforcement, customs brokers, railroads, and Mexican federal or local authorities.",
        "Ownership and operational responsibility therefore vary by facility. When a project expands lanes or adds inspection technology, readers should identify which entity owns the infrastructure, which agency operates inspections, and who is paying for the improvement.",
      ]},
      { heading: "Security actions can affect the supply chain", paragraphs: [
        "Enhanced state or federal inspections, bridge closures, staffing shortages, construction, technology failures, or security incidents can increase crossing times. For time-sensitive cargo, those delays can affect factories, produce shipments, livestock and agricultural products, retail inventories, and freight schedules far beyond the border region.",
        "The economic effect depends on the crossing, commodity, duration, and availability of alternate routes. Current wait-time and freight data are more useful than assuming every delay has the same statewide impact.",
      ]},
      { heading: "Data to check before making a border-trade claim", bullets: [
        "CBP port-of-entry statistics and official operational notices.",
        "Bureau of Transportation Statistics border-crossing and freight data.",
        "TxDOT international-trade and border-planning materials.",
        "Current bridge or local port authority notices where applicable.",
        "Trade-value data should be labeled by period and whether it measures imports, exports, total trade, or freight mode.",
      ]},
    ],
    faq: [
      { q: "Is a port of entry the same as the entire Texas-Mexico border?", a: "No. A port of entry is a designated lawful crossing where federal inspection occurs. Areas between ports are a separate operational and enforcement environment." },
      { q: "Who inspects trucks entering Texas from Mexico?", a: "U.S. Customs and Border Protection performs federal customs and border inspections at ports of entry. Commercial vehicles can also be subject to state safety inspections and other regulatory requirements." },
      { q: "Why do border-security policies matter to Texas businesses away from the border?", a: "Texas-Mexico crossings serve manufacturing, agriculture, retail, automotive, energy, and logistics supply chains. Significant delays can affect firms and consumers far from the crossing itself." },
    ],
    sources: [
      { label: "U.S. Customs and Border Protection — Ports of Entry", url: "https://www.cbp.gov/about/contact/ports" },
      { label: "Bureau of Transportation Statistics — Border Crossing Data", url: "https://www.bts.gov/browse-statistical-products-and-data/border-crossing-data/border-crossingentry-data" },
      { label: "Texas Department of Transportation — International Trade", url: "https://www.txdot.gov/projects/planning/international-trade.html" },
      { label: "U.S. General Services Administration — Land Ports of Entry", url: "https://www.gsa.gov/real-estate/gsa-properties/land-ports-of-entry" },
    ],
    related: [...commonRelated, { label: "Texas border geography", href: "/news/texas-border-geography-101" }, { label: "Texas Economy & Small Business", href: "/texas-economy" }],
  },
};
