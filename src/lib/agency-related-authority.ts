import type { AgencyAuthorityLink } from "@/data/agency-authority";

const POLICING_COMPARISON_LINK: AgencyAuthorityLink = {
  label: "Texas Policing Agencies Compared",
  href: "/news/texas-policing-agencies-compared",
};

export function getAgencyRelatedAuthorityLinks(slug: string, related: readonly AgencyAuthorityLink[]) {
  const additions: Record<string, AgencyAuthorityLink[]> = {
    "texas-department-public-safety": [POLICING_COMPARISON_LINK, { label: "Texas open meetings and public information", href: "/news/texas-open-meetings-public-info" }],
    "health-human-services-commission": [{ label: "Texas government data and budget sources", href: "/data" }],
    "texas-commission-environmental-quality": [{ label: "Texas water rights and groundwater law", href: "/news/texas-water-rights-explained" }, { label: "Texas Water Development Board", href: "/texas-government/agencies/texas-water-development-board" }],
  };
  const extra = (additions[slug] ?? []).filter((item) => !related.some((existing) => existing.href === item.href));
  return extra.length ? [...related, ...extra] : related;
}
