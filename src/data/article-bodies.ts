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
};
