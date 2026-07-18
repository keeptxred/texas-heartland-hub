export type Article = {
  slug: string;
  category: "Legislature" | "Border" | "Elections" | "Tax & Spending" | "Energy" | "Education" | "Non-Political";
  title: string;
  dek: string;
  author: string;
  date: string;
  image: string;
  featured?: boolean;
  /** Marks a long-form pillar guide (1500+ words). */
  pillar?: boolean;
  /** ISO timestamp; if set and in the future, the article is hidden from listings, sitemap, and direct routes until that moment. */
  publishAt?: string;
  /** ISO timestamp for sorting and display. Required on all articles. */
  publishedAt: string;
  /** Evergreen maintenance metadata. Assigned automatically for new evergreens
   *  so future content-review sweeps know when to re-examine an article.
   *  See src/lib/content-maintenance.ts for review-interval rules. */
  contentCategory?:
    | "laws"
    | "elections"
    | "taxes"
    | "regulations"
    | "government-policy"
    | "relocation"
    | "housing"
    | "financial"
    | "cost-of-living"
    | "history"
    | "culture"
    | "lifestyle";
  /** ISO date of the last editorial content review (may equal publishedAt). */
  lastReviewedDate?: string;
  /** ISO date of the last meaningful content update (drives dateModified schema). */
  dateModified?: string;
  /** Optional topical tags used by the client-side category filters
   *  (e.g. "energy", "property-tax", "elections"). Falls back to
   *  keyword matching in src/lib/article-filters.ts when omitted. */
  topics?: string[];
  /** Optional single subcategory (finer-grained than `category`). */
  subcategory?: string;
};

import border from "@/assets/border.jpg";
import ballot from "@/assets/ballot.jpg";
import suburb from "@/assets/suburb.jpg";
import podium from "@/assets/podium.jpg";
import oil from "@/assets/article-oil.jpg";
import grid from "@/assets/article-grid.jpg";
import water from "@/assets/article-water.jpg";
import classroom from "@/assets/article-classroom.jpg";
import courthouse from "@/assets/article-courthouse.jpg";
import taxbill from "@/assets/article-taxbill.jpg";
import pollingplace from "@/assets/article-pollingplace.jpg";
import riogrande from "@/assets/article-riogrande.jpg";
import rotunda from "@/assets/article-rotunda.jpg";
import gavel from "@/assets/article-gavel.jpg";
import trooper from "@/assets/article-trooper.jpg";
import carry from "@/assets/article-carry.jpg";
import ballot2 from "@/assets/article-ballot2.jpg";
import voterreg from "@/assets/article-voterreg.jpg";
import schoolbus from "@/assets/article-schoolbus.jpg";
import library from "@/assets/article-library.jpg";
import boardroom from "@/assets/article-boardroom.jpg";
import wind from "@/assets/article-wind.jpg";
import openmeeting from "@/assets/article-openmeeting.jpg";
import salestax from "@/assets/article-salestax.jpg";
import governor from "@/assets/article-governor.jpg";
import ag from "@/assets/article-ag.jpg";

