import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";

const SECTIONS = [
  { title: "Operation Lone Star", description: "Texas-led border enforcement, deployments, costs, and legal challenges.", href: "/news/operation-lone-star" },
  { title: "State vs. Federal Role", description: "Where Texas authority ends and federal immigration authority begins.", href: "/news/border-security-state-role" },
  { title: "Border Geography", description: "The places, crossings, counties, and terrain behind the policy debate.", href: "/news/texas-border-geography-101" },
  { title: "Texas Laws", description: "Bills, statutes, court fights, and legislative action tied to border policy.", href: "/laws" },
];

export const Route = createFileRoute("/texas-border-security")({
  head: () => ({
    meta: [
      { title: "Texas Border & Immigration — Security, Enforcement & Policy" },
      { name: "description", content: "Texas border security and immigration coverage: Operation Lone Star, enforcement, ports of entry, state-federal authority, legislation, and developing news." },
      { property: "og:title", content: "Texas Border & Immigration — Keep TX Red" },
      { property: "og:description", content: "Texas border security, immigration enforcement, Operation Lone Star, and state-federal policy." },
      { property: "og:url", content: "https://keeptxred.com/texas-border-security" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-border-security" }],
  }),
  component: TexasBorderSecurityPage,
});

function TexasBorderSecurityPage() {
  return (
    <ContentPillarView
      hubSlug="texas-border-security"
      sections={SECTIONS}
      feedSection="border"
      heading="Texas at the Border"
      paragraphs={[
        "Keep TX Red follows the Texas-specific decisions behind border security and immigration enforcement: state deployments, state legislation, federal litigation, ports of entry, local impacts, and the agencies responsible for carrying policy out.",
        "This pillar separates breaking developments from evergreen context so readers can move from a headline to the underlying law, geography, authority, and policy history without leaving the topic.",
      ]}
      related={[
        { label: "Texas Laws & Legislature", href: "/laws" },
        { label: "Texas Politics & Government", href: "/texas-politics" },
        { label: "Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
      ]}
    />
  );
}
