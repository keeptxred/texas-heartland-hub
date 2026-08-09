import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";

const SECTIONS = [
  { title: "Permian Basin", description: "Oil and gas production, infrastructure, jobs, and policy in West Texas.", href: "/news/permian-energy" },
  { title: "ERCOT & the Grid", description: "Reliability, generation, transmission, demand, and the Texas power market.", href: "/news/texas-grid-ercot-explained" },
  { title: "Energy Policy", description: "Regulation, legislation, pipelines, refineries, LNG, and state energy agencies.", href: "/news/texas-energy-policy-guide" },
  { title: "Texas Economy", description: "How energy connects to jobs, taxes, investment, and the broader state economy.", href: "/texas-economy" },
];

export const Route = createFileRoute("/texas-energy")({
  head: () => ({
    meta: [
      { title: "Texas Energy & Oil — ERCOT, Permian Basin & Energy Policy" },
      { name: "description", content: "Texas energy coverage spanning oil and gas, the Permian Basin, ERCOT, the electric grid, pipelines, refineries, LNG, regulation, and legislation." },
      { property: "og:title", content: "Texas Energy & Oil — Keep TX Red" },
      { property: "og:description", content: "Oil and gas, ERCOT, the Permian Basin, electricity reliability, and Texas energy policy." },
      { property: "og:url", content: "https://keeptxred.com/texas-energy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-energy" }],
  }),
  component: TexasEnergyPage,
});

function TexasEnergyPage() {
  return (
    <ContentPillarView
      hubSlug="texas-energy"
      sections={SECTIONS}
      feedSection="energy"
      heading="The Energy System Behind Texas"
      paragraphs={[
        "Energy is both an industry and a public-policy system in Texas. Keep TX Red connects oil and gas production, ERCOT, generation, transmission, reliability, pipelines, refineries, LNG, and the state agencies and lawmakers that govern them.",
        "The pillar is built to connect developing energy news with evergreen explainers so readers can understand not only what changed, but which institution made the decision and what it can mean for Texans.",
      ]}
      related={[
        { label: "Texas Economy & Small Business", href: "/texas-economy" },
        { label: "Texas Laws & Legislature", href: "/laws" },
        { label: "Texas Politics & Government", href: "/texas-politics" },
      ]}
    />
  );
}
