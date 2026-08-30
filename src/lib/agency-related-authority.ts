import type { AgencyAuthorityLink } from "@/data/agency-authority";

const POLICING_COMPARISON_LINK: AgencyAuthorityLink = {
  label: "Texas Policing Agencies Compared",
  href: "/news/texas-policing-agencies-compared",
};

export function getAgencyRelatedAuthorityLinks(slug: string, related: readonly AgencyAuthorityLink[]) {
  if (slug !== "texas-department-public-safety" || related.some((item) => item.href === POLICING_COMPARISON_LINK.href)) {
    return related;
  }
  return [...related, POLICING_COMPARISON_LINK];
}
