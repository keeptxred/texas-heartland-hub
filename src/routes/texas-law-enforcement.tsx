import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { SupportingGuideGrid } from "@/components/supporting-guide-grid";

const SECTIONS = [
  { title: "Who Does What Guide", description: "Start here: DPS, Highway Patrol, Texas Rangers, criminal investigations, local agencies, and public-safety authority.", href: "/guides/texas-law-enforcement-public-safety-guide" },
  { title: "Texas Laws", description: "Criminal law, public-safety statutes, enforcement authority, and legal changes.", href: "/laws" },
  { title: "Texas Legislature", description: "Bills, committees, hearings, and votes affecting law enforcement and public safety.", href: "/texas-legislature" },
  { title: "Border Security", description: "DPS, Operation Lone Star, border enforcement, and public-safety operations.", href: "/texas-border-security" },
];

export const Route = createFileRoute("/texas-law-enforcement")({
  head: () => ({
    meta: [
      { title: "Texas Law Enforcement & Public Safety — Police, DPS & Policy" },
      { name: "description", content: "Texas law enforcement and public safety coverage: police, sheriffs, DPS, criminal justice, emergency response, enforcement actions, legislation, and public-safety policy." },
      { property: "og:title", content: "Texas Law Enforcement & Public Safety — Keep TX Red" },
      { property: "og:description", content: "Texas police, sheriffs, DPS, criminal justice, emergency response, and public-safety policy." },
      { property: "og:url", content: "https://keeptxred.com/texas-law-enforcement" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-law-enforcement" }],
  }),
  component: TexasLawEnforcementPage,
});

function TexasLawEnforcementPage() {
  return (
    <>
      <ContentPillarView
        hubSlug="texas-law-enforcement"
        sections={SECTIONS}
        feedSection="law-enforcement"
        heading="Public Safety Across Texas"
        paragraphs={[
          "Keep TX Red follows the agencies, officers, laws, courts, and policy decisions behind statewide and local public safety. Coverage includes Texas DPS, sheriffs, police departments, major enforcement actions, criminal-justice policy, and emergency response when the story has a clear statewide or public-policy impact.",
          "The pillar connects breaking enforcement news to the laws, agencies, legislative decisions, and government authority that explain how Texas public safety actually works.",
        ]}
        related={[
          { label: "Read the law enforcement guide", href: "/guides/texas-law-enforcement-public-safety-guide" },
          { label: "Texas Border & Immigration", href: "/texas-border-security" },
          { label: "Texas Laws & Legislature", href: "/laws" },
          { label: "Texas Politics & Government", href: "/texas-politics" },
        ]}
      />
      <SupportingGuideGrid pillarHref="/texas-law-enforcement" />
    </>
  );
}
