import type { TexasPoliticalFigure } from "./texas-political-figures";

export type PoliticalFigureCategory =
  | "Statewide executive leaders"
  | "U.S. senators"
  | "Texas judicial leaders"
  | "Current U.S. representatives"
  | "Historical U.S. House leaders"
  | "Texas legislative leaders"
  | "Reconstruction and early GOP leaders"
  | "Party organizers and conservative activists";

type PoliticalFigureSource = { href: string; label: string };

export type ExtendedTexasPoliticalFigure = TexasPoliticalFigure & {
  category: PoliticalFigureCategory;
  seoKeywords: string[];
  relatedFigureSlugs?: string[];
  sources: PoliticalFigureSource[];
};

type FigureInput = {
  slug: string;
  name: string;
  category: PoliticalFigureCategory;
  kicker: string;
  description: string;
  years: string;
  texasRole: string;
  career: string;
  impact: string;
  context: string;
  legacy: string;
  officeHref?: string;
  officeLabel?: string;
  relatedFigureSlugs?: string[];
  seoKeywords?: string[];
  sources?: PoliticalFigureSource[];
};

const categoryLinks: Record<PoliticalFigureCategory, Array<{ href: string; label: string }>> = {
  "Statewide executive leaders": [
    { href: "/texas-government", label: "Texas Government" },
    { href: "/elections", label: "Texas Election Central" },
  ],
  "U.S. senators": [
    { href: "/texas-politics", label: "Texas Politics" },
    { href: "/elections", label: "Texas Election Central" },
  ],
  "Texas judicial leaders": [
    { href: "/texas-politics/texas-supreme-court-realignment", label: "Texas Supreme Court realignment" },
    { href: "/texas-government", label: "Texas Government" },
    { href: "/texas-law-policy", label: "Texas Law & Policy" },
  ],
  "Current U.S. representatives": [
    { href: "/elections", label: "Texas Election Central" },
    { href: "/texas-politics", label: "Texas Politics" },
  ],
  "Historical U.S. House leaders": [
    { href: "/texas-politics", label: "Texas Politics" },
    { href: "/texas-law-policy", label: "Texas Law & Policy" },
  ],
  "Texas legislative leaders": [
    { href: "/texas-legislature", label: "Texas Legislature" },
    { href: "/texas-legislature/current-session", label: "Current Texas legislative session" },
  ],
  "Reconstruction and early GOP leaders": [
    { href: "/texas-politics", label: "Texas Politics" },
    { href: "/texas-government", label: "Texas Government" },
  ],
  "Party organizers and conservative activists": [
    { href: "/texas-politics", label: "Texas Politics" },
    { href: "/elections", label: "Texas Election Central" },
  ],
};

