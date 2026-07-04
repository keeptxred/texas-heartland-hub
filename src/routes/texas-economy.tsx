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
      { property: "og:url", content: "https://www.keeptxred.com/texas-economy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-economy" }],
  }),
  component: TexasEconomyPage,
});

function TexasEconomyPage() {
  return (
    <HubView hub={HUB} sections={SECTIONS}>
      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl tracking-tight mb-3">Inside the Texas Economy</h2>
        <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
          <p>
            Texas is the ninth-largest economy in the world, and it got there without a state income tax.
            That single fact shapes everything downstream — how the state funds schools, why property
            taxes matter so much, how ERCOT keeps a standalone power grid running for 30+ million
            people, and why so many companies keep moving their headquarters here from California,
            Illinois, and New York.
          </p>
          <p>
            The backbone is still energy. The Permian Basin produces more oil than most OPEC members,
            and Texas leads the country in both natural gas and wind generation. But the story is no
            longer just oil: semiconductor fabs in North Texas, biotech in Houston, and a fast-growing
            aerospace corridor from Austin to Brownsville have turned the state into one of the most
            diversified economies in the U.S.
          </p>
          <p>
            On the household side, the pressure point is property tax. Because there's no income tax,
            local school districts and counties lean on appraisals — and appraisals have risen sharply
            as new residents bid up home prices. The Legislature's ongoing property-tax-relief packages,
            the homestead exemption, and the appraisal protest process are the tools every Texas
            homeowner needs to understand. Our coverage below walks through each of them.
          </p>
        </div>
      </section>
    </HubView>
  );
}