import { Droplets, MapPinned, ShieldCheck } from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { Button } from "@/components/ui/button";
import type { MajorSpringDiscoveryCollection } from "@/data/explore/collections.major-springs";
import type { ExploreEntity } from "@/types/explore/public";

export function SpringCollectionLanding({
  collection,
  items,
  canonicalPath,
}: {
  collection: MajorSpringDiscoveryCollection;
  items: ExploreEntity[];
  canonicalPath: string;
}) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: `https://keeptxred.com${canonicalPath}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `https://keeptxred.com/explore/${item.slug}`,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <a href="https://texasdefined.com/explore" className="hover:text-primary hover:underline">
              Explore Texas
            </a>{" "}
            / {collection.title}
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Spring-fed Texas
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            {collection.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            {collection.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://texasdefined.com/explore/search?q=Texas%20springs">
                <MapPinned /> Browse spring destinations
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://texasdefined.com/explore/trip-planner">Plan a Texas trip</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <section className="grid gap-6 md:grid-cols-3" aria-label="Texas spring planning guidance">
          <div className="rounded-lg border p-5">
            <Droplets className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Check current conditions</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Spring flow, water quality, swimming access, closures, and capacity limits can change.
              Confirm current conditions with the official operator before traveling.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <ShieldCheck className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Protect sensitive springs</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Follow posted rules, stay in designated areas, and avoid disturbing protected habitat,
              wildlife, vegetation, and historic water features.
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <MapPinned className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl">Verify access</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Admission, reservations, parking, swimming, guided access, and seasonal schedules vary
              by destination. Review each guide and its official source.
            </p>
          </div>
        </section>

        <section aria-labelledby="spring-destinations">
          <h2 id="spring-destinations" className="font-display text-3xl md:text-4xl">
            Destinations in this collection
          </h2>
          <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
            Open a destination guide for access details, activities, regulations, maps, nearby places,
            and official visitor information.
          </p>
          <div className="mt-6">
            <EntityGrid items={items} />
          </div>
        </section>
      </div>
    </main>
  );
}