const categorySources: Record<PoliticalFigureCategory, PoliticalFigureSource[]> = {
  "Statewide executive leaders": [
    { href: "https://www.sos.state.tx.us/elections/voter/elected.shtml", label: "Texas Secretary of State — statewide elected officials" },
    { href: "https://www.lrl.texas.gov/legeLeaders/CEO/index.cfm", label: "Texas Legislative Reference Library — chief elected officials" },
  ],
  "U.S. senators": [
    { href: "https://www.senate.gov/states/TX/senators.htm", label: "U.S. Senate — all Texas senators" },
    { href: "https://www.senate.gov/states/TX/timeline.shtml", label: "U.S. Senate — Texas Senate timeline" },
  ],
  "Texas judicial leaders": [
    { href: "https://www.txcourts.gov/supreme/about-the-court/justices/", label: "Supreme Court of Texas — justices" },
    { href: "https://texascourthistory.org/", label: "Texas Supreme Court Historical Society" },
  ],
  "Current U.S. representatives": [
    { href: "https://www.house.gov/representatives", label: "U.S. House — directory of representatives" },
    { href: "https://www.lrl.texas.gov/legeLeaders/CEO/index.cfm", label: "Texas Legislative Reference Library — Texas members of Congress" },
  ],
  "Historical U.S. House leaders": [
    { href: "https://history.house.gov/People/Search/", label: "U.S. House History, Art & Archives — people search" },
    { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas — Republican Party" },
  ],
  "Texas legislative leaders": [
    { href: "https://www.lrl.texas.gov/legeLeaders/members/lrlhome.cfm", label: "Texas Legislative Reference Library — legislators past and present" },
    { href: "https://www.lrl.texas.gov/legeLeaders/index.cfm", label: "Texas Legislative Reference Library — legislators and leaders" },
  ],
  "Reconstruction and early GOP leaders": [
    { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas — Republican Party" },
    { href: "https://www.tshaonline.org/handbook/entries/reconstruction", label: "Handbook of Texas — Reconstruction" },
  ],
  "Party organizers and conservative activists": [
    { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas — Republican Party" },
    { href: "https://www.tshaonline.org/handbook/entries/political-parties", label: "Handbook of Texas — Political Parties" },
  ],
};

const categoryContext: Record<PoliticalFigureCategory, string> = {
  "Statewide executive leaders": "Statewide executive power in Texas is divided among separately elected officials, so the office, the Legislature and the broader Republican coalition all matter when evaluating a leader's record.",
  "U.S. senators": "Texas senators operate simultaneously as statewide elected officials, federal lawmakers and national party figures, making both their Texas coalition and their work in Washington relevant.",
  "Texas judicial leaders": "Judicial profiles should distinguish legal method, institutional service and major rulings from campaign rhetoric because Texas judges serve in an elected judicial system with its own political history.",
  "Current U.S. representatives": "A congressional profile is most useful when it separates durable biography and legislative priorities from election-cycle details that belong in KeepTXRed's live race coverage.",
  "Historical U.S. House leaders": "These careers show how Texans accumulated committee, caucus and party power in Congress and how that influence affected both national policy and the state's Republican development.",
  "Texas legislative leaders": "Texas legislative power depends heavily on chamber rules, committee assignments and relationships with the presiding officers, so a member's institutional role matters alongside ideology and public messaging.",
  "Reconstruction and early GOP leaders": "Reconstruction-era Texas politics involved federal occupation, emancipation, constitutional change, racial violence and intense partisan conflict; durable profiles should preserve that context rather than flattening it into modern party labels.",
  "Party organizers and conservative activists": "Party building happens outside elected office as well as inside it, through fundraising, precinct organization, issue advocacy, candidate recruitment and grassroots networks that can reshape Republican primaries and statewide coalitions.",
};

export function createPoliticalFigure(input: FigureInput): ExtendedTexasPoliticalFigure {
  const relatedLinks = [
    ...(input.officeHref && input.officeLabel ? [{ href: input.officeHref, label: input.officeLabel }] : []),
    ...categoryLinks[input.category],
    { href: "/texas-politics/figures", label: "Texas Political Figures" },
  ].filter((link, index, links) => links.findIndex((candidate) => candidate.href === link.href) === index);
  const sources = [...(input.sources ?? []), ...categorySources[input.category]].filter(
    (source, index, list) => list.findIndex((candidate) => candidate.href === source.href) === index,
  );

  return {
    slug: input.slug,
    name: input.name,
    category: input.category,
    kicker: input.kicker,
    description: input.description,
    years: input.years,
    texasRole: input.texasRole,
    seoKeywords: Array.from(new Set([input.name, input.texasRole, "Texas politics", "Texas Republican history", ...(input.seoKeywords ?? [])])),
    relatedFigureSlugs: input.relatedFigureSlugs,
    sources,
    sections: [
      { heading: `${input.name}: career and Texas role`, body: input.career },
      { heading: `Why ${input.name} matters`, body: input.impact },
      { heading: "Political context, record and debate", body: input.context },
      { heading: "Where this career fits in Texas political history", body: `${input.legacy} ${categoryContext[input.category]}` },
    ],
    relatedLinks,
  };
}
