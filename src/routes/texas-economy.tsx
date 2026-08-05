import { createFileRoute, Link } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";

const HUB = HUBS.find((h) => h.slug === "texas-economy")!;
const SECTIONS = [
  { title: "Energy & Oil", description: "Permian Basin, ERCOT, and state energy policy.", href: "/news/texas-energy-economy-overview" },
  { title: "Jobs & Employment", description: "Workforce policy, business conditions, and the Texas labor market.", href: "/texas-business" },
  { title: "Business Growth", description: "Corporate investment, regulation, startups, and Texas competitiveness.", href: "/texas-business" },
  { title: "Taxes & State Budget", description: "Tax policy, appropriations, public spending, and legislative proposals.", href: "/bills" },
];

export const Route = createFileRoute("/texas-economy")({
  head: () => ({
    meta: [
      { title: "Texas Economy — Energy, Jobs, Taxes & Business Policy" },
      { name: "description", content: "Coverage of Texas economic policy, energy regulation, jobs, state spending, taxes, and business conditions." },
      { property: "og:title", content: "Texas Economy — Keep TX Red" },
      { property: "og:description", content: "Texas economic policy, energy regulation, jobs, state spending, taxes, and business conditions." },
      { property: "og:url", content: "https://keeptxred.com/texas-economy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-economy" }],
  }),
  component: TexasEconomyPage,
});

function TexasEconomyPage() {
  return (
    <HubView hub={HUB} sections={SECTIONS}>
      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl tracking-tight mb-3">Inside Texas Economic Policy</h2>
        <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
          <p>
            Keep TX Red follows the decisions in Austin that shape the state economy: taxes,
            appropriations, energy regulation, workforce policy, infrastructure, and the business
            climate. The focus is on government action and measurable public consequences rather
            than household relocation or personal-finance planning.
          </p>
          <p>
            Energy remains central to the state economy. Legislative decisions involving ERCOT,
            the Public Utility Commission, oil and gas production, transmission, and reliability can
            affect employers, local governments, and consumers across Texas.
          </p>
          <p>
            Tax and spending coverage centers on proposals before the Legislature, adopted budgets,
            agency implementation, and local-government authority. Follow the
            {" "}<Link to="/bills" className="underline text-primary">Texas bills database</Link>{" "}
            and our <Link to="/texas-legislature" className="underline text-primary">Legislature coverage</Link>
            {" "}for the measures and votes behind those changes.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-xl border bg-muted/20 p-7 md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Track state decisions</p>
        <h2 className="mt-2 font-display text-3xl">Taxes, spending, regulation, and growth</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Review active legislation, state-government actions, and reporting on how public policy
          affects Texas employers, taxpayers, industries, and regional economies.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link to="/bills" className="font-semibold text-primary hover:underline">Browse Texas bills</Link>
          <Link to="/texas-business" className="font-semibold text-primary hover:underline">Read Texas business coverage</Link>
        </div>
      </section>
    </HubView>
  );
}
