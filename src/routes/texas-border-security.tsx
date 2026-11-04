import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { SupportingGuideGrid } from "@/components/supporting-guide-grid";
import { BorderSecurityAuthorityResearch } from "@/components/border-security-authority-research";
import { buildSeo } from "@/lib/seo";

const OPERATION_LONE_STAR_SOURCE = "https://gov.texas.gov/operationlonestar";

const SECTIONS = [
  { title: "Operation Lone Star", description: "Texas-led border enforcement, deployments, costs, and legal challenges.", href: OPERATION_LONE_STAR_SOURCE },
  { title: "State vs. Federal Role", description: "Where Texas authority ends and federal immigration authority begins.", href: "#border-powers" },
  { title: "Border Geography", description: "The places, crossings, counties, and terrain behind the policy debate.", href: "/news/texas-border-geography-101" },
  { title: "Texas Laws", description: "Bills, statutes, court fights, and legislative action tied to border policy.", href: "/laws" },
];

const TEXAS_BORDER_TITLE = "Texas Border Security & Immigration Policy";
const TEXAS_BORDER_DESCRIPTION =
  "Compare Texas and federal border authority, the enacted state border-security budget, SB 4 court orders, and official Texas-Mexico crossing records.";

export function texasBorderSecurityHead() {
  return buildSeo({
    title: TEXAS_BORDER_TITLE,
    description: TEXAS_BORDER_DESCRIPTION,
    path: "/texas-border-security",
    type: "website",
    imageAlt: "Keep TX Red Texas border security and immigration policy coverage",
  });
}

export const Route = createFileRoute("/texas-border-security")({
  head: texasBorderSecurityHead,
  component: TexasBorderSecurityPage,
});

function TexasBorderSecurityPage() {
  return (
    <>
      <ContentPillarView
        hubSlug="texas-border-security"
        sections={SECTIONS}
        feedSection="border"
        featuredContent={<BorderSecurityAuthorityResearch />}
        heading="Texas at the Border"
        paragraphs={[
          "Keep TX Red follows the Texas-specific decisions behind border security and immigration enforcement: state deployments, state legislation, federal litigation, ports of entry, local impacts, and the agencies responsible for carrying policy out.",
          "This pillar separates breaking developments from evergreen context so readers can move from a headline to the underlying law, geography, authority, and policy history without leaving the topic.",
        ]}
        related={[
          { label: "Texas Laws & Legislature", href: "/laws" },
          { label: "Texas Politics & Government", href: "/texas-politics" },
          { label: "Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
          { label: "TexasDefined: Texas cities and regional differences", href: "https://texasdefined.com/article/texas-major-cities-regional-differences" },
          { label: "TexasDefined: Texas borderlands historic sites", href: "https://texasdefined.com/article/texas-borderlands-historic-sites-guide" },
        ]}
      />
      <SupportingGuideGrid pillarHref="/texas-border-security" />
    </>
  );
}