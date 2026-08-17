export type SourceAuthorityKind = "government" | "official" | "news" | "analysis";

export type SourceAuthorityProfile = {
  slug: string;
  name: string;
  aliases: string[];
  kind: SourceAuthorityKind;
  label: string;
  homepage: string;
  description: string;
  usage: string;
};

export const SOURCE_AUTHORITY_PROFILES: SourceAuthorityProfile[] = [
  {
    slug: "texas-legislature-online",
    name: "Texas Legislature Online",
    aliases: ["texas legislature", "texas legislature online", "capitol.texas.gov"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://capitol.texas.gov/",
    description: "The official Texas Legislature website for bills, resolutions, legislative histories, member information, committee activity, calendars, journals, and related records.",
    usage: "Keep TX Red uses Texas Legislature Online to verify bill text, status, authorship, legislative actions, committee referrals, votes, and other legislative records when those records are relevant to a story.",
  },
  {
    slug: "texas-secretary-of-state",
    name: "Texas Secretary of State",
    aliases: ["texas secretary of state", "secretary of state", "sos.state.tx.us"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://www.sos.state.tx.us/",
    description: "The Texas Secretary of State is the state's chief election officer and publishes official election guidance, election results, voter-registration information, and other state records.",
    usage: "Keep TX Red uses Secretary of State material to verify election dates, procedures, official results, voter-registration information, and other election administration facts.",
  },
  {
    slug: "office-of-the-governor",
    name: "Office of the Governor of Texas",
    aliases: ["office of governor greg abbott", "office of the governor", "gov.texas.gov"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://gov.texas.gov/",
    description: "The official website of the Governor of Texas, including executive orders, appointments, proclamations, press releases, speeches, and policy announcements.",
    usage: "Keep TX Red uses the Governor's office as a primary source for the administration's own orders, appointments, announcements, statements, and published policy positions.",
  },
  {
    slug: "texas-attorney-general",
    name: "Office of the Texas Attorney General",
    aliases: ["texas attorney general", "office of the attorney general", "texasag.gov"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://www.texasattorneygeneral.gov/",
    description: "The official website of the Office of the Texas Attorney General, including lawsuits, legal opinions, settlements, notices, and agency statements.",
    usage: "Keep TX Red uses Attorney General records to verify the office's filed actions, legal positions, opinions, settlements, and official statements.",
  },
  {
    slug: "texas-ethics-commission",
    name: "Texas Ethics Commission",
    aliases: ["texas ethics commission", "ethics.state.tx.us"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://www.ethics.state.tx.us/",
    description: "The state agency that administers and publishes records related to campaign finance, lobbying, personal financial statements, and ethics requirements under Texas law.",
    usage: "Keep TX Red uses Texas Ethics Commission records when verifying campaign-finance, lobbying, disclosure, and ethics information.",
  },
  {
    slug: "texas-education-agency",
    name: "Texas Education Agency",
    aliases: ["texas education agency", "tea.texas.gov"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://tea.texas.gov/",
    description: "The state agency responsible for public primary and secondary education, with official data, accountability records, guidance, reports, and agency actions.",
    usage: "Keep TX Red uses TEA publications to verify state education data, accountability results, rules, guidance, and official agency actions.",
  },
  {
    slug: "texas-comptroller",
    name: "Texas Comptroller of Public Accounts",
    aliases: ["texas comptroller", "comptroller.texas.gov"],
    kind: "government",
    label: "Primary government source",
    homepage: "https://comptroller.texas.gov/",
    description: "The state's chief tax collector, accountant, revenue estimator, treasurer, and purchasing manager, publishing official fiscal and economic data.",
    usage: "Keep TX Red uses Comptroller publications to verify state revenue, taxes, fiscal estimates, economic data, and other official financial records.",
  },
  {
    slug: "ercot",
    name: "ERCOT",
    aliases: ["ercot", "electric reliability council of texas", "ercot.com"],
    kind: "official",
    label: "Official system source",
    homepage: "https://www.ercot.com/",
    description: "The Electric Reliability Council of Texas operates the electric grid and wholesale electricity market for most of Texas and publishes grid conditions, market data, notices, and reports.",
    usage: "Keep TX Red uses ERCOT material to verify grid conditions, official notices, market information, and published system data.",
  },
  {
    slug: "texas-tribune",
    name: "The Texas Tribune",
    aliases: ["texas tribune", "the texas tribune", "texastribune.org"],
    kind: "news",
    label: "Reporting source",
    homepage: "https://www.texastribune.org/",
    description: "A Texas-focused nonprofit news organization covering state government, politics, policy, elections, and public affairs.",
    usage: "When a Texas Tribune report is part of a Keep TX Red story cluster, Keep TX Red preserves the source link and attributes claims that depend on that reporting.",
  },
  {
    slug: "texas-standard",
    name: "Texas Standard",
    aliases: ["texas standard", "texasstandard.org"],
    kind: "news",
    label: "Reporting source",
    homepage: "https://www.texasstandard.org/",
    description: "A statewide Texas public-radio news program and digital publication covering government, politics, culture, business, and public affairs.",
    usage: "When Texas Standard reporting is included in a Keep TX Red story cluster, Keep TX Red preserves the source link and attributes reporting-dependent claims.",
  },
  {
    slug: "texas-scorecard",
    name: "Texas Scorecard",
    aliases: ["texas scorecard", "texasscorecard.com"],
    kind: "analysis",
    label: "News and commentary source",
    homepage: "https://texasscorecard.com/",
    description: "A Texas-focused publication covering state and local government, elections, policy, and political commentary.",
    usage: "When Texas Scorecard material is included in a Keep TX Red story cluster, Keep TX Red preserves the source link and distinguishes sourced reporting or commentary from primary government records.",
  },
];

function normalizeSourceName(value: string): string {
  return value
    .toLowerCase()
    .replace(/https?:\/\/(?:www\.)?/g, "")
    .replace(/\s+[—–-]\s+(?:primary government source|official system source|reporting source|news and commentary source|source)$/i, "")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSourceAuthorityProfile(value: string | null | undefined): SourceAuthorityProfile | undefined {
  if (!value) return undefined;
  const normalized = normalizeSourceName(value);
  return SOURCE_AUTHORITY_PROFILES.find((profile) =>
    normalizeSourceName(profile.name) === normalized
    || profile.aliases.some((alias) => normalized.includes(normalizeSourceName(alias))),
  );
}

export function sourceAuthorityLabel(input: {
  source: string;
  url?: string | null;
  isPrimarySource?: boolean;
}): string {
  const profile = getSourceAuthorityProfile(`${input.source} ${input.url ?? ""}`);
  if (input.isPrimarySource) return `${input.source} — primary / official source`;
  if (profile) return `${input.source} — ${profile.label.toLowerCase()}`;
  return `${input.source} — published source`;
}