export const ARTICLES: Article[] = [
  {
    slug: "property-tax-relief-package",
    category: "Tax & Spending",
    title: "New Property Tax Relief Package Heads to Floor for Decisive Vote",
    dek: "GOP leaders signal confidence as the historic $18 billion plan reaches final deliberations in the House, promising compression to district maintenance rates.",
    author: "Staff Reporter",
    date: "2 hours ago",
    publishedAt: "2026-06-26T10:00:00",
    image: taxbill,
    featured: true,
  },
  {
    slug: "moving-to-texas-guide",
    category: "Tax & Spending",
    title: "Moving to Texas: The Complete Guide to Taxes, Schools, Voting, and Life in the Lone Star State",
    dek: "Everything a new Texan needs to know — property taxes and the homestead exemption, ISDs and school boards, the ERCOT grid, constitutional carry, and how to register your car, your kids, and your vote.",
    author: "Civics Desk",
    date: "Pillar guide",
    publishedAt: "2026-07-09T12:00:00",
    image: suburb,
    pillar: true,
    featured: true,
  },
  {
    slug: "operation-lone-star",
    category: "Border",
    title: "Operation Lone Star Reinforces Key Crossing Points Along the Rio Grande",
    dek: "Texas Department of Public Safety expands buoy barriers and razor wire as federal pushback intensifies.",
    author: "Border Bureau",
    date: "5 hours ago",
    publishedAt: "2026-06-26T07:00:00",
    image: trooper,
  },
  {
    slug: "voter-id-surge",
    category: "Elections",
    title: "Voter Registration Surges in Red Wall Counties Ahead of 2026 Primary",
    dek: "Suburban counties around Houston and DFW post double-digit gains in conservative voter rolls.",
    author: "Politics Desk",
    date: "1 day ago",
    publishedAt: "2026-06-25T12:00:00",
    image: ballot,
  },
  {
    slug: "school-board-elections",
    category: "Education",
    title: "Local School Board Elections: Why Every Conservative Vote Matters",
    dek: "Parental rights coalitions are running slates of candidates in 87 ISDs across the state this May.",
    author: "Lone Star Civics",
    date: "2 days ago",
    publishedAt: "2026-06-24T12:00:00",
    image: classroom,
    topics: ["elections", "education"],
    subcategory: "elections",
  },
  {
    slug: "speaker-special-session",
    category: "Legislature",
    title: "Special Session Rumors Grow as Property Tax Relief Stalls",
    dek: "Conservative caucus members say they will not adjourn until appraisal caps are codified.",
    author: "Austin Bureau",
    date: "3 days ago",
    publishedAt: "2026-06-23T12:00:00",
    image: podium,
  },
  {
    slug: "isd-tax-burdens",
    category: "Tax & Spending",
    title: "The 10 Texas Counties with the Highest School Tax Burdens in 2024",
    dek: "Our analysis of TEA filings shows where homeowners are paying the steepest ISD M&O rates.",
    author: "Data Desk",
    date: "4 days ago",
    publishedAt: "2026-06-22T12:00:00",
    image: taxbill,
  },
  {
    slug: "permian-energy",
    category: "Energy",
    title: "Permian Basin Production Hits Record as Federal Permitting Threats Loom",
    dek: "West Texas operators warn of EPA overreach even as output climbs to 6.1 million barrels per day.",
    author: "Energy Desk",
    date: "5 days ago",
    publishedAt: "2026-06-21T12:00:00",
    image: oil,
  },
  {
    slug: "homestead-exemption-explained",
    category: "Tax & Spending",
    title: "The Texas Homestead Exemption Explained: What Every Homeowner Should Claim",
    dek: "A plain-English walkthrough of the $100,000 school-district homestead exemption, over-65 freezes, and disabled-veteran reductions — and how to file with your county appraisal district.",
    author: "Taxpayer Desk",
    date: "1 week ago",
    publishedAt: "2026-06-19T12:00:00",
    image: suburb,
  },
  {
    slug: "how-a-bill-becomes-texas-law",
    category: "Legislature",
    title: "How a Bill Becomes Texas Law: A Citizen's Field Guide to the 88th Legislature",
    dek: "From filing in the House clerk's office to the Governor's desk — every committee, calendar, and conference step that shapes the bills you actually live under.",
    author: "Civics Desk",
    date: "1 week ago",
    publishedAt: "2026-06-19T13:00:00",
    image: rotunda,
  },
  {
    slug: "constitutional-carry-one-year-later",
    category: "Legislature",
    title: "Constitutional Carry in Texas: What the Law Actually Says",
    dek: "House Bill 1927 lets eligible Texans 21 and older carry a handgun without a permit. Here's where you still can't carry, and what reciprocity means on the road.",
    author: "Liberty Desk",
    date: "2 weeks ago",
    publishedAt: "2026-06-12T12:00:00",
    image: carry,
    topics: ["legislature", "laws"],
    subcategory: "laws",
  },
  {
    slug: "primary-vs-general-election",
    category: "Elections",
    title: "Primary vs. General: Why the March Ballot Decides More Than November Does",
    dek: "In most Texas districts the Republican primary is the real election. We break down open primaries, runoff math, and why low-turnout March races set the next decade of policy.",
    author: "Elections Desk",
    date: "2 weeks ago",
    publishedAt: "2026-06-12T13:00:00",
    image: pollingplace,
    topics: ["elections"],
    subcategory: "elections",
  },
  {
    slug: "school-choice-esa-guide",
    category: "Education",
    title: "Education Savings Accounts: A Parent's Guide to Texas School Choice",
    dek: "How the new ESA program works, who qualifies, what expenses are covered, and the application timeline parents need to know before the fall enrollment window.",
    author: "Education Desk",
    date: "3 weeks ago",
    publishedAt: "2026-06-05T12:00:00",
    image: library,
  },
  {
    slug: "appraisal-protest-playbook",
    category: "Tax & Spending",
    title: "How to Protest Your Property Appraisal — and Actually Win",
    dek: "Deadlines, evidence packets, equal-and-uniform comps, and the ARB hearing script that gets values reduced. A practical playbook for every Texas homeowner.",
    author: "Taxpayer Desk",
    date: "3 weeks ago",
    publishedAt: "2026-06-05T13:00:00",
    image: gavel,
  },
  {
    slug: "texas-grid-ercot-explained",
    category: "Energy",
    title: "The Texas Grid Explained: ERCOT, Reliability, and Why Independence Still Matters",
    dek: "Why Texas runs its own grid, what the Public Utility Commission actually controls, and the reforms keeping the lights on through summer peaks and winter freezes.",
    author: "Energy Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T12:00:00",
    image: grid,
  },
  {
    slug: "border-security-state-role",
    category: "Border",
    title: "Operation Lone Star: The State's Role in Border Security",
    dek: "How Texas DPS, the National Guard, and county sheriffs coordinate enforcement along the Rio Grande — and the constitutional case for state action when Washington won't act.",
    author: "Border Bureau",
    date: "1 month ago",
    publishedAt: "2026-05-27T13:00:00",
    image: border,
  },
  {
    slug: "texas-property-tax-guide",
    category: "Tax & Spending",
    title: "The Texas Property Tax Guide: Appraisals, Caps, and Calculating Your Bill",
    dek: "How Texas property taxes really work — appraisal caps, homestead exemptions, ISD M&O rates, and a step-by-step walkthrough for estimating what you actually owe.",
    author: "Taxpayer Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T14:00:00",
    image: taxbill,
  },
  {
    slug: "beginners-guide-texas-elections",
    category: "Elections",
    title: "A Beginner's Guide to Texas Elections: Primaries, Runoffs, and General Ballots",
    dek: "How Texas's open-primary system works, when runoffs trigger, how districts are drawn, and the dates every conservative voter should mark on the calendar.",
    author: "Elections Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T15:00:00",
    image: ballot2,
    topics: ["elections"],
    subcategory: "elections",
  },
  {
    slug: "texas-school-board-powers",
    category: "Education",
    title: "Texas School Board Powers Explained: Curriculum, Budgets, and Why They Matter",
    dek: "What an elected school board actually controls — from library policy and bond elections to superintendent hiring — and why low-turnout May races shape your kids' classrooms.",
    author: "Education Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T16:00:00",
    image: boardroom,
  },
  {
    slug: "texas-energy-policy-guide",
    category: "Energy",
    title: "A Guide to Texas Energy Policy: ERCOT, Oil & Gas, and the Regulators in Charge",
    dek: "How the Railroad Commission, PUC, and ERCOT divide authority over the nation's largest energy economy — and where renewables fit into a grid built on hydrocarbons.",
    author: "Energy Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T17:00:00",
    image: wind,
  },
  {
    slug: "county-appraisal-districts-explained",
    category: "Tax & Spending",
    title: "How County Appraisal Districts Work — and Your Rights as a Taxpayer",
    dek: "Inside the CAD: how appraisers set market values, what the Appraisal Review Board does, and the statutory rights every property owner can invoke during protest season.",
    author: "Taxpayer Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T18:00:00",
    image: suburb,
  },
  {
    slug: "texas-voter-registration-guide",
    category: "Elections",
    title: "The Texas Voter Registration Guide: Deadlines, ID Rules, and FAQs",
    dek: "Who can register, the 30-day deadline before each election, accepted photo ID, and how to update your address when you move counties — everything you need before you vote.",
    author: "Civics Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T19:00:00",
    image: voterreg,
  },
  {
    slug: "what-local-governments-control",
    category: "Tax & Spending",
    title: "What Local Governments Actually Control in Texas",
    dek: "Counties, cities, ISDs, MUDs, and emergency-services districts each levy their own tax — here's who decides what, and which line on your bill funds which service.",
    author: "Civics Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T20:00:00",
    image: courthouse,
  },
  {
    slug: "texas-border-geography-101",
    category: "Border",
    title: "Texas Border Geography 101: The Rio Grande, Ports of Entry, and Sector Maps",
    dek: "A factual tour of the 1,254-mile border — Border Patrol sectors, international bridges, and the river communities of the Rio Grande Valley, El Paso, and Big Bend.",
    author: "Border Bureau",
    date: "1 month ago",
    publishedAt: "2026-05-27T21:00:00",
    image: riogrande,
  },
  {
    slug: "texas-school-finance-explained",
    category: "Education",
    title: "Understanding Texas School Finance: Recapture, ISD Budgets, and the Funding Formula",
    dek: "How the Foundation School Program, basic allotment, and 'Robin Hood' recapture redistribute property-tax dollars — and why two ISDs with identical tax rates fund students very differently.",
    author: "Education Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T22:00:00",
    image: schoolbus,
  },
  {
    slug: "texas-political-terminology",
    category: "Legislature",
    title: "A Guide to Texas Political Terminology",
    dek: "Special session, sunset review, calendars committee, constitutional amendment, point of order — a plain-English glossary of the terms Austin reporters never define.",
    author: "Civics Desk",
    date: "1 month ago",
    publishedAt: "2026-05-27T23:00:00",
    image: rotunda,
    topics: ["legislature", "governor-leadership"],
    subcategory: "government",
  },
  {
    slug: "how-texas-counties-spend",
    category: "Tax & Spending",
    title: "How Texas Counties Actually Spend Your Money",
    dek: "Sheriff's office, jail operations, road and bridge, district courts, and indigent defense — a breakdown of where every dollar of your county property tax actually goes.",
    author: "Taxpayer Desk",
    date: "1 month ago",
    publishedAt: "2026-05-28T00:00:00",
    image: courthouse,
  },
  {
    slug: "texas-water-rights-explained",
    category: "Energy",
    title: "Texas Water Rights Explained: Rivers, Aquifers, and the Rule of Capture",
    dek: "Surface water belongs to the state; groundwater belongs to the landowner. How prior appropriation, groundwater conservation districts, and interstate compacts shape every drop.",
    author: "Policy Desk",
    date: "1 month ago",
    publishedAt: "2026-05-28T01:00:00",
    image: water,
    topics: ["economy", "infrastructure"],
    subcategory: "infrastructure",
  },
  {
    slug: "texas-constitutional-amendments-guide",
    category: "Legislature",
    title: "A Guide to Texas Constitutional Amendments and Why There Are So Many",
    dek: "Texas has amended its 1876 constitution more than 500 times. Here's how the two-thirds legislative vote and statewide ballot referendum work — and how to read the November propositions.",
    author: "Civics Desk",
    date: "1 month ago",
    publishedAt: "2026-05-28T02:00:00",
    image: gavel,
    topics: ["voting-policy", "elections"],
    subcategory: "voting",
  },
  {
    slug: "texas-open-meetings-public-info",
    category: "Legislature",
    title: "The Texas Open Meetings & Public Information Acts: Your Sunshine Rights",
    dek: "Every city council, school board, and commissioners court in Texas operates under sunshine laws. Here's how to read a posted agenda, file a public information request, and challenge a closed-door vote.",
    author: "Civics Desk",
    date: "1 week ago",
    publishedAt: "2026-06-19T14:00:00",
    image: openmeeting,
    topics: ["legislature", "governor-leadership"],
    subcategory: "government",
  },
  {
    slug: "why-texas-has-no-income-tax",
    category: "Tax & Spending",
    title: "Why Texas Has No State Income Tax — and What Pays for Government Instead",
    dek: "Texas is one of nine states without an income tax, and the 2019 constitutional amendment makes it nearly impossible to enact one. Here's the sales-tax-and-property-tax model that funds the second-largest state in the union.",
    author: "Taxpayer Desk",
    date: "1 week ago",
    publishedAt: "2026-06-19T15:00:00",
    image: salestax,
  },
  {
    slug: "texas-attorney-general-powers",
    category: "Legislature",
    title: "The Powers of the Texas Attorney General Explained",
    dek: "From multistate lawsuits and consumer protection to child-support enforcement and open-records opinions — what the elected Attorney General of Texas actually does, and the statutory limits of the office.",
    author: "Civics Desk",
    date: "Just published",
    publishedAt: "2026-06-26T12:00:00",
    image: ag,
    publishAt: "2026-06-29T11:00:00Z",
  },
  {
    slug: "texas-governor-powers",
    category: "Legislature",
    title: "The Powers of the Texas Governor Explained",
    dek: "Texas has one of the most constitutionally limited governors in the country — and one of the most politically powerful. Here's what the office can do with appointments, vetoes, special sessions, and the line-item veto.",
    author: "Civics Desk",
    date: "Just published",
    publishedAt: "2026-06-26T13:00:00",
    image: governor,
    publishAt: "2026-07-02T11:00:00Z",
  },
  {
    slug: "texas-border-policy-full-guide",
    category: "Border",
    title:
      "Texas Border Policy Explained: The Full Guide to Operation Lone Star, State Authority & the Rio Grande Fight",
    dek: "The definitive Keep TX Red guide to Texas border policy in Houston, the Rio Grande Valley, and Austin — Operation Lone Star, state vs. federal authority, DPS, the Texas National Guard, and the 1,254-mile Rio Grande line.",
    author: "Border Bureau",
    date: "Pillar guide",
    publishedAt: "2026-06-27T09:00:00",
    image: border,
    pillar: true,
    featured: true,
    topics: ["legislature", "governor-leadership"],
    subcategory: "government",
  },
  {
    slug: "texas-energy-economy-overview",
    category: "Energy",
    title: "The Texas Energy Economy: A Full Overview of Oil, Gas, ERCOT, and the Grid That Powers America",
    dek: "How Texas became the energy capital of North America — Permian crude, Eagle Ford gas, ERCOT reliability, the Railroad Commission, and what the Houston-led oil and gas industry means for the Texas economy.",
    author: "Energy Desk",
    date: "Pillar guide",
    publishedAt: "2026-06-27T09:30:00",
    image: oil,
    pillar: true,
    topics: ["economy", "energy"],
    subcategory: "business",
  },
  {
    slug: "texas-voting-guide-2026",
    category: "Elections",
    title: "The Texas Voting Guide for 2026: Primaries, Runoffs, ID Rules, and the Calendar That Actually Matters",
    dek: "Everything a Texas voter needs for 2026 — registration deadlines, March primary, May runoff, November general, accepted photo ID, mail ballot rules, and how to find your polling place in Houston, Dallas, San Antonio, Austin, and beyond.",
    author: "Elections Desk",
    date: "Pillar guide",
    publishedAt: "2026-06-27T10:00:00",
    image: ballot,
    pillar: true,
    topics: ["elections", "voting-policy"],
    subcategory: "elections",
  },
  {
    slug: "texas-gun-laws-explained",
    category: "Legislature",
    title: "Texas Gun Laws Explained: What Every Texas Resident Should Know",
    dek: "A plain-English guide to Texas firearm law in 2026 — constitutional carry, License to Carry, purchase and ownership rules, restricted places, castle doctrine, and how state law interacts with federal firearms restrictions.",
    author: "Liberty Desk",
    date: "Evergreen guide",
    publishedAt: "2026-07-15T09:00:00",
    image: carry,
    pillar: true,
    contentCategory: "laws",
    lastReviewedDate: "2026-07-15",
    dateModified: "2026-07-15",
  },
  {
    slug: "texas-property-tax-laws-explained",
    category: "Tax & Spending",
    title: "Texas Property Tax Laws Explained: What Homeowners Need to Know",
    dek: "How Texas property tax law actually works in 2026 — appraisals, exemptions, rate-setting, ARB protests, truth-in-taxation notices, and the constitutional amendments that raised the homestead exemption to $140,000.",
    author: "Taxpayer Desk",
    date: "Evergreen guide",
    publishedAt: "2026-07-15T09:30:00",
    image: taxbill,
    pillar: true,
    contentCategory: "taxes",
    lastReviewedDate: "2026-07-15",
    dateModified: "2026-07-15",
  },
  {
    slug: "texas-election-laws-explained",
    category: "Elections",
    title: "Texas Election Laws Explained: Voting Rules, Registration, and Requirements",
    dek: "The definitive guide to Texas election law — voter registration, accepted photo ID, mail ballot eligibility, early voting, primary rules, runoffs, provisional ballots, and the enforcement provisions added by SB 1.",
    author: "Elections Desk",
    date: "Evergreen guide",
    publishedAt: "2026-07-15T10:00:00",
    image: voterreg,
    pillar: true,
    contentCategory: "elections",
    lastReviewedDate: "2026-07-15",
    dateModified: "2026-07-15",
  },
  {
    slug: "texas-new-laws-2026",
    category: "Legislature",
    title: "Texas New Laws 2026: Major Legislative Changes Explained",
    dek: "The major statutes that took effect in Texas for 2026 — property tax relief, education savings accounts, border security funding, criminal justice updates, and the effective dates every Texan should know.",
    author: "Austin Bureau",
    date: "Evergreen guide",
    publishedAt: "2026-07-15T10:30:00",
    image: rotunda,
    pillar: true,
    contentCategory: "laws",
    lastReviewedDate: "2026-07-15",
    dateModified: "2026-07-15",
  },
];

/** True if the article's publishAt is unset or has already passed (relative to `now`). */
export function isPublished(a: Article, now: Date = new Date()): boolean {
  return !a.publishAt || new Date(a.publishAt).getTime() <= now.getTime();
}

/** ARTICLES filtered to only those currently live. */
export function publishedArticles(now: Date = new Date()): Article[] {
  return ARTICLES.filter((a) => isPublished(a, now));
}

/** Sort articles by publishedAt descending (newest first). */
export function sortByDateDesc(a: Article, b: Article): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export const ELECTION_RACES = [
  { office: "U.S. Senate", incumbent: "Republican Hold", margin: "+12.4", status: "Likely R" },
  { office: "Governor (2026)", incumbent: "Republican Hold", margin: "+9.8", status: "Likely R" },
  { office: "Attorney General", incumbent: "Republican Hold", margin: "+10.2", status: "Safe R" },
  { office: "TX-15 (RGV)", incumbent: "Republican Flip", margin: "+4.1", status: "Lean R" },
  { office: "TX-28 (South TX)", incumbent: "Democrat Held", margin: "+2.7", status: "Tossup" },
  { office: "State Board of Education", incumbent: "Republican Majority", margin: "+8.0", status: "Safe R" },
];
