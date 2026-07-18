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
  keyTakeaways?: string[];
};

export const ARTICLE_BODIES: Record<string, ArticleBody> = {
  "moving-to-texas-guide": {
    updated: "2026-07-09",
    intro: [
      "Every year, hundreds of thousands of people pack up and head for Texas — drawn by no state income tax, a lower cost of living than the coasts, a business-friendly regulatory climate, and a political culture built on limited government and individual liberty.",
      "This guide is for anyone packing a moving truck for Texas, or anyone who just arrived and is trying to make sense of property tax bills, ISD ballots, and an electric bill that works nothing like the one back home. We'll walk through taxes, schools, voting, energy, gun laws, and the civic institutions that make Texas run.",
    ],
    sections: [
      {
        heading: "Why People Are Moving to Texas",
        paragraphs: [
          "Texas has added more new residents than any other state for over a decade running, driven by job growth in energy, tech, healthcare, and manufacturing, plus corporate relocations to Austin, Dallas-Fort Worth, and Houston.",
          "But the tradeoffs are real: Texas makes up for the lack of an income tax with property and sales tax, government here is unusually decentralized, and a huge amount of what affects your daily life — your kids' schools, your electricity, your water — is decided locally, not in Austin.",
        ],
      },
      {
        heading: "Choosing Where in Texas to Land",
        paragraphs: [
          "Texas is closer to four or five different states stitched together under one flag. Houston is the state's largest metro, built on the energy industry and the Port of Houston, with no zoning code and sprawling suburbs. Dallas-Fort Worth is the corporate relocation capital of the country right now, split across dozens of independent suburban cities, each with its own tax rate and school district.",
          "Austin is the state capital and a tech hub, but also the most liberal major city in Texas by a wide margin — the suburbs ringing it (Georgetown, Leander, Round Rock) are considerably more conservative than the city itself. San Antonio is more affordable, anchored by military installations and healthcare, with a political character that leans more purple. The Rio Grande Valley and Hill Country represent opposite ends of the state's geography and politics.",
          "If you're weighing a move to South Texas specifically, our guide to [Texas Border Geography 101](/news/texas-border-geography-101) covers the region's ports of entry and sector maps.",
        ],
      },
      {
        heading: "No State Income Tax — But Read the Fine Print",
        paragraphs: [
          "The single biggest reason people cite for moving to Texas is the tax bill. Texas is one of only nine states with no personal income tax, and voters amended the constitution in 2019 to make one nearly impossible to enact without another statewide vote.",
          "That doesn't mean low taxes overall — it means a different structure. Texas leans on sales and property tax instead. For the full breakdown, see [Why Texas Has No State Income Tax](/news/why-texas-has-no-income-tax).",
        ],
      },
      {
        heading: "Property Taxes: The Bill That Surprises Every Newcomer",
        paragraphs: [
          "Texas has some of the highest effective property tax rates in the country, because property tax — not income tax — is the primary funding mechanism for schools, counties, and cities. A $400,000 home in a typical suburb can carry a $8,000-$10,000+ annual bill, split across your ISD, county, city, and often a municipal utility district (MUD).",
          "Your tax rate and your appraised value are two separate numbers. The rate is set by each taxing entity; the appraised value is set independently by your county appraisal district and can rise even in years your local governments don't raise rates at all — which is the number worth protesting every year.",
          "File your homestead exemption immediately if the home will be your primary residence. Texas voters raised this exemption from $100,000 to $140,000 via a 2025 constitutional amendment, with a larger reduction for homeowners 65+. This isn't automatic — you file directly with your county appraisal district. See [The Texas Homestead Exemption Explained](/news/homestead-exemption-explained) for eligibility and deadlines.",
          "For a full walkthrough of how the bill is calculated from appraisal to final total, read [The Texas Property Tax Guide](/news/texas-property-tax-guide). To get an actual dollar estimate before you buy, use our own [Property Tax Calculator](/tax-calculator).",
          "Protesting your appraisal every year is routine, expected, and effective in Texas. See [How to Protest Your Property Appraisal — and Actually Win](/news/appraisal-protest-playbook) for deadlines and the evidence-packet approach that works, and [How County Appraisal Districts Work](/news/county-appraisal-districts-explained) for your statutory rights during that process.",
        ],
      },
      {
        heading: "Understanding Local Government: Who Actually Runs Your Life",
        paragraphs: [
          "Counties, cities, ISDs, MUDs, and emergency services districts each have their own elected boards and their own taxing authority. If you buy in a newer suburban development, you may be inside two or three overlapping special districts you'll only discover on your tax bill. See [What Local Governments Actually Control in Texas](/news/what-local-governments-control).",
          "Counties carry more weight in Texas than in many states, running the sheriff's department, jails, district courts, and rural roads. See [How Texas Counties Actually Spend Your Money](/news/how-texas-counties-spend) for where that money goes.",
        ],
      },
      {
        heading: "Registering to Vote and Understanding Texas Elections",
        paragraphs: [
          "Texas requires voter registration at least 30 days before an election, and you'll need to update it any time you move counties. See [The Texas Voter Registration Guide](/news/texas-voter-registration-guide) for accepted ID and mail-ballot rules.",
          "In much of Texas, the March Republican primary effectively decides who holds the seat — the November general is often a formality. See [Primary vs. General](/news/primary-vs-general-election) for how that works, and [The Texas Voting Guide for 2026](/news/texas-voting-guide-2026) for the full calendar. If you're new to open primaries and runoff math, start with [A Beginner's Guide to Texas Elections](/news/beginners-guide-texas-elections).",
        ],
      },
      {
        heading: "Schools: ISDs, School Boards, and School Choice",
        paragraphs: [
          "Public education runs through more than 1,000 independent school districts, each with its own elected board. Not sure which ISD you fall under? Use our [Find My School District](/find-my-school-district) tool to look it up by address and jump straight to that district's registration page.",
          "School board elections are low-turnout and often decided by a few hundred votes, yet they determine curriculum, budgets, and bond measures. See [Local School Board Elections: Why Every Conservative Vote Matters](/news/school-board-elections) and [Texas School Board Powers Explained](/news/texas-school-board-powers).",
          "Understand how your ISD is actually funded, especially in a high-property-value district — Texas's 'Robin Hood' recapture system redistributes revenue between districts. See [Understanding Texas School Finance](/news/texas-school-finance-explained).",
          "If school choice factors into your decision, Texas's new Education Savings Account program gives parents access to state funds for private tuition and other expenses. See [Education Savings Accounts: A Parent's Guide to Texas School Choice](/news/school-choice-esa-guide).",
        ],
      },
      {
        heading: "Registering Your Vehicle and Getting a Texas License",
        paragraphs: [
          "New residents generally have 30 days to title and register a vehicle and 90 days to get a Texas driver's license — two different agencies, two different deadlines. Registration happens at your county tax assessor-collector's office; the license comes from the Department of Public Safety (DPS).",
          "Use our [Find My DMV](/find-my-dmv) tool to locate your county tax office and nearest DPS office, with what to bring for each.",
        ],
      },
      {
        heading: "Energy and Utilities: Welcome to ERCOT",
        paragraphs: [
          "Most of the state runs its own electric grid, managed by ERCOT, specifically to avoid federal regulation. If you're in Houston, Dallas-Fort Worth, or most of the ERCOT footprint, you'll actually get to shop for your electricity provider and plan. See [The Texas Grid Explained](/news/texas-grid-ercot-explained).",
          "For the bigger picture on how Texas became the country's energy capital, see [The Texas Energy Economy](/news/texas-energy-economy-overview). If you're moving somewhere rural and relying on a well, see [Texas Water Rights Explained](/news/texas-water-rights-explained).",
        ],
      },
      {
        heading: "Gun Laws: Constitutional Carry",
        paragraphs: [
          "Since House Bill 1927 took effect, eligible Texans 21 and older can carry a handgun, openly or concealed, without a state-issued permit — though location restrictions and reciprocity rules still apply. See [Constitutional Carry in Texas: What the Law Actually Says](/news/constitutional-carry-one-year-later).",
        ],
      },
      {
        heading: "Learning How Texas Government Actually Works",
        paragraphs: [
          "Austin politics runs on its own vocabulary — special sessions, sunset review, points of order. See [A Guide to Texas Political Terminology](/news/texas-political-terminology) and [How a Bill Becomes Texas Law](/news/how-a-bill-becomes-texas-law).",
          "Texas has one of the most constitutionally limited governors in the country on paper, paired with significant informal power. See [The Powers of the Texas Governor Explained](/news/texas-governor-powers) and [The Powers of the Texas Attorney General Explained](/news/texas-attorney-general-powers).",
          "Every city council, school board, and commissioners court operates under sunshine laws — see [The Texas Open Meetings & Public Information Acts](/news/texas-open-meetings-public-info). And Texas has amended its constitution more than 500 times — see [A Guide to Texas Constitutional Amendments](/news/texas-constitutional-amendments-guide) for how that process works.",
        ],
      },
      {
        heading: "A Practical First-90-Days Checklist",
        paragraphs: [
          "1. Register your vehicle within 30 days and get a Texas driver's license within 90 days — use [Find My DMV](/find-my-dmv) to locate both offices.",
          "2. File your homestead exemption the moment you close on a home — most counties tie the deadline to January 1 of the following tax year.",
          "3. Register to vote and mark your calendar for the March primary, not just the November general.",
          "4. Shop your electricity plan if you're in ERCOT territory.",
          "5. Look up your county appraisal district and set a reminder for protest season, typically April–May.",
          "6. Find your ISD using [Find My School District](/find-my-school-district) and check when the next school board election falls.",
          "7. Bookmark your county and city government sites for commissioners court and council meeting agendas.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I have to give up my old state's driver's license right away?",
        a: "Texas requires new residents to title and register a vehicle within 30 days of establishing residency and to obtain a Texas driver's license within 90 days. Registration is handled at your county tax assessor-collector's office, not a DMV branch, while the driver's license comes from the Department of Public Safety — use our Find My DMV tool to locate both.",
      },
      {
        q: "Is it true I can shop for my own electricity provider?",
        a: "In most of the ERCOT service area — roughly 90% of the state, including Houston and Dallas-Fort Worth — yes. A handful of cities, including Austin and San Antonio, run municipally owned utilities instead, so you won't get a choice of provider there.",
      },
      {
        q: "How different is a Texas primary from what I'm used to?",
        a: "Texas has open primaries — you don't register by party. You simply choose which party's primary ballot to request when you vote, and that choice isn't a permanent party registration the way it is in some closed-primary states.",
      },
      {
        q: "Will my property tax bill really be that much higher than my old state's?",
        a: "It depends on the comparison. Coming from a high-property-tax, high-income-tax state, Texas is close to a pure win. Coming from a low-property-tax state, the property tax bill will likely be the biggest sticker shock — which is why filing your homestead exemption and protesting your appraisal every year matters.",
      },
      {
        q: "Do I need to worry about hurricanes or winter storms depending on where I move?",
        a: "Coastal and Houston-area residents should budget for hurricane season (June–November) and related insurance costs. Nearly anywhere in the state can also see a severe winter storm capable of straining the ERCOT grid, as happened in February 2021.",
      },
    ],
    sources: [
      { label: "TxDMV: New to Texas", url: "https://www.txdmv.gov/motorists/new-to-texas" },
      { label: "Texas DPS: Moving to Texas", url: "https://www.dps.texas.gov/section/driver-license/moving-texas" },
      {
        label: "Texas Comptroller: Homestead Exemption Form 50-114",
        url: "https://comptroller.texas.gov/forms/50-114.pdf",
      },
      {
        label: "Texas Comptroller: County Appraisal District Directory",
        url: "https://comptroller.texas.gov/taxes/property-tax/references/directory/cad.php",
      },
      {
        label: "Texas Comptroller: Property Tax Exemptions",
        url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/",
      },
      {
        label: "Texas.gov: Property Tax Transparency",
        url: "https://www.texas.gov/living-in-texas/property-tax-transparency/",
      },
      {
        label: "Texas Education Agency: School District Locator",
        url: "https://tea.texas.gov/texas-schools/general-information/school-district-locator",
      },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
    ],
    related: [
      "texas-property-tax-guide",
      "homestead-exemption-explained",
      "texas-voter-registration-guide",
      "texas-grid-ercot-explained",
      "texas-school-board-powers",
      "constitutional-carry-one-year-later",
    ],
    cta: { label: "Browse the Newsroom", href: "/news" },
  },
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
        paragraphs: ["Every Texas property tax bill follows the same arithmetic, no matter which county you live in:"],
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
      {
        label: "Texas Tax Code Chapter 11 (Exemptions)",
        url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.11.htm",
      },
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
      {
        q: "Can I claim a homestead on more than one house?",
        a: "No. Texas allows one homestead per family, and it must be your principal residence.",
      },
      {
        q: "Do I have to refile every year?",
        a: "No. Once granted, the exemption stays in place until you move, sell, or the CAD requests reverification.",
      },
      {
        q: "What if I bought mid-year?",
        a: "You still qualify for the full year as long as you occupied the home as your principal residence by January 1 of the next year.",
      },
    ],
    sources: [
      { label: "Form 50-114 — Residence Homestead Application", url: "https://comptroller.texas.gov/forms/50-114.pdf" },
      {
        label: "Texas Comptroller — Homestead Exemptions",
        url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/residence-homestead.php",
      },
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
      {
        q: "When can I testify on a bill?",
        a: "Only during the committee hearing stage. Most committees post hearings 24-72 hours in advance on the Texas Legislature Online site.",
      },
      {
        q: "Can the Governor line-item veto?",
        a: "Only on appropriations bills. On every other bill, the Governor must sign or veto the entire bill.",
      },
      {
        q: "Why do so many bills die?",
        a: "Most bills never receive a committee hearing. Calendar deadlines and committee chair discretion kill the vast majority.",
      },
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
      {
        q: "Can I vote in both primaries?",
        a: "No. Picking one party's primary ballot locks you out of the other party's runoff.",
      },
      {
        q: "Do I need to register as a Republican?",
        a: "Texas does not have party registration. Anyone registered to vote can request either party's primary ballot.",
      },
    ],
    sources: [
      { label: "Texas Secretary of State — Voter Information", url: "https://www.votetexas.gov/" },
      {
        label: "Election Code Chapter 172 (Primaries)",
        url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.172.htm",
      },
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
      {
        q: "Why are there so many May elections?",
        a: "Texas law lets local governments (ISDs, cities, MUDs) hold elections on uniform May or November dates. Most pick May to depress turnout and let core voters decide.",
      },
      { q: "When do I vote on judges?", a: "Texas elects most judges in partisan November elections." },
    ],
    sources: [
      {
        label: "Texas Secretary of State — Election Dates",
        url: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
      },
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
      {
        q: "What if I moved counties?",
        a: "You must re-register in your new county. Update your address on the Secretary of State portal.",
      },
      {
        q: "Can I register online?",
        a: "Texas does not have full online voter registration — you must mail or hand-deliver a paper application.",
      },
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
      {
        q: "Are school board races partisan?",
        a: "Officially no — but coalitions of parents, teachers' unions, and political groups openly endorse and fund slates.",
      },
      {
        q: "Can I recall a board member?",
        a: "Texas does not allow recall of elected ISD trustees; you must wait for the next election.",
      },
    ],
    sources: [
      { label: "Texas Education Agency", url: "https://tea.texas.gov/" },
      {
        label: "Texas Education Code Chapter 11 (School Districts)",
        url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.11.htm",
      },
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
      {
        q: "Does Texas import electricity?",
        a: "ERCOT is largely self-contained, though small DC ties exist with the Eastern grid and Mexico.",
      },
      {
        q: "Who sets electricity prices?",
        a: "In deregulated areas, the PUC supervises a competitive retail market; you pick your provider.",
      },
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
      {
        q: "Who pays for the CAD?",
        a: "The taxing units inside the county (ISDs, the county itself, cities) fund it proportionally to their levies.",
      },
      {
        q: "Can the CAD enter my property?",
        a: "Not without your permission. CAD valuations are based on exterior observation, sales data, and your improvements on file.",
      },
    ],
    sources: [
      {
        label: "Texas Comptroller — Appraisal Districts",
        url: "https://comptroller.texas.gov/taxes/property-tax/cad/",
      },
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
      {
        q: "Why do I pay so many different property taxes?",
        a: "Because each layer is a separate government with its own elected board and its own tax rate, all stacked on the same parcel.",
      },
      {
        q: "Who handles 911?",
        a: "Cities handle 911 inside city limits; counties or Emergency Services Districts (ESDs) handle it elsewhere.",
      },
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
      {
        q: "Where is the river the deepest?",
        a: "Below Falcon and Amistad reservoirs the Rio Grande runs deep and wide; in the Big Bend and upper sectors it is often walkable in dry months.",
      },
      {
        q: "Is the border fenced everywhere?",
        a: "No. Roughly a third of the Texas border has some form of barrier; the rest is open river, ranchland, or desert.",
      },
    ],
    sources: [
      {
        label: "U.S. Customs and Border Protection — Sectors",
        url: "https://www.cbp.gov/border-security/along-us-borders/border-patrol-sectors",
      },
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
      {
        q: "Does recapture leave Texas?",
        a: "No. Every recaptured dollar is spent inside the Texas school finance system.",
      },
      {
        q: "What is the basic allotment?",
        a: "The dollar-per-student amount the Legislature sets as the funding floor. It is the lever that drives nearly every other formula.",
      },
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
      {
        q: "What is the 'Local & Consent Calendar'?",
        a: "The House calendar for non-controversial bills, debated under time-limited rules.",
      },
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
      {
        q: "Who sets the county budget?",
        a: "The five-member Commissioners Court — the county judge plus four precinct commissioners.",
      },
      {
        q: "Why is the jail so expensive?",
        a: "Counties bear nearly all pretrial detention costs and most jails operate 24/7 with state-mandated staffing ratios.",
      },
    ],
    sources: [
      {
        label: "Texas Association of Counties — Budgets",
        url: "https://www.county.org/Education-Training/County-Budgets",
      },
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
      {
        q: "Can my neighbor drain my well?",
        a: "Under classic rule of capture, generally yes — though most aquifers are now overseen by a GCD with permit limits.",
      },
      {
        q: "Who decides Rio Grande shares with Mexico?",
        a: "The 1944 Water Treaty, administered by the International Boundary and Water Commission.",
      },
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
      {
        q: "When are amendments on the ballot?",
        a: "Odd-year Novembers, in standalone constitutional amendment elections that turn out roughly 10% of registered voters.",
      },
      {
        q: "Can the Governor veto an amendment?",
        a: "No. Joint Resolutions proposing amendments are not subject to gubernatorial veto.",
      },
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
      {
        q: "Does the OMA apply to my HOA?",
        a: "No — the OMA covers governmental bodies. HOAs are private corporations governed by Property Code Ch. 209.",
      },
      {
        q: "Can my school board go into closed session to discuss curriculum?",
        a: "No. Curriculum is not one of the enumerated exceptions in §551.071-§551.089. Personnel discussions about a specific teacher are.",
      },
      {
        q: "What if my PIA request is ignored?",
        a: "File a complaint with your county or district attorney, or sue for mandamus. The agency pays your attorney's fees if you win.",
      },
    ],
    sources: [
      {
        label: "Texas Government Code Ch. 551 — Open Meetings",
        url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.551.htm",
      },
      {
        label: "Texas Government Code Ch. 552 — Public Information",
        url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm",
      },
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
      {
        q: "Could Texas ever add an income tax?",
        a: "Only with two-thirds of the Legislature and a statewide voter referendum — Proposition 4 (2019) wrote the prohibition into the constitution.",
      },
      {
        q: "Do Texas businesses pay an income tax?",
        a: "No — but most businesses with over $2.47M in revenue pay the franchise (margin) tax, which is calculated on gross receipts minus deductions, not net income.",
      },
      {
        q: "Why are Texas property taxes so high?",
        a: "Because there is no income tax, schools and local government rely heavily on property tax. State surplus dollars have been used to compress ISD M&O rates since 2019.",
      },
    ],
    sources: [
      {
        label: "Texas Comptroller — Sources of Revenue",
        url: "https://comptroller.texas.gov/transparency/reports/sources-of-revenue/",
      },
      {
        label: "Texas Constitution Article 8 §24-a (Income Tax Prohibition)",
        url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.8.htm",
      },
      { label: "Tax Foundation — State Tax Climate Index", url: "https://taxfoundation.org/research/state-tax/" },
    ],
    related: ["texas-property-tax-guide", "what-local-governments-control", "how-texas-counties-spend"],
    cta: { label: "Estimate Your Property Tax", href: "/tax-calculator" },
  },
  "texas-attorney-general-powers": {
    updated: "2026-06-29",
    editorNote:
      "Part of our Texas civics series. See also our guide to the [Powers of the Texas Governor](/news/texas-governor-powers).",
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
      {
        label: "Texas Constitution Article 4 (Executive Department)",
        url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm",
      },
      {
        label: "Texas Government Code Chapter 402 (AG Duties)",
        url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.402.htm",
      },
    ],
    related: ["texas-governor-powers", "how-a-bill-becomes-texas-law", "texas-open-meetings-public-info"],
    cta: { label: "Meet Your Texas Representatives", href: "/representatives" },
  },
  "texas-governor-powers": {
    updated: "2026-07-02",
    editorNote:
      "Part of our Texas civics series. See also our guide to the [Powers of the Texas Attorney General](/news/texas-attorney-general-powers).",
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
      {
        label: "Texas Constitution Article 4 §1–§16 (Executive Department)",
        url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm",
      },
      {
        label: "Texas Legislative Reference Library — Governors of Texas",
        url: "https://lrl.texas.gov/legeLeaders/governors/",
      },
    ],
    related: ["texas-attorney-general-powers", "how-a-bill-becomes-texas-law", "texas-constitutional-amendments-guide"],
    cta: { label: "Meet Your Texas Representatives", href: "/representatives" },
  },

  "texas-border-policy-full-guide": {
    updated: "2026-06-27",
    editorNote:
      "This is a Keep TX Red pillar guide — updated June 2026 by our Border Bureau. We refresh it as Operation Lone Star deployments, federal litigation, and Rio Grande conditions change.",
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
      {
        q: "Is Operation Lone Star paid for with federal money?",
        a: "No. OLS is funded entirely with Texas state appropriations. Texas has formally requested federal reimbursement and has been denied.",
      },
      {
        q: "Can Texas legally arrest people for illegal entry?",
        a: "Texas argues yes, under SB4 and its sovereign self-defense authority. The federal government has challenged that position in court, and the litigation is ongoing.",
      },
      {
        q: "Does Texas operate its own border wall?",
        a: "Yes. The Texas Facilities Commission builds the state wall on private and state land, independent of the federal border wall.",
      },
      {
        q: "How many troopers and Guard members are deployed?",
        a: "OLS deployments have ranged from 5,000 to over 10,000 personnel at peak, including DPS, the Texas Military Department, and supporting agencies.",
      },
      {
        q: "Where does the Texas border actually run?",
        a: "From the New Mexico line at El Paso, along the Rio Grande, to the Gulf of Mexico at Boca Chica — 1,254 miles total.",
      },
    ],
    sources: [
      {
        label: "Office of the Texas Governor — Operation Lone Star",
        url: "https://gov.texas.gov/news/category/operation-lone-star",
      },
      { label: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/" },
      { label: "Texas Military Department", url: "https://tmd.texas.gov/" },
      { label: "Senate Bill 4 (88R)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=SB4" },
      {
        label: "U.S. Customs and Border Protection — Southwest Border Sectors",
        url: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters",
      },
    ],
    related: ["operation-lone-star", "border-security-state-role", "texas-border-geography-101"],
    cta: { label: "Contact Your Texas Legislators", href: "/contact-legislators" },
  },

  "texas-energy-economy-overview": {
    updated: "2026-06-27",
    editorNote:
      "This is a Keep TX Red pillar guide — updated June 2026 by our Energy Desk. The Texas energy economy moves fast; we refresh production figures, ERCOT reserve margins, and Railroad Commission rulings as they change.",
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
      {
        q: "How much oil does Texas produce?",
        a: "Roughly 5.5 to 6 million barrels per day from the Permian alone, plus material volumes from the Eagle Ford and other plays — about 43% of total U.S. crude production.",
      },
      {
        q: "Does Texas really have its own electric grid?",
        a: "Yes. ERCOT covers about 90% of Texas load and is deliberately separated from the Eastern and Western Interconnections so federal regulators have no jurisdiction.",
      },
      {
        q: "Who regulates oil and gas in Texas?",
        a: "The Railroad Commission of Texas — three statewide elected commissioners. It does not regulate railroads.",
      },
      {
        q: "Is Texas pro-renewable?",
        a: "Texas leads the country in installed wind capacity and is the top state for new utility-scale solar. Conservative policy in Austin favors 'all of the above' generation with firm dispatchable backup.",
      },
      {
        q: "How does energy fund Texas schools?",
        a: "Severance taxes and the Permanent School Fund — which holds mineral interests across the Permian — generate billions annually for K-12 education and the Rainy Day Fund.",
      },
    ],
    sources: [
      { label: "Railroad Commission of Texas", url: "https://www.rrc.texas.gov/" },
      { label: "ERCOT", url: "https://www.ercot.com/" },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/" },
      {
        label: "Texas Comptroller — Energy Industry",
        url: "https://comptroller.texas.gov/economy/economic-data/energy/",
      },
      {
        label: "U.S. Energy Information Administration — Texas State Profile",
        url: "https://www.eia.gov/state/?sid=TX",
      },
    ],
    related: ["permian-energy", "texas-grid-ercot-explained", "texas-energy-policy-guide"],
    cta: { label: "Browse Energy Coverage", href: "/news" },
  },

  "texas-voting-guide-2026": {
    updated: "2026-06-27",
    editorNote:
      "This is the Keep TX Red 2026 voting pillar guide — maintained year-round by our Elections Desk. We update it as deadlines, ID rules, and ballot dates change.",
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
            [
              "Lost or stolen",
              "Sign a Reasonable Impediment Declaration and present a supporting document (utility bill, paycheck, bank statement).",
            ],
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
      {
        q: "Can I register to vote online in Texas?",
        a: "No. You can update your existing registration's address online, but the initial registration must be filed on paper with your county voter registrar.",
      },
      {
        q: "Do I need to declare a party to vote in the primary?",
        a: "Texas does not have party registration. You declare a party only by picking that party's primary ballot on primary day — it then locks you into that party's runoff.",
      },
      {
        q: "How early can I vote?",
        a: "Early voting starts about 17 days before Election Day for the primary and the general election.",
      },
      {
        q: "What if my name is not on the rolls when I show up?",
        a: "Cast a provisional ballot. You then have six days to provide proof of eligibility to the county registrar.",
      },
      {
        q: "Can I take my kids to the polls?",
        a: "Yes. Texas law specifically permits voters to bring children under 18 into the voting booth.",
      },
    ],
    sources: [
      { label: "Texas Secretary of State — VoteTexas.gov", url: "https://www.votetexas.gov/" },
      { label: "Texas Secretary of State — My Voter Portal", url: "https://teamrv-mvp.sos.texas.gov/MVP/" },
      { label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.toc.htm" },
      {
        label: "DPS — Election Identification Certificate",
        url: "https://www.dps.texas.gov/section/driver-license/election-identification-certificate-eic",
      },
    ],
    related: ["texas-voter-registration-guide", "primary-vs-general-election", "beginners-guide-texas-elections"],
    cta: { label: "Find Your Polling Place", href: "/voting-locations" },
  },


  "speaker-special-session": {
    updated: "2026-06-23",
    intro: [
      "Rumors of a special session are hardening into expectation at the Capitol. Conservative caucus members have gone on the record saying they will not accept an adjournment sine die until hard appraisal caps for non-homestead property are codified alongside the compression package the House sent to the floor last week.",
      "The trigger is math, not politics. Even with $18 billion in compression on the table, homeowners in fast-growing suburban counties are still seeing double-digit taxable-value increases because the 10% homestead cap does not apply to rental properties, second homes, or commercial land — and those valuations are pulling the whole appraisal roll up with them.",
    ],
    sections: [
      {
        heading: "What the Caucus Is Actually Demanding",
        bullets: [
          "A statewide 5% appraisal cap on all real property, not just homesteads.",
          "A constitutional amendment locking the cap in so it cannot be reversed by a future legislature.",
          "Rate compression paired with cap reform, not offered as a substitute.",
          "A truth-in-taxation trigger that requires an automatic rollback election when a taxing unit exceeds the no-new-revenue rate by more than 2.5%.",
        ],
      },
      {
        heading: "Why Compression Alone Isn't Working",
        paragraphs: [
          "Compression buys down the school M&O rate, which is the largest line on any Texas tax bill. But every dollar of compression only holds if appraisal growth is contained. In counties like Collin, Denton, Williamson, and Hays, taxable values have grown faster than compression can offset — meaning bills go up even as rates go down.",
          "That dynamic is what caucus members mean when they say 'we are running on a treadmill.' Structural reform means bending the appraisal curve, not just the rate curve.",
        ],
      },
      {
        heading: "How a Special Session Would Work",
        paragraphs: [
          "Only the Governor can call a special session, and only the Governor sets the call — the list of subjects lawmakers may consider. A special session lasts up to 30 days. The Governor can call as many back-to-back as needed.",
          "If a session is called on property tax, expect the call to be tightly scoped: appraisal reform, revenue caps, and possibly a constitutional amendment for the November ballot. Broader agenda items — school choice expansion, border funding — would require separate calls.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "This is not a red-versus-blue fight. It is a fight inside the Republican supermajority between members who see compression as sufficient and members who see structural caps as the only durable answer. Local government associations are lobbying hard against both. That alignment — grassroots conservatives plus homeowners against city halls and appraisal district boards — is the same coalition that drove the 2019 Senate Bill 2 reforms.",
        ],
      },
    ],
    faq: [
      {
        q: "When would a special session start?",
        a: "The Governor typically calls a session within two to four weeks of the regular session ending, once the agenda has been negotiated with leadership. No formal call has been issued as of this report.",
      },
      {
        q: "Would appraisal caps require a constitutional amendment?",
        a: "Yes. The current 10% homestead cap is constitutional. Extending it to non-homestead property below the current statutory ceiling would require an amendment ratified by voters.",
      },
      {
        q: "Does a special session cost taxpayers extra?",
        a: "Special session costs are modest — mostly per diem for members and staff overtime — typically under $1 million per 30-day session.",
      },
      {
        q: "Can lawmakers vote on anything they want in a special?",
        a: "No. Members can only pass bills on subjects the Governor lists in the call. Anything outside the call is out of order.",
      },
    ],
    sources: [
      {
        label: "Texas Constitution Article III, Section 40",
        url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm",
      },
      {
        label: "Texas Comptroller — Property Tax Reports",
        url: "https://comptroller.texas.gov/taxes/property-tax/reports/",
      },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
    ],
    related: ["property-tax-relief-package", "texas-property-tax-guide", "how-a-bill-becomes-texas-law"],
    cta: { label: "Contact Your Legislator", href: "/contact-legislators" },
    keyTakeaways: [
      "A special session is increasingly likely if appraisal caps aren't paired with compression.",
      "Only the Governor can call a special and set the agenda.",
      "Structural cap reform likely requires a November constitutional amendment.",
      "The fight is intra-GOP, driven by suburban homeowners in fast-growing counties.",
    ],
  },

  "property-tax-relief-package": {
    updated: "2026-06-26",
    intro: [
      "The $18 billion property tax relief package heading to the House floor is the largest single tax cut in Texas history. It combines school district rate compression with an expanded homestead exemption and new caps on annual revenue growth for cities and counties.",
      "Here is what is actually in the bill, how much the average homeowner would save, and where the remaining points of friction sit as leadership pushes for a decisive vote.",
    ],
    sections: [
      {
        heading: "What's in the Package",
        bullets: [
          "$12.5 billion in school district Maintenance & Operations (M&O) rate compression.",
          "Homestead exemption raised from $100,000 to $140,000 of ISD taxable value.",
          "Franchise tax exemption raised to $2.7 million in annual revenue, removing tens of thousands of small businesses from the roll.",
          "3.5% revenue cap for cities and counties (down from 8% pre-2019).",
          "New non-homestead 20% appraisal cap for properties valued under $5 million.",
        ],
      },
      {
        heading: "What Homeowners Actually Save",
        table: {
          headers: ["Home Value", "Est. Annual Savings", "Est. 10-Year Savings"],
          rows: [
            ["$250,000", "~$780", "~$8,900"],
            ["$400,000", "~$1,240", "~$14,100"],
            ["$600,000", "~$1,820", "~$20,700"],
            ["$1,000,000", "~$3,100", "~$35,300"],
          ],
        },
      },
      {
        heading: "The Sticking Points",
        paragraphs: [
          "Two provisions are drawing the most late-stage negotiation. First, the non-homestead cap sunsets after ten years unless renewed; conservative members want it made permanent. Second, cities are pushing back on the 3.5% revenue trigger, arguing it forces automatic rollback elections during years of rapid population growth.",
          "Leadership has signaled willingness to extend the sunset to twenty years but is holding firm on the 3.5% cap.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texas is the only large state that funds its schools primarily through local property tax, with no state income tax to offset it. That structural choice — made explicit in the state constitution — is why property tax reform is always simultaneously a school finance fight. Every dollar of compression is a dollar the state must send to districts through the Foundation School Program to keep them whole. The package is affordable this session because Texas is running historic budget surpluses fed by oil, gas, and sales tax collections. Whether it stays affordable when the energy cycle turns is the durable question no one on either side wants to answer out loud.",
        ],
      },
    ],
    faq: [
      {
        q: "When does the relief take effect?",
        a: "If signed into law, changes apply to the tax year beginning January 1 of the following calendar year, showing up on bills mailed in October.",
      },
      {
        q: "Do I have to apply for the higher homestead exemption?",
        a: "No. If you already have a homestead on file, the increase applies automatically. If you don't, file Form 50-114 with your appraisal district — see our homestead guide.",
      },
      {
        q: "Does this cap what I owe forever?",
        a: "No. Compression reduces rates but does not freeze them. Local voters can still approve higher rates through tax rate elections.",
      },
      {
        q: "What about renters?",
        a: "Compression flows through to landlords, but there is no rent-control provision requiring the savings be passed on. Historical data suggests roughly 25-40% of commercial property tax savings reach renters through rent stabilization over 3-5 years.",
      },
    ],
    sources: [
      { label: "Legislative Budget Board — Fiscal Notes", url: "https://www.lbb.texas.gov/" },
      {
        label: "Texas Comptroller — Property Tax Assistance",
        url: "https://comptroller.texas.gov/taxes/property-tax/",
      },
    ],
    related: ["texas-property-tax-guide", "homestead-exemption-explained", "speaker-special-session"],
    cta: { label: "Estimate Your Savings", href: "/tax-calculator" },
    keyTakeaways: [
      "Largest single tax cut in Texas history at $18 billion.",
      "Combines rate compression, higher homestead exemption, and new caps.",
      "Average homeowner saves $780–$1,820 per year depending on home value.",
      "Long-term durability depends on continued budget surpluses.",
    ],
  },

  "operation-lone-star": {
    updated: "2026-06-26",
    intro: [
      "Texas Department of Public Safety and Texas Military Department have expanded buoy barriers and razor-wire fencing at three additional Rio Grande crossings this month, part of Operation Lone Star's continued build-out along the 1,254-mile border.",
      "Federal officials have again pushed back on the state footprint, but state leadership has cited both the Texas Constitution's Article I self-defense clause and Governor Abbott's 2022 border disaster declaration as authority for the expansion.",
    ],
    sections: [
      {
        heading: "What Expanded This Month",
        bullets: [
          "New 1,000-foot buoy string near Eagle Pass Sector Zone 3.",
          "6.2 additional miles of concertina wire installed by Texas National Guard engineers.",
          "Two new forward operating bases in Maverick and Val Verde counties.",
          "Additional 400 DPS troopers rotated in from interior counties.",
        ],
      },
      {
        heading: "The Federal Pushback",
        paragraphs: [
          "The Department of Justice has continued its position that state-installed physical barriers in the river channel encroach on federal navigable-waters authority. Texas has responded that the Rio Grande in the disputed segments is not navigable in the legal sense and that state action is authorized under Article I, Section 10 of the U.S. Constitution when a state faces invasion or imminent danger.",
          "That constitutional argument — long dormant — is now being tested in real time and will almost certainly land at the Supreme Court in the current or next term.",
        ],
      },
      {
        heading: "Cost and Manpower",
        table: {
          headers: ["Category", "FY 2024", "FY 2026 (Est.)"],
          rows: [
            ["DPS Personnel Deployed", "1,900", "2,600"],
            ["National Guard Deployed", "5,100", "6,400"],
            ["Miles of Barrier Installed", "108", "168"],
            ["State Appropriation", "$4.5B", "$6.3B"],
          ],
        },
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "No other state has attempted anything close to Operation Lone Star's scale. The closest historical parallel is not another border state — it is Texas itself, when the Texas Rangers stood up frontier defense in the 1870s absent effective federal presence. Whether the current constitutional theory survives Supreme Court review will define the balance of state and federal border authority for a generation.",
        ],
      },
    ],
    faq: [
      {
        q: "How much has Operation Lone Star cost so far?",
        a: "Cumulative state appropriations since 2021 exceed $14 billion, funded from state general revenue and a series of supplemental budget items.",
      },
      {
        q: "Can Texas legally place barriers in the Rio Grande?",
        a: "That is the pending legal question. Texas argues yes under state self-defense authority; the federal government argues no under the Rivers and Harbors Act. The Fifth Circuit has largely sided with Texas so far.",
      },
      {
        q: "Are National Guard troops federalized?",
        a: "No. They serve on state active duty under the Governor as commander-in-chief, which is why the state pays their salaries directly.",
      },
    ],
    sources: [
      { label: "Texas Governor — Operation Lone Star", url: "https://gov.texas.gov/operationlonestar" },
      { label: "Texas DPS — Border Security", url: "https://www.dps.texas.gov/" },
      {
        label: "U.S. Constitution Article I, Section 10",
        url: "https://constitution.congress.gov/constitution/article-1/",
      },
    ],
    related: ["border-security-state-role", "texas-political-terminology", "how-a-bill-becomes-texas-law"],
    cta: { label: "Read Our Border Coverage", href: "/news" },
    keyTakeaways: [
      "Operation Lone Star has expanded to 168 miles of barrier and 9,000+ personnel.",
      "State cost approaches $14 billion cumulative since 2021.",
      "Federal legal challenges continue; constitutional question is Supreme Court-bound.",
      "No comparable state-led border operation exists in modern U.S. history.",
    ],
  },

  "voter-id-surge": {
    updated: "2026-06-25",
    intro: [
      "New Secretary of State registration filings show double-digit percentage gains in voter rolls across the suburban counties that form the Republican 'red wall' outside Houston and Dallas–Fort Worth, driven by continued in-migration from higher-tax states and aggressive local registration drives.",
      "The numbers add real weight to the March 2026 primary. Precinct-level turnout modeling suggests the primary electorate in these counties will be 8–14% larger than 2024's high-water mark.",
    ],
    sections: [
      {
        heading: "Where Growth Is Concentrated",
        table: {
          headers: ["County", "New Registrations (YTD)", "% Change vs. 2024"],
          rows: [
            ["Montgomery", "+34,200", "+11.4%"],
            ["Collin", "+41,800", "+9.8%"],
            ["Denton", "+38,600", "+10.2%"],
            ["Williamson", "+27,900", "+12.1%"],
            ["Hays", "+14,300", "+13.7%"],
          ],
        },
      },
      {
        heading: "Who's Registering",
        paragraphs: [
          "Registration data doesn't record party in Texas — the state uses open primaries — but demographic overlays make the pattern legible. New registrants skew slightly older than the average voter, are more likely to own than rent, and cluster in master-planned communities that historically produce Republican primary majorities of 65% or higher.",
          "In-migration continues to be the largest single driver. Roughly 40% of new registrants in these counties list a prior address outside Texas.",
        ],
      },
      {
        heading: "What It Means for March",
        paragraphs: [
          "Higher registration doesn't automatically translate to higher turnout, but county party organizations across the red wall have paired registration drives with early-vote get-out-the-vote programs designed to bank ballots before Super Tuesday. The result should be a primary electorate that is larger, slightly older, and more concentrated in the suburbs than any modern Texas primary.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texas has quietly become the most consequential state in the country for how population growth reshapes an electorate. Roughly 1,300 people move to Texas every day, and where they land is redrawing the political map in real time — not by flipping counties but by amplifying already-red suburbs to numbers that swamp the state's slowly changing urban cores.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I register to vote in Texas?",
        a: "File a voter registration application with your county elections office at least 30 days before the election. See our register-to-vote guide for step-by-step instructions.",
      },
      {
        q: "Does Texas have partisan registration?",
        a: "No. Any registered voter can pull either primary ballot on primary election day. You are 'affiliated' with that party only through the current election cycle.",
      },
      {
        q: "When is the 2026 primary?",
        a: "The Texas primary is scheduled for March 3, 2026, with early voting typically running the two weeks prior.",
      },
      {
        q: "Do I need photo ID to vote?",
        a: "Yes. Texas requires one of seven forms of acceptable photo ID at the polls, with a reasonable-impediment declaration process for voters without ID.",
      },
    ],
    sources: [
      { label: "Texas Secretary of State — Elections", url: "https://www.sos.state.tx.us/elections/" },
      { label: "Texas Election Code Chapter 13", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.13.htm" },
    ],
    related: ["school-board-elections", "primary-vs-general-election", "how-to-register-and-vote"],
    cta: { label: "Register to Vote", href: "/register-to-vote" },
    keyTakeaways: [
      "Red-wall suburban counties are posting 10%+ registration gains for 2026.",
      "In-migration accounts for ~40% of new registrations.",
      "March 2026 primary electorate could be 8–14% larger than 2024.",
      "Population growth is reshaping Texas politics faster than any single election.",
    ],
  },

  "school-board-elections": {
    updated: "2026-06-24",
    intro: [
      "Parental rights coalitions have qualified slates of candidates for school board races in 87 independent school districts across Texas ahead of the May uniform election, part of a multi-cycle push to reshape district governance from the ground up.",
      "Local school board elections in Texas are among the lowest-turnout races on any ballot — often decided by fewer than a thousand votes — which means organized, informed participation is disproportionately powerful.",
    ],
    sections: [
      {
        heading: "What School Boards Actually Control",
        bullets: [
          "Adopting the annual district budget and setting the M&O tax rate.",
          "Hiring and firing the superintendent.",
          "Approving curriculum, library collections, and instructional materials.",
          "Setting district policy on discipline, athletics, and parental notification.",
          "Calling and administering bond elections.",
        ],
      },
      {
        heading: "Where the Slates Are Running",
        paragraphs: [
          "The 87 districts skew suburban — Cypress-Fairbanks, Katy, Frisco, Prosper, Round Rock, Leander, Northwest, and Grapevine-Colleyville among the largest — but also include a growing number of rural districts where parents have organized around specific curriculum or library disputes.",
          "The most consistent policy planks: instructional transparency (curriculum posted online), library review procedures, opt-in rather than opt-out parental notification, and no closed-door executive sessions on curriculum matters.",
        ],
      },
      {
        heading: "How to Evaluate a Candidate",
        bullets: [
          "Do they publish a specific policy platform, or vague slogans?",
          "Have they attended board meetings before running?",
          "Do they understand the difference between M&O and I&S tax rates?",
          "Have they read the district's current strategic plan?",
          "Who is funding their campaign — local parents or out-of-district PACs on either side?",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texas' 1,024 independent school districts collectively spend more than the state's entire general revenue budget. Every district is governed by a locally elected board — no state authority sets curriculum, staffing, or spending decisions once the ISD is funded. That local control is why school board elections are the single most consequential ballot most Texans will ever vote on.",
        ],
      },
    ],
    faq: [
      {
        q: "When are Texas school board elections?",
        a: "Most are held on the May uniform election date, typically the first Saturday in May. Some districts moved to November after a 2019 change in state law.",
      },
      {
        q: "How many seats are up in each district?",
        a: "Most Texas ISDs use staggered three-year terms, with roughly one-third of the board on the ballot each cycle.",
      },
      {
        q: "Can I run for my school board?",
        a: "Yes, if you are a U.S. citizen at least 18 years old, a registered voter in the district, and have lived in the district for at least six months and Texas for at least a year.",
      },
      {
        q: "Where do I find candidate information?",
        a: "Your county elections office publishes the sample ballot; most districts also post candidate applications and campaign finance filings on the district website.",
      },
    ],
    sources: [
      { label: "Texas Education Agency", url: "https://tea.texas.gov/" },
      { label: "Texas Association of School Boards", url: "https://www.tasb.org/" },
      { label: "Texas Election Code Chapter 41", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.41.htm" },
    ],
    related: ["school-choice-esa-guide", "voter-id-surge", "primary-vs-general-election"],
    cta: { label: "Find Your Ballot", href: "/voting-locations" },
    keyTakeaways: [
      "87 Texas ISDs have organized parental-rights candidate slates for May.",
      "School boards control curriculum, budget, superintendent, and tax rate.",
      "Turnout is historically low — every vote is amplified.",
      "Texas has 1,024 ISDs, each independently governed.",
    ],
  },

  "isd-tax-burdens": {
    updated: "2026-06-22",
    intro: [
      "Our review of Texas Education Agency (TEA) and Comptroller filings identified the ten counties where homeowners paid the steepest independent school district Maintenance & Operations (M&O) tax rates in 2024 — the year that most directly precedes the current relief package debate.",
      "The pattern is not what most Texans expect. It is not the biggest urban districts driving the top of the list; it is a mix of fast-growing suburban counties and rural counties with small property tax bases relative to enrollment.",
    ],
    sections: [
      {
        heading: "The Ten Highest ISD M&O Rates (2024)",
        table: {
          headers: ["Rank", "County", "Weighted ISD M&O Rate"],
          rows: [
            ["1", "Fort Bend", "$0.9871"],
            ["2", "Denton", "$0.9846"],
            ["3", "Collin", "$0.9812"],
            ["4", "Williamson", "$0.9788"],
            ["5", "Comal", "$0.9754"],
            ["6", "Hays", "$0.9721"],
            ["7", "Kaufman", "$0.9698"],
            ["8", "Rockwall", "$0.9662"],
            ["9", "Parker", "$0.9631"],
            ["10", "Montgomery", "$0.9604"],
          ],
        },
      },
      {
        heading: "Why These Counties Top the List",
        paragraphs: [
          "Every county in the top ten is either a suburban growth county or a fast-growing exurb. The common thread is enrollment growth outpacing appraisal roll growth — meaning districts have to run higher rates to fund the same per-pupil spending as slower-growing peers.",
          "The compression package heading to the floor would push every one of these rates below $0.90, effectively erasing the gap between fast-growing districts and stable ones.",
        ],
      },
      {
        heading: "What This Means for Homeowners",
        paragraphs: [
          "A homeowner in Fort Bend County with a $450,000 taxable value paid roughly $4,442 in ISD M&O tax in 2024 alone — before county, city, and MUD taxes. Under the proposed compression, that same home would pay approximately $3,825, a $617 annual reduction from a single line item on the bill.",
          "The compounding effect over a decade — combined with a higher homestead exemption and the proposed 20% non-homestead cap — meaningfully changes the affordability picture in exactly the counties where housing costs have grown fastest.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "This ranking is a stress test for the constitutional promise of 'efficient' school funding. When suburban homeowners are paying a materially higher effective tax rate than urban homeowners for equivalent education services, the recapture (Robin Hood) and Foundation School Program formulas are doing part of what the constitution asks — but the compression debate is fundamentally about whether they're doing enough.",
        ],
      },
    ],
    faq: [
      {
        q: "What is an M&O tax rate?",
        a: "Maintenance & Operations — the portion of an ISD tax rate that funds day-to-day district operations. It is distinct from the Interest & Sinking (I&S) rate that services bond debt.",
      },
      {
        q: "How is a 'weighted' rate calculated?",
        a: "We weighted each ISD's rate by its share of the county's total taxable value, giving a per-county number that reflects what an average homeowner actually paid.",
      },
      {
        q: "Where does the M&O money go?",
        a: "By law, only into district operating expenses — salaries, curriculum, transportation, utilities. Bond-funded capital projects come from the separate I&S rate.",
      },
    ],
    sources: [
      { label: "Texas Education Agency — Financial Data", url: "https://tea.texas.gov/finance-and-grants" },
      {
        label: "Texas Comptroller — School District Property Values",
        url: "https://comptroller.texas.gov/taxes/property-tax/",
      },
    ],
    related: ["texas-property-tax-guide", "property-tax-relief-package", "appraisal-protest-playbook"],
    cta: { label: "Estimate Your Bill", href: "/tax-calculator" },
    keyTakeaways: [
      "Fast-growing suburban counties top the ISD tax burden list.",
      "Fort Bend, Denton, Collin, and Williamson lead the state.",
      "Compression would materially narrow the suburban-vs-urban gap.",
      "M&O rate is only one line of the total property tax bill.",
    ],
  },

  "permian-energy": {
    updated: "2026-06-21",
    intro: [
      "Permian Basin oil production hit a record 6.1 million barrels per day in the latest Texas Railroad Commission filings, extending West Texas's run as the single largest producing region in the world outside Saudi Arabia's core fields.",
      "The milestone comes as operators continue to warn that the current pace of federal permitting review, methane rule updates, and Bureau of Land Management leasing pauses threaten the reinvestment cycle that keeps the basin at record output.",
    ],
    sections: [
      {
        heading: "The Numbers",
        bullets: [
          "6.1 million barrels per day of crude oil production.",
          "Approximately 25 billion cubic feet per day of associated natural gas.",
          "Roughly 40% of all U.S. oil production originates in the Permian.",
          "$14.7 billion in Texas severance tax collections from oil and gas in the last fiscal year.",
          "Direct and indirect employment estimated at 380,000+ Texas jobs.",
        ],
      },
      {
        heading: "What Operators Are Warning About",
        paragraphs: [
          "The most immediate concern is not the price deck — it is the regulatory calendar. Federal permitting timelines have extended materially over the last two years, and new EPA methane rules require capital retrofits at existing sites that operators say are being finalized faster than equipment supply chains can deliver.",
          "Because roughly 25% of Permian acreage sits on federal land in southeastern New Mexico, federal leasing decisions have an outsized effect on planning even for operators whose primary footprint is on Texas fee land.",
        ],
      },
      {
        heading: "Why the Permian Matters Beyond Texas",
        paragraphs: [
          "The Permian is now the marginal barrel setter for the global oil market. When Permian production grows, OPEC has to accommodate; when it flattens, global prices tighten. That dynamic makes the basin a de facto instrument of U.S. energy security and foreign policy, whether Washington acknowledges it or not.",
          "It is also a fiscal cornerstone for Texas. Severance tax funds the Economic Stabilization Fund (the 'Rainy Day Fund'), the Permanent School Fund, and the state highway fund — meaning every reinvestment cycle in West Texas quietly funds classrooms and roads statewide.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texans have subsidized the rest of the country's energy transition for a decade — not through political statements but through infrastructure and capital. The state's grid, pipelines, storage, and workforce are the substrate for both hydrocarbons and the massive wind, solar, and battery buildout in the same counties. Losing the reinvestment cycle in one hurts the buildout of the other.",
        ],
      },
    ],
    faq: [
      {
        q: "How big is the Permian Basin?",
        a: "About 86,000 square miles across West Texas and southeastern New Mexico — roughly the size of South Dakota.",
      },
      {
        q: "Who regulates Permian production?",
        a: "The Texas Railroad Commission regulates oil and gas within Texas. Federal agencies (BLM, EPA) regulate federal-land production and interstate emissions rules.",
      },
      {
        q: "How much of Texas' budget comes from oil and gas?",
        a: "Directly, roughly 12–15% of state general revenue through severance and sales tax on oilfield services. Indirectly, considerably more when downstream industries are counted.",
      },
    ],
    sources: [
      { label: "Texas Railroad Commission", url: "https://www.rrc.texas.gov/" },
      { label: "EIA — Permian Basin Data", url: "https://www.eia.gov/petroleum/drilling/" },
      { label: "Texas Comptroller — Severance Tax", url: "https://comptroller.texas.gov/economy/economic-data/" },
    ],
    related: ["texas-grid-ercot-explained", "texas-property-tax-guide", "how-a-bill-becomes-texas-law"],
    cta: { label: "Read Our Energy Coverage", href: "/news" },
    keyTakeaways: [
      "Permian output hit a record 6.1 million barrels per day.",
      "Federal permitting and methane rules are the leading industry concerns.",
      "Severance tax funds Texas schools, roads, and the Rainy Day Fund.",
      "The Permian is the marginal barrel setter for global oil markets.",
    ],
  },

  "constitutional-carry-one-year-later": {
    updated: "2026-06-12",
    intro: [
      "House Bill 1927 — Texas' 'constitutional carry' law — took effect September 1, 2021, allowing eligible Texans 21 and older to carry a handgun in most public places without a state-issued License to Carry (LTC).",
      "Several years in, the law has settled into a workable framework, but a handful of common misconceptions still trip up otherwise law-abiding gun owners. Here is what the statute actually says, where you still cannot carry, and how reciprocity works when you cross state lines.",
    ],
    sections: [
      {
        heading: "Who Is Eligible",
        bullets: [
          "At least 21 years old.",
          "Legally allowed to possess a firearm under state and federal law.",
          "Not subject to a protective order, active felony indictment, or certain misdemeanor convictions from the past five years.",
          "Not intoxicated at the time of carry.",
        ],
      },
      {
        heading: "Where You Still Cannot Carry",
        bullets: [
          "Schools (K–12 campuses, buses, and school-sponsored events).",
          "Polling places on election day and during early voting.",
          "Courtrooms and courthouse offices used by courts.",
          "Racetracks.",
          "Secured airport areas past TSA screening.",
          "Bars deriving 51%+ of revenue from on-premise alcohol sales (posted with the red '51%' sign).",
          "Any private property whose owner posts compliant 30.06/30.07 signage prohibiting carry.",
        ],
      },
      {
        heading: "Why the LTC Still Matters",
        paragraphs: [
          "Constitutional carry did not eliminate the License to Carry — it made it optional. The LTC still provides real advantages: statutory reciprocity with roughly 37 other states, expedited background checks on retail purchases, and access to certain federal buildings and school-adjacent property under federal law.",
          "For frequent travelers, the LTC remains the practical choice.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texas was late to constitutional carry by conservative-state standards — Arizona had it since 2010, and by 2021 more than twenty states already permitted it. What Texas added was scale: HB 1927 brought roughly 22 million adults into a permitless-carry framework overnight, more than doubled the total U.S. population living under such a regime, and reset the political conversation on carry policy nationally.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I have to notify police I'm carrying?",
        a: "No. Texas law does not require you to volunteer that you are carrying, though most instructors recommend calmly informing an officer during a traffic stop.",
      },
      {
        q: "Can I carry in my car without a license?",
        a: "Yes. Texas has allowed licensed and unlicensed adults to carry a handgun in their private vehicle for years, provided they are not otherwise prohibited.",
      },
      {
        q: "Does my Texas LTC work in other states?",
        a: "Yes, in the roughly 37 states with formal reciprocity. Check each state before traveling — a few states honor the LTC but impose their own carry restrictions.",
      },
      {
        q: "Can a business ban carry?",
        a: "Yes. A private property owner may prohibit carry by posting compliant 30.06 (LTC) or 30.07 (open carry) signage. Ignoring proper signage is a criminal offense.",
      },
    ],
    sources: [
      { label: "Texas Penal Code Chapter 46", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.46.htm" },
      { label: "Texas DPS — License to Carry", url: "https://www.dps.texas.gov/rsd/ltc/" },
    ],
    related: ["how-a-bill-becomes-texas-law", "texas-political-terminology", "texas-constitutional-amendments-guide"],
    cta: { label: "Explore Texas Laws", href: "/laws" },
    keyTakeaways: [
      "HB 1927 lets eligible adults 21+ carry without a state permit.",
      "Schools, courtrooms, polling places, and 51% bars remain off-limits.",
      "The LTC is optional but still useful for reciprocity and expedited purchases.",
      "Texas doubled the U.S. population under permitless carry overnight.",
    ],
  },

  "school-choice-esa-guide": {
    updated: "2026-06-05",
    intro: [
      "Texas' Education Savings Account (ESA) program is the largest school choice expansion in state history, giving eligible families access to state funds they can direct to private tuition, tutoring, curriculum, therapy, and testing services.",
      "This guide walks through how the program actually works, who qualifies, what expenses are covered, and the application timeline every parent should mark before the fall enrollment window.",
    ],
    sections: [
      {
        heading: "How the ESA Works",
        bullets: [
          "Eligible students receive a per-pupil allotment set by statute, deposited into a state-administered account.",
          "Funds may be spent on approved education expenses from a state-published vendor list.",
          "Unused funds roll forward each year and can be saved for later education costs.",
          "Families must renew eligibility annually.",
        ],
      },
      {
        heading: "Who Qualifies",
        paragraphs: [
          "The program is broadly eligible in its first years: any Texas resident student aged 5–17 who is eligible to attend a public school. Priority is given in the initial enrollment tiers to students from low-income households, students with disabilities, and students zoned to underperforming campuses.",
          "Once priority tiers are seated, remaining slots are filled by lottery from the general applicant pool.",
        ],
      },
      {
        heading: "What You Can Spend On",
        bullets: [
          "Tuition and fees at an approved private school.",
          "Curriculum and instructional materials.",
          "Tutoring from a certified tutor.",
          "Therapy services for students with disabilities (speech, OT, PT, ABA).",
          "Testing fees (AP, SAT/ACT, industry certifications).",
          "Educational technology from the approved vendor list.",
        ],
      },
      {
        heading: "Application Timeline",
        table: {
          headers: ["Milestone", "Window"],
          rows: [
            ["Application portal opens", "Early spring (annually)"],
            ["Priority application deadline", "Late spring"],
            ["Award notifications", "Early summer"],
            ["Vendor selection and enrollment", "Summer"],
            ["Funds available for use", "By start of fall term"],
          ],
        },
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texas came to ESAs later than many red states but arrived with the largest per-pupil funding and broadest expense eligibility of any comparable program. Combined with the state's booming private and micro-school sector, the ESA program is likely to produce more measurable data on parental choice than any previous experiment in the country.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I use ESA funds for homeschool?",
        a: "Yes, for curriculum, tutoring, and testing expenses. ESA funds cannot pay a parent for teaching their own child.",
      },
      {
        q: "Does using an ESA affect my public school enrollment?",
        a: "Yes. Accepting an ESA means the student is not simultaneously enrolled in a traditional public school. You can return to public school in a future year.",
      },
      {
        q: "Is the ESA award taxable?",
        a: "No. ESA funds used for qualified education expenses are not treated as taxable income.",
      },
      {
        q: "What if my private school costs more than the ESA?",
        a: "You pay the difference out of pocket. Some private schools offer additional financial aid that stacks on top of the ESA.",
      },
    ],
    sources: [
      { label: "Texas Education Agency — School Choice", url: "https://tea.texas.gov/" },
      { label: "Texas Comptroller — Education Programs", url: "https://comptroller.texas.gov/" },
    ],
    related: ["school-board-elections", "how-a-bill-becomes-texas-law", "texas-political-terminology"],
    cta: { label: "Read Our Education Coverage", href: "/news" },
    keyTakeaways: [
      "Largest school choice expansion in Texas history.",
      "Priority tiers favor low-income, disabled, and zoned-to-underperforming students.",
      "Funds cover tuition, tutoring, curriculum, therapy, and testing.",
      "Applications open in early spring; funds available by fall term.",
    ],
  },

  "appraisal-protest-playbook": {
    updated: "2026-06-05",
    intro: [
      "Every spring, Texas homeowners receive a Notice of Appraised Value from their County Appraisal District — and every year, most homeowners either ignore it or file a protest they aren't prepared to win.",
      "This is the practical playbook: the deadlines, the evidence packet, the equal-and-uniform comparables argument, and the script that actually works in an Appraisal Review Board (ARB) hearing.",
    ],
    sections: [
      {
        heading: "The Deadlines That Matter",
        bullets: [
          "Notices mailed: April 1 – May 15.",
          "Protest deadline: May 15 or 30 days after your notice is mailed, whichever is later.",
          "Informal hearing: typically 2–6 weeks after protest filing.",
          "Formal ARB hearing: scheduled if informal doesn't resolve it, generally June–August.",
          "Judicial appeal deadline: 60 days after ARB order.",
        ],
      },
      {
        heading: "Build Your Evidence Packet",
        bullets: [
          "3–5 sales comps within one mile from the last 12 months, similar square footage and age.",
          "3–5 equity comps: neighboring properties similar to yours with lower appraised values (the equal-and-uniform argument).",
          "Photos of any condition issues — foundation cracks, roof damage, deferred maintenance.",
          "A repair estimate from a licensed contractor for any documented issues.",
          "Your closing disclosure if you purchased within the last 24 months, especially if you paid below the CAD's value.",
        ],
      },
      {
        heading: "The Equal-and-Uniform Argument",
        paragraphs: [
          "Texas Tax Code §41.43(b)(3) allows a protest based on 'equal and uniform' taxation — meaning your property must not be appraised at a materially higher value than similar properties in your area, regardless of what market value data says.",
          "This is often the strongest argument for homeowners in built-out neighborhoods where the CAD has under-appraised some homes and over-appraised others. If you can identify 4–5 truly comparable properties appraised lower than yours, the ARB is required to consider a reduction.",
        ],
      },
      {
        heading: "The Hearing Script",
        bullets: [
          "Open with the specific value you are requesting — not just 'lower.'",
          "Present sales comps first, then equity comps.",
          "Address condition issues with photos and estimates.",
          "Ask the appraiser presenting for the district to identify each comp they used and whether any were foreclosures or non-arm's-length sales.",
          "Close by restating your requested value and the specific section of Tax Code §41.43 you're relying on.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "Texas is one of the only states where every homeowner has an annual right to challenge their own tax bill — and where the burden of proof shifts to the appraisal district once the taxpayer presents credible evidence. Not exercising that right is leaving money on the table every single year.",
        ],
      },
    ],
    faq: [
      {
        q: "Does protesting hurt my property value?",
        a: "No. Appraised value for tax purposes is separate from market value in a sale, and buyers do not have access to your protest history.",
      },
      {
        q: "Should I use a protest company?",
        a: "For high-value or complex properties, a licensed property tax consultant can add value. For a typical homestead, a well-prepared homeowner routinely wins without one.",
      },
      {
        q: "What if the ARB denies my protest?",
        a: "You can appeal to district court, to binding arbitration, or to the State Office of Administrative Hearings, depending on property type and value.",
      },
      {
        q: "Can I protest every year?",
        a: "Yes. Every year is a new tax year and a new appraisal — every year is a new right to protest.",
      },
    ],
    sources: [
      { label: "Texas Tax Code Chapter 41", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.41.htm" },
      {
        label: "Texas Comptroller — Property Tax Protests",
        url: "https://comptroller.texas.gov/taxes/property-tax/protests/",
      },
    ],
    related: ["texas-property-tax-guide", "homestead-exemption-explained", "county-appraisal-districts-explained"],
    cta: { label: "Estimate Your Bill", href: "/tax-calculator" },
    keyTakeaways: [
      "Protest deadline is May 15 or 30 days after your notice.",
      "Equal-and-uniform is often the strongest argument in built-out neighborhoods.",
      "The burden of proof shifts to the CAD once you present credible evidence.",
      "You have the right to protest every year — use it.",
    ],
  },

  "texas-grid-ercot-explained": {
    updated: "2026-05-27",
    intro: [
      "Texas is the only state in the continental United States that runs its own electric grid. The Electric Reliability Council of Texas (ERCOT) manages roughly 90% of the state's electric load, operating almost entirely inside state borders and outside the jurisdiction of the Federal Energy Regulatory Commission (FERC).",
      "That independence is why Texans set their own reliability rules, absorb the political heat when the grid strains, and retain policy flexibility that no other state has. Here is what ERCOT actually does, what the Public Utility Commission (PUC) actually controls, and why the state has doubled down on independence after the 2021 winter storm.",
    ],
    sections: [
      {
        heading: "Who Does What",
        bullets: [
          "ERCOT: real-time grid operator — balances supply and demand every five minutes.",
          "Public Utility Commission of Texas (PUC): sets market rules, reliability standards, and rates for regulated utilities.",
          "Texas Legislature: passes structural reforms and appropriates funds like the Texas Energy Fund.",
          "Generators: private companies that own and operate power plants.",
          "Transmission and Distribution Utilities (TDUs): own the poles and wires that deliver power.",
        ],
      },
      {
        heading: "Why Texas Runs Its Own Grid",
        paragraphs: [
          "The historical answer is federalism: interconnecting substantively with neighboring grids would subject ERCOT to FERC jurisdiction, giving federal regulators authority over generation buildout, rate design, and market structure inside Texas. The practical answer is that Texas has the resource base to be self-sufficient — abundant natural gas, world-leading wind, fast-growing solar, and a competitive market that has attracted more generation investment than any other state.",
          "Keeping the seam with the Eastern and Western Interconnections limited preserves state-level control over every one of those decisions.",
        ],
      },
      {
        heading: "Reforms Since 2021",
        bullets: [
          "Mandatory weatherization for gas and electric infrastructure.",
          "New reliability standards including a Dispatchable Reliability Reserve Service.",
          "The Texas Energy Fund — low-cost state loans for dispatchable generation.",
          "Market redesign incentivizing on-demand power alongside intermittent renewables.",
          "Improved communication protocols between the gas system and the electric grid.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "The 2021 winter storm cost Texas roughly $130 billion and 200+ lives — a catastrophic reliability failure that federal integration would not have prevented and might have worsened by removing state authority to force the reforms since enacted. Texas' answer since has been to keep the grid independent, tighten the rules, and pay directly for the reliability investment. That approach is under continuous stress-test every summer peak and every winter cold snap.",
        ],
      },
    ],
    faq: [
      {
        q: "Does ERCOT set my electric rate?",
        a: "No. Your rate is set by your retail electric provider in deregulated areas, or by your municipal utility or co-op in regulated areas.",
      },
      {
        q: "Can Texas 'join' the national grid?",
        a: "It could increase interconnections technically, but doing so at scale would trigger FERC jurisdiction — which is why the state has consistently opted against it.",
      },
      {
        q: "Who pays for reliability reforms?",
        a: "A mix of ratepayers, generators, and state general revenue (through the Texas Energy Fund). The exact allocation is set by the PUC and Legislature.",
      },
      {
        q: "Is the grid more reliable now?",
        a: "Objectively yes on winter preparation; the summer picture depends on how quickly new dispatchable generation comes online relative to load growth.",
      },
    ],
    sources: [
      { label: "ERCOT", url: "https://www.ercot.com/" },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/" },
      { label: "Texas Energy Fund", url: "https://www.puc.texas.gov/agency/resources/reports/TEF.aspx" },
    ],
    related: ["permian-energy", "how-a-bill-becomes-texas-law", "texas-political-terminology"],
    cta: { label: "Read Our Energy Coverage", href: "/news" },
    keyTakeaways: [
      "Texas runs the only state-level grid in the lower 48.",
      "Independence preserves state control over generation, market, and reliability rules.",
      "Post-2021 reforms include weatherization, reserves, and the Texas Energy Fund.",
      "Reliability is a continuous stress-test at every seasonal peak.",
    ],
  },

  "border-security-state-role": {
    updated: "2026-05-27",
    intro: [
      "Operation Lone Star has crystallized a constitutional question the country hasn't seriously litigated in more than a century: what authority does a state have to defend its own border when the federal government won't?",
      "This guide walks through how Texas DPS, the Texas Military Department, and county sheriffs actually coordinate along the Rio Grande — and the constitutional case the state has made for acting when Washington has declined to act.",
    ],
    sections: [
      {
        heading: "Who Does What",
        bullets: [
          "Texas Department of Public Safety (DPS): highway interdiction, criminal investigations, arrests under state law.",
          "Texas Military Department (National Guard + State Guard): observation posts, physical barrier installation, engineering support.",
          "Texas Parks & Wildlife Game Wardens: river patrol in remote sectors.",
          "County Sheriffs: local arrests, jail intake, coordination with local judges.",
          "Texas Rangers: complex criminal cases including smuggling and trafficking prosecutions.",
        ],
      },
      {
        heading: "The Constitutional Argument",
        paragraphs: [
          "Article I, Section 10 of the U.S. Constitution generally prohibits states from engaging in war, but contains an explicit carve-out: states may act 'when actually invaded, or in such imminent Danger as will not admit of delay.' Texas' formal position, reflected in Governor Abbott's 2022 disaster declaration and subsequent statements, is that the scale of unlawful entry over recent years meets that standard.",
          "Federal courts — particularly the Fifth Circuit — have so far declined to enjoin the state's core border operations. The Supreme Court has weighed in on razor-wire and buoy cases with narrow holdings that have generally preserved state authority pending fuller litigation.",
        ],
      },
      {
        heading: "Cost and Scale",
        paragraphs: [
          "Since 2021, Texas has appropriated more than $14 billion cumulatively for border-related operations — a state expenditure with no modern precedent. That funding covers salaries, equipment, barrier construction, jail bed rentals for state charges, and grants to border counties for prosecution and infrastructure.",
          "The state has also built a network of processing centers and cooperative agreements with roughly two dozen upstream states through the Interstate Compact for Border Security.",
        ],
      },
      {
        heading: "The Texas Angle",
        paragraphs: [
          "The closest historical parallel to Operation Lone Star is not another state's border operation — it is Texas' own frontier era, when Texas Rangers stood up structured defense of the frontier in the absence of federal presence. Whether the modern iteration survives Supreme Court review will define the boundary between state and federal border authority for a generation of Americans.",
        ],
      },
    ],
    faq: [
      {
        q: "Can Texas arrest people for federal immigration offenses?",
        a: "Not directly. The state's arrest authority is grounded in Texas criminal statutes — trespass, smuggling, and related offenses — not federal immigration law.",
      },
      {
        q: "Are National Guard troops federalized?",
        a: "No. They serve on state active duty under the Governor. The state pays their salaries and directs their deployment.",
      },
      {
        q: "Do border counties agree with Operation Lone Star?",
        a: "Broadly yes among sheriffs and county leadership on the Texas side; specific tactics (barrier placement, prosecution volume) generate ongoing local debate.",
      },
    ],
    sources: [
      { label: "Texas Governor — Operation Lone Star", url: "https://gov.texas.gov/operationlonestar" },
      { label: "Texas DPS", url: "https://www.dps.texas.gov/" },
      {
        label: "U.S. Constitution Article I, Section 10",
        url: "https://constitution.congress.gov/constitution/article-1/",
      },
    ],
    related: ["operation-lone-star", "how-a-bill-becomes-texas-law", "texas-political-terminology"],
    cta: { label: "Read Our Border Coverage", href: "/news" },
    keyTakeaways: [
      "Texas coordinates DPS, the Guard, game wardens, and sheriffs along the Rio Grande.",
      "The state's authority rests on the Constitution's 'invasion' clause.",
      "Cumulative state cost exceeds $14 billion since 2021.",
      "Supreme Court review will define the modern federal-state border boundary.",
    ],
  },
  "texas-gun-laws-explained": {
    updated: "2026-07-15",
    intro: [
      "Texas has among the most permissive firearm statutes in the country, but 'Texas gun laws' is a shorthand that hides a real amount of nuance — federal purchase rules apply the same way here as anywhere else, certain places are still off-limits regardless of what you're carrying, and the private-property owner's right to post a firearm notice remains fully enforceable. This guide walks every Texas resident through the framework: who can own, who can carry, where you can't, and what changed after House Bill 1927 made Texas a constitutional-carry state in 2021.",
      "The audience for this guide is broad on purpose. First-time buyers moving into a Houston or DFW suburb, longtime hunters in East Texas trying to make sense of the new License to Carry rules, and out-of-state residents wondering whether their permit is honored here will all find the answers below. For a companion piece focused specifically on the enabling statute, read [Constitutional Carry in Texas](/news/constitutional-carry-one-year-later).",
    ],
    sections: [
      {
        heading: "The Legal Framework: State Statute on Top of Federal Law",
        paragraphs: [
          "Texas firearm law lives primarily in Chapter 46 of the Penal Code and Subchapter H of Chapter 411 of the Government Code, layered on top of the federal Gun Control Act of 1968 and the National Firearms Act. That layering matters: even when Texas law permits a specific behavior, federal prohibitions on possession by felons, unlawful drug users, adjudicated mental defectives, and those subject to certain protective orders continue to apply. Nothing at the state level overrides those.",
          "The Texas Constitution's Article I, Section 23 guarantees the right to keep and bear arms 'in the lawful defense of himself or the State,' with the Legislature retaining power to 'regulate the wearing of arms, with a view to prevent crime.' Courts have historically read that clause as protecting individual ownership while allowing reasonable place-and-manner restrictions.",
        ],
      },
      {
        heading: "Who Can Legally Own a Firearm in Texas",
        paragraphs: [
          "Under federal law, a licensed dealer (FFL) must run every buyer through the NICS background check. Texas has no state waiting period, no permit-to-purchase, no registry, and no assault-weapons list. Once NICS returns a proceed, the sale completes the same day.",
          "Federal prohibited persons categories still apply: felony conviction, misdemeanor domestic violence conviction, active protective order for family violence, dishonorable discharge, illegal drug use (including state-legal marijuana under federal classification), and adjudicated mental illness with commitment. Texas adds a few of its own: someone under a Chapter 411 or Chapter 46 disability, or a minor in most cases.",
          "Private, in-state, person-to-person sales between two Texas residents are legal without a background check, provided the seller does not have reasonable cause to believe the buyer is prohibited. Serious sellers still route private sales through an FFL for a modest fee — it's the cleanest paper trail if the firearm is ever traced.",
        ],
      },
      {
        heading: "Age Requirements — Federal Floor, Texas Ceiling",
        paragraphs: [
          "Federal law sets the floor: 18 to purchase a long gun from an FFL, 21 to purchase a handgun from an FFL. Private long-gun sales to those 18 and over are permitted; private handgun sales to those under 21 are federally prohibited.",
          "Texas layers on the carry age: constitutional carry and the License to Carry both require you to be 21, with a narrow exception for active-duty and honorably discharged military members who may qualify at 18. Long-gun carry in most public contexts does not require a permit at any age but is limited by federal age of purchase.",
        ],
      },
      {
        heading: "Constitutional Carry: What HB 1927 Actually Did",
        paragraphs: [
          "In September 2021, HB 1927 removed the License to Carry requirement for Texans 21 and older who are not otherwise prohibited from possessing a firearm. Since then, an eligible Texan may carry a handgun openly in a holster or concealed on the person in most public places without any state-issued permit.",
          "'Constitutional carry' did not repeal the LTC — it made it optional. Many Texans still get the license because it unlocks reciprocity with 37 other states, waives the NICS check on future purchases in Texas, and provides an affirmative defense in specific location-based prosecutions. For anyone who travels or crosses state lines regularly, the LTC remains genuinely useful.",
          "HB 1927 did not change where you can and cannot carry, did not authorize carry by prohibited persons, and did not affect federal restrictions in federal buildings, federal courthouses, or on federal property. It also did not modify Section 30.06 and 30.07 signage — the notices private property owners post to prohibit carry — both of which remain fully enforceable.",
        ],
      },
      {
        heading: "The License to Carry — Still Worth Getting",
        paragraphs: [
          "The Texas Department of Public Safety issues the LTC. Applicants must be 21 (18 for qualifying military), a legal U.S. resident, not in default on state taxes or child support, not a felon, not chemically dependent, and mentally sound. The process requires a written application, fingerprints, a four-to-six-hour classroom course, and a written and range proficiency test through a state-certified instructor.",
          "The license, once issued, is valid for five years initially and every subsequent renewal. It costs less than most people expect and can be done online for renewals. The reciprocity map — the states that honor a Texas LTC — is maintained by DPS and worth checking before an out-of-state trip.",
        ],
      },
      {
        heading: "Where You Cannot Carry, Permit or No Permit",
        paragraphs: [
          "Section 46.03 of the Penal Code lists the places where carry is generally prohibited regardless of LTC or constitutional carry status: school premises, school buses, polling places on election day and during early voting, courts and offices of courts, racetracks, secured areas of airports past the TSA checkpoint, and within 1,000 feet of an execution facility on execution days. Federal law adds federal buildings, post offices, military installations, and secure federal courthouses.",
          "Section 46.035 layers additional restrictions on LTC holders and, by extension, constitutional carriers: bars deriving 51% or more of receipts from on-premises alcohol sales (marked with a red 51% sign), high school and collegiate sporting events, correctional facilities, hospitals with proper notice, nursing homes with proper notice, amusement parks with proper notice, meetings of governmental bodies where proper notice is posted, and civil-commitment facilities.",
          "Private property owners in Texas may prohibit carry by giving effective notice — the classic Section 30.06 sign prohibits concealed carry by LTC holders, and Section 30.07 prohibits open carry by LTC holders. After constitutional carry, the effective standard is essentially that private property owners may exclude firearms by posting statutory notice or by giving verbal notice; ignoring either after receiving notice is a criminal trespass.",
        ],
      },
      {
        heading: "Castle Doctrine and the Use of Force in Texas",
        paragraphs: [
          "Texas has a robust castle doctrine codified in Sections 9.31, 9.32, and 9.42 of the Penal Code. A person is presumed to have acted reasonably in using deadly force against an intruder who unlawfully and with force enters or attempts to enter an occupied habitation, vehicle, or place of business or employment, provided the defender was not engaged in criminal activity at the time.",
          "Texas also has a stand-your-ground provision — there is no duty to retreat before using force or deadly force in self-defense, provided the person had a right to be at the location and was not engaged in criminal activity. Section 9.42 permits the use of deadly force to protect property under specific, narrow circumstances (at night, to prevent arson, burglary, robbery, aggravated robbery, or theft during the nighttime), and this is one of the more legally aggressive property-defense standards in the country.",
          "None of this means a shooting is legally uncomplicated. Any use of deadly force triggers a police investigation, a grand jury review, and often a civil suit even after criminal acquittal. Insurance products marketed as 'self-defense coverage' exist for exactly this reason; consulting an attorney immediately after any defensive incident is standard advice.",
        ],
      },
      {
        heading: "Carrying in Your Vehicle",
        paragraphs: [
          "Texas has long allowed a non-LTC holder to carry a handgun in their own motor vehicle or watercraft, so long as the person is not otherwise prohibited, not a member of a criminal street gang, and not engaged in criminal activity other than a Class C traffic offense. The handgun must not be in plain view unless the driver has an LTC or is otherwise legally carrying under constitutional carry (which for a person 21+ effectively resolves the plain-view question).",
          "Officers may still ask about firearms during a traffic stop. Texas does not require automatic disclosure, but most instructors recommend calm, factual disclosure at the start of any stop — hands on the wheel, license and insurance ready, and a straightforward statement that a firearm is present and where.",
        ],
      },
      {
        heading: "Long Guns, Suppressors, NFA Items, and the Made-in-Texas Statute",
        paragraphs: [
          "Rifles and shotguns are unrestricted at the state level in Texas beyond federal rules. There is no state assault-weapons ban, no state magazine capacity limit, and no state red-flag law.",
          "Suppressors, short-barreled rifles, and other NFA items require the standard federal ATF Form 4 process, a $200 tax stamp, and typically several months of wait time. Texas passed a Firearms Freedom Act arguing that firearms manufactured, sold, and kept exclusively within Texas fall outside federal Commerce Clause jurisdiction. In practice, federal law still governs — the ATF has not conceded the state's theory — and residents are advised to comply with federal NFA rules regardless.",
        ],
      },
      {
        heading: "Special Rules by Setting: Home, Work, School, Church, Business",
        paragraphs: [
          "At home, Texas has essentially no restrictions on lawful ownership. Storage requirements only kick in when a child under 17 gains access and causes death or serious injury — a Class C misdemeanor unless reckless, in which case it becomes a Class A. Safe storage is best practice regardless.",
          "At work, private employers may prohibit firearms on the premises but generally cannot prohibit them from being kept locked in an employee's personal vehicle in the parking lot, per Section 52.061 of the Labor Code. Certain regulated employers (school districts, federal contractors, chemical facilities) have carve-outs.",
          "Churches: after 2019 reforms, licensed carriers may lawfully carry in houses of worship in Texas unless the congregation posts effective notice barring firearms. Many congregations have adopted written security plans that welcome trained congregants to carry.",
          "Schools: still prohibited without written authorization from the school district. The 'Guardian' and 'School Marshal' programs allow specifically trained employees to carry on campus with school-board approval.",
        ],
      },
      {
        heading: "How Texas Law Interacts with Federal Firearms Law",
        paragraphs: [
          "State permissiveness does not preempt federal restrictions. A Texan cannot use constitutional carry to enter a federal courthouse. A resident cannot buy from an FFL if a federal prohibitor applies. Federal machine-gun rules, silencer rules, and interstate transfer rules still control.",
          "This friction is most visible in the marijuana context. Texas has no adult-use marijuana program, but any user of a federally controlled substance is federally prohibited from possessing a firearm — a question that shows up honestly on ATF Form 4473 during every FFL purchase. The prohibition is well established in federal case law, though currently under litigation in multiple circuits.",
        ],
      },
      {
        heading: "Common Situations Texans Ask About",
        paragraphs: [
          "New residents relocating from a permit-required state often ask whether their out-of-state license works here. Texas honors permits from any state that honors ours — DPS publishes the reciprocity list — and constitutional carry means most permitless carriers 21 and over are effectively covered anyway.",
          "Hunters ask about carrying a personal handgun into the field. Legal for anyone 21+ under constitutional carry, and legal for LTC holders regardless of age qualifications, subject to hunting regulations set by Texas Parks and Wildlife.",
          "Business owners ask whether they can post their own establishment. Yes — Sections 30.06 and 30.07 signage, or verbal notice, are enforceable. A number of chain retailers with corporate policies against carry post statewide.",
          "Renters ask whether landlords can prohibit firearms in leased dwellings. Texas has narrow tenant protections here; most reasonable, non-discriminatory firearm rules in a lease are enforceable, but blanket prohibitions in a residence face more scrutiny than similar prohibitions in commercial space.",
        ],
      },
    ],
    faq: [
      { q: "Do I need any license to carry a handgun in Texas?", a: "If you are 21 or older, a legal U.S. resident, and not otherwise prohibited under state or federal law, you may lawfully carry a handgun in most public places without a permit under HB 1927. Location restrictions in Sections 46.03 and 46.035 still apply." },
      { q: "Is the Texas License to Carry still worth getting after constitutional carry?", a: "Yes for most active carriers — the LTC provides reciprocity with 37 other states, exempts you from NICS on future purchases, gives you an affirmative defense to certain location prosecutions, and often reduces friction with law enforcement." },
      { q: "Can I carry openly in Texas?", a: "Open carry of a holstered handgun by someone 21 or older is generally legal in most public places. Long-gun open carry has always been legal but can trigger disorderly conduct scrutiny if used to intimidate." },
      { q: "Where can I never carry a firearm in Texas regardless of my license?", a: "Schools, courts, polling places during voting, secured airport areas, federal buildings, correctional facilities, and any private property that has posted effective notice under Sections 30.06 or 30.07." },
      { q: "Do I have to tell an officer I have a firearm during a traffic stop?", a: "Texas law does not require automatic disclosure, but calm, prompt disclosure with your hands visible is the standard recommended practice and usually shortens the encounter." },
      { q: "Can a Texas landlord prohibit firearms in a rented home?", a: "Landlords can include reasonable, non-discriminatory firearm provisions in a residential lease, though blanket bans in a private residence face more scrutiny than in commercial contexts." },
    ],
    sources: [
      { label: "Texas Penal Code Chapter 46", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.46.htm" },
      { label: "Texas DPS License to Carry", url: "https://www.dps.texas.gov/rsd/ltc" },
      { label: "HB 1927 (2021) Bill Text", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=87R&Bill=HB1927" },
      { label: "ATF Firearms Verification", url: "https://www.atf.gov/firearms" },
      { label: "Texas Constitution Article I, Section 23", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.1.htm" },
    ],
    related: [
      "constitutional-carry-one-year-later",
      "texas-new-laws-2026",
      "texas-election-laws-explained",
      "moving-to-texas-guide",
      "how-a-bill-becomes-texas-law",
    ],
    cta: { label: "Explore More Texas Law Guides", href: "/laws" },
    keyTakeaways: [
      "Texans 21+ can carry a handgun without a permit under HB 1927, subject to Section 46 place restrictions.",
      "Federal prohibitor categories (felony, drug use, protective order) still apply regardless of Texas law.",
      "The License to Carry is optional but still unlocks reciprocity and NICS-exempt future purchases.",
      "Castle doctrine and stand-your-ground protections are among the strongest in the nation.",
      "Private property owners retain full authority to prohibit carry via 30.06/30.07 notice.",
    ],
  },
  "texas-property-tax-laws-explained": {
    updated: "2026-07-15",
    intro: [
      "Property tax is the single most consequential tax a Texas homeowner pays, and it operates under a body of law most residents never encounter until the appraisal notice arrives in April. This guide explains the statutory framework that governs how your home is valued, how your rate is set, how your bill is calculated, and what legal tools you have to challenge every one of those steps.",
      "Texas property tax law is a mix of the Property Tax Code (Title 1), the Tax Code (Chapter 26), constitutional caps (Article VIII), and voter-approved amendments — including the 2025 measure that raised the residence homestead exemption to $140,000. If you're new to the state and want the whole system in plain English, start with [The Texas Property Tax Guide](/news/texas-property-tax-guide), and use our [Property Tax Calculator](/tax-calculator) to run your actual numbers.",
    ],
    sections: [
      {
        heading: "Why Texas Relies on Property Tax So Heavily",
        paragraphs: [
          "Texas has no personal income tax, and voters made that permanent with a 2019 constitutional amendment. That leaves property tax as the primary funding mechanism for local government — school districts, counties, cities, community colleges, hospital districts, MUDs, and emergency-service districts all draw from it. The state itself does not levy property tax; the whole system is local, which is why identical homes in adjacent ZIP codes can carry very different bills.",
          "For a full explanation of the trade-off, see [Why Texas Has No State Income Tax](/news/why-texas-has-no-income-tax). The upside is choice: Texans decide the size of local government by voting on bonds and by voting for the elected officials who set rates.",
        ],
      },
      {
        heading: "How Your Property Gets Valued: County Appraisal Districts",
        paragraphs: [
          "Every Texas county has a Central Appraisal District (CAD) governed by a board and led by a chief appraiser. The CAD is legally independent of every taxing entity — the county doesn't set your value, the school district doesn't set your value, only the CAD does. Values are certified in July and used by every entity that draws from your property.",
          "By statute, the CAD must appraise at market value as of January 1 each year using mass appraisal techniques. Residential appraisers analyze comparable sales, adjust for differences, and generate a value for every parcel. The methodology is public. The result is the 'appraised value' that appears on your April notice.",
          "For homestead properties, the Texas Constitution caps the growth of the taxable value at 10% per year regardless of how much the market value rose. That 'assessed value' is what your rate is applied to, not the raw market number. For non-homestead residential properties valued at $5 million or less, a temporary 20% growth cap runs through the 2026 tax year.",
          "For a deeper dive into how the CAD operates and your statutory rights during the process, see [How County Appraisal Districts Work](/news/county-appraisal-districts-explained).",
        ],
      },
      {
        heading: "The Homestead Exemption and Other Statutory Reductions",
        paragraphs: [
          "The residence homestead exemption is the single largest reduction most Texans will ever qualify for. As of the November 2025 constitutional amendment, the school-district homestead exemption is $140,000, up from $100,000. Homeowners 65 or older or with a qualifying disability receive an additional $10,000 ($60,000 in some prior packages) plus a school-district tax freeze that caps school taxes at the level owed the year they qualified.",
          "Optional local homestead exemptions of up to 20% of appraised value may be adopted by counties, cities, and other taxing units. Many major counties have adopted them. Disabled veterans qualify for exemptions ranging from $5,000 to a full exemption depending on VA disability rating; 100% disabled veterans and their surviving spouses pay no property tax on their homestead.",
          "The exemption is not automatic. It must be applied for at your county appraisal district using Form 50-114, ordinarily by April 30 of the tax year, though late filings back two years are commonly accepted. See [The Texas Homestead Exemption Explained](/news/homestead-exemption-explained) for the filing walkthrough.",
        ],
      },
      {
        heading: "How Rates Are Set: Truth-in-Taxation and the Voter-Approval Rate",
        paragraphs: [
          "Each taxing entity — school district, county, city, hospital district, and so on — must adopt a tax rate every year. That rate is expressed in dollars per $100 of assessed valuation. Rates are the second half of the bill; the first half is your assessed value.",
          "The 'no-new-revenue rate' is the rate that would generate the same total revenue as last year on the same properties. The 'voter-approval rate' is generally the no-new-revenue rate plus 3.5% for most cities and counties and 2.5% for school districts. If a taxing unit adopts a rate above the voter-approval rate, voters automatically get a rollback election in November — a reform put in place by Senate Bill 2 in 2019 to force elected officials to defend increases at the ballot box.",
          "Truth-in-taxation notices must be published, posted online, and mailed to homeowners in advance of the rate-adoption hearing. The Texas Comptroller maintains a truth-in-taxation lookup site where any resident can see every entity's proposed rate side by side.",
        ],
      },
      {
        heading: "How the Bill Is Actually Calculated",
        paragraphs: [
          "The formula is straightforward: assessed value minus exemptions, times the sum of all applicable tax rates, divided by 100. If your home is assessed at $400,000, your homestead exemption is $140,000 for school purposes, and your school district rate is $1.05 per $100, your school-district portion is (($400,000 − $140,000) × 1.05) / 100 = $2,730. Add the county, city, MUD, and hospital-district portions, each calculated on their own exempted taxable value and their own rate, and you have the total bill.",
          "Bills are mailed in October and are legally due by January 31 without penalty. Payment options include installment plans for homeowners 65 and older and for qualifying disabled Texans, plus escrowed payment through the mortgage servicer for most buyers.",
        ],
      },
      {
        heading: "Your Right to Protest — And Why You Should",
        paragraphs: [
          "Every property owner has a statutory right to protest the appraised value each year. The typical protest deadline is May 15 or 30 days after the notice was mailed, whichever is later. Two grounds carry the most weight: (1) the market value is too high compared to actual sales of comparable properties, and (2) the appraisal is unequal — comparable properties in the neighborhood are appraised for less on a per-square-foot basis.",
          "The process starts with an informal meeting at the CAD, where a substantial percentage of protests are resolved. If not, the case moves to the Appraisal Review Board (ARB) — a panel of citizen volunteers who hear evidence from both sides. ARB hearings are not adversarial in the courtroom sense; they are structured, brief, and evidence-driven. From an ARB order, the property owner may appeal to district court, to binding arbitration, or to SOAH (the State Office of Administrative Hearings) depending on the property type.",
          "Practical advice: file the protest online the day the notice arrives, request the CAD's evidence packet (they are required to provide it), and build a five-page comparable-sales packet from MLS data, closing statements, or a fee appraisal. See [How to Protest Your Property Appraisal — and Actually Win](/news/appraisal-protest-playbook) for the full playbook.",
        ],
      },
      {
        heading: "What the 2023 and 2025 Reform Packages Actually Changed",
        paragraphs: [
          "The 2023 reform package (SB 2, the constitutional Proposition 4) delivered the largest one-time property tax reduction in Texas history: $18 billion. It compressed school district M&O rates by roughly 10.7 cents, raised the school-district homestead exemption from $40,000 to $100,000, and introduced the temporary 20% cap on non-homestead residential properties valued at $5 million or under.",
          "The 2025 constitutional amendment approved by voters raised the homestead exemption further to $140,000 and expanded the additional over-65/disabled exemption. School district rate compression continued in the 2025 budget. Both packages left the underlying formula intact — Texas still funds schools through property tax with state supplementation — but shifted a meaningful share of the burden off the residential homeowner.",
          "For related coverage, see [New Property Tax Relief Package](/news/property-tax-relief-package) and our [Texas Property Tax Relief Calculator](/tax-calculator).",
        ],
      },
      {
        heading: "Special Situations: Ag-Use, Wildlife, Timber, and Open Space",
        paragraphs: [
          "Texas allows productivity-based appraisal for land in agricultural, wildlife, or timber use — often shorthanded as 'ag exemption,' though it is technically a special use valuation. The valuation is based on the land's productive value, not market value, resulting in dramatically lower tax bills on qualifying tracts. Rules and minimum acreage vary by county.",
          "Rollback taxes apply when land drops out of qualifying use — typically five years of the difference between what was paid and what would have been paid at market value, with interest. Anyone buying land with an existing ag valuation should confirm the current productivity status and understand what an intended change of use would trigger.",
        ],
      },
      {
        heading: "MUDs, PIDs, and the Other Line Items That Surprise Newcomers",
        paragraphs: [
          "A Municipal Utility District (MUD) is a special-purpose local government created to finance water, sewer, and drainage infrastructure in a developing subdivision. MUDs levy their own property tax, sometimes at rates of $0.50-$1.00 per $100, which sits on top of the county, city, and school portions of your bill.",
          "Public Improvement Districts (PIDs) and Emergency Services Districts (ESDs) function similarly. Buyers of new construction in Texas's expanding suburbs should ask specifically about every overlapping district before closing — the true tax rate is the sum of every entity your property falls inside, and it can meaningfully change what a $400,000 house actually costs to hold.",
          "For a broader look at these overlapping entities, see [What Local Governments Actually Control in Texas](/news/what-local-governments-control).",
        ],
      },
      {
        heading: "Enforcement, Delinquency, and the Statute of Limitations",
        paragraphs: [
          "Unpaid property taxes accrue penalty and interest starting February 1. After delinquency, the taxing unit can sue for a personal judgment, place a lien on the property, and ultimately foreclose. Tax lien foreclosures happen at monthly courthouse-step auctions in every Texas county.",
          "Texas has a strong statutory framework for tax deferrals for homeowners 65 and over and for surviving spouses — the tax accrues but cannot be collected during the deferral period, protecting seniors on fixed incomes from being taxed out of long-held homes. Interest continues to accumulate; the deferral is not forgiveness.",
        ],
      },
      {
        heading: "What Every Homeowner Should Do Every Year",
        paragraphs: [
          "Three steps, every year, without exception: (1) verify your homestead exemption is on file with your CAD, (2) protest the appraised value when it arrives in April, and (3) show up or vote absentee in the November constitutional-amendment and rollback elections. These are the only levers a homeowner controls, and each one measurably affects the annual bill.",
          "For a full first-year checklist for new arrivals, our [Moving to Texas Guide](/news/moving-to-texas-guide) walks through the entire property tax cycle in the context of everything else a new resident has to file.",
        ],
      },
    ],
    faq: [
      { q: "How much is the Texas homestead exemption in 2026?", a: "The residence homestead exemption for school district purposes is $140,000 as of the November 2025 constitutional amendment. Homeowners 65 or older or with a qualifying disability receive an additional exemption plus a school-tax freeze." },
      { q: "When is the deadline to protest my property appraisal?", a: "The standard deadline is May 15 or 30 days after the appraisal notice was mailed, whichever is later. File online with your county appraisal district as soon as the notice arrives." },
      { q: "Who actually sets my property tax rate?", a: "Each taxing entity — school district, county, city, hospital district, MUD — sets its own rate every year. If the total exceeds the voter-approval rate, a rollback election is automatic in November." },
      { q: "What is the appraisal cap and how does it work?", a: "The Texas Constitution caps growth of the taxable value on a homestead at 10% per year regardless of market value. A temporary 20% cap applies to non-homestead residential properties valued under $5 million through the 2026 tax year." },
      { q: "Can I stop paying property tax when I turn 65?", a: "No, but you may qualify for a school-tax freeze, an additional exemption, and a full deferral of collection during your lifetime (interest continues to accrue). File with your CAD when you qualify." },
      { q: "What happens if I do not pay my property tax bill?", a: "Delinquency triggers penalty and interest starting February 1, followed by potential lawsuit, lien, and eventually tax-lien foreclosure at courthouse auction." },
    ],
    sources: [
      { label: "Texas Property Tax Code (Title 1)", url: "https://statutes.capitol.texas.gov/?link=TX" },
      { label: "Texas Comptroller — Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/" },
      { label: "Truth-in-Taxation Portal", url: "https://truth-in-taxation.com/" },
      { label: "Constitutional Amendments Ballot History", url: "https://www.sos.state.tx.us/elections/historical/index.shtml" },
      { label: "Senate Bill 2 (2019) Bill Text", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=86R&Bill=SB2" },
    ],
    related: [
      "texas-property-tax-guide",
      "homestead-exemption-explained",
      "appraisal-protest-playbook",
      "county-appraisal-districts-explained",
      "texas-new-laws-2026",
    ],
    cta: { label: "Estimate Your Bill With Our Calculator", href: "/tax-calculator" },
    keyTakeaways: [
      "The homestead exemption is $140,000 for school purposes as of 2025's constitutional amendment.",
      "Homestead values are capped at 10% annual growth regardless of market appreciation.",
      "Every taxing entity sets its own rate; rates above the voter-approval rate trigger November rollback elections.",
      "The protest deadline is May 15 or 30 days after your notice — file online and request the CAD evidence packet.",
      "Seniors 65+ qualify for a school-tax freeze and can defer collection entirely during their lifetime.",
    ],
  },
  "texas-election-laws-explained": {
    updated: "2026-07-15",
    intro: [
      "Texas election law lives principally in the Texas Election Code, a document that runs to hundreds of chapters and governs everything from voter registration to how a ballot is counted after the polls close. This guide summarizes the practical rules that actually affect a Texas voter: who can register, what identification is accepted, when and how to vote early or by mail, what happens at the polling place, and the enforcement provisions added by Senate Bill 1 in 2021.",
      "Whether you are a first-time voter, a new Texas resident, or a longtime resident brushing up before the March primary, the framework below covers what the law requires and what your rights are. For a broader walkthrough written for civic education, see [A Beginner's Guide to Texas Elections](/news/beginners-guide-texas-elections) and [The Texas Voting Guide for 2026](/news/texas-voting-guide-2026).",
    ],
    sections: [
      {
        heading: "Who Runs Elections in Texas",
        paragraphs: [
          "The Texas Secretary of State is the chief election officer of the state, responsible for uniform interpretation of the Election Code and for certifying voting equipment. Actual administration happens county by county — 254 counties, each with an elections administrator or a combination of county clerk and voter registrar handling registration, polling places, ballots, and results reporting.",
          "This decentralization is a feature. The Legislature sets the statewide floor; counties implement within that floor. Local nuances — where polling places are, whether countywide voting is offered, how many voting machines each precinct receives — vary considerably between Harris, Dallas, Travis, Tarrant, Bexar, and the smaller counties.",
        ],
      },
      {
        heading: "Voter Registration: Deadlines and Requirements",
        paragraphs: [
          "To vote in Texas, you must be a U.S. citizen, at least 18 years old on election day (17 years, 10 months to register), a resident of the Texas county where you're registering, not a convicted felon (unless the sentence has been fully discharged), and not declared mentally incapacitated by a court.",
          "Registration must be received by the county voter registrar at least 30 days before an election in which you want to vote. Texas does not offer same-day registration, and does not offer online voter registration in the way most other states do — the application must be printed and mailed, or handed in in person, though you can update an existing registration online through the Secretary of State's site if you have a Texas driver license.",
          "Registration is permanent within a county but does not transfer automatically across county lines. Any Texan who moves to a new county must submit a new application. See [The Texas Voter Registration Guide](/news/texas-voter-registration-guide) for the full walkthrough.",
        ],
      },
      {
        heading: "Photo ID Requirements at the Polls",
        paragraphs: [
          "Texas requires voters to present one of seven forms of acceptable photo identification at the polling place. The accepted list is: Texas driver license, Texas Election Identification Certificate, Texas personal ID card, Texas concealed handgun license or License to Carry, U.S. military ID with photo, U.S. citizenship certificate with photo, and U.S. passport (book or card). IDs may be expired by up to four years (no expiration limit for voters 70 and over).",
          "Voters without an acceptable photo ID may still vote by presenting a supporting document (voter registration certificate, utility bill, bank statement, government check, or paycheck) and signing a Reasonable Impediment Declaration. The ballot is counted as a regular ballot.",
          "The Texas Election Identification Certificate is issued free by DPS specifically to satisfy voter ID and requires the same base documentation as a driver license (proof of identity, citizenship, and Texas residency).",
        ],
      },
      {
        heading: "Early Voting: The Way Most Texans Actually Vote",
        paragraphs: [
          "Texas offers a robust early voting period — typically 17 to 12 days before election day for a general election, and 10 to 4 days before a primary. During early voting, any registered voter in the county may vote at any designated early voting location in most participating counties (Harris, Dallas, Tarrant, Travis, Bexar, and most large counties all use countywide voting).",
          "Turnout during early voting typically exceeds election-day turnout for major statewide contests. It is the recommended way to vote for most Texans — shorter lines, more flexible hours, and no need to identify a specific precinct polling place.",
        ],
      },
      {
        heading: "Vote by Mail: Narrow Eligibility, Strict Rules",
        paragraphs: [
          "Texas is a limited excuse mail ballot state. To vote by mail, you must be at least 65 years old, disabled, out of the county during the entire early voting period and on election day, expected to give birth within three weeks before or after election day, or confined in jail but otherwise eligible to vote.",
          "The application for a Ballot by Mail must be received by the early voting clerk by the 11th day before the election. Voters must include the same identification number they used to register (Texas driver license, personal ID, or last four SSN) on both the application and the ballot return carrier envelope. Mismatches trigger a curative process — the county must notify the voter and allow correction — but this rule tightened materially under SB 1 in 2021 and is a common cause of rejection for first-time mail voters.",
          "Ballots must be received by 7:00 PM on election day or postmarked by 7:00 PM on election day and received by 5:00 PM the next day.",
        ],
      },
      {
        heading: "Election Day: Polling Places, Countywide Voting, and Provisional Ballots",
        paragraphs: [
          "Election-day polling places are open 7:00 AM to 7:00 PM. Anyone in line at 7:00 PM must be allowed to vote. In counties using countywide voting on election day (a majority of Texas voters live in one), any voter may cast a ballot at any of the county's polling locations. In counties that maintain traditional precinct voting, you must vote at your assigned precinct.",
          "Provisional ballots are available when a voter's eligibility is questioned at the polls — for example, if they appear to be at the wrong precinct or their name isn't found on the rolls. Provisional ballots are counted only after the county verifies eligibility, which happens during canvass in the following week.",
        ],
      },
      {
        heading: "Primaries, Runoffs, and How Texas Nominates",
        paragraphs: [
          "Texas holds open primaries, meaning a voter chooses which party's primary to vote in on primary day (typically the first Tuesday in March) without prior party registration. The party you vote in that year becomes your party affiliation for the remainder of that cycle for purposes such as county-convention delegate participation.",
          "If no candidate wins more than 50% of the vote in a primary, the top two candidates advance to a runoff — typically held on a Tuesday in late May. Runoffs are famously low-turnout, which is why organized primary voters have outsized influence in the resulting nomination.",
          "For most Texas districts drawn since the last redistricting, the Republican primary is where the seat is actually decided. See [Primary vs. General](/news/primary-vs-general-election) for why that matters.",
        ],
      },
      {
        heading: "General Elections, Constitutional Amendments, and Special Elections",
        paragraphs: [
          "The general election is the first Tuesday after the first Monday in November. Every partisan office, every constitutional amendment referred by the Legislature, and every county rollback election appears on the November ballot.",
          "Constitutional amendments in Texas require a two-thirds vote of each chamber of the Legislature to be placed on the ballot, then a simple majority of voters statewide to be adopted. Texas has amended its 1876 constitution more than 500 times. For more, see [A Guide to Texas Constitutional Amendments](/news/texas-constitutional-amendments-guide).",
          "Special elections fill vacancies and are held on uniform election dates — the first Saturday in May and the November general election date — with specific exceptions the governor may call.",
        ],
      },
      {
        heading: "Senate Bill 1 (2021) and Enforcement Provisions",
        paragraphs: [
          "SB 1 in 2021 rewrote large portions of election administration. Key provisions include: uniform statewide early voting hours (6:00 AM to 10:00 PM at most), a ban on drive-thru voting and 24-hour voting, the ID requirement on mail-ballot applications and return envelopes described above, new criminal penalties for election-worker conduct that improperly obstructs poll watchers, and enhanced authority for poll watchers to move freely inside polling places.",
          "The law also created new civil and criminal enforcement mechanisms for the Attorney General and Secretary of State, and empowered private-citizen election integrity officers within each county party.",
        ],
      },
      {
        heading: "Poll Watchers, Election Workers, and What You Can and Cannot Do at the Polls",
        paragraphs: [
          "Each candidate, party, and specific-purpose PAC on the ballot may appoint poll watchers who may observe the entire voting and counting process. SB 1 clarified that watchers must be permitted 'free movement' inside the polling place, though not close enough to see how a specific voter marks a ballot.",
          "Voters may not electioneer within 100 feet of a polling place entrance and may not wear campaign apparel, buttons, or hats inside that zone. Photography of ballots (ballot selfies) remains prohibited in Texas.",
        ],
      },
      {
        heading: "Rights of Voters With Disabilities and Limited English",
        paragraphs: [
          "Voters with disabilities have the right to curbside voting at any polling place, the right to an assistant of their choice (excluding an employer or union agent), and the right to accessible voting equipment. Signage and accessible parking are required.",
          "Texas provides Spanish-language ballots and materials in every county under federal law, and provides materials in additional languages (Vietnamese, Chinese, Korean) in counties that meet Section 203 thresholds. Voters may bring an interpreter of their choice, subject to the same limitations as any voter-assistant.",
        ],
      },
      {
        heading: "Contest, Recount, and Post-Election Rights",
        paragraphs: [
          "Candidates and, in some cases, voters may contest election results in court under specified grounds. Recounts are available under Chapter 212 of the Election Code — automatic in ties, on request in close races, with the requesting party bearing the cost unless the recount reverses the result.",
          "County canvassing occurs within a set number of days after election day; statewide canvassing happens on the second Tuesday after election day for general elections. Results are unofficial until canvass is complete.",
        ],
      },
      {
        heading: "Practical Advice for First-Time and New-Resident Voters",
        paragraphs: [
          "New arrivals to Texas from states with same-day registration, automatic registration, or all-mail voting often assume similar rules apply here. They do not. The single most important date on a new Texan's calendar is the 30-day registration deadline before each election — miss it and there is no cure. Download the application from the Secretary of State site, mail it or drop it off in person with the county voter registrar, and confirm receipt through the online lookup after two weeks.",
          "Sample ballots are published online by every county elections office roughly two weeks before early voting begins. Studying the sample ballot before you arrive is the single largest quality-of-vote improvement most voters can make — a Texas ballot typically contains 40 to 90 individual contests including judicial races, school board races, constitutional amendments, and local bond propositions that receive little media coverage.",
          "Down-ballot judicial races are decided almost entirely on party affiliation in most Texas jurisdictions. Voters who care about specific judicial philosophy should study the State Bar of Texas judicial evaluation polls and the Texans for Lawsuit Reform PAC endorsements, which publish detailed race-by-race information ahead of primary and general elections.",
          "For voters new to the concept of a runoff, note that runoffs are separate elections requiring a separate trip to the polls — they are not automatic. Turnout in primary runoffs is often in the single-digit percentages, which means an organized voter's ballot is disproportionately powerful in choosing the eventual nominee.",
        ],
      },
    ],
    faq: [
      { q: "What is the deadline to register to vote in Texas?", a: "Registration must be received by your county voter registrar at least 30 days before the election. There is no same-day registration in Texas." },
      { q: "What forms of ID does Texas accept at the polls?", a: "Texas driver license, Election ID Certificate, personal ID, License to Carry, military ID with photo, U.S. passport, or U.S. citizenship certificate with photo. Voters without ID can use a supporting document and sign a Reasonable Impediment Declaration." },
      { q: "Can I vote by mail in Texas?", a: "Only if you are 65 or older, disabled, out of the county during the entire early voting period and election day, expecting to give birth, or confined in jail but eligible." },
      { q: "When is early voting in Texas?", a: "Early voting is typically 17 to 12 days before a general election and 10 to 4 days before a primary. Most large counties allow countywide voting during early voting." },
      { q: "What is an open primary and can I switch parties?", a: "Texas has open primaries — you choose which party's primary to vote in on primary day without registering by party. Your choice binds you to that party for the remainder of the primary cycle." },
      { q: "What happens if I vote at the wrong precinct?", a: "In most large counties Texas allows countywide voting on election day, so any polling place counts. In smaller counties that still use precinct voting, you can cast a provisional ballot, which will be counted only for races you are eligible to vote in from your correct precinct." },
    ],
    sources: [
      { label: "Texas Election Code", url: "https://statutes.capitol.texas.gov/?link=EL" },
      { label: "Texas Secretary of State — Voting", url: "https://www.sos.state.tx.us/elections/voter/" },
      { label: "Senate Bill 1 (2021) Bill Text", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=872&Bill=SB1" },
      { label: "VoteTexas.gov", url: "https://www.votetexas.gov/" },
      { label: "Federal Voting Rights Act Section 203", url: "https://www.justice.gov/crt/language-minority-provisions" },
    ],
    related: [
      "texas-voting-guide-2026",
      "texas-voter-registration-guide",
      "beginners-guide-texas-elections",
      "primary-vs-general-election",
      "texas-new-laws-2026",
    ],
    cta: { label: "Register or Update Your Registration", href: "/register-to-vote" },
    keyTakeaways: [
      "You must register at least 30 days before an election; Texas has no same-day registration.",
      "Seven forms of photo ID are accepted; a Reasonable Impediment Declaration is available without ID.",
      "Vote by mail is limited to 65+, disabled, out-of-county, expecting, or lawfully confined voters.",
      "SB 1 (2021) tightened mail-ballot ID matching and standardized early-voting hours statewide.",
      "Most large counties allow countywide voting during early voting and often on election day.",
    ],
  },
  "texas-new-laws-2026": {
    updated: "2026-07-15",
    intro: [
      "Every regular session of the Texas Legislature produces hundreds of bills that make it to the governor's desk, and every biennium a specific slate of laws takes effect on September 1 (the default effective date) or on January 1 of the following year. This guide covers the major statutes that took effect for the 2026 cycle — the property tax reform package voters approved in November 2025, the expanded education savings account program, additional border security funding, criminal justice updates, and the elections-and-administration bills that shape day-to-day life in Texas.",
      "For an overview of how any Texas bill becomes law, see [How a Bill Becomes Texas Law](/news/how-a-bill-becomes-texas-law). For the ongoing tracker used by the newsroom, visit our [Legislative Updates](/legislative-updates) hub.",
    ],
    sections: [
      {
        heading: "Property Tax Relief: $140,000 Homestead Exemption and Continued Rate Compression",
        paragraphs: [
          "The single largest change taking effect for the 2026 tax year is the increase of the residence homestead exemption from $100,000 to $140,000, approved by voters as a constitutional amendment on the November 2025 ballot. The additional exemption for homeowners 65 and older or with a qualifying disability was also expanded.",
          "Alongside the exemption increase, the 2025 legislative package continued the school district maintenance-and-operations rate compression that began with SB 2 in 2019 and the 2023 relief package. Combined, the compression and exemption produce a meaningful reduction on the school-district portion of most residential bills. See [Texas Property Tax Laws Explained](/news/texas-property-tax-laws-explained) for the full framework.",
          "The temporary 20% appraisal cap for non-homestead residential properties valued at $5 million or less remains in effect through the 2026 tax year. Whether the Legislature extends or makes it permanent will be a headline debate in the next session.",
        ],
      },
      {
        heading: "Education Savings Accounts: Statewide Implementation",
        paragraphs: [
          "The Texas Education Savings Account program authorized by SB 2 in 2025 begins operating at scale in the 2026-27 school year. Eligible families receive approximately $10,000 per participating child (with a higher amount for students with disabilities and a lower amount for homeschool families) that can be spent on private-school tuition, tutoring, curriculum, therapy services, and other qualifying educational expenses.",
          "The initial rollout prioritizes low-income families, students with disabilities, and children currently enrolled in public schools rated as low performing, then expands to other Texas families as capacity permits. Applications open through a state-selected program manager. See [Education Savings Accounts: A Parent's Guide](/news/school-choice-esa-guide) for the qualification walkthrough and timeline.",
        ],
      },
      {
        heading: "Border Security Funding and Operation Lone Star Continuation",
        paragraphs: [
          "The 2026-27 biennial budget continues Operation Lone Star funding at record levels, with allocations for Texas Department of Public Safety border deployments, the Texas National Guard, and the state's construction of border barrier infrastructure. Statutory provisions extend the trespass authorities granted to state and local law enforcement in border counties.",
          "The Texas Attorney General retains enhanced authority to bring civil actions against entities that assist unauthorized crossings and to coordinate with county prosecutors on transnational criminal cases. Federal preemption litigation on state border authority remains active, and the Legislature may return to the issue in the next session depending on how the courts rule.",
          "For deeper context, see [Operation Lone Star](/news/operation-lone-star) and the pillar [Texas Border Policy Explained](/news/texas-border-policy-full-guide).",
        ],
      },
      {
        heading: "Criminal Justice and Public Safety Updates",
        paragraphs: [
          "Several criminal-justice bills took effect for 2026, including sentence enhancements for organized retail theft, fentanyl-related distribution offenses, and human smuggling in border counties. A dedicated statutory framework for prosecuting fentanyl deaths as murder in certain circumstances expanded during the 2025 session.",
          "The Legislature also continued the phased expansion of the state's mental-health beds through the Texas Health and Human Services Commission, and refined the involuntary commitment process for individuals repeatedly charged with certain violent offenses.",
          "Bail reform provisions from earlier sessions remain in effect, with additional restrictions on cash-bond releases for defendants with prior violent-offense histories.",
        ],
      },
      {
        heading: "Elections Administration: Continued SB 1 Implementation",
        paragraphs: [
          "The 2025 session refined the SB 1 (2021) framework rather than reopening its core provisions. Adjustments included tighter deadlines for ballot-cure notifications, standardized statewide poll watcher training curricula, and additional record-retention requirements on county elections administrators.",
          "The Secretary of State retains expanded authority to audit county election administration, and the Attorney General's election integrity unit continues its investigative work under existing statutory grants. See [Texas Election Laws Explained](/news/texas-election-laws-explained) for the full framework.",
        ],
      },
      {
        heading: "Firearms Law Refinements",
        paragraphs: [
          "House Bill 1927's constitutional-carry framework remains the backbone of Texas firearms law. The 2025 session added narrow clarifications on carry authority in state parks, at governmental meetings, and by peace officers in their private capacity, plus continued expansion of the School Marshal and Guardian programs that allow trained employees to be armed on campus.",
          "No state-level restrictions on firearm ownership, magazine capacity, or so-called assault weapons were enacted. For the operational reality of Texas gun law in 2026, see [Texas Gun Laws Explained](/news/texas-gun-laws-explained).",
        ],
      },
      {
        heading: "Business, Regulatory, and Tort Reform",
        paragraphs: [
          "The 2025 session included several statutes aimed at the business-relocation pipeline. The Texas Business Court, a specialized commercial court created in 2023, expanded operational capacity in 2026 with additional divisions in Houston, Dallas, and Austin — handling complex commercial cases with a specialized bench.",
          "Franchise-tax thresholds were adjusted for inflation, marginally expanding the number of small businesses exempted from filing. Occupational licensing reforms narrowed several boards' authority to impose fees or continuing-education requirements that were determined to lack a substantive public-safety justification.",
          "Tort reform legislation refined damage caps in specific medical liability contexts and clarified attorney-fee recovery rules in construction disputes.",
        ],
      },
      {
        heading: "Water, Energy, and Infrastructure",
        paragraphs: [
          "The Texas Water Fund, created by voters in 2023 and expanded by the Legislature in 2025, continues to distribute grants and low-interest loans for municipal water infrastructure and new water supply. Rural water systems and border-region infrastructure received priority allocations in the 2026 disbursement cycle.",
          "The Texas Energy Fund, aimed at incentivizing dispatchable (non-intermittent) generation on the ERCOT grid, entered its second application round. Approved projects receive low-interest loans conditioned on completion and interconnection by set deadlines. See [The Texas Grid Explained](/news/texas-grid-ercot-explained) for how the fund fits the broader ERCOT reliability question.",
          "Water rights and groundwater conservation district authorities remained unchanged in substance for 2026; see [Texas Water Rights Explained](/news/texas-water-rights-explained).",
        ],
      },
      {
        heading: "Health Care and Family Policy",
        paragraphs: [
          "Continued statutory protections for pre-born children remain in effect, with the Texas Attorney General maintaining primary enforcement authority. Expanded maternal-health investments — including a longer postpartum Medicaid coverage window — took effect for the 2026 fiscal year.",
          "The Legislature strengthened parental rights notification requirements for public schools on health-related interventions and continued reforms to the Texas foster-care system, including additional oversight of contracted care providers.",
        ],
      },
      {
        heading: "Effective Dates and How to Track Ongoing Changes",
        paragraphs: [
          "Most Texas laws take effect September 1 following the regular session, with some designated for earlier effect (immediate effect with two-thirds vote) or later (January 1 or specific fiscal year). Constitutional amendments take effect upon voter approval and canvass of the November election.",
          "The Legislative Reference Library, Texas Legislature Online, and Texas Register are the three primary places to track statutes and rulemaking. Our [Legislative Updates](/legislative-updates) hub aggregates the bills we're tracking for readers.",
        ],
      },
      {
        heading: "What Ordinary Texans Should Do About New Laws",
        paragraphs: [
          "For most residents, staying current on new Texas law involves a small set of habits: watch the November constitutional-amendment ballot each odd-numbered year, review the changes to your annual property tax notice each spring, and check the [Texas Laws Explained](/texas-laws) page for major statutes that touch your household directly.",
          "For families with school-age children, the ESA rollout is the practical change most likely to affect a household decision this cycle. For property owners, the exemption increase and rate compression will show up on the fall bill without any action required beyond confirming your homestead exemption is on file.",
        ],
      },
    ],
    faq: [
      { q: "What was the biggest new Texas law for 2026?", a: "The constitutional amendment raising the residence homestead exemption to $140,000, combined with continued school-district rate compression — the largest ongoing property tax relief package in state history." },
      { q: "When did the education savings account program actually start?", a: "The ESA program authorized by SB 2 in 2025 begins operating at scale in the 2026-27 school year, prioritizing low-income families, students with disabilities, and children in low-performing public schools." },
      { q: "Did Texas pass any new gun laws in 2025?", a: "No major changes. Constitutional carry under HB 1927 remains the operative framework, with narrow clarifications on carry in state parks and expansions of the School Marshal program." },
      { q: "How do I find out when a specific bill takes effect?", a: "Check the bill's caption on Texas Legislature Online — the effective date is stated in the final section of every enrolled bill. Default is September 1 after the regular session." },
      { q: "What is the Texas Business Court and does it affect small businesses?", a: "The Business Court handles complex commercial disputes above a jurisdictional threshold — it primarily affects mid-size and larger enterprises, not typical small-business litigation." },
      { q: "Are there major new laws taking effect in 2027?", a: "The Legislature will meet in regular session in early 2027; new statutes from that session typically take effect September 1, 2027, or January 1, 2028." },
    ],
    sources: [
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
      { label: "Legislative Reference Library", url: "https://lrl.texas.gov/" },
      { label: "Texas Register", url: "https://www.sos.state.tx.us/texreg/" },
      { label: "Texas Comptroller — Property Tax", url: "https://comptroller.texas.gov/taxes/property-tax/" },
      { label: "Texas Education Agency — ESA Program", url: "https://tea.texas.gov/" },
    ],
    related: [
      "texas-property-tax-laws-explained",
      "texas-gun-laws-explained",
      "texas-election-laws-explained",
      "school-choice-esa-guide",
      "legislative-updates",
    ],
    cta: { label: "Track Bills In Our Legislative Hub", href: "/legislative-updates" },
    keyTakeaways: [
      "The homestead exemption rose to $140,000 for the 2026 tax year via 2025 constitutional amendment.",
      "The Texas ESA program begins at scale for 2026-27, prioritizing low-income and disabled students.",
      "Operation Lone Star funding continues at record levels through the 2026-27 biennium.",
      "SB 1's elections framework was refined, not reopened, in the 2025 session.",
      "Most 2025 session bills took effect September 1, 2025; constitutional amendments effective on canvass.",
    ],
  },
};
