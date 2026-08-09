import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";

const SECTIONS = [
  { title: "Texas Government", description: "State agencies and officials responsible for veterans policy and services.", href: "/texas-government" },
  { title: "Laws & Benefits Policy", description: "Legislation and policy affecting veterans, benefits, and military families.", href: "/laws" },
  { title: "Representatives", description: "Find Texas elected officials and follow the offices shaping veterans policy.", href: "/representatives" },
  { title: "Latest Texas News", description: "Current military, veterans, honors, and public-policy coverage from across Texas.", href: "/news" },
];

export const Route = createFileRoute("/texas-veterans")({
  head: () => ({
    meta: [
      { title: "Texas Veterans & Military — Benefits, Bases, Honors & Policy" },
      { name: "description", content: "Texas veterans and military coverage: service members, bases, benefits, honors, deployments, military families, and policy affecting Texans who served." },
      { property: "og:title", content: "Texas Veterans & Military — Keep TX Red" },
      { property: "og:description", content: "Texas veterans, service members, military installations, benefits, honors, and policy." },
      { property: "og:url", content: "https://keeptxred.com/texas-veterans" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-veterans" }],
  }),
  component: TexasVeteransPage,
});

function TexasVeteransPage() {
  return (
    <ContentPillarView
      hubSlug="texas-veterans"
      sections={SECTIONS}
      feedSection="veterans"
      heading="Service and Policy in Texas"
      paragraphs={[
        "Texas has a large military and veteran community, and decisions made by state and federal officials can affect benefits, installations, military families, honors, deployments, and local economies. This pillar keeps those developments together instead of scattering them across general government coverage.",
        "Military honors and commemorations belong here when the Texas veteran, service-member, installation, or public-policy connection is central to the story.",
      ]}
      related={[
        { label: "Texas Laws & Legislature", href: "/laws" },
        { label: "Texas Politics & Government", href: "/texas-politics" },
        { label: "Latest Texas News", href: "/news" },
      ]}
    />
  );
}
