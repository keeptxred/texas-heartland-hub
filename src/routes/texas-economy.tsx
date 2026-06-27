import { createFileRoute } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";

const HUB = HUBS.find((h) => h.slug === "texas-economy")!;
const SECTIONS = [
  { title: "Energy & Oil", description: "Permian Basin, ERCOT, and the state's energy economy.", href: "/news/texas-energy-economy-overview" },
  { title: "Jobs & Employment", description: "Workforce, in-migration, and the Texas labor market.", href: "/texas-business" },
  { title: "Business Growth", description: "Corporate relocations, startups, and Texas's economic edge.", href: "/texas-business" },
  { title: "Taxes & State Budget", description: "Property taxes, sales tax, appraisals, and how Texas spends.", href: "/tax-calculator" },
];

export const Route = createFileRoute("/texas-economy")({
  head: () => ({
    meta: [
      { title: "Texas Economy — Energy, Jobs, Taxes & Business News" },
      { name: "description", content: "Analysis of Texas economic trends, energy, business growth, taxes, and employment across the Lone Star State." },
      { property: "og:title", content: "Texas Economy — Keep TX Red" },
      { property: "og:description", content: "Analysis of Texas economic trends, energy, business growth, taxes, and employment." },
      { property: "og:url", content: "/texas-economy" },
    ],
    links: [{ rel: "canonical", href: "/texas-economy" }],
  }),
  component: () => <HubView hub={HUB} sections={SECTIONS} />,
});