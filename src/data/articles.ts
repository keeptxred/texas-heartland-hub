export type Article = {
  slug: string;
  category: "Legislature" | "Border" | "Elections" | "Tax & Spending" | "Energy" | "Education";
  title: string;
  dek: string;
  author: string;
  date: string;
  image: string;
  featured?: boolean;
};

import capitol from "@/assets/capitol.jpg";
import border from "@/assets/border.jpg";
import ballot from "@/assets/ballot.jpg";
import suburb from "@/assets/suburb.jpg";
import podium from "@/assets/podium.jpg";

export const ARTICLES: Article[] = [
  {
    slug: "property-tax-relief-package",
    category: "Tax & Spending",
    title: "New Property Tax Relief Package Heads to Floor for Decisive Vote",
    dek: "GOP leaders signal confidence as the historic $18 billion plan reaches final deliberations in the House, promising compression to district maintenance rates.",
    author: "Staff Reporter",
    date: "2 hours ago",
    image: capitol,
    featured: true,
  },
  {
    slug: "operation-lone-star",
    category: "Border",
    title: "Operation Lone Star Reinforces Key Crossing Points Along the Rio Grande",
    dek: "Texas Department of Public Safety expands buoy barriers and razor wire as federal pushback intensifies.",
    author: "Border Bureau",
    date: "5 hours ago",
    image: border,
  },
  {
    slug: "voter-id-surge",
    category: "Elections",
    title: "Voter Registration Surges in Red Wall Counties Ahead of 2026 Primary",
    dek: "Suburban counties around Houston and DFW post double-digit gains in conservative voter rolls.",
    author: "Politics Desk",
    date: "1 day ago",
    image: ballot,
  },
  {
    slug: "school-board-elections",
    category: "Education",
    title: "Local School Board Elections: Why Every Conservative Vote Matters",
    dek: "Parental rights coalitions are running slates of candidates in 87 ISDs across the state this May.",
    author: "Lone Star Civics",
    date: "2 days ago",
    image: suburb,
  },
  {
    slug: "speaker-special-session",
    category: "Legislature",
    title: "Special Session Rumors Grow as Property Tax Relief Stalls",
    dek: "Conservative caucus members say they will not adjourn until appraisal caps are codified.",
    author: "Austin Bureau",
    date: "3 days ago",
    image: podium,
  },
  {
    slug: "isd-tax-burdens",
    category: "Tax & Spending",
    title: "The 10 Texas Counties with the Highest School Tax Burdens in 2024",
    dek: "Our analysis of TEA filings shows where homeowners are paying the steepest ISD M&O rates.",
    author: "Data Desk",
    date: "4 days ago",
    image: suburb,
  },
  {
    slug: "permian-energy",
    category: "Energy",
    title: "Permian Basin Production Hits Record as Federal Permitting Threats Loom",
    dek: "West Texas operators warn of EPA overreach even as output climbs to 6.1 million barrels per day.",
    author: "Energy Desk",
    date: "5 days ago",
    image: border,
  },
  {
    slug: "homestead-exemption-explained",
    category: "Tax & Spending",
    title: "The Texas Homestead Exemption Explained: What Every Homeowner Should Claim",
    dek: "A plain-English walkthrough of the $100,000 school-district homestead exemption, over-65 freezes, and disabled-veteran reductions — and how to file with your county appraisal district.",
    author: "Taxpayer Desk",
    date: "1 week ago",
    image: suburb,
  },
  {
    slug: "how-a-bill-becomes-texas-law",
    category: "Legislature",
    title: "How a Bill Becomes Texas Law: A Citizen's Field Guide to the 88th Legislature",
    dek: "From filing in the House clerk's office to the Governor's desk — every committee, calendar, and conference step that shapes the bills you actually live under.",
    author: "Civics Desk",
    date: "1 week ago",
    image: capitol,
  },
  {
    slug: "constitutional-carry-one-year-later",
    category: "Legislature",
    title: "Constitutional Carry in Texas: What the Law Actually Says",
    dek: "House Bill 1927 lets eligible Texans 21 and older carry a handgun without a permit. Here's where you still can't carry, and what reciprocity means on the road.",
    author: "Liberty Desk",
    date: "2 weeks ago",
    image: podium,
  },
  {
    slug: "primary-vs-general-election",
    category: "Elections",
    title: "Primary vs. General: Why the March Ballot Decides More Than November Does",
    dek: "In most Texas districts the Republican primary is the real election. We break down open primaries, runoff math, and why low-turnout March races set the next decade of policy.",
    author: "Elections Desk",
    date: "2 weeks ago",
    image: ballot,
  },
  {
    slug: "school-choice-esa-guide",
    category: "Education",
    title: "Education Savings Accounts: A Parent's Guide to Texas School Choice",
    dek: "How the new ESA program works, who qualifies, what expenses are covered, and the application timeline parents need to know before the fall enrollment window.",
    author: "Education Desk",
    date: "3 weeks ago",
    image: suburb,
  },
  {
    slug: "appraisal-protest-playbook",
    category: "Tax & Spending",
    title: "How to Protest Your Property Appraisal — and Actually Win",
    dek: "Deadlines, evidence packets, equal-and-uniform comps, and the ARB hearing script that gets values reduced. A practical playbook for every Texas homeowner.",
    author: "Taxpayer Desk",
    date: "3 weeks ago",
    image: suburb,
  },
  {
    slug: "texas-grid-ercot-explained",
    category: "Energy",
    title: "The Texas Grid Explained: ERCOT, Reliability, and Why Independence Still Matters",
    dek: "Why Texas runs its own grid, what the Public Utility Commission actually controls, and the reforms keeping the lights on through summer peaks and winter freezes.",
    author: "Energy Desk",
    date: "1 month ago",
    image: border,
  },
  {
    slug: "border-security-state-role",
    category: "Border",
    title: "Operation Lone Star: The State's Role in Border Security",
    dek: "How Texas DPS, the National Guard, and county sheriffs coordinate enforcement along the Rio Grande — and the constitutional case for state action when Washington won't act.",
    author: "Border Bureau",
    date: "1 month ago",
    image: border,
  },
];

export const ELECTION_RACES = [
  { office: "U.S. Senate", incumbent: "Republican Hold", margin: "+12.4", status: "Likely R" },
  { office: "Governor (2026)", incumbent: "Republican Hold", margin: "+9.8", status: "Likely R" },
  { office: "Attorney General", incumbent: "Republican Hold", margin: "+10.2", status: "Safe R" },
  { office: "TX-15 (RGV)", incumbent: "Republican Flip", margin: "+4.1", status: "Lean R" },
  { office: "TX-28 (South TX)", incumbent: "Democrat Held", margin: "+2.7", status: "Tossup" },
  { office: "State Board of Education", incumbent: "Republican Majority", margin: "+8.0", status: "Safe R" },
];