import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { SupportingGuideGrid } from "@/components/supporting-guide-grid";
import { EvergreenAuthorityReference } from "@/components/authority/EvergreenAuthorityReference";

const SECTIONS = [
  { title: "Veterans Services & Agencies", description: "Start with the state and federal institutions responsible for veteran services, benefits, employment, education, and military families.", href: "/texas-government" },
  { title: "Laws & Benefits Policy", description: "Legislation and policy affecting veterans, benefits, and military families.", href: "/laws" },
  { title: "Texas Government", description: "State agencies and officials responsible for veterans policy and services.", href: "/texas-government" },
  { title: "Representatives", description: "Find Texas elected officials and follow the offices shaping veterans policy.", href: "/representatives" },
];

const VERIFIED = "Reviewed against the cited official institutional sources on August 11, 2026.";

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
    <>
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
          { label: "Texas Government & Agencies", href: "/texas-government" },
          { label: "Texas Laws & Legislature", href: "/laws" },
          { label: "Texas Politics & Government", href: "/texas-politics" },
          { label: "Latest Texas News", href: "/news" },
        ]}
      />
      <EvergreenAuthorityReference
        eyebrow="Veterans authority map"
        title="State, federal and military roles for Texas veterans"
        summary="Veterans coverage frequently mixes three separate systems: Texas veteran-service programs, federal VA benefits, and military command or installation matters. This reference keeps those responsibilities separate so readers know where a benefit, policy or military decision actually originates."
        institutions={[
          { name: "Texas Veterans Commission", href: "https://tvc.texas.gov/", role: "Texas state agency focused on veteran services, claims assistance, employment, education and other state veteran programs.", scopeNote: "TVC can help veterans navigate services, but federal VA benefit eligibility and awards are governed by federal law and VA processes." },
          { name: "U.S. Department of Veterans Affairs", href: "https://www.va.gov/", role: "Federal department administering major veterans benefits and health-care programs, including disability, education, pensions and home-loan benefits.", scopeNote: "For an individual federal benefit determination, the VA record and applicable federal rules control." },
          { name: "Texas Military Department", href: "https://tmd.texas.gov/about-us", role: "Texas military organization including the Texas Army National Guard, Texas Air National Guard and Texas State Guard.", scopeNote: "Military command, activation and installation issues are distinct from veteran-benefit administration." },
          { name: "Texas Legislature", href: "/texas-legislature", role: "Creates state statutes and appropriations affecting Texas veteran programs, state benefits and military-related policy.", scopeNote: "A proposed bill does not change current benefits until it completes the legislative process and takes effect." },
        ]}
        questions={[
          { question: "Are Texas veteran benefits the same as federal VA benefits?", answer: "No. Texas can provide state programs and benefits, while the U.S. Department of Veterans Affairs administers federal benefits under federal law. A veteran may interact with both systems for different purposes.", href: "https://tvc.texas.gov/", linkLabel: "Visit the Texas Veterans Commission" },
          { question: "Who can help with a VA claim in Texas?", answer: "The Texas Veterans Commission provides state-level veteran assistance, including claims-related support, while the VA makes federal benefit decisions. Readers should distinguish assistance with a claim from the federal agency that adjudicates it." },
          { question: "Who controls Texas National Guard and State Guard matters?", answer: "The Texas Military Department is the state military organization. The legal command framework can depend on the force and mission, including whether personnel are serving under state or federal authority.", href: "https://tmd.texas.gov/about-us", linkLabel: "Read the Texas Military Department overview" },
        ]}
        sources={[
          { name: "Texas Veterans Commission", url: "https://tvc.texas.gov/", note: "Official Texas veteran-services source." },
          { name: "U.S. Department of Veterans Affairs", url: "https://www.va.gov/", note: "Official federal veterans-benefits and health-care source." },
          { name: "Texas Military Department — About", url: "https://tmd.texas.gov/about-us", note: "Official Texas military organization source." },
          { name: "Texas Legislature Online", url: "https://capitol.texas.gov/", note: "Official Texas legislative records." },
        ]}
        methodology="Keep TX Red separates Texas veteran-service programs, federal VA benefits and military command matters. Benefit amounts, eligibility, deadlines and individual claim status are not inferred from news coverage and should be verified with the responsible official program."
        lastVerified={VERIFIED}
      />
      <SupportingGuideGrid pillarHref="/texas-veterans" />
    </>
  );
}
