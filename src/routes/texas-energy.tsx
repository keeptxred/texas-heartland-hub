import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { EvergreenAuthorityReference } from "@/components/authority/EvergreenAuthorityReference";

const SECTIONS = [
  { title: "Permian Basin", description: "Oil and gas production, infrastructure, jobs, and policy in West Texas.", href: "/news/permian-energy" },
  { title: "ERCOT & the Grid", description: "Reliability, generation, transmission, demand, and the Texas power market.", href: "/news/texas-grid-ercot-explained" },
  { title: "Energy Policy", description: "Regulation, legislation, pipelines, refineries, LNG, and state energy agencies.", href: "/news/texas-energy-policy-guide" },
  { title: "Texas Economy", description: "How energy connects to jobs, taxes, investment, and the broader state economy.", href: "/texas-economy" },
];

const VERIFIED = "Reviewed against the cited official institutional sources on August 11, 2026.";

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
    <>
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
          { label: "TexasDefined: Choosing a Texas electricity plan", href: "https://texasdefined.com/article/how-to-choose-electricity-plan-texas" },
          { label: "TexasDefined: Texas jobs and industries", href: "https://texasdefined.com/article/texas-jobs-economy-industries" },
        ]}
      />
      <EvergreenAuthorityReference
        eyebrow="Energy authority map"
        title="Who controls what in Texas energy"
        summary="Texas energy does not run through one agency. Grid operations, utility regulation, oil-and-gas regulation and legislation sit in different institutions. This reference separates those roles so a reader can move from an energy headline to the office or record that actually controls the issue."
        institutions={[
          { name: "ERCOT", href: "https://www.ercot.com/about", role: "Operates the ERCOT power system and wholesale-market functions for its region.", scopeNote: "ERCOT operates the grid; it is not a retail electric provider and does not own generation or transmission assets." },
          { name: "Public Utility Commission of Texas", href: "https://www.puc.texas.gov/", role: "State utility regulator with jurisdiction over ERCOT activities and major electric-market regulatory responsibilities.", scopeNote: "Consumer utility complaints and regulatory proceedings belong with PUCT rather than ERCOT grid operations." },
          { name: "Railroad Commission of Texas", href: "https://www.rrc.texas.gov/about-us/faqs/rrc-authority-and-jurisdiction/", role: "Primary state regulator for oil and natural gas production, pipeline transporters and several related energy industries.", scopeNote: "Despite its name, the Railroad Commission no longer regulates railroads." },
          { name: "Texas Legislature", href: "/texas-legislature", role: "Creates and changes the statutes that define agency authority, market rules and energy-policy mandates.", scopeNote: "Use the bill database for filed measures and official legislative actions." },
        ]}
        questions={[
          { question: "Does ERCOT regulate electric utilities?", answer: "ERCOT operates the grid and market functions assigned to it. The Public Utility Commission of Texas is the state regulator with jurisdiction over ERCOT activities and utility regulation. Keeping those roles separate is essential when assigning responsibility for a grid or consumer issue.", href: "/news/texas-grid-ercot-explained", linkLabel: "Read the ERCOT explainer" },
          { question: "Who regulates Texas oil and gas production?", answer: "The Railroad Commission of Texas has primary state regulatory jurisdiction over oil and natural gas exploration, production and transportation, along with several related pipeline and natural-gas functions.", href: "/news/permian-energy", linkLabel: "Follow Permian Basin coverage" },
          { question: "Where do Texas energy rules come from?", answer: "The Legislature establishes statutory authority and can change the policy framework; agencies and ERCOT implement responsibilities assigned by law and regulation. For a specific proposal, follow the bill record and then the responsible regulator.", href: "/bills", linkLabel: "Search Texas bills" },
        ]}
        sources={[
          { name: "ERCOT — About", url: "https://www.ercot.com/about", note: "Official description of ERCOT grid and market responsibilities." },
          { name: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/", note: "Official utility-regulation and ERCOT-oversight source." },
          { name: "Railroad Commission — Authority and Jurisdiction", url: "https://www.rrc.texas.gov/about-us/faqs/rrc-authority-and-jurisdiction/", note: "Official description of RRC regulatory jurisdiction." },
          { name: "Texas Legislature Online", url: "https://capitol.texas.gov/", note: "Official bills, actions, statutes and legislative records." },
        ]}
        methodology="Keep TX Red separates operational, regulatory and legislative authority instead of treating 'Texas energy' as one institution. The descriptions above summarize institutional responsibilities from official sources and avoid live market statistics that can change daily."
        lastVerified={VERIFIED}
      />
    </>
  );
}
