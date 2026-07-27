import { createFileRoute, Link } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";

const HUB = HUBS.find((h) => h.slug === "texas-policy-law")!;
const SECTIONS = [
  { title: "Border Policy", description: "Operation Lone Star, border security, and federal-state conflict.", href: "/news/texas-border-policy-full-guide" },
  { title: "Education Policy", description: "School districts, school choice, parental rights, and ISD governance.", href: "/texas-school-districts-explained" },
  { title: "Housing Law", description: "Leases, renter protections, deposits, repairs, notices, and eviction procedure.", href: "/texas-renters-rights-guide" },
  { title: "Public Safety", description: "DPS, criminal justice, constitutional carry, and policing.", href: "/news/constitutional-carry-one-year-later" },
  { title: "Legal Updates", description: "AG opinions, Texas Supreme Court rulings, and new statutes.", href: "/texas-laws" },
];

export const Route = createFileRoute("/texas-law-policy")({
  head: () => ({
    meta: [
      { title: "Texas Law & Policy — Border, Education, Housing, Public Safety" },
      { name: "description", content: "Texas laws, regulations, housing rules, public safety, and policy changes — explained for the people who live under them." },
      { property: "og:title", content: "Texas Law & Policy — Keep TX Red" },
      { property: "og:description", content: "Texas laws, regulations, housing rules, public safety, and policy changes." },
      { property: "og:url", content: "https://keeptxred.com/texas-law-policy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-law-policy" }],
  }),
  component: TexasLawPolicyPage,
});

function TexasLawPolicyPage() {
  return (
    <HubView hub={HUB} sections={SECTIONS}>
      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl tracking-tight mb-3">How Texas Law Actually Works</h2>
        <div className="space-y-4 font-serif text-base text-foreground/90 leading-relaxed">
          <p>
            Texas law is written for a state that behaves like a country. The Legislature meets for
            140 days every two years and passes more than a thousand bills — on border enforcement,
            school choice, constitutional carry, water rights, housing, and the sunshine laws that keep local
            governments accountable. Between sessions, the Attorney General's opinions and Texas
            Supreme Court rulings quietly reshape how those statutes are enforced.
          </p>
          <p>
            The most consequential rules are often the ones Texans meet at home: the school district that
            taxes and educates a family, the lease that controls a rental, and the notice deadlines that
            determine whether a dispute reaches court. Start with our guides to{" "}
            <Link to="/texas-school-districts-explained" className="text-primary underline underline-offset-4">
              how Texas school districts work
            </Link>{" "}
            and{" "}
            <Link to="/texas-renters-rights-guide" className="text-primary underline underline-offset-4">
              Texas renters' rights
            </Link>
            .
          </p>
          <p>
            The guides below break these subjects down statute by statute — what the law says, who enforces
            it, and what it actually means for the families, business owners, landlords, tenants, and local officials
            who have to live under it.
          </p>
        </div>
      </section>
    </HubView>
  );
}
