export type ArticleSource = { label: string; url: string };
export type ArticleFAQ = { q: string; a: string };
export type ArticleSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
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
};
