import { createFileRoute } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { HubView } from "@/components/hub-view";

const HUB = HUBS.find((h) => h.slug === "texas-policy-law")!;
const SECTIONS = [
  { title: "Border Policy", description: "Operation Lone Star, border security, and federal-state conflict.", href: "/news/texas-border-policy-full-guide" },
  { title: "Education Policy", description: "School choice, ESAs, parental rights, and ISD governance.", href: "/news/school-choice-esa-guide" },
  { title: "Public Safety", description: "DPS, criminal justice, constitutional carry, and policing.", href: "/news/constitutional-carry-one-year-later" },
  { title: "Legal Updates", description: "AG opinions, Texas Supreme Court rulings, and new statutes.", href: "/texas-laws" },
];

export const Route = createFileRoute("/texas-law-policy")({
  head: () => ({
    meta: [
      { title: "Texas Law & Policy — Border, Education, Public Safety, Legal" },
      { name: "description", content: "Texas laws, regulations, public safety, and policy changes — explained for the people who live under them." },
      { property: "og:title", content: "Texas Law & Policy — Keep TX Red" },
      { property: "og:description", content: "Texas laws, regulations, public safety, and policy changes." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-law-policy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-law-policy" }],
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
            school choice, constitutional carry, water rights, and the sunshine laws that keep local
            governments accountable. Between sessions, the Attorney General's opinions and Texas
            Supreme Court rulings quietly reshape how those statutes are enforced.
          </p>
          <p>
            The most consequential fights right now are at the border and in the classroom. Operation
            Lone Star put the state directly in the middle of what used to be a federal-only lane,
            and the ongoing legal battle over SB 4 will define state authority for a generation.
            Education Savings Accounts, parental rights, and school board governance are doing the
            same on the K-12 side.
          </p>
          <p>
            The guides below break these down statute by statute — what the law says, who enforces
            it, and what it actually means for the families, business owners, and local officials
            who have to live under it.
          </p>
        </div>
      </section>
    </HubView>
  );
}