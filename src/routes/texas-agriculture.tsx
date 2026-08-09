import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";

const SECTIONS = [
  { title: "Essential Agriculture Guide", description: "Start here: agencies, financing, water, land, rural infrastructure, and the policy system affecting Texas producers.", href: "/guides/texas-agriculture-rural-guide" },
  { title: "Rural Economy", description: "Jobs, taxes, infrastructure, and business conditions beyond the major metros.", href: "/texas-economy" },
  { title: "Water & Land", description: "Water rights, drought, land use, and resources that shape farms and ranches.", href: "/news/texas-water-rights-explained" },
  { title: "Laws & Legislature", description: "Bills, regulation, and state policy affecting agriculture and rural Texas.", href: "/laws" },
];

export const Route = createFileRoute("/texas-agriculture")({
  head: () => ({
    meta: [
      { title: "Texas Agriculture & Rural Texas — Farms, Ranches & Policy" },
      { name: "description", content: "Texas agriculture and rural coverage: farmers, ranchers, livestock, crops, drought, water, rural communities, the agricultural economy, and state policy." },
      { property: "og:title", content: "Texas Agriculture & Rural Texas — Keep TX Red" },
      { property: "og:description", content: "Farmers, ranchers, rural communities, water, livestock, crops, and Texas agricultural policy." },
      { property: "og:url", content: "https://keeptxred.com/texas-agriculture" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-agriculture" }],
  }),
  component: TexasAgriculturePage,
});

function TexasAgriculturePage() {
  return (
    <ContentPillarView
      hubSlug="texas-agriculture"
      sections={SECTIONS}
      feedSection="agriculture"
      heading="Texas Beyond the Metros"
      paragraphs={[
        "Agriculture remains inseparable from Texas water, land, transportation, trade, taxes, and rural economic policy. This pillar follows the decisions that affect farmers, ranchers, producers, agricultural businesses, and the communities built around them.",
        "Coverage is routed here when agriculture or rural Texas is the primary subject, keeping those stories from disappearing inside generic business or statewide-news categories.",
      ]}
      related={[
        { label: "Read the essential agriculture guide", href: "/guides/texas-agriculture-rural-guide" },
        { label: "Texas Economy & Small Business", href: "/texas-economy" },
        { label: "Texas Laws & Legislature", href: "/laws" },
        { label: "Texas Politics & Government", href: "/texas-politics" },
      ]}
    />
  );
}
