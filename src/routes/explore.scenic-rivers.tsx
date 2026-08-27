import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Compass, MapPinned, Waves } from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { Button } from "@/components/ui/button";
import { stateScenicRiverDestinations } from "@/data/explore/catalog.state-scenic-rivers.entities";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/scenic-rivers")({
  loader: () => ({ items: stateScenicRiverDestinations }),
  head: () => {
    const seo = buildSeo({
      title: "Texas Scenic Rivers | Paddling, Access & Visitor Guides",
      description:
        "Explore Texas scenic river segments with paddling guidance, lawful access reminders, ecological highlights, maps, nearby destinations, and official TPWD resources.",
      path: "/explore/scenic-rivers",
      type: "website",
      keywords:
        "Texas scenic rivers, Texas paddling rivers, scenic river segments Texas, TPWD rivers, river access Texas",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasScenicRiversPage,
});

const faqItems = [
  {
    question: "What is a Texas scenic river segment?",
    answer:
      "These guides cover river reaches identified by the Texas Parks and Wildlife Department for notable scenic, ecological, wildlife, or recreational value. A designation does not guarantee public access along the entire corridor.",
  },
  {
    question: "Can the public access every scenic river segment?",
    answer:
      "No. Texas river corridors often border private property, and access conditions vary. Use established public access points, parks, authorized private facilities, or lawful public crossings and confirm entry and take-out locations before traveling.",
  },
  {
    question: "What should paddlers verify before a trip?",
    answer:
      "Check current streamflow, weather, flood risk, dam releases, closures, permits, route difficulty, parking, and take-out access. Remote segments may require advanced planning and self-rescue capability.",
  },
];

function TexasScenicRiversPage() {
  const { items } = Route.useLoaderData();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Texas Scenic Rivers",
    description:
      "Visitor and planning guides for scenic and ecologically significant river segments across Texas.",
    url: "https://keeptxred.com/explore/scenic-rivers",
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
            <a href="https://texasdefined.com/explore" className="hover:text-primary hover:underline">
              Explore Texas
            </a>{" "}
            / Texas scenic rivers
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Rivers of Texas
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Texas scenic rivers
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Explore {items.length.toLocaleString("en-US")} scenic and ecologically significant river
            segments with paddling guidance, access reminders, nearby destinations, and official
            planning resources.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://texasdefined.com/explore/search?activities=paddling">
                <MapPinned /> Browse paddling destinations
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://texasdefined.com/explore/trip-planner">
                <Compass /> Build a Texas trip
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <section className="grid gap-6 md:grid-cols-3" aria-label="Scenic river planning guidance">
          <div className="rounded-lg border p-5">
            <Waves className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Check river conditions</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Flow, flood risk, dam releases, weather, and water temperature can change quickly.
              Verify current conditions before entering the water.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <MapPinned className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Confirm lawful access</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Use established public access, authorized facilities, parks, or lawful crossings.
              River use does not authorize trespass across private land.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <AlertTriangle className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Plan for remote travel</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Some segments have limited parking, take-outs, cell service, and rescue access. Match
              the route to your experience and prepare for self-rescue.
            </p>
          </div>
        </section>

        <section aria-labelledby="all-scenic-rivers">
          <div className="mb-6">
            <h2 id="all-scenic-rivers" className="font-display text-3xl md:text-4xl">
              Texas scenic river guides
            </h2>
            <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
              Open a river guide for segment boundaries, ecological significance, activities,
              access notes, official sources, maps, and nearby Explore Texas destinations.
            </p>
          </div>
          <EntityGrid items={items} />
        </section>

        <section aria-labelledby="scenic-river-faq">
          <h2 id="scenic-river-faq" className="font-display text-3xl md:text-4xl">
            Texas scenic river questions
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
