import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { SupportingGuideGrid } from "@/components/supporting-guide-grid";
import { EvergreenAuthorityReference } from "@/components/authority/EvergreenAuthorityReference";

const SECTIONS = [
  { title: "Agriculture Agencies & Authority", description: "Find the state institutions responsible for agriculture programs, water planning, legislation, and rural policy.", href: "/texas-government" },
  { title: "Rural Economy", description: "Jobs, taxes, infrastructure, and business conditions beyond the major metros.", href: "/texas-economy" },
  { title: "Water & Land", description: "Water rights, drought, land use, and resources that shape farms and ranches.", href: "/news/texas-water-rights-explained" },
  { title: "Laws & Legislature", description: "Bills, regulation, and state policy affecting agriculture and rural Texas.", href: "/laws" },
];

const VERIFIED = "Reviewed against the cited official institutional sources on August 11, 2026.";

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
    <>
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
          { label: "Texas Government & Agencies", href: "/texas-government" },
          { label: "Texas Economy & Small Business", href: "/texas-economy" },
          { label: "Texas Laws & Legislature", href: "/laws" },
          { label: "Texas Politics & Government", href: "/texas-politics" },
        ]}
      />
      <EvergreenAuthorityReference
        eyebrow="Agriculture authority map"
        title="Who governs Texas agriculture, land and rural policy"
        summary="Agriculture policy crosses more than one agency. Production and consumer-protection programs, water planning and regulation, federal farm programs, and state legislation each live in different institutions. The useful question is not simply 'what is the agriculture rule?' but which authority owns that part of the system."
        institutions={[
          { name: "Texas Department of Agriculture", href: "https://texasagriculture.gov/", role: "State agriculture agency with production-agriculture, consumer-protection, marketing and rural-development responsibilities.", scopeNote: "TDA's responsibilities include programs and regulation across agriculture, but it is not the sole authority for Texas water or federal farm programs." },
          { name: "Texas Water Development Board", href: "https://www.twdb.texas.gov/", role: "State water-planning, data and financing institution central to long-range water supply and drought planning.", scopeNote: "Water rights, environmental regulation and local groundwater governance can involve different authorities." },
          { name: "U.S. Department of Agriculture", href: "https://www.usda.gov/", role: "Federal department responsible for national farm, conservation, rural-development, food and agricultural programs.", scopeNote: "Federal program eligibility and payments should be verified with USDA or the responsible federal program office." },
          { name: "Texas Legislature", href: "/texas-legislature", role: "Creates state statutes affecting agriculture, water, taxes, rural infrastructure and agency authority.", scopeNote: "Use the bill tracker for proposals and the enacted law for final requirements." },
        ]}
        questions={[
          { question: "Is the Texas Department of Agriculture responsible for every agriculture issue?", answer: "No. TDA handles a broad agriculture portfolio, but water planning, environmental rules, groundwater, federal farm programs, taxes and local land questions can belong to other state, federal or local institutions.", href: "https://texasagriculture.gov/", linkLabel: "Visit the Texas Department of Agriculture" },
          { question: "Where should a producer verify a water-policy claim?", answer: "Start by identifying whether the issue is statewide water planning, a water right or environmental permit, a groundwater district rule, or a federal program. Texas water governance is divided among several institutions, so the controlling source depends on the specific decision.", href: "/news/texas-water-rights-explained", linkLabel: "Read the Texas water-rights explainer" },
          { question: "How should readers track a proposed agriculture law?", answer: "Use the official bill history for text, sponsors, actions and votes; then identify the agency or local authority responsible for implementation after enactment. A filed bill is not the same thing as current law.", href: "/bills", linkLabel: "Search Texas bills" },
        ]}
        sources={[
          { name: "Texas Department of Agriculture", url: "https://texasagriculture.gov/", note: "Official state agriculture-program and regulatory source." },
          { name: "Texas Water Development Board", url: "https://www.twdb.texas.gov/", note: "Official state water-planning, data and financing source." },
          { name: "U.S. Department of Agriculture", url: "https://www.usda.gov/", note: "Official federal agriculture source." },
          { name: "Texas Legislature Online", url: "https://capitol.texas.gov/", note: "Official state legislative records." },
        ]}
        methodology="Keep TX Red separates state agriculture programs, water planning, federal agriculture programs and legislation instead of attributing the entire rural-policy system to one office. Program eligibility, drought status and other changing conditions should be rechecked with the cited responsible authority."
        lastVerified={VERIFIED}
      />
      <SupportingGuideGrid pillarHref="/texas-agriculture" />
    </>
  );
}
