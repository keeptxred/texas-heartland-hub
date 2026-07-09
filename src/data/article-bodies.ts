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

  "gracie-the-giraffe": {
    updated: "2026-06-27",
    editorNote:
      "Updated June 27, 2026. Reporting compiled from AP, Texas Standard, and the Real County Sheriff's Office. Framing and analysis are editorial.",
    intro: [
      "For nearly two weeks in June 2026, the most-watched fugitive in Texas was not a cartel suspect or a border-crosser — it was an 18-foot-tall reticulated giraffe named Gracie. She slipped off the Cedar Hollow Ranch in Real County, vanished into the cedar breaks and limestone canyons of the Hill Country, and led ranchers, sheriff's deputies, drone pilots, and a small army of internet sleuths on one of the most uniquely Texan manhunts in recent memory.",
      "On Friday, June 26, Gracie was spotted from the air about four miles from the ranch, near Leakey, and recovered safely. Real County Sheriff Nathan Johnson described her as 'fat and happy.' She is fine. The story behind how a giraffe ends up loose in the Hill Country in the first place is a window into a uniquely Texas tradition.",
    ],
    sections: [
      {
        heading: "The Escape",
        paragraphs: [
          "Gracie went missing in mid-June from Cedar Hollow Ranch, a private exotic property in Real County, west of San Antonio. Ranch manager Vic Jones reported her absence, and the Real County Sheriff's Office posted a $5,000 reward through local channels.",
          "Within days the story had jumped from the Uvalde Leader-News to the Associated Press, ABC News, and Texas Standard. Drone operators, hunters, and hill-country neighbors fanned out across thousands of acres of brush. For thirteen days she eluded all of them — a 1,500-pound animal hiding in plain sight in country that has swallowed plenty of smaller things.",
        ],
      },
      {
        heading: "How a Giraffe Survives the Hill Country",
        paragraphs: [
          "Hill Country ranchers were not as surprised as the national press. The terrain Gracie disappeared into is, by accident of climate and geology, one of the better places on the continent for a giraffe to go feral for a week or two:",
        ],
        bullets: [
          "Climate — June in the Hill Country is hot and dry, much like the East African savanna giraffes evolved on.",
          "Browse — mesquite, live oak, cedar elm, and persimmon all grow tall enough to feed a browser that prefers tree tops to grass.",
          "Land — Real County is overwhelmingly privately owned, with ranches measured in thousands of acres and cover thick enough to hide a giraffe from a road but not from a helicopter.",
          "Water — late-spring rains had filled stock tanks across the region, so Gracie was never far from a drink.",
        ],
      },
      {
        heading: "Why There Was a Giraffe to Lose in the First Place",
        paragraphs: [
          "Gracie is one of an estimated several hundred giraffes living in Texas at any given time — across Fossil Rim Wildlife Center in Glen Rose, the Natural Bridge Wildlife Ranch outside San Antonio, accredited zoos in Dallas, Houston, and Waco, and private exotic ranches like Cedar Hollow. The Exotic Wildlife Association estimates Texas private ranches host more than 1 million head of exotic hoofstock across roughly 5,000 properties.",
          "That industry exists because of three things Texas treats differently than almost any other state: 95% private land ownership, a property-rights tradition that classifies non-native hoofstock as livestock rather than state wildlife, and a federal-permitting environment that lets accredited owners breed and move animals without asking permission for every transaction. Conservatives have long argued private ownership is the most reliable engine of conservation. The Texas exotic-ranching industry is the closest thing in America to a real-world test of that idea.",
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
        heading: "Fat, Happy, and Home",
        paragraphs: [
          "Gracie was located the morning of June 26 about four miles from Cedar Hollow Ranch, near Leakey. Aerial photos from the Real County Sheriff's Office showed her standing calmly in tall grass, in noticeably better condition than when she left. Sheriff Johnson's blunt summary — 'fat and happy' — became the line of the week across Texas talk radio.",
          "There is something Texas about the whole episode: a giraffe gets loose, the sheriff handles it, neighbors pitch in, the internet cheers her on, and a private landowner gets his animal back without a federal task force or a press conference from Washington. The story ends the way Texans like stories to end — with the animal safe, the rancher whole, and the government barely involved.",
        ],
      },
    ],
    faq: [
      {
        q: "Where was Gracie found?",
        a: "About four miles from Cedar Hollow Ranch, near Leakey in Real County, on the morning of Friday, June 26, 2026. Authorities spotted her from the air and recovered her safely.",
      },
      {
        q: "Who owns Gracie?",
        a: "She lives at Cedar Hollow Ranch, a private exotic property in Real County. Ranch manager Vic Jones led the recovery effort along with the Real County Sheriff's Office.",
      },
      { q: "How long was she missing?", a: "Roughly two weeks, from mid-June 2026 until her recovery on June 26." },
      {
        q: "Is it legal to own a giraffe in Texas?",
        a: "Yes. Texas classifies most non-native hoofstock as private livestock rather than state wildlife, which is why the state has one of the largest private exotic-ranching industries in the country.",
      },
      {
        q: "How many giraffes are in Texas?",
        a: "There is no official count, but between Fossil Rim, accredited zoos, drive-through safari parks, and private exotic ranches, Texas hosts several hundred giraffes — more than several African nations.",
      },
    ],
    sources: [
      {
        label: "AP — A giraffe named Gracie escaped in Texas",
        url: "https://apnews.com/article/giraffe-escape-texas-23bd372aa6a09259a302297e3b7b1939",
      },
      {
        label: "Texas Standard — Missing giraffe Gracie found safe near Leakey",
        url: "https://texasstandard.org/stories/texas-giraffe-missing-found/",
      },
      {
        label: "News 4 San Antonio — Gracie found 'fat and happy'",
        url: "https://news4sanantonio.com/news/local/gracie-the-giraffe-found-fat-and-happy-real-county-sheriff-johnson-says",
      },
      { label: "Fossil Rim Wildlife Center", url: "https://fossilrim.org/" },
      { label: "Exotic Wildlife Association", url: "https://www.myewa.org/" },
    ],
    related: ["texas-property-tax-guide", "texas-water-rights-explained", "what-local-governments-control"],
    cta: { label: "Visit Fossil Rim", href: "https://fossilrim.org/" },
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
};
