import { createFileRoute, Link } from "@tanstack/react-router";
import { Binoculars, Compass, Landmark, MapPinned } from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { Button } from "@/components/ui/button";
import { texasLighthouseDestinations } from "@/data/explore/catalog.lighthouses.entities";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/lighthouses")({
  loader: () => ({ items: texasLighthouseDestinations }),
  head: () => {
    const seo = buildSeo({
      title: "Texas Lighthouses | Coastal History & Visitor Guides",
      description:
        "Explore Texas lighthouses with public-access guidance, maritime history, maps, coastal destinations, official sources, and practical trip-planning information.",
      path: "/explore/lighthouses",
      type: "website",
      keywords:
        "Texas lighthouses, lighthouses in Texas, Texas coast attractions, maritime history Texas, lighthouse tours Texas",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasLighthousesPage,
});

const searchDefaults = { page: 1, pageSize: 24, sort: "relevance" as const };

const faqItems = [
  {
    question: "Can visitors enter every Texas lighthouse?",
    answer:
      "No. Public access varies by lighthouse. Some sites allow interior or grounds access, while others can only be viewed from public areas or during special events. Review the individual guide and confirm current conditions before traveling.",
  },
  {
    question: "Do Texas lighthouse visits require reservations?",
    answer:
      "Some lighthouse tours, boat trips, museums, or special-access events may require advance reservations. Availability can also depend on weather, restoration work, staffing, and seasonal schedules.",
  },
  {
    question: "What should visitors check before a coastal lighthouse trip?",
    answer:
      "Confirm operating hours, access restrictions, ferry or boat schedules, parking, weather, admission, accessibility, and whether the tower or grounds are open. Coastal conditions can change quickly.",
  },
];

function TexasLighthousesPage() {
  const { items } = Route.useLoaderData();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Texas Lighthouses",
    description:
      "Visitor guides for historic lighthouses and maritime landmarks along the Texas coast.",
    url: "https://keeptxred.com/explore/lighthouses",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `https://keeptxred.com/explore/${item.slug}`,
      })),
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionSchema, faqSchema]).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary hover:underline">
              Explore Texas
            </Link>{" "}
            / Texas lighthouses
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Texas Maritime Heritage
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Texas lighthouses
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Explore {items.length.toLocaleString("en-US")} Texas lighthouse and maritime landmark
            guides with access information, coastal history, maps, official sources, and nearby
            destinations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                to="/explore/search"
                search={{ ...searchDefaults, types: ["lighthouse"] }}
              >
                <MapPinned /> Browse lighthouse destinations
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore/trip-planner">
                <Compass /> Build a coastal trip
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <section className="grid gap-6 md:grid-cols-3" aria-label="Lighthouse visit planning">
          <div className="rounded-lg border p-5">
            <Landmark className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Respect historic sites</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Many lighthouse structures are protected historic resources. Follow posted rules and
              remain within designated visitor areas.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <Binoculars className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Confirm viewing access</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Some lighthouses are open for tours, while others are view-only or reached by boat.
              Check current access before making the trip.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <MapPinned className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Plan for coastal conditions</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Weather, tides, ferry schedules, restoration work, and seasonal operations can affect
              access. Verify conditions with the official operator.
            </p>
          </div>
        </section>

        <section aria-labelledby="all-texas-lighthouses">
          <div className="mb-6">
            <h2 id="all-texas-lighthouses" className="font-display text-3xl md:text-4xl">
              Texas lighthouse visitor guides
            </h2>
            <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
              Open a guide for ownership, public-access status, tower access, maritime context,
              official information, maps, and nearby Explore Texas destinations.
            </p>
          </div>
          <EntityGrid items={items} />
        </section>

        <section aria-labelledby="texas-lighthouse-faq">
          <h2 id="texas-lighthouse-faq" className="font-display text-3xl md:text-4xl">
            Texas lighthouse questions
          </h2>
          <div className="mt-6 divide-y rounded-lg border">
            {faqItems.map((item) => (
              <div key={item.question} className="p-5 md:p-6">
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
