export type Hub = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  pillarSlug: string;
  articleSlugs: string[];
};

export const HUBS: Hub[] = [
  {
    slug: "texas-politics",
    title: "Texas Politics",
    eyebrow: "Section",
    intro:
      "From the Capitol in Austin to the county precinct chair, this is the conservative voter's map of how Texas politics actually works — primaries, runoffs, the legislature, statewide offices, and the local races that decide the next decade.",
    pillarSlug: "texas-voting-guide-2026",
    articleSlugs: [
      "texas-voting-guide-2026",
      "how-a-bill-becomes-texas-law",
      "primary-vs-general-election",
      "beginners-guide-texas-elections",
      "texas-voter-registration-guide",
      "texas-political-terminology",
      "texas-attorney-general-powers",
      "texas-governor-powers",
      "speaker-special-session",
      "voter-id-surge",
      "school-board-elections",
    ],
  },
  {
    slug: "texas-economy",
    title: "Texas Economy",
    eyebrow: "Section",
    intro:
      "The Texas economy runs on energy, property, and the absence of an income tax. This section explains how each piece fits together — what powers the grid, what fills the budget, and what every Texan pays to keep it all running.",
    pillarSlug: "texas-energy-economy-overview",
    articleSlugs: [
      "texas-energy-economy-overview",
      "permian-energy",
      "texas-grid-ercot-explained",
      "texas-energy-policy-guide",
      "why-texas-has-no-income-tax",
      "texas-property-tax-guide",
      "homestead-exemption-explained",
      "appraisal-protest-playbook",
      "county-appraisal-districts-explained",
      "isd-tax-burdens",
      "how-texas-counties-spend",
      "property-tax-relief-package",
    ],
  },
  {
    slug: "texas-policy-law",
    title: "Texas Policy & Law",
    eyebrow: "Section",
    intro:
      "Border security, constitutional carry, school choice, water rights, sunshine laws — the statutes and policy fights that define life in Texas, explained for the people who live under them.",
    pillarSlug: "texas-border-policy-full-guide",
    articleSlugs: [
      "texas-border-policy-full-guide",
      "operation-lone-star",
      "border-security-state-role",
      "texas-border-geography-101",
      "constitutional-carry-one-year-later",
      "texas-school-board-powers",
      "school-choice-esa-guide",
      "texas-school-finance-explained",
      "texas-water-rights-explained",
      "texas-constitutional-amendments-guide",
      "texas-open-meetings-public-info",
      "what-local-governments-control",
    ],
  },
];