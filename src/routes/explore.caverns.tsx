import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MapPinned, Ticket } from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { Button } from "@/components/ui/button";
import { getCavernLanding } from "@/services/explore/cavern.functions";
import { buildSeo } from "@/lib/seo";
import { geographyPath } from "@/lib/explore/geography-pages";

export const Route = createFileRoute("/explore/caverns")({
  loader: () => getCavernLanding(),
  head: () => {
    const seo = buildSeo({
      title: "Texas Caverns and Caves | Tours, Tickets & Visitor Guides",
      description:
        "Explore Texas caverns and caves with guided-tour details, reservation guidance, accessibility information, maps, nearby attractions, and practical visitor tips.",
      path: "/explore/caverns",
      type: "website",
      keywords:
        "Texas caverns, Texas caves, caves in Texas, cavern tours Texas, guided cave tours, Texas underground attractions",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasCavernsPage,
});

const searchDefaults = { page: 1, pageSize: 24, sort: "relevance" as const };

const cavernFaqItems = [
  {
    question: "What is the difference between a cave and a cavern?",
    answer:
      "Cave is the broad geological term for a natural underground void. Cavern is commonly used for a cave with large chambers or for a developed public attraction offering guided tours. Texas destinations may use either term in their official names.",
  },
  {
    question: "Do Texas caverns require guided tours?",
    answer:
      "Most developed public caverns control underground access through scheduled guided tours for visitor safety and resource protection. Check the individual destination guide and official operator information before traveling.",
  },
  {
    question: "Should cavern tickets be reserved in advance?",
    answer:
      "Advance reservations are strongly recommended when a destination lists limited tour capacity, especially on weekends, holidays, school breaks, and during peak travel seasons. Walk-up availability is not guaranteed.",
  },
  {
    question: "What should visitors wear inside a Texas cavern?",
    answer:
      "Closed-toe walking shoes with dependable traction are the safest choice. Underground routes can include stairs, slopes, damp surfaces, and cooler temperatures, so a light layer may also be useful.",
  },
  {
    question: "Are Texas cavern tours accessible?",
    answer:
      "Accessibility varies significantly by cavern and tour route. Some attractions offer elevators, paved paths, or limited-access tours, while others include stairs and uneven passages. Contact the operator for route-specific guidance.",
  },
  {
    question: "Are pets or service animals allowed in caverns?",
    answer:
      "Pet and service-animal policies vary because underground environments may involve narrow routes, wildlife protections, and safety restrictions. Review the destination guide and confirm the current policy directly with the operator.",
  },
];

function TexasCavernsPage() {
  const data = Route.useLoaderData();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Texas Caverns and Caves",
    description: "Visitor guides for commercial caverns and public cave attractions across Texas.",
    url: "https://keeptxred.com/explore/caverns",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.total,
      itemListElement: data.items.map((item: any, index: number) => ({
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
    mainEntity: cavernFaqItems.map((item) => ({
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
            / Texas caverns and caves
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Underground Texas
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Texas caverns and caves
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Compare {data.total.toLocaleString("en-US")} published cavern destinations, review
            guided-tour requirements, check reservation guidance, and plan an underground Texas day
            trip with nearby attractions.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/explore/search" search={{ ...searchDefaults, types: ["cavern"] }}>
                <MapPinned /> Browse cavern results
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore/trip-planner">
                <Compass /> Build a Texas trip
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <section aria-labelledby="cavern-planning">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border p-5">
              <Ticket className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Reserve ahead</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                {data.reservationRecommendedCount.toLocaleString("en-US")} listed destinations
                recommend advance reservations. Weekend, holiday, and school-break tours can fill
                quickly.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <Compass className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Prepare for cave conditions</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Wear closed-toe shoes with dependable traction. Underground routes may include
                stairs, slopes, narrow passages, damp surfaces, and cooler temperatures.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <MapPinned className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Check access details</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Accessibility, pet, service-animal, and photography policies vary by cavern. Review
                each visitor guide and confirm current rules with the operator before traveling.
              </p>
            </div>
          </div>
        </section>

        {data.regionalGroups.length > 0 && (
          <section aria-labelledby="cavern-regions" className="space-y-10">
            <div>
              <h2 id="cavern-regions" className="font-display text-3xl md:text-4xl">
                Explore caverns by Texas region
              </h2>
              <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
                Build a regional underground itinerary, compare nearby tours, and combine cavern
                visits with parks, historic sites, and other Explore Texas destinations.
              </p>
            </div>

            {data.regionalGroups.map((group: any) => (
              <div key={group.region} className="border-t pt-8">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl">{group.region} caverns</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {group.items.length.toLocaleString("en-US")} destination
                      {group.items.length === 1 ? "" : "s"} in this regional collection.
                    </p>
                  </div>
                  <Link
                    to={geographyPath("region", group.region)}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View all {group.region} cavern results
                  </Link>
                </div>
                <EntityGrid items={group.items.slice(0, 4)} />
              </div>
            ))}
          </section>
        )}

        <section aria-labelledby="all-texas-caverns">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="all-texas-caverns" className="font-display text-3xl md:text-4xl">
                All Texas cavern guides
              </h2>
              <p className="mt-2 text-muted-foreground">
                Open a destination guide for tour length, admission, accessibility, pet rules,
                photography guidance, maps, and nearby places.
              </p>
            </div>
            <Link
              to="/explore/search"
              search={{ ...searchDefaults, types: ["cavern"] }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Search and filter caverns
            </Link>
          </div>
          <EntityGrid items={data.items} />
        </section>

        <section aria-labelledby="texas-cavern-faq">
          <h2 id="texas-cavern-faq" className="font-display text-3xl md:text-4xl">
            Texas cavern visitor questions
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            Use these statewide planning answers as a starting point, then review the individual
            cavern guide and official operator information for destination-specific requirements.
          </p>
          <div className="mt-6 divide-y rounded-lg border">
            {cavernFaqItems.map((item) => (
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
