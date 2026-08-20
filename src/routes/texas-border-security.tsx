import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { SupportingGuideGrid } from "@/components/supporting-guide-grid";
import { EvergreenAuthorityReference } from "@/components/authority/EvergreenAuthorityReference";

const OPERATION_LONE_STAR_SOURCE = "https://gov.texas.gov/operationlonestar";

const SECTIONS = [
  { title: "Operation Lone Star", description: "Texas-led border enforcement, deployments, costs, and legal challenges.", href: OPERATION_LONE_STAR_SOURCE },
  { title: "State vs. Federal Role", description: "Where Texas authority ends and federal immigration authority begins.", href: "/news/border-security-state-role" },
  { title: "Border Geography", description: "The places, crossings, counties, and terrain behind the policy debate.", href: "/news/texas-border-geography-101" },
  { title: "Texas Laws", description: "Bills, statutes, court fights, and legislative action tied to border policy.", href: "/laws" },
];

const VERIFIED = "Reviewed against the cited official institutional sources on August 11, 2026.";

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
    <>
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
          { label: "TexasDefined: Texas cities and regional differences", href: "https://texasdefined.com/article/texas-major-cities-regional-differences" },
          { label: "TexasDefined: Texas borderlands historic sites", href: "https://texasdefined.com/article/texas-borderlands-historic-sites-guide" },
        ]}
      />
      <EvergreenAuthorityReference
        eyebrow="Border authority map"
        title="Texas, federal and military roles at the border"
        summary="Border stories often combine separate legal systems. Texas public-safety agencies and the Texas Military Department carry out state missions, while federal agencies administer federal immigration and customs authorities. Courts and legislation can change the boundary between those responsibilities, so this page points readers to the institution behind each claim."
        institutions={[
          { name: "Texas Department of Public Safety", href: "https://www.dps.texas.gov/", role: "State public-safety agency whose divisions include Highway Patrol and Texas Rangers and which participates in Texas border-security operations.", scopeNote: "DPS criminal and public-safety authority is distinct from federal immigration administration." },
          { name: "Texas Military Department", href: "https://tmd.texas.gov/about-us", role: "State military organization that provides forces for state and federal missions and includes the Texas Army National Guard, Texas Air National Guard and Texas State Guard.", scopeNote: "The legal status and authority of personnel can depend on the mission and activation framework." },
          { name: "Operation Lone Star", href: OPERATION_LONE_STAR_SOURCE, role: "Governor's Office reference for the state's border-security mission involving DPS and Texas military forces.", scopeNote: "Operational claims and totals can change; use the official page for the state's current description of the mission." },
          { name: "U.S. Customs and Border Protection", href: "https://www.cbp.gov/border-security", role: "Federal border-security and customs agency responsible for federal border and port-of-entry functions.", scopeNote: "Federal immigration and customs authority should not be attributed to a Texas state agency." },
        ]}
        questions={[
          { question: "Is border enforcement controlled by one Texas agency?", answer: "No. Texas border policy can involve DPS, the Texas Military Department, the Governor's Office, local agencies and federal partners. The responsible institution depends on whether the issue is state criminal enforcement, a military mission, federal immigration authority, customs or a court order.", href: "/news/border-security-state-role", linkLabel: "Read the state-vs-federal guide" },
          { question: "Who runs Operation Lone Star?", answer: "The Governor's Office describes Operation Lone Star as a Texas border-security mission involving the Texas Department of Public Safety and Texas military forces, with the mix of state and federal coordination changing over time. Current operational claims should be checked against the official state source.", href: OPERATION_LONE_STAR_SOURCE, linkLabel: "Review the official Operation Lone Star source" },
          { question: "Where should a reader verify a new border law or court dispute?", answer: "Start with the enacted statute or bill history for state law, the actual court order or opinion for litigation, and the responsible state or federal agency for implementation. Keep TX Red links developing coverage back to those records instead of treating a press release as the final legal authority.", href: "/laws", linkLabel: "Browse Texas law references" },
        ]}
        sources={[
          { name: "Texas Governor — Operation Lone Star", url: OPERATION_LONE_STAR_SOURCE, note: "Official state description of the border-security mission." },
          { name: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/", note: "Official state public-safety agency source." },
          { name: "Texas Military Department — About", url: "https://tmd.texas.gov/about-us", note: "Official description of Texas military organization and mission." },
          { name: "U.S. Customs and Border Protection", url: "https://www.cbp.gov/border-security", note: "Federal border-security reference." },
          { name: "Texas Legislature Online", url: "https://capitol.texas.gov/", note: "Official Texas legislative records." },
        ]}
        methodology="This authority map separates state public safety, state military activity, federal border authority and legislation. It does not infer that participation in a joint operation transfers one institution's legal authority to another, and it avoids static enforcement totals that can quickly become stale."
        lastVerified={VERIFIED}
      />
      <SupportingGuideGrid pillarHref="/texas-border-security" />
    </>
  );
}
