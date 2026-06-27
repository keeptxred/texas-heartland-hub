export type ArticleSource = { label: string; url: string };
export type ArticleFAQ = { q: string; a: string };
export type ArticleSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  image?: { src: string; alt: string; caption?: string };
};

export type ArticleBody = {
  updated: string; // ISO date, e.g. "2026-06-15"
  editorNote?: string;
  intro: string[];
  sections: ArticleSection[];
  faq: ArticleFAQ[];
  sources: ArticleSource[];
  related: string[]; // article slugs
  cta?: { label: string; href: string };
};

export const ARTICLE_BODIES: Record<string, ArticleBody> = {
  "texas-property-tax-guide": {
    updated: "2026-06-15",
    editorNote: "Updated June 2026 by the Keep TX Red editorial team.",
    intro: [
      "Texas has no state income tax, which means local property taxes do most of the heavy lifting for schools, counties, and cities. For the average Texas homeowner, the property tax bill is the single largest check they write to government in a year — and almost none of it goes to Austin.",
      "This guide walks through how the bill is actually calculated: who sets your value, who sets the rates, and what the homestead exemption, school-district compression, and the 10% appraisal cap mean for what you actually owe.",
    ],
    sections: [
      {
        heading: "The Three-Step Formula",
        paragraphs: [
          "Every Texas property tax bill follows the same arithmetic, no matter which county you live in:",
        ],
        bullets: [
          "Step 1 — Appraised value: your County Appraisal District (CAD) sets a market value as of January 1.",
          "Step 2 — Taxable value: subtract exemptions (homestead, over-65, disabled veteran) to get the value actually taxed.",
          "Step 3 — Tax bill: multiply taxable value by the combined rate of every taxing unit you live inside (ISD + county + city + special districts).",
        ],
      },
      {
        heading: "The 10% Homestead Cap",
        paragraphs: [
          "Once you file a homestead exemption, the taxable value of your primary residence cannot rise more than 10% per year, regardless of market appreciation. The CAD can still raise your market value — but the cap controls what hits your bill.",
          "See our companion piece on filing the exemption: the [Texas Homestead Exemption Explained](/news/homestead-exemption-explained).",
        ],
      },
      {
        heading: "Who Sets Which Rate",
        table: {
          headers: ["Taxing Unit", "Who Decides", "Typical Share of Bill"],
          rows: [
            ["Independent School District", "Elected ISD board", "~55%"],
            ["County", "Commissioners Court", "~20%"],
            ["City", "City Council", "~15%"],
            ["Special / MUD / Hospital", "District board", "~10%"],
          ],
        },
      },
    ],
    faq: [
      {
        q: "Does Texas have a state property tax?",
        a: "No. Property tax in Texas is exclusively a local tax — Austin sets the rules, but every dollar is levied and spent by ISDs, counties, cities, and special districts.",
      },
      {
        q: "When can my appraised value go up more than 10%?",
        a: "The 10% cap only applies to your homestead. Rental properties, second homes, commercial, and unhomesteaded land can rise to full market value each year.",
      },
      {
        q: "Can I lower my bill?",
        a: "Yes — file every exemption you qualify for and protest your appraisal each spring. See our appraisal protest playbook.",
      },
    ],
    sources: [
      { label: "Texas Comptroller — Property Tax Basics", url: "https://comptroller.texas.gov/taxes/property-tax/" },
      { label: "Texas Tax Code Chapter 11 (Exemptions)", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.11.htm" },
    ],
    related: ["homestead-exemption-explained", "appraisal-protest-playbook", "county-appraisal-districts-explained"],
    cta: { label: "Estimate Your Bill", href: "/tax-calculator" },
  },

  "homestead-exemption-explained": {
    updated: "2026-06-10",
    editorNote: "Updated June 2026 by the Keep TX Red editorial team.",
    intro: [
      "If you own and occupy your home in Texas as of January 1, you are leaving money on the table every year you do not file a homestead exemption. The $100,000 school-district exemption alone is worth roughly $1,000 a year for most homeowners — and filing is free.",
      "Here is exactly what the exemption does, who qualifies, and how to file with your County Appraisal District.",
    ],
    sections: [
      {
        heading: "What the Exemption Actually Does",
        bullets: [
          "Removes $100,000 from the value taxed by your school district (the largest line on your bill).",
          "Removes $3,000 from county road-and-bridge value (in counties that levy it).",
          "Caps annual taxable-value growth at 10% per year, even when market values surge.",
        ],
      },
      {
        heading: "Extra Exemptions Most People Miss",
        bullets: [
          "Over-65 or disabled: additional $10,000 school exemption plus a ceiling that freezes the school-tax dollar amount.",
          "100% disabled veteran: full exemption on the homestead.",
          "Surviving spouse of a first responder killed in the line of duty: full exemption.",
        ],
      },
      {
        heading: "How to File",
        paragraphs: [
          "File Form 50-114 with the appraisal district in the county where the home sits. There is no fee. You can file anytime after you take occupancy, up to two years past the standard deadline of April 30.",
        ],
      },
    ],
    faq: [
      { q: "Can I claim a homestead on more than one house?", a: "No. Texas allows one homestead per family, and it must be your principal residence." },
      { q: "Do I have to refile every year?", a: "No. Once granted, the exemption stays in place until you move, sell, or the CAD requests reverification." },
      { q: "What if I bought mid-year?", a: "You still qualify for the full year as long as you occupied the home as your principal residence by January 1 of the next year." },
    ],
    sources: [
      { label: "Form 50-114 — Residence Homestead Application", url: "https://comptroller.texas.gov/forms/50-114.pdf" },
      { label: "Texas Comptroller — Homestead Exemptions", url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/residence-homestead.php" },
    ],
    related: ["texas-property-tax-guide", "appraisal-protest-playbook", "county-appraisal-districts-explained"],
    cta: { label: "Calculate Your Savings", href: "/tax-calculator" },
  },

  "how-a-bill-becomes-texas-law": {
    updated: "2026-05-20",
    editorNote: "Updated May 2026 by the Keep TX Red editorial team.",
    intro: [
      "The Texas Legislature meets in regular session for 140 days every other year. In that window, lawmakers file roughly 7,000 bills and pass fewer than 1,500. Knowing how a bill moves through the process is the difference between effective advocacy and shouting into the void.",
      "Here is the path every Texas bill takes from filing to the Governor's desk — and the chokepoints where citizens can actually influence it.",
    ],
    sections: [
      {
        heading: "The Eight Steps",
        bullets: [
          "Filed with the House or Senate clerk and assigned a number.",
          "Referred to committee by the Speaker or Lieutenant Governor.",
          "Committee hearing — the only stage where public testimony is taken.",
          "Committee vote to report the bill favorably (or kill it).",
          "Calendars Committee (House) or Intent Calendar (Senate) schedules floor debate.",
          "Second and third reading on the floor — amendments allowed at second reading.",
          "Conference committee reconciles House and Senate versions.",
          "Governor signs, vetoes, or lets it become law without a signature.",
        ],
      },
      {
        heading: "Regular Session vs. Special Session",
        paragraphs: [
          "A regular session lasts 140 days and starts the second Tuesday of January in odd-numbered years. Only the Governor can call a special session, which is limited to 30 days and to the subjects the Governor lists in the call.",
        ],
      },
    ],
    faq: [
      { q: "When can I testify on a bill?", a: "Only during the committee hearing stage. Most committees post hearings 24-72 hours in advance on the Texas Legislature Online site." },
      { q: "Can the Governor line-item veto?", a: "Only on appropriations bills. On every other bill, the Governor must sign or veto the entire bill." },
      { q: "Why do so many bills die?", a: "Most bills never receive a committee hearing. Calendar deadlines and committee chair discretion kill the vast majority." },
    ],
    sources: [
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
      { label: "Texas Constitution Article III", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm" },
    ],
    related: ["texas-political-terminology", "texas-constitutional-amendments-guide", "speaker-special-session"],
    cta: { label: "Find Your Representative", href: "/find-representative" },
  },

  "primary-vs-general-election": {
    updated: "2026-06-01",
    intro: [
      "In most of Texas, the November general election is a formality. The real contest is the March Republican primary — that's where statewide offices, congressional seats, and the legislature are actually decided.",
      "Understanding why means understanding open primaries, runoff math, and turnout patterns that have held for two decades.",
    ],
    sections: [
      {
        heading: "Texas Has an Open Primary",
        paragraphs: [
          "You do not register with a party in Texas. On primary day you pick a Republican or Democratic ballot, and that becomes your party affiliation for the rest of the election cycle.",
        ],
      },
      {
        heading: "When a Runoff Happens",
        paragraphs: [
          "If no candidate wins more than 50% of the primary vote, the top two go to a May runoff. Runoff turnout is typically a third of primary turnout — small, dedicated electorates decide.",
        ],
      },
      {
        heading: "Key Dates",
        bullets: [
          "Primary Election: first Tuesday in March",
          "Primary Runoff: fourth Tuesday in May",
          "General Election: first Tuesday after the first Monday in November",
        ],
      },
    ],
    faq: [
      { q: "Can I vote in both primaries?", a: "No. Picking one party's primary ballot locks you out of the other party's runoff." },
      { q: "Do I need to register as a Republican?", a: "Texas does not have party registration. Anyone registered to vote can request either party's primary ballot." },
    ],
    sources: [
      { label: "Texas Secretary of State — Voter Information", url: "https://www.votetexas.gov/" },
      { label: "Election Code Chapter 172 (Primaries)", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.172.htm" },
    ],
    related: ["beginners-guide-texas-elections", "texas-voter-registration-guide", "voter-id-surge"],
    cta: { label: "Find Your Polling Place", href: "/voting-locations" },
  },

  "beginners-guide-texas-elections": {
    updated: "2026-06-05",
    intro: [
      "Texas runs more elections than most states realize: federal, state, county, ISD, city, MUD, water district, hospital district, and constitutional amendments. Here is a plain-English map of the cycle so you know which ballot does what.",
    ],
    sections: [
      {
        heading: "The Annual Calendar",
        bullets: [
          "March — Party primaries (every even year).",
          "May — Primary runoffs, plus most school board and city council races.",
          "November — General election (federal/state every even year, constitutional amendments every odd year).",
        ],
      },
      {
        heading: "How Districts Are Drawn",
        paragraphs: [
          "The Legislature redraws congressional, state House, state Senate, and State Board of Education districts after each U.S. Census. Local districts are drawn by counties and cities.",
        ],
      },
    ],
    faq: [
      { q: "Why are there so many May elections?", a: "Texas law lets local governments (ISDs, cities, MUDs) hold elections on uniform May or November dates. Most pick May to depress turnout and let core voters decide." },
      { q: "When do I vote on judges?", a: "Texas elects most judges in partisan November elections." },
    ],
    sources: [
      { label: "Texas Secretary of State — Election Dates", url: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml" },
    ],
    related: ["primary-vs-general-election", "texas-voter-registration-guide", "texas-school-board-powers"],
    cta: { label: "Check County Election Pages", href: "/county-elections" },
  },

  "texas-voter-registration-guide": {
    updated: "2026-06-12",
    intro: [
      "Registering to vote in Texas takes about five minutes and one piece of paper. Here is everything you need to know — including the often-missed 30-day deadline that disqualifies thousands of would-be voters every cycle.",
    ],
    sections: [
      {
        heading: "Who Can Register",
        bullets: [
          "U.S. citizen, age 18 by Election Day.",
          "Resident of the Texas county where you apply.",
          "Not finally convicted of a felony (or have completed sentence, parole, and probation).",
          "Not declared mentally incapacitated by a court.",
        ],
      },
      {
        heading: "The 30-Day Rule",
        paragraphs: [
          "Your application must be received by the county voter registrar at least 30 days before the election you want to vote in. Texas does not offer same-day registration.",
        ],
      },
      {
        heading: "Accepted Photo ID",
        bullets: [
          "Texas Driver License (or expired up to 4 years; lifetime if 70+).",
          "Texas Election Identification Certificate (EIC).",
          "U.S. passport, military ID, or citizenship certificate.",
          "Texas handgun license.",
        ],
      },
    ],
    faq: [
      { q: "What if I moved counties?", a: "You must re-register in your new county. Update your address on the Secretary of State portal." },
      { q: "Can I register online?", a: "Texas does not have full online voter registration — you must mail or hand-deliver a paper application." },
    ],
    sources: [
      { label: "Vote Texas — Register to Vote", url: "https://www.votetexas.gov/register-to-vote/" },
      { label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/elections/" },
    ],
    related: ["primary-vs-general-election", "beginners-guide-texas-elections", "voter-id-surge"],
    cta: { label: "Get the Registration Form", href: "/register-to-vote" },
  },

  "texas-school-board-powers": {
    updated: "2026-05-28",
    intro: [
      "Independent School District boards are the most powerful local government most Texans have never voted for. A seven-member board controls a budget larger than the city it sits in — and is elected by a fraction of the turnout that picks the mayor.",
    ],
    sections: [
      {
        heading: "What ISD Boards Actually Control",
        bullets: [
          "Annual budget and the M&O property tax rate.",
          "Superintendent hiring and contract.",
          "Curriculum adoption and library policy.",
          "Bond elections for new construction.",
          "Attendance boundaries and school closures.",
        ],
      },
      {
        heading: "Why May Races Decide So Much",
        paragraphs: [
          "School board elections are held in May, when turnout often falls below 5%. A few hundred votes routinely decide districts with tens of thousands of students.",
        ],
      },
    ],
    faq: [
      { q: "Are school board races partisan?", a: "Officially no — but coalitions of parents, teachers' unions, and political groups openly endorse and fund slates." },
      { q: "Can I recall a board member?", a: "Texas does not allow recall of elected ISD trustees; you must wait for the next election." },
    ],
    sources: [
      { label: "Texas Education Agency", url: "https://tea.texas.gov/" },
      { label: "Texas Education Code Chapter 11 (School Districts)", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.11.htm" },
    ],
    related: ["school-board-elections", "texas-school-finance-explained", "school-choice-esa-guide"],
    cta: { label: "Find Your School Board Race", href: "/county-elections" },
  },

  "texas-energy-policy-guide": {
    updated: "2026-06-08",
    intro: [
      "Texas produces more energy than any other state and most countries. Three agencies divide the regulatory pie — and almost none of it is what their names suggest.",
    ],
    sections: [
      {
        heading: "The Three Regulators",
        table: {
          headers: ["Agency", "What It Actually Regulates"],
          rows: [
            ["Railroad Commission", "Oil, natural gas, pipelines (not railroads since 2005)."],
            ["Public Utility Commission", "Retail electricity, water, telecom utilities."],
            ["ERCOT", "Operates the grid that serves about 90% of Texas load."],
          ],
        },
      },
      {
        heading: "Why Texas Has Its Own Grid",
        paragraphs: [
          "ERCOT covers most of Texas as an electrical island, deliberately kept separate from the Eastern and Western Interconnections so federal regulators have no jurisdiction.",
        ],
      },
    ],
    faq: [
      { q: "Does Texas import electricity?", a: "ERCOT is largely self-contained, though small DC ties exist with the Eastern grid and Mexico." },
      { q: "Who sets electricity prices?", a: "In deregulated areas, the PUC supervises a competitive retail market; you pick your provider." },
    ],
    sources: [
      { label: "Texas Railroad Commission", url: "https://www.rrc.texas.gov/" },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/" },
      { label: "ERCOT", url: "https://www.ercot.com/" },
    ],
    related: ["texas-grid-ercot-explained", "permian-energy", "texas-water-rights-explained"],
    cta: { label: "See Energy Coverage", href: "/news" },
  },

  "county-appraisal-districts-explained": {
    updated: "2026-05-15",
    intro: [
      "Your County Appraisal District (CAD) is the single most consequential government office most Texans never visit. It sets the value every taxing unit uses to bill you — and the protest process is your only legal recourse.",
    ],
    sections: [
      {
        heading: "What a CAD Does",
        bullets: [
          "Sets the January 1 market value of every property in the county.",
          "Maintains exemption applications and the homestead roll.",
          "Runs the Appraisal Review Board (ARB) that hears protests.",
        ],
      },
      {
        heading: "Your Statutory Rights",
        bullets: [
          "Right to written notice when value rises over $1,000.",
          "Right to inspect the evidence the CAD will use against you.",
          "Right to protest on market value AND on 'equal and uniform' grounds.",
          "Right to appeal an ARB decision to state district court.",
        ],
      },
    ],
    faq: [
      { q: "Who pays for the CAD?", a: "The taxing units inside the county (ISDs, the county itself, cities) fund it proportionally to their levies." },
      { q: "Can the CAD enter my property?", a: "Not without your permission. CAD valuations are based on exterior observation, sales data, and your improvements on file." },
    ],
    sources: [
      { label: "Texas Comptroller — Appraisal Districts", url: "https://comptroller.texas.gov/taxes/property-tax/cad/" },
      { label: "Tax Code Chapter 41 (Local Review)", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.41.htm" },
    ],
    related: ["appraisal-protest-playbook", "texas-property-tax-guide", "homestead-exemption-explained"],
    cta: { label: "Estimate Your Bill", href: "/tax-calculator" },
  },

  "what-local-governments-control": {
    updated: "2026-06-02",
    intro: [
      "When Texans complain about 'the government,' they almost always mean Washington — but the governments that actually tax you, school your kids, and pave your road are all local. Here is who does what.",
    ],
    sections: [
      {
        heading: "The Five Layers",
        table: {
          headers: ["Layer", "Top Responsibility", "Taxing Power"],
          rows: [
            ["County", "Sheriff, jail, district courts, roads", "Property tax"],
            ["City", "Police, fire, zoning, water", "Property + sales tax"],
            ["ISD", "K-12 education", "Property tax (largest share)"],
            ["MUD", "Water and sewer in unincorporated growth areas", "Property tax + utility fees"],
            ["Special District", "Hospitals, EMS, community college", "Property tax"],
          ],
        },
      },
    ],
    faq: [
      { q: "Why do I pay so many different property taxes?", a: "Because each layer is a separate government with its own elected board and its own tax rate, all stacked on the same parcel." },
      { q: "Who handles 911?", a: "Cities handle 911 inside city limits; counties or Emergency Services Districts (ESDs) handle it elsewhere." },
    ],
    sources: [
      { label: "Texas Association of Counties", url: "https://www.county.org/" },
      { label: "Texas Comptroller — Local Government", url: "https://comptroller.texas.gov/economy/local/" },
    ],
    related: ["how-texas-counties-spend", "texas-property-tax-guide", "county-appraisal-districts-explained"],
    cta: { label: "See What Your County Charges", href: "/tax-calculator" },
  },

  "texas-border-geography-101": {
    updated: "2026-05-18",
    intro: [
      "The Texas-Mexico border runs 1,254 miles along the center of the Rio Grande. Understanding what happens there starts with the map.",
    ],
    sections: [
      {
        heading: "The Five Border Patrol Sectors in Texas",
        bullets: [
          "El Paso Sector — far West Texas plus New Mexico.",
          "Big Bend Sector — sparsely populated Trans-Pecos.",
          "Del Rio Sector — Eagle Pass and surrounding ranchland.",
          "Laredo Sector — Webb County and the I-35 corridor.",
          "Rio Grande Valley Sector — the four-county Valley, historically the busiest.",
        ],
      },
      {
        heading: "Major Ports of Entry",
        paragraphs: [
          "Texas hosts more than two dozen international bridges and crossings, including Laredo's World Trade Bridge — the busiest commercial truck crossing in the hemisphere.",
        ],
      },
    ],
    faq: [
      { q: "Where is the river the deepest?", a: "Below Falcon and Amistad reservoirs the Rio Grande runs deep and wide; in the Big Bend and upper sectors it is often walkable in dry months." },
      { q: "Is the border fenced everywhere?", a: "No. Roughly a third of the Texas border has some form of barrier; the rest is open river, ranchland, or desert." },
    ],
    sources: [
      { label: "U.S. Customs and Border Protection — Sectors", url: "https://www.cbp.gov/border-security/along-us-borders/border-patrol-sectors" },
      { label: "Texas DPS — Border Operations", url: "https://www.dps.texas.gov/" },
    ],
    related: ["operation-lone-star", "border-security-state-role"],
    cta: { label: "Read Border Coverage", href: "/news" },
  },

  "texas-school-finance-explained": {
    updated: "2026-05-30",
    intro: [
      "Texas school finance is engineered to confuse — and it succeeds. Two ISDs with identical tax rates can fund students at wildly different levels because of recapture, the basic allotment, and a dozen weighted student categories.",
    ],
    sections: [
      {
        heading: "The Foundation School Program",
        paragraphs: [
          "The state guarantees every ISD a per-student funding floor. Local property taxes are counted first; the state fills the gap. When a district raises more locally than its formula entitlement, the excess is recaptured.",
        ],
      },
      {
        heading: "Recapture ('Robin Hood')",
        paragraphs: [
          "Property-wealthy districts send a portion of their M&O collections to the state, which redistributes the money to property-poor districts. Recapture now exceeds $5 billion per year.",
        ],
      },
    ],
    faq: [
      { q: "Does recapture leave Texas?", a: "No. Every recaptured dollar is spent inside the Texas school finance system." },
      { q: "What is the basic allotment?", a: "The dollar-per-student amount the Legislature sets as the funding floor. It is the lever that drives nearly every other formula." },
    ],
    sources: [
      { label: "TEA — School Finance", url: "https://tea.texas.gov/finance-and-grants/state-funding" },
      { label: "Education Code Chapter 48", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.48.htm" },
    ],
    related: ["texas-school-board-powers", "school-choice-esa-guide", "isd-tax-burdens"],
    cta: { label: "See School Tax Burdens by County", href: "/tax-calculator" },
  },

  "texas-political-terminology": {
    updated: "2026-06-20",
    intro: [
      "Texas politics has its own dialect. Here is a working glossary of the terms reporters and lobbyists throw around without ever defining.",
    ],
    sections: [
      {
        heading: "Core Terms",
        bullets: [
          "Special session — a 30-day session called by the Governor on specific subjects.",
          "Sunset review — periodic audit that abolishes a state agency unless reauthorized.",
          "Calendars Committee — the House gatekeeper that schedules floor debate.",
          "Point of order — a parliamentary objection that can kill a bill on procedure.",
          "Constitutional amendment — voter-approved change to the Texas Constitution.",
          "Recapture — Robin Hood redistribution of ISD property tax revenue.",
          "Compression — state buy-down of school M&O property tax rates.",
        ],
      },
    ],
    faq: [
      { q: "What is 'chub'?", a: "House slang for talking a bill to death as a procedural deadline approaches." },
      { q: "What is the 'Local & Consent Calendar'?", a: "The House calendar for non-controversial bills, debated under time-limited rules." },
    ],
    sources: [
      { label: "Texas House Rules", url: "https://capitol.texas.gov/" },
      { label: "Glossary of Legislative Terms", url: "https://www.tlc.texas.gov/" },
    ],
    related: ["how-a-bill-becomes-texas-law", "texas-constitutional-amendments-guide", "speaker-special-session"],
    cta: { label: "Browse the Full Glossary", href: "/glossary" },
  },

  "how-texas-counties-spend": {
    updated: "2026-06-03",
    intro: [
      "A Texas county's budget is dominated by public safety. Strip away the sheriff, the jail, and the courts, and there's not much left.",
    ],
    sections: [
      {
        heading: "Where the Money Goes (Typical County)",
        table: {
          headers: ["Function", "Approximate Share"],
          rows: [
            ["Sheriff's office & patrol", "20-25%"],
            ["Jail operations", "15-20%"],
            ["District & county courts", "10-15%"],
            ["Indigent defense", "5-7%"],
            ["Road & bridge", "10-12%"],
            ["Administration & elections", "5-10%"],
          ],
        },
      },
    ],
    faq: [
      { q: "Who sets the county budget?", a: "The five-member Commissioners Court — the county judge plus four precinct commissioners." },
      { q: "Why is the jail so expensive?", a: "Counties bear nearly all pretrial detention costs and most jails operate 24/7 with state-mandated staffing ratios." },
    ],
    sources: [
      { label: "Texas Association of Counties — Budgets", url: "https://www.county.org/Education-Training/County-Budgets" },
      { label: "Texas Comptroller — Local Finances", url: "https://comptroller.texas.gov/transparency/local/" },
    ],
    related: ["what-local-governments-control", "texas-property-tax-guide"],
    cta: { label: "Calculate Your County Tax", href: "/tax-calculator" },
  },

  "texas-water-rights-explained": {
    updated: "2026-05-25",
    intro: [
      "Water law in Texas turns on one strange fact: surface water and groundwater are governed by completely different rules. Above ground, the state owns the water. Below ground, you own it.",
    ],
    sections: [
      {
        heading: "Surface Water: Prior Appropriation",
        paragraphs: [
          "Texas surface water (rivers, lakes, springs) is owned by the state and allocated through permits administered by the TCEQ. Older permits get water first when supplies fall — 'first in time, first in right.'",
        ],
      },
      {
        heading: "Groundwater: Rule of Capture",
        paragraphs: [
          "Groundwater belongs to the surface landowner, who may pump as much as can be put to beneficial use — subject to limits set by local Groundwater Conservation Districts.",
        ],
      },
    ],
    faq: [
      { q: "Can my neighbor drain my well?", a: "Under classic rule of capture, generally yes — though most aquifers are now overseen by a GCD with permit limits." },
      { q: "Who decides Rio Grande shares with Mexico?", a: "The 1944 Water Treaty, administered by the International Boundary and Water Commission." },
    ],
    sources: [
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/" },
      { label: "TCEQ — Water Rights", url: "https://www.tceq.texas.gov/permitting/water_rights/" },
    ],
    related: ["texas-energy-policy-guide", "texas-border-geography-101"],
    cta: { label: "Read Policy Coverage", href: "/news" },
  },

  "texas-constitutional-amendments-guide": {
    updated: "2026-06-18",
    intro: [
      "Texas operates under its 1876 Constitution — and has amended it more than 500 times. Here's why amendments are so common and how the process works.",
    ],
    sections: [
      {
        heading: "The Two-Step Process",
        bullets: [
          "Step 1 — Two-thirds of each chamber of the Legislature must pass a Joint Resolution proposing the amendment.",
          "Step 2 — A simple majority of Texas voters must approve it in a statewide November election.",
        ],
      },
      {
        heading: "Why So Many Amendments",
        paragraphs: [
          "The 1876 Constitution was designed to limit state government. Many routine policy decisions therefore require an amendment rather than a simple bill — bond authorizations, exemption changes, judicial salary caps, and more.",
        ],
      },
    ],
    faq: [
      { q: "When are amendments on the ballot?", a: "Odd-year Novembers, in standalone constitutional amendment elections that turn out roughly 10% of registered voters." },
      { q: "Can the Governor veto an amendment?", a: "No. Joint Resolutions proposing amendments are not subject to gubernatorial veto." },
    ],
    sources: [
      { label: "Texas Legislative Reference Library — Amendments", url: "https://lrl.texas.gov/legis/constAmends/" },
      { label: "Texas Constitution", url: "https://statutes.capitol.texas.gov/?link=CN" },
    ],
    related: ["how-a-bill-becomes-texas-law", "texas-political-terminology"],
    cta: { label: "See This Year's Propositions", href: "/elections" },
  },

  "texas-open-meetings-public-info": {
    updated: "2026-06-26",
    editorNote: "New evergreen explainer — June 2026.",
    intro: [
      "Texas runs on sunshine laws. The Open Meetings Act (OMA) requires almost every governing body — from your ISD board to the Railroad Commission — to deliberate in public, with posted agendas and recorded votes. The Public Information Act (PIA) gives every Texan the right to request government records and get a written response within 10 business days.",
      "These two statutes are the most powerful tools a conservative citizen has at the local level. They are how you find out what your school board is actually voting on, how your county is spending bond money, and what your city manager wrote in that email to the developer.",
    ],
    sections: [
      {
        heading: "What the Open Meetings Act Requires",
        bullets: [
          "Written notice posted at least 72 hours before a meeting (Government Code Ch. 551).",
          "An agenda listing every subject to be discussed — vague items like 'other business' are not allowed.",
          "Public access to the room and the right to record audio or video.",
          "Roll-call votes on final action; secret ballots are prohibited.",
          "Executive (closed) sessions only for narrowly defined topics — real estate, litigation, personnel, security.",
        ],
      },
      {
        heading: "How to File a Public Information Request",
        paragraphs: [
          "Write a short letter or email to the governmental body's designated PIA officer. Describe the records you want with enough detail that staff can find them — date ranges, sender/recipient names, subject keywords.",
        ],
        bullets: [
          "The agency has 10 business days to produce records, ask for a deposit, or seek an Attorney General ruling.",
          "Charges are limited by Comptroller rules — typically $0.10 per page, no charge for under 50 pages of email.",
          "If the agency wants to withhold records, it must ask the Attorney General — and you get to argue your side in writing.",
        ],
      },
      {
        heading: "When the Rules Are Broken",
        table: {
          headers: ["Violation", "Remedy"],
          rows: [
            ["No 72-hour notice", "Action taken at the meeting is voidable in district court"],
            ["Walking quorum (members meeting in groups to dodge OMA)", "Criminal misdemeanor under §551.143"],
            ["Improperly withheld records", "Sue in district court for mandamus and attorney's fees"],
          ],
        },
      },
    ],
    faq: [
      { q: "Does the OMA apply to my HOA?", a: "No — the OMA covers governmental bodies. HOAs are private corporations governed by Property Code Ch. 209." },
      { q: "Can my school board go into closed session to discuss curriculum?", a: "No. Curriculum is not one of the enumerated exceptions in §551.071-§551.089. Personnel discussions about a specific teacher are." },
      { q: "What if my PIA request is ignored?", a: "File a complaint with your county or district attorney, or sue for mandamus. The agency pays your attorney's fees if you win." },
    ],
    sources: [
      { label: "Texas Government Code Ch. 551 — Open Meetings", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.551.htm" },
      { label: "Texas Government Code Ch. 552 — Public Information", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm" },
      { label: "Attorney General — Open Government", url: "https://www.texasattorneygeneral.gov/open-government" },
    ],
    related: ["how-a-bill-becomes-texas-law", "what-local-governments-control", "texas-school-board-powers"],
    cta: { label: "Find Your Local Officials", href: "/find-representative" },
  },

  "why-texas-has-no-income-tax": {
    updated: "2026-06-26",
    editorNote: "New evergreen explainer — June 2026.",
    intro: [
      "Texas is one of nine states without a personal income tax — and thanks to Proposition 4 in 2019, it would now take a two-thirds vote of both chambers plus a statewide referendum to enact one. That low-tax structure is the single biggest reason Texas led the nation in job creation and net domestic migration through the 2020s.",
      "But government still has to be paid for. This explainer walks through the three pillars that replace an income tax: the state sales tax, local property taxes, and severance taxes on oil and gas — and the trade-offs each one creates.",
    ],
    sections: [
      {
        heading: "The Three Pillars of Texas Revenue",
        table: {
          headers: ["Source", "Rate", "Share of State+Local Revenue"],
          rows: [
            ["State sales tax", "6.25% state + up to 2% local", "~26%"],
            ["Local property tax", "Set by ISDs, counties, cities", "~45%"],
            ["Severance (oil & gas)", "4.6% oil / 7.5% gas", "~7%"],
            ["Franchise (margin) tax", "0.375%–0.75% on businesses over $2.47M", "~3%"],
          ],
        },
      },
      {
        heading: "How Proposition 4 Locked the Door",
        paragraphs: [
          "In November 2019, Texas voters approved Proposition 4 by 74% to 26%, amending Article 8 of the Texas Constitution to prohibit a state tax on the net incomes of natural persons. Repealing the ban would require another two-thirds legislative vote and statewide approval — a much steeper hill than simply passing a tax.",
          "The amendment built on the older Bullock Amendment (1993), which had already required voter approval for any new income tax. Proposition 4 went further by banning the tax outright, not merely making it harder to enact.",
        ],
      },
      {
        heading: "The Trade-Off: High Property Taxes",
        paragraphs: [
          "Because Texas leans on property tax to fund schools, the state has some of the highest effective property tax rates in the country — typically 1.6%–2.2% of market value once ISD, county, and city rates are combined.",
          "That's why the 88th and 89th Legislatures put record surplus dollars into school-district rate compression and homestead exemption increases. See the [Texas Property Tax Guide](/news/texas-property-tax-guide) for the full mechanics.",
        ],
      },
    ],
    faq: [
      { q: "Could Texas ever add an income tax?", a: "Only with two-thirds of the Legislature and a statewide voter referendum — Proposition 4 (2019) wrote the prohibition into the constitution." },
      { q: "Do Texas businesses pay an income tax?", a: "No — but most businesses with over $2.47M in revenue pay the franchise (margin) tax, which is calculated on gross receipts minus deductions, not net income." },
      { q: "Why are Texas property taxes so high?", a: "Because there is no income tax, schools and local government rely heavily on property tax. State surplus dollars have been used to compress ISD M&O rates since 2019." },
    ],
    sources: [
      { label: "Texas Comptroller — Sources of Revenue", url: "https://comptroller.texas.gov/transparency/reports/sources-of-revenue/" },
      { label: "Texas Constitution Article 8 §24-a (Income Tax Prohibition)", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.8.htm" },
      { label: "Tax Foundation — State Tax Climate Index", url: "https://taxfoundation.org/research/state-tax/" },
    ],
    related: ["texas-property-tax-guide", "what-local-governments-control", "how-texas-counties-spend"],
    cta: { label: "Estimate Your Property Tax", href: "/tax-calculator" },
  },
  "texas-attorney-general-powers": {
    updated: "2026-06-29",
    editorNote: "Part of our Texas civics series. See also our guide to the [Powers of the Texas Governor](/news/texas-governor-powers).",
    intro: [
      "The Texas Attorney General is the state's top lawyer — elected statewide, accountable to voters, and constitutionally independent of the governor. Unlike the U.S. Attorney General, who serves at the pleasure of the president, the Texas AG answers only to the people who put them in office.",
      "That independence has made the office one of the most consequential conservative posts in the country. The AG defends Texas law in court, files suits against federal overreach, issues binding legal opinions to state officials, and runs the largest child-support enforcement operation in the United States.",
    ],
    sections: [
      {
        heading: "A Constitutional, Elected Office",
        paragraphs: [
          "Article 4 of the Texas Constitution creates the Attorney General as a separately elected executive officer serving a four-year term. The AG is not appointed by the governor and cannot be fired by the governor — a structural check that the [Texas Constitution](/news/texas-constitutional-amendments-guide) has preserved since 1876.",
          "The office operates out of the William P. Clements Building in Austin with more than 4,000 employees statewide, making it one of the largest law offices in the country.",
        ],
      },
      {
        heading: "Core Powers of the Office",
        bullets: [
          "Defend the constitutionality of Texas statutes in state and federal court.",
          "Represent the State of Texas, its agencies, and its officers in civil litigation.",
          "Issue Attorney General Opinions interpreting state law for elected officials and agency heads.",
          "Enforce the Deceptive Trade Practices Act and consumer protection laws.",
          "Operate the Child Support Division — collecting more than $5 billion in court-ordered support annually.",
          "Prosecute Medicaid fraud, human trafficking, and certain election-integrity cases.",
          "Enforce the [Texas Open Meetings and Public Information Acts](/news/texas-open-meetings-public-info).",
        ],
      },
      {
        heading: "What the AG Cannot Do",
        paragraphs: [
          "Despite the broad portfolio, the Texas AG has narrower criminal authority than many people assume. Texas places general criminal prosecution in the hands of locally elected District Attorneys and County Attorneys — not the state AG.",
          "The AG can prosecute criminal cases only when the Legislature has specifically granted that authority (e.g., Medicaid fraud) or when a local prosecutor formally requests assistance. The Court of Criminal Appeals has reinforced these limits in recent rulings.",
        ],
      },
      {
        heading: "Powers Compared",
        table: {
          headers: ["Power", "Texas AG", "Texas Governor"],
          rows: [
            ["Sue the federal government", "Yes (lead role)", "No"],
            ["Veto legislation", "No", "Yes"],
            ["Issue binding legal opinions", "Yes", "No"],
            ["Appoint state judges (vacancies)", "No", "Yes"],
            ["Prosecute general crimes", "Limited", "No"],
            ["Enforce consumer protection", "Yes", "No"],
          ],
        },
      },
    ],
    faq: [
      {
        q: "Can the governor fire the Texas Attorney General?",
        a: "No. The AG is independently elected. Removal requires impeachment by the Texas House and conviction by the Senate.",
      },
      {
        q: "Are Attorney General Opinions legally binding?",
        a: "They are binding guidance for state officials and agencies who request them, but courts treat them as persuasive — not controlling — authority.",
      },
      {
        q: "Who can request an Attorney General Opinion?",
        a: "Only certain officials: the governor, lieutenant governor, House speaker, agency heads, county and district attorneys, and the chairs of legislative committees.",
      },
    ],
    sources: [
      { label: "Office of the Texas Attorney General", url: "https://www.texasattorneygeneral.gov/" },
      { label: "Texas Constitution Article 4 (Executive Department)", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm" },
      { label: "Texas Government Code Chapter 402 (AG Duties)", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.402.htm" },
    ],
    related: ["texas-governor-powers", "how-a-bill-becomes-texas-law", "texas-open-meetings-public-info"],
    cta: { label: "Meet Your Texas Representatives", href: "/representatives" },
  },
  "texas-governor-powers": {
    updated: "2026-07-02",
    editorNote: "Part of our Texas civics series. See also our guide to the [Powers of the Texas Attorney General](/news/texas-attorney-general-powers).",
    intro: [
      "On paper, the Texas Governor is one of the weakest chief executives in the country. Power is deliberately fragmented across separately elected statewide officers — the Lieutenant Governor, Attorney General, Comptroller, Land Commissioner, and Agriculture Commissioner — none of whom answer to the governor.",
      "In practice, the modern Texas Governor is one of the most politically powerful figures in state government, thanks to a small number of constitutional tools used aggressively: the appointment power, the line-item veto, the special-session call, and command of the Texas National Guard.",
    ],
    sections: [
      {
        heading: "A Plural Executive by Design",
        paragraphs: [
          "The 1876 Texas Constitution was written in reaction to Reconstruction-era Governor E.J. Davis, whose centralized authority Texans loathed. The framers split executive power across multiple elected offices — a structure known as the 'plural executive' — so no single official could dominate state government.",
          "That's why the [Attorney General](/news/texas-attorney-general-powers), Comptroller, and Land Commissioner each run independent operations. The governor cannot fire them, override their decisions, or veto their budgets.",
        ],
      },
      {
        heading: "The Powers That Matter",
        bullets: [
          "Appointments: roughly 1,500 appointments per term to boards, commissions, and judicial vacancies — including university regents, the Public Utility Commission, and Texas Supreme Court vacancies.",
          "Line-item veto: the governor can strike individual spending items from the state budget without vetoing the whole bill (a power the U.S. President does not have).",
          "Special sessions: the governor — and only the governor — can call the Legislature into a 30-day special session and set its agenda.",
          "Veto power: any bill can be vetoed; overrides require a two-thirds vote in both chambers and are historically rare.",
          "Commander-in-chief of the Texas National Guard and Texas State Guard, including deployment for border security under [Operation Lone Star](/news/border-security-state-role).",
          "Emergency declarations and suspension of statutes during declared disasters.",
        ],
      },
      {
        heading: "What the Governor Cannot Do",
        paragraphs: [
          "The governor does not set the legislative agenda the way a president does. The [Speaker of the House and Lieutenant Governor](/news/texas-political-terminology) — the latter elected statewide and presiding over the Senate — control the flow of legislation.",
          "The governor cannot reorganize state agencies at will, cannot remove most appointees once confirmed, and cannot block the Attorney General from filing or settling lawsuits in the state's name.",
        ],
      },
      {
        heading: "Term, Salary, and Succession",
        table: {
          headers: ["Item", "Detail"],
          rows: [
            ["Term length", "4 years, no term limit"],
            ["Annual salary (2025)", "$153,750"],
            ["Successor if vacant", "Lieutenant Governor"],
            ["Residence", "Texas Governor's Mansion, Austin"],
            ["Minimum age", "30"],
          ],
        },
      },
    ],
    faq: [
      {
        q: "Does the Texas Governor have term limits?",
        a: "No. Texas is one of 14 states with no gubernatorial term limit. Rick Perry holds the record at 14 consecutive years.",
      },
      {
        q: "Can the governor override the Lieutenant Governor or Attorney General?",
        a: "No. Each is independently elected and constitutionally autonomous. The governor's leverage is political and budgetary, not hierarchical.",
      },
      {
        q: "How is the line-item veto different from a regular veto?",
        a: "A line-item veto lets the governor strike specific dollar amounts from an appropriations bill while signing the rest. It applies only to spending bills, not to substantive policy legislation.",
      },
      {
        q: "Can the Legislature meet without the governor's permission?",
        a: "During the biennial 140-day regular session, yes. Outside that window, only the governor can call a special session and set its agenda.",
      },
    ],
    sources: [
      { label: "Office of the Texas Governor", url: "https://gov.texas.gov/" },
      { label: "Texas Constitution Article 4 §1–§16 (Executive Department)", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm" },
      { label: "Texas Legislative Reference Library — Governors of Texas", url: "https://lrl.texas.gov/legeLeaders/governors/" },
    ],
    related: ["texas-attorney-general-powers", "how-a-bill-becomes-texas-law", "texas-constitutional-amendments-guide"],
    cta: { label: "Meet Your Texas Representatives", href: "/representatives" },
  },

  "texas-border-policy-full-guide": {
    updated: "2026-06-27",
    editorNote: "This is a Keep TX Red pillar guide — updated June 2026 by our Border Bureau. We refresh it as Operation Lone Star deployments, federal litigation, and Rio Grande conditions change.",
    intro: [
      "No policy fight defines modern Texas like the border. The 1,254-mile line between Texas and Mexico runs from El Paso along the Rio Grande to the Gulf of Mexico — through ranchland, river towns, federal wildlife refuges, and the four most populous border metros in the United States. Roughly two-thirds of the entire southwest border is Texas alone, and the policy choices made in Austin reach further than most people in Washington understand.",
      "Texas has spent more than $11 billion on state-funded border security since 2021 under Operation Lone Star — a deployment of the Department of Public Safety, the Texas Military Department, and county sheriffs that has fundamentally changed how Texans think about state sovereignty. This pillar guide walks through how it works, who runs it, what the law actually says, and where the policy fight is headed in 2026.",
    ],
    sections: [
      {
        heading: "The 1,254-Mile Line: Geography First",
        paragraphs: [
          "Texas's border with Mexico is not a fence on a map. It is the Rio Grande itself — a winding, often shallow river that doubles as the international boundary from the New Mexico state line at El Paso all the way to the Gulf at Boca Chica. The river passes through nine Border Patrol sub-sectors, 28 international ports of entry, and some of the most rugged country in North America, including the Big Bend, where canyon walls drop a thousand feet into the water.",
          "The four busiest crossing zones are the El Paso sector, the Big Bend sector, the Del Rio sector, and the Rio Grande Valley sector — and they look nothing alike. El Paso is urban, dense, and shares a metroplex with Ciudad Juárez. The RGV is agricultural, hot, and lined with colonias and small river towns. Big Bend is empty. Del Rio is the area where the 2021 Haitian migrant encampment forced a national reckoning.",
        ],
      },
      {
        heading: "What Operation Lone Star Actually Is",
        paragraphs: [
          "Operation Lone Star (OLS) is the umbrella name for the state-funded border deployment Governor Greg Abbott launched in March 2021. It is not one agency or one mission — it is a coordinated, ongoing operation that pulls together:",
        ],
        bullets: [
          "Texas Department of Public Safety (DPS) — state troopers patrolling river roads, working trafficking interdiction, and arresting trespassers under state law.",
          "Texas Military Department (TMD) — Army and Air National Guard soldiers and airmen running observation posts, installing concertina wire, and operating boats on the river.",
          "Texas Parks & Wildlife Game Wardens — water patrol and rural enforcement.",
          "Local county sheriffs in Kinney, Val Verde, Maverick, Webb, Zapata, Starr, Hidalgo, and Cameron counties.",
          "The Texas Facilities Commission, which builds and operates the state border wall and the buoy barrier on the Rio Grande near Eagle Pass.",
        ],
        table: {
          headers: ["OLS Statistic (cumulative since March 2021)", "Reported Figure"],
          rows: [
            ["Migrant apprehensions / encounters", "550,000+"],
            ["Criminal arrests", "50,000+"],
            ["Felony charges filed", "45,000+"],
            ["Fentanyl seized (lethal doses)", "Hundreds of millions"],
            ["State funds appropriated", "$11+ billion"],
          ],
        },
      },
      {
        heading: "State vs. Federal: The Constitutional Question",
        paragraphs: [
          "Immigration enforcement is constitutionally a federal power. But Texas's argument — articulated by Governor Abbott in his 2024 invocation of Article I, Section 10 of the U.S. Constitution — is that when the federal government refuses to defend a state from an 'invasion,' the state retains a residual sovereign authority to defend itself. That clause reads, in part, that no state shall 'engage in War, unless actually invaded, or in such imminent Danger as will not admit of delay.'",
          "The Biden-era Department of Justice sued Texas repeatedly over the buoy barrier, the concertina wire, and Senate Bill 4 — the 2023 law making illegal entry a state crime. The Fifth Circuit, the Supreme Court's shadow docket, and a series of injunctions ping-ponged the cases. The bottom line as of mid-2026: Texas has retained the buoys, kept most of the wire, and continues to make state-law trespass arrests, while SB4 remains the central legal flashpoint.",
        ],
      },
      {
        heading: "The State Border Wall",
        paragraphs: [
          "Texas has built and is building its own physical barrier — separate from the federal wall. The state wall is funded out of OLS appropriations and constructed by the Texas Facilities Commission on land where private owners, the General Land Office, or local governments grant access. Roughly 75 miles of state-funded wall has been constructed across multiple border counties, with hundreds of additional miles planned where rights-of-way can be secured.",
          "The state wall does not require federal cooperation, which is the point. Texas treats it as a long-term capital investment in deterrence.",
        ],
      },
      {
        heading: "Senate Bill 4: State Authority to Arrest and Remove",
        paragraphs: [
          "Senate Bill 4, passed in 2023 and signed by Governor Abbott, makes illegal entry into Texas from a foreign nation a state crime — a Class B misdemeanor for a first offense, escalating to a state jail felony for repeat offenses. It authorizes state magistrates to order removal to a Mexican port of entry as an alternative to prosecution.",
          "SB4 is the most aggressive state immigration statute in modern American history. The legal fight over whether Texas can enforce it — and whether it survives federal preemption under Arizona v. United States (2012) — is one of the most important federalism cases of the decade.",
        ],
      },
      {
        heading: "Ports of Entry and Trade",
        paragraphs: [
          "Border policy is not just enforcement. The Texas border is also the largest land-trade interface in the Western Hemisphere. The Laredo port of entry — the World Trade Bridge and the Colombia Solidarity Bridge — handles more truck crossings than any other port in the United States, more than $300 billion in trade with Mexico annually. Mexico is the #1 trading partner of both the United States and the state of Texas.",
          "That trade reality is why intelligent border policy distinguishes between the river itself, where unlawful crossings happen, and the ports of entry, where legitimate commerce, work visas, and lawful travel move. Conservative border policy in Texas — at its strongest — has done both: secured the river while keeping the ports moving.",
        ],
      },
      {
        heading: "Who Pays for It",
        paragraphs: [
          "Operation Lone Star is paid for out of the Texas General Revenue Fund — appropriated by the Legislature in successive biennia, with the 2023 session alone adding $5.1 billion in border security funding. That is roughly half of what some entire state agencies receive. The political consensus in Austin to keep funding it has held across two regular sessions and multiple special sessions, with bipartisan votes in the Texas House on key border appropriations.",
        ],
      },
      {
        heading: "What Comes Next",
        paragraphs: [
          "Three questions will define Texas border policy in 2026 and beyond. First, does the federal government — under any administration — return to operational control of the border, removing Texas's stated justification for OLS? Second, do the courts ultimately uphold or strike down SB4 and similar state-led enforcement? Third, does Texas continue to scale the state wall and buoy systems into a permanent fortified line, or does it draw down once federal posture changes?",
          "Read our companion explainers on [Operation Lone Star](/news/border-security-state-role), the [Texas border geography](/news/texas-border-geography-101), and the [reinforced Rio Grande crossings](/news/operation-lone-star).",
        ],
      },
    ],
    faq: [
      { q: "Is Operation Lone Star paid for with federal money?", a: "No. OLS is funded entirely with Texas state appropriations. Texas has formally requested federal reimbursement and has been denied." },
      { q: "Can Texas legally arrest people for illegal entry?", a: "Texas argues yes, under SB4 and its sovereign self-defense authority. The federal government has challenged that position in court, and the litigation is ongoing." },
      { q: "Does Texas operate its own border wall?", a: "Yes. The Texas Facilities Commission builds the state wall on private and state land, independent of the federal border wall." },
      { q: "How many troopers and Guard members are deployed?", a: "OLS deployments have ranged from 5,000 to over 10,000 personnel at peak, including DPS, the Texas Military Department, and supporting agencies." },
      { q: "Where does the Texas border actually run?", a: "From the New Mexico line at El Paso, along the Rio Grande, to the Gulf of Mexico at Boca Chica — 1,254 miles total." },
    ],
    sources: [
      { label: "Office of the Texas Governor — Operation Lone Star", url: "https://gov.texas.gov/news/category/operation-lone-star" },
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/" },
      { label: "Texas Military Department", url: "https://tmd.texas.gov/" },
      { label: "Senate Bill 4 (88R)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=SB4" },
      { label: "U.S. Customs and Border Protection — Southwest Border Sectors", url: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters" },
    ],
    related: ["operation-lone-star", "border-security-state-role", "texas-border-geography-101"],
    cta: { label: "Contact Your Texas Legislators", href: "/contact-legislators" },
  },

  "texas-energy-economy-overview": {
    updated: "2026-06-27",
    editorNote: "This is a Keep TX Red pillar guide — updated June 2026 by our Energy Desk. The Texas energy economy moves fast; we refresh production figures, ERCOT reserve margins, and Railroad Commission rulings as they change.",
    intro: [
      "If Texas were its own country, it would be the third-largest oil producer in the world, behind only Saudi Arabia and the rest of the United States. The Permian Basin in West Texas pumps more than 6 million barrels of crude per day — more than the entire output of Iraq. Add the Eagle Ford in South Texas, the Haynesville on the Louisiana line, the Barnett under Fort Worth, and the Anadarko in the Panhandle, and Texas accounts for roughly 43% of all U.S. crude production and 25% of U.S. natural gas.",
      "But the Texas energy economy is bigger than hydrocarbons. Texas is also the largest wind-power state in the country, leads the nation in installed utility-scale solar, runs its own electric grid through ERCOT, and exports liquefied natural gas from Sabine Pass, Corpus Christi, and Freeport to Europe and Asia. This pillar guide is the Keep TX Red overview of how the whole system fits together — and why it matters to every Texan, not just the ones in Midland or Houston.",
    ],
    sections: [
      {
        heading: "The Three Pillars: Oil, Gas, Electricity",
        paragraphs: [
          "Texas's energy economy rests on three distinct industries that overlap but operate under different regulators, different markets, and different geographies. Understanding the difference is the first step to understanding any Texas energy story.",
        ],
        bullets: [
          "Oil — pumped, refined, exported. Centered in the Permian (Midland and Odessa), refined along the Gulf Coast (Houston, Port Arthur, Corpus Christi).",
          "Natural gas — produced both as associated gas from oil wells and as the primary product of dry-gas fields like the Haynesville. Liquefied for export at Sabine Pass, Corpus Christi, and Freeport.",
          "Electricity — generated, transmitted, and sold inside the ERCOT grid. About 90% of Texas load is served by ERCOT; the El Paso area, parts of East Texas, and the Panhandle sit on other grids.",
        ],
      },
      {
        heading: "The Permian Basin: Why It Matters",
        paragraphs: [
          "The Permian Basin straddles West Texas and southeastern New Mexico and is the most productive oil play in the world. The Texas side — anchored by Midland and the Delaware sub-basin to the west — produces more than 6 million barrels of crude per day plus enormous volumes of associated natural gas. At current prices and production, the Permian generates over $150 billion in annual gross revenue for the Texas economy.",
          "Permian operators range from supermajors like ExxonMobil and Chevron to independents like Pioneer (now part of Exxon), Diamondback, and EOG, down to hundreds of smaller producers. The Railroad Commission of Texas regulates the wells, well spacing, flaring, and plugging of abandoned wells.",
        ],
      },
      {
        heading: "ERCOT and Why Texas Has Its Own Grid",
        paragraphs: [
          "The Electric Reliability Council of Texas, or ERCOT, operates the grid that serves roughly 26 million Texans across 90% of the state's geography. Texas deliberately maintained an intrastate grid — separate from the Eastern and Western Interconnections — so that the federal government, through the Federal Energy Regulatory Commission, has no jurisdiction over Texas wholesale power.",
          "The Public Utility Commission of Texas (PUC) oversees ERCOT, sets the rules of the deregulated retail market, and supervises reliability standards. After Winter Storm Uri in February 2021, the Legislature passed Senate Bill 3, weatherization mandates, and the Texas Energy Fund — a multi-billion-dollar low-interest loan program for new dispatchable generation, principally natural gas.",
        ],
        table: {
          headers: ["Generation Source", "Approx. % of ERCOT Capacity"],
          rows: [
            ["Natural gas", "~40%"],
            ["Wind", "~28%"],
            ["Solar", "~18%"],
            ["Coal", "~8%"],
            ["Nuclear (Comanche Peak + South Texas Project)", "~4%"],
            ["Battery storage (utility-scale)", "~2% and growing fast"],
          ],
        },
      },
      {
        heading: "LNG Exports: Texas as Energy Diplomat",
        paragraphs: [
          "Three Gulf Coast LNG terminals — Cheniere's Sabine Pass and Corpus Christi facilities, plus Freeport LNG — make Texas one of the top liquefied natural gas exporters in the world. After Russia's 2022 invasion of Ukraine, European utilities signed long-term contracts with Texas LNG suppliers that effectively turned the Permian and Haynesville into Europe's strategic gas reserve.",
          "More export capacity is under construction at Port Arthur, Rio Grande LNG near Brownsville, and additional Cheniere trains. Federal export-permit policy is the single largest variable in how big the Texas LNG industry becomes by the end of the decade.",
        ],
      },
      {
        heading: "The Railroad Commission of Texas",
        paragraphs: [
          "Texas's primary oil and gas regulator is the Railroad Commission — three statewide elected commissioners, six-year staggered terms, all currently Republican. The Commission has not regulated railroads since 2005, but the name has stuck since 1891. The Commission regulates drilling permits, well spacing, pipeline safety, surface mining, and the plugging of orphaned wells.",
          "It is, in practical terms, one of the most consequential elected bodies in the United States — and one of the lowest-turnout statewide races on the Texas ballot.",
        ],
      },
      {
        heading: "Property Taxes, Severance Taxes, and the Permanent School Fund",
        paragraphs: [
          "The Texas energy economy doesn't just employ Texans — it pays for Texas government. The 4.6% oil severance tax and 7.5% natural gas severance tax flow into the General Revenue Fund and, after thresholds, into the Economic Stabilization Fund (the Rainy Day Fund) and the Permanent School Fund.",
          "The Permanent School Fund — which owns 13 million acres of state lands including major mineral interests across the Permian — is one of the largest sovereign endowments for public education in the world and currently exceeds $55 billion. Every distribution it makes to ISDs is, in effect, a check that the Texas energy economy writes for Texas schoolchildren.",
        ],
      },
      {
        heading: "Renewables Are Texan Too",
        paragraphs: [
          "Texas leads the United States in installed wind capacity — over 40 gigawatts, more than the next three states combined — and is now the leader in new utility-scale solar deployment. West Texas wind, Panhandle wind, and South Texas solar all feed into ERCOT.",
          "Conservative energy policy in Texas has generally been 'all of the above with a thumb on dispatchable resources': encourage every form of generation, but make sure firm, dispatchable capacity (natural gas, nuclear, and increasingly batteries) is sized to keep the lights on at peak demand. That is the Texas Energy Fund's core logic.",
        ],
      },
      {
        heading: "Bottom Line for Texans",
        paragraphs: [
          "If you drive in Houston, run an HVAC in Dallas in August, work in a school in Austin, or own a ranch in the Permian, your daily life is downstream of the Texas energy economy. It funds your kids' classrooms, fuels your truck, heats your home, and is increasingly Europe's hedge against authoritarian energy suppliers.",
          "Read our companion guides: the [Texas grid and ERCOT explained](/news/texas-grid-ercot-explained), the [Texas energy policy guide](/news/texas-energy-policy-guide), and our running [Permian Basin coverage](/news/permian-energy).",
        ],
      },
    ],
    faq: [
      { q: "How much oil does Texas produce?", a: "Roughly 5.5 to 6 million barrels per day from the Permian alone, plus material volumes from the Eagle Ford and other plays — about 43% of total U.S. crude production." },
      { q: "Does Texas really have its own electric grid?", a: "Yes. ERCOT covers about 90% of Texas load and is deliberately separated from the Eastern and Western Interconnections so federal regulators have no jurisdiction." },
      { q: "Who regulates oil and gas in Texas?", a: "The Railroad Commission of Texas — three statewide elected commissioners. It does not regulate railroads." },
      { q: "Is Texas pro-renewable?", a: "Texas leads the country in installed wind capacity and is the top state for new utility-scale solar. Conservative policy in Austin favors 'all of the above' generation with firm dispatchable backup." },
      { q: "How does energy fund Texas schools?", a: "Severance taxes and the Permanent School Fund — which holds mineral interests across the Permian — generate billions annually for K-12 education and the Rainy Day Fund." },
    ],
    sources: [
      { label: "Railroad Commission of Texas", url: "https://www.rrc.texas.gov/" },
      { label: "ERCOT", url: "https://www.ercot.com/" },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/" },
      { label: "Texas Comptroller — Energy Industry", url: "https://comptroller.texas.gov/economy/economic-data/energy/" },
      { label: "U.S. Energy Information Administration — Texas State Profile", url: "https://www.eia.gov/state/?sid=TX" },
    ],
    related: ["permian-energy", "texas-grid-ercot-explained", "texas-energy-policy-guide"],
    cta: { label: "Browse Energy Coverage", href: "/news" },
  },

  "texas-voting-guide-2026": {
    updated: "2026-06-27",
    editorNote: "This is the Keep TX Red 2026 voting pillar guide — maintained year-round by our Elections Desk. We update it as deadlines, ID rules, and ballot dates change.",
    intro: [
      "Texas runs more elections than most voters realize: federal, state, county, ISD, city, MUD, hospital district, water district, and constitutional amendments. In an even-numbered year like 2026, the cycle starts in early January with the candidate filing deadline, runs through the March primary and May runoff, and ends with the November general election. Miss the wrong deadline and you sit out a year that decides governor, lieutenant governor, attorney general, every member of the U.S. House, half the State Senate, and every member of the Texas House.",
      "This is the Keep TX Red voter guide for 2026 — registration, ID, the calendar, mail ballots, where to vote, and how to find your district. It is written for Texans in Houston, Dallas, San Antonio, Austin, Fort Worth, El Paso, the Rio Grande Valley, and every county in between.",
    ],
    sections: [
      {
        heading: "The 2026 Calendar",
        bullets: [
          "Monday, December 8, 2025 — first day candidates can file for the March 2026 primary.",
          "Monday, December 8, 2025 — filing deadline for most state and federal primary races.",
          "Monday, February 2, 2026 — last day to register to vote in the March primary (30 days before Election Day).",
          "Monday, February 16 – Friday, February 27, 2026 — early voting for the March primary.",
          "Tuesday, March 3, 2026 — Primary Election Day.",
          "Tuesday, May 26, 2026 — Primary Runoff Election Day (if needed; many statewide races trigger runoffs).",
          "Saturday, May 2, 2026 — Uniform Election Date for most ISD trustee, city council, and special-district races.",
          "Monday, October 5, 2026 — last day to register to vote in the November general election.",
          "Monday, October 19 – Friday, October 30, 2026 — early voting for the general election.",
          "Tuesday, November 3, 2026 — General Election Day.",
        ],
      },
      {
        heading: "How to Register",
        paragraphs: [
          "Texas does not offer same-day registration and does not offer fully online registration. To vote, you must submit a paper voter registration application to the voter registrar in the county where you live at least 30 days before the election.",
          "You can pick up the form at any county tax office, public library, post office, or many high schools, or you can download and print it from the Secretary of State's website at votetexas.gov. The application is free.",
        ],
        bullets: [
          "U.S. citizen.",
          "Age 18 or older by Election Day (17-year-olds can register if they will turn 18 by the next election).",
          "Resident of the Texas county where you apply.",
          "Not finally convicted of a felony — or have completed sentence, parole, and probation.",
          "Not declared mentally incapacitated by a court.",
        ],
      },
      {
        heading: "Accepted Photo ID at the Polls",
        paragraphs: [
          "Texas has one of the country's strongest voter ID laws. You must present one of the following at the polling place:",
        ],
        bullets: [
          "Texas Driver License (may be expired up to four years; no expiration limit if you're 70 or older).",
          "Texas Election Identification Certificate (EIC) — free from DPS for those who don't drive.",
          "Texas Personal Identification Card.",
          "Texas handgun license.",
          "U.S. military ID with photo.",
          "U.S. citizenship certificate with photo.",
          "U.S. passport (book or card).",
        ],
        table: {
          headers: ["If you don't have an accepted ID", "What to do"],
          rows: [
            ["Forgot it at home", "Cast a provisional ballot; bring ID to county registrar within 6 days."],
            ["Lost or stolen", "Sign a Reasonable Impediment Declaration and present a supporting document (utility bill, paycheck, bank statement)."],
            ["Never had one", "Apply for a free Election Identification Certificate at any DPS office."],
          ],
        },
      },
      {
        heading: "Mail Ballots: Limited and Specific",
        paragraphs: [
          "Texas does not have universal mail-in voting. You may vote by mail only if you meet one of four conditions:",
        ],
        bullets: [
          "Age 65 or older on Election Day.",
          "Disabled (per the Texas Election Code definition).",
          "Out of the county during the entire early-voting period and on Election Day.",
          "Confined in jail but otherwise eligible to vote.",
        ],
      },
      {
        heading: "Primary vs. General: Why March Decides Most Texas Races",
        paragraphs: [
          "In most Texas legislative and congressional districts, the Republican primary is the actual election. November is the formality. That is a direct result of how districts have been drawn and how Texas's electorate has sorted geographically over the past two decades.",
          "For full mechanics, read our companion explainer on the [Texas primary system](/news/primary-vs-general-election) and the [beginner's guide to Texas elections](/news/beginners-guide-texas-elections).",
        ],
      },
      {
        heading: "How to Find Your Polling Place",
        paragraphs: [
          "Most Texas counties — including Harris, Dallas, Tarrant, Bexar, Travis, Collin, Denton, Fort Bend, El Paso, Hidalgo, and dozens of others — participate in the Countywide Polling Place Program. That means on Election Day you may vote at any open polling location in your county, not just one assigned precinct. Smaller and rural counties still assign precinct-specific polling places. Always check before you go.",
          "Use the Secretary of State's 'My Voter' portal at teamrv-mvp.sos.texas.gov/MVP — or check our [voting locations page](/voting-locations) for county links.",
        ],
      },
      {
        heading: "Find Your Districts and Representatives",
        paragraphs: [
          "Texans live inside multiple overlapping districts: congressional, state Senate, state House, State Board of Education, county commissioner precinct, ISD trustee district, and city council district. The Secretary of State's voter portal lists all of them by your registered address.",
          "To contact officials once you know them, see our [representatives page](/representatives) and the [contact legislators directory](/contact-legislators).",
        ],
      },
      {
        heading: "What's on the Ballot in 2026",
        bullets: [
          "Governor of Texas",
          "Lieutenant Governor of Texas",
          "Attorney General of Texas",
          "Comptroller of Public Accounts",
          "Commissioner of the General Land Office",
          "Commissioner of Agriculture",
          "Railroad Commissioner (one seat)",
          "U.S. House of Representatives — all 38 Texas seats",
          "Texas State Senate — 15 of 31 seats",
          "Texas State House — all 150 seats",
          "Court of Criminal Appeals seats and several Texas Supreme Court seats",
          "State Board of Education (selected seats)",
          "Local: county commissioners, district attorneys, sheriffs, ISD trustees, city councils where on the cycle",
        ],
      },
    ],
    faq: [
      { q: "Can I register to vote online in Texas?", a: "No. You can update your existing registration's address online, but the initial registration must be filed on paper with your county voter registrar." },
      { q: "Do I need to declare a party to vote in the primary?", a: "Texas does not have party registration. You declare a party only by picking that party's primary ballot on primary day — it then locks you into that party's runoff." },
      { q: "How early can I vote?", a: "Early voting starts about 17 days before Election Day for the primary and the general election." },
      { q: "What if my name is not on the rolls when I show up?", a: "Cast a provisional ballot. You then have six days to provide proof of eligibility to the county registrar." },
      { q: "Can I take my kids to the polls?", a: "Yes. Texas law specifically permits voters to bring children under 18 into the voting booth." },
    ],
    sources: [
      { label: "Texas Secretary of State — VoteTexas.gov", url: "https://www.votetexas.gov/" },
      { label: "Texas Secretary of State — My Voter Portal", url: "https://teamrv-mvp.sos.texas.gov/MVP/" },
      { label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.toc.htm" },
      { label: "DPS — Election Identification Certificate", url: "https://www.dps.texas.gov/section/driver-license/election-identification-certificate-eic" },
    ],
    related: ["texas-voter-registration-guide", "primary-vs-general-election", "beginners-guide-texas-elections"],
    cta: { label: "Find Your Polling Place", href: "/voting-locations" },
  },

  "texas-giraffe-story": {
    updated: "2026-06-27",
    editorNote: "A Texana feature from the Keep TX Red editorial team. Opinions and framing are editorial — facts are sourced below.",
    intro: [
      "Drive an hour southwest of Fort Worth, past the live oaks and limestone of Glen Rose, and you will find something most Americans do not associate with Texas: a herd of giraffes browsing the tops of mesquite trees as casually as whitetail deer browse a Hill Country pasture. They are not lost. They are not on loan. They live here — born in Texas, raised in Texas, and in many cases, never having set foot on the African continent their ancestors came from.",
      "Texas, by a quiet quirk of private property law and ranching culture, is now home to one of the largest concentrations of giraffes outside Africa. The story of how that happened is part conservation, part rugged individualism, and entirely Texan.",
    ],
    sections: [
      {
        heading: "It Started at Fossil Rim",
        paragraphs: [
          "The center of gravity for Texas giraffes is the Fossil Rim Wildlife Center, a 1,800-acre conservation ranch outside Glen Rose. Founded in 1984 on a former exotic-game ranch, Fossil Rim has bred and raised more than 200 reticulated giraffes — one of the most successful captive breeding programs in North America.",
          "Calves born at Fossil Rim have been placed in accredited zoos and conservation parks from Florida to California. The ranch's veterinary program has trained a generation of giraffe specialists, and its open pasture model — giraffes walking miles a day across native Texas range — has become a template for humane large-herbivore husbandry.",
        ],
      },
      {
        heading: "Why Texas, of All Places",
        paragraphs: [
          "Three things made Texas the unlikely capital of American giraffe ranching:",
        ],
        bullets: [
          "Climate — the Hill Country's hot, dry summers and mild winters mimic the East African savanna better than almost anywhere else in the United States.",
          "Land — Texas is overwhelmingly privately owned (about 95% of the state), and the ranches are big enough that exotic species can roam without fences feeling like cages.",
          "Law — Texas treats most non-native hoofstock as private property rather than state wildlife, which lets ranchers buy, breed, sell, and conserve them without a federal permit for every transaction.",
        ],
      },
      {
        heading: "The Exotic Ranching Economy",
        paragraphs: [
          "Fossil Rim is the flagship, but it is not alone. The Exotic Wildlife Association estimates that Texas private ranches host more than 1 million head of exotic hoofstock across roughly 5,000 properties — including blackbuck antelope, scimitar-horned oryx, addax, and yes, giraffes. Several species the ranches conserve are now extinct or near-extinct in their native ranges.",
          "Conservatives have long argued that private ownership is the most reliable engine of conservation: a rancher who can profit from a herd has every incentive to keep it healthy, fed, and reproducing. The Texas exotic industry is the closest thing in America to a real-world test of that idea, and the giraffe is its most visible mascot.",
        ],
        table: {
          headers: ["Where to See Giraffes in Texas", "Location", "Type"],
          rows: [
            ["Fossil Rim Wildlife Center", "Glen Rose", "Conservation ranch / drive-through"],
            ["Natural Bridge Wildlife Ranch", "San Antonio", "Drive-through safari park"],
            ["Dallas Zoo — Giants of the Savanna", "Dallas", "Accredited zoo habitat"],
            ["Houston Zoo — African Forest", "Houston", "Accredited zoo habitat"],
            ["Cameron Park Zoo", "Waco", "Accredited zoo habitat"],
          ],
        },
      },
      {
        heading: "Conservation by Property Right",
        paragraphs: [
          "Reticulated giraffes are listed as endangered by the IUCN, with wild populations down sharply across Kenya, Somalia, and southern Ethiopia. The Texas herds — Fossil Rim's especially — function as a genetic reserve. Calves born here carry bloodlines that may one day be reintroduced if range conditions in East Africa ever stabilize.",
          "It is a quiet conservative success story: no federal mandate built it, no Washington program funds it, and no environmental lobby gets credit for it. Texas ranchers, Texas veterinarians, and Texas land did the work.",
        ],
      },
    ],
    faq: [
      { q: "How many giraffes live in Texas?", a: "There is no official count, but between Fossil Rim, accredited zoos, drive-through safari parks, and private exotic ranches, Texas hosts well over 100 giraffes at any given time — more than several African nations." },
      { q: "Can you legally own a giraffe in Texas?", a: "Yes, with the right facilities and a USDA exhibitor license if you display them. Texas classifies most non-native hoofstock as private property, which is why the exotic-ranching industry exists here at the scale it does." },
      { q: "Is Fossil Rim a zoo?", a: "Not exactly. It is an accredited conservation center where visitors drive through open pastures while giraffes, zebras, rhinos, and other species roam. Think wildlife park, not roadside zoo." },
      { q: "Are Texas giraffes endangered?", a: "The species (reticulated giraffe) is endangered in the wild. The Texas captive population is healthy and reproducing, which is precisely why it matters as a genetic backup." },
    ],
    sources: [
      { label: "Fossil Rim Wildlife Center", url: "https://fossilrim.org/" },
      { label: "Exotic Wildlife Association", url: "https://www.myewa.org/" },
      { label: "IUCN Red List — Reticulated Giraffe", url: "https://www.iucnredlist.org/species/88420717/88420720" },
      { label: "Texas Parks & Wildlife — Exotic Species", url: "https://tpwd.texas.gov/huntwild/wild/nuisance/exotic/" },
    ],
    related: ["texas-property-tax-guide", "texas-water-rights-explained", "what-local-governments-control"],
    cta: { label: "Visit Fossil Rim", href: "https://fossilrim.org/" },
  },
};
