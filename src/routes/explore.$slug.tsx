import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import {
  Accessibility,
  Compass,
  ExternalLink,
  MapPin,
  PawPrint,
  Printer,
  Route as RouteIcon,
  Ticket,
  Users,
} from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { ExploreMap } from "@/components/explore/ExploreMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getExploreEntity, getExploreSlugTarget } from "@/services/explore/public.functions";
import { buildSeo } from "@/lib/seo";
import { geographyPath } from "@/lib/explore/geography-pages";
import type { ExploreEntity } from "@/types/explore/public";

const TEXAS_DEFINED_ORIGIN = "https://texasdefined.com";
const TEXAS_DEFINED_EXPLORE = "https://texasdefined.com/explore";
const TEXAS_DEFINED_SEARCH = "https://texasdefined.com/explore/search";
const TEXAS_DEFINED_TRIP_PLANNER = "https://texasdefined.com/explore/trip-planner";

export const Route = createFileRoute("/explore/$slug")({
  loader: async ({ params }) => {
    const entity = await getExploreEntity({ data: { slug: params.slug } });
    if (!entity) {
      const target = await getExploreSlugTarget({ data: { slug: params.slug } });
      if (target)
        throw redirect({ to: "/explore/$slug", params: { slug: target }, statusCode: 301 });
      throw notFound();
    }
    return entity;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = buildSeo({
      title: `${loaderData.name} Visitor Guide | Explore Texas`,
      description:
        loaderData.summary ||
        `Plan a visit to ${loaderData.name} with activities, amenities, nearby destinations, maps, and official visitor information.`,
      path: `/explore/${loaderData.slug}`,
      image: loaderData.heroImageUrl || undefined,
      imageAlt: loaderData.heroImageAlt || loaderData.name,
      type: "article",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: ExploreEntityPage,
});

const searchDefaults = { page: 1, pageSize: 24, sort: "relevance" as const };

function texasDefinedGeographyHref(kind: "county" | "region", name: string) {
  return `${TEXAS_DEFINED_ORIGIN}${geographyPath(kind, name)}`;
}

function texasDefinedSearchHref(filters: { activities?: string[]; types?: string[] } = {}) {
  const params = new URLSearchParams({
    page: String(searchDefaults.page),
    pageSize: String(searchDefaults.pageSize),
    sort: searchDefaults.sort,
  });
  for (const activity of filters.activities ?? []) params.append("activities", activity);
  for (const type of filters.types ?? []) params.append("types", type);
  return `${TEXAS_DEFINED_SEARCH}?${params.toString()}`;
}

function JsonValue({ value }: { value: unknown }) {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") return <p>{String(value)}</p>;
  if (Array.isArray(value))
    return (
      <ul className="list-disc pl-5">
        {value.map((item, index) => (
          <li key={index}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</li>
        ))}
      </ul>
    );
  if (typeof value === "object")
    return (
      <dl className="grid gap-2 sm:grid-cols-2">
        {Object.entries(value as Record<string, unknown>).map(
          ([key, item]) =>
            item != null && (
              <div key={key}>
                <dt className="font-semibold capitalize">{key.replaceAll("_", " ")}</dt>
                <dd className="text-muted-foreground">
                  <JsonValue value={item} />
                </dd>
              </div>
            ),
        )}
      </dl>
    );
  return null;
}

function profileSection(entity: ExploreEntity, key: string): Record<string, unknown> {
  const value = (entity.profile as Record<string, unknown>)[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cavernStructuredProperties(entity: ExploreEntity) {
  if (entity.entityType !== "cavern") return undefined;
  const tour = profileSection(entity, "tour_information");
  const access = profileSection(entity, "visitor_access");
  const properties = [
    [
      "Guided tours",
      tour.guided_tours === true ? "Yes" : tour.guided_tours === false ? "No" : null,
    ],
    [
      "Reservations recommended",
      tour.reservations_recommended === true
        ? "Yes"
        : tour.reservations_recommended === false
          ? "No"
          : null,
    ],
    ["Typical visit duration", tour.typical_duration],
    ["Accessibility", access.accessibility],
    ["Pet policy", access.pet_policy],
    ["Photography policy", access.photography_policy],
  ].filter((item): item is [string, string | number | boolean] => item[1] != null);

  return properties.map(([name, value]) => ({
    "@type": "PropertyValue",
    name,
    value,
  }));
}

function ExploreEntityPage() {
  const entity = Route.useLoaderData() as ExploreEntity;
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": schemaType(entity.entityType),
    name: entity.name,
    description: entity.summary || undefined,
    image: entity.heroImageUrl || undefined,
    url: `https://keeptxred.com/explore/${entity.slug}`,
    geo:
      entity.latitude != null && entity.longitude != null
        ? {
            "@type": "GeoCoordinates",
            latitude: entity.latitude,
            longitude: entity.longitude,
          }
        : undefined,
    address:
      entity.city || entity.county
        ? {
            "@type": "PostalAddress",
            addressLocality: entity.city || undefined,
            addressRegion: "TX",
            addressCountry: "US",
          }
        : undefined,
    containedInPlace: [
      entity.county
        ? {
            "@type": "AdministrativeArea",
            name: `${entity.county} County, Texas`,
            url: texasDefinedGeographyHref("county", entity.county),
          }
        : null,
      entity.region
        ? {
            "@type": "Place",
            name: `${entity.region}, Texas`,
            url: texasDefinedGeographyHref("region", entity.region),
          }
        : null,
    ].filter(Boolean),
    dateModified: entity.updatedAt,
    touristType: entity.activities.length ? entity.activities : undefined,
    publicAccess: true,
    isAccessibleForFree: entity.feeRequired === false,
    additionalProperty: cavernStructuredProperties(entity),
    sameAs: entity.officialUrl ? [entity.officialUrl] : undefined,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Explore Texas",
        item: TEXAS_DEFINED_EXPLORE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: entity.region || "Texas destinations",
        item: entity.region
          ? texasDefinedGeographyHref("region", entity.region)
          : TEXAS_DEFINED_SEARCH,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entity.name,
        item: `https://keeptxred.com/explore/${entity.slug}`,
      },
    ],
  };
  const faqItems = buildFaqItems(entity);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const details = [
    ["Hours", entity.hours],
    ["Fees", entity.fees],
    ["Regulations", entity.regulations],
    ["Seasonal guidance", entity.seasonalGuidance],
  ] as const;
  const highlights = buildHighlights(entity);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([placeSchema, breadcrumbSchema, faqSchema]).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      {entity.heroImageUrl && (
        <img
          src={entity.heroImageUrl}
          alt={entity.heroImageAlt || entity.name}
          width={1600}
          height={800}
          className="max-h-[34rem] w-full object-cover"
        />
      )}
      <article className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1 text-sm text-muted-foreground">
          <a href={TEXAS_DEFINED_EXPLORE} className="hover:underline">
            Explore Texas
          </a>
          <span>/</span>
          {entity.region ? (
            <a href={texasDefinedGeographyHref("region", entity.region)} className="hover:underline">
              {entity.region}
            </a>
          ) : (
            <span>{entity.entityType.replaceAll("_", " ")}</span>
          )}
          <span>/</span>
          <span>{entity.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <Badge>{entity.entityType.replaceAll("_", " ")}</Badge>
            <h1 className="mt-3 font-display text-5xl leading-none md:text-7xl">{entity.name}</h1>
            {(entity.city || entity.county || entity.region) && (
              <p className="mt-3 flex flex-wrap items-center gap-x-2 text-lg text-muted-foreground">
                <MapPin className="size-5" aria-hidden="true" />
                {entity.city && <span>{entity.city}</span>}
                {entity.county && (
                  <a
                    href={texasDefinedGeographyHref("county", entity.county)}
                    className="hover:text-primary hover:underline"
                  >
                    {entity.county} County
                  </a>
                )}
                {entity.region && (
                  <a
                    href={texasDefinedGeographyHref("region", entity.region)}
                    className="hover:text-primary hover:underline"
                  >
                    {entity.region}
                  </a>
                )}
              </p>
            )}
            {entity.summary && <p className="mt-6 text-xl leading-8">{entity.summary}</p>}

            <section className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Destination highlights">
              {highlights.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex gap-3 rounded-lg border bg-muted/20 p-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-10" aria-labelledby="about-destination">
              <h2 id="about-destination" className="font-display text-3xl">
                About {entity.name}
              </h2>
              <div className="mt-4 space-y-4 font-serif text-lg leading-8">
                <p>{buildOverview(entity)}</p>
                {entity.description && entity.description !== entity.summary && (
                  <p className="whitespace-pre-line">{entity.description}</p>
                )}
              </div>
            </section>

            {entity.activities.length > 0 && (
              <section className="mt-10" aria-labelledby="things-to-do">
                <h2 id="things-to-do" className="font-display text-3xl">
                  Things to do at {entity.name}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Use these activities to plan your visit or discover more Texas destinations
                  offering the same experience.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {entity.activities.map((activity) => (
                    <a
                      key={activity}
                      href={texasDefinedSearchHref({ activities: [activity] })}
                      className="group rounded-lg border p-4 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <span className="font-semibold capitalize group-hover:text-primary">
                        {activity}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        Find more places for {activity} in Texas
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {buildHistory(entity) && (
              <section className="mt-10" aria-labelledby="destination-history">
                <h2 id="destination-history" className="font-display text-3xl">
                  History and significance
                </h2>
                <p className="mt-4 font-serif text-lg leading-8">{buildHistory(entity)}</p>
              </section>
            )}

            {entity.observations.length > 0 && (
              <section className="mt-10" aria-labelledby="current-conditions">
                <h2 id="current-conditions" className="font-display text-3xl">
                  Current conditions and advisories
                </h2>
                <div className="mt-4 space-y-3">
                  {entity.observations.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-primary/30 bg-primary/5 p-4"
                    >
                      <Badge variant="outline">{item.severity || item.observationType}</Badge>
                      <h3 className="mt-2 font-semibold">{item.title}</h3>
                      {item.description && <p className="mt-1 text-sm">{item.description}</p>}
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                          Observation source
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {Object.keys(entity.profile).length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-3xl">Visitor details</h2>
                <div className="mt-4">
                  <JsonValue value={entity.profile} />
                </div>
              </section>
            )}

            {details.map(
              ([title, value]) =>
                value != null && (
                  <section className="mt-10" key={title}>
                    <h2 className="font-display text-3xl">{title}</h2>
                    <div className="mt-4">
                      <JsonValue value={value} />
                    </div>
                  </section>
                ),
            )}

            {entity.amenities.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-3xl">Amenities and facilities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entity.amenities.map((item) => (
                    <Badge key={item} variant="secondary" className="px-3 py-1.5 capitalize">
                      {item}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-10" aria-labelledby="plan-your-visit-guide">
              <h2 id="plan-your-visit-guide" className="font-display text-3xl">
                Plan your visit
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
                <p>{buildPlanningGuidance(entity)}</p>
                <p>
                  Conditions, closures, reservations, fees, and operating hours can change. Confirm
                  the latest information with the official destination before traveling, especially
                  for overnight stays, water activities, guided access, or remote areas.
                </p>
              </div>
            </section>

            <section className="mt-10" aria-labelledby="destination-faq">
              <h2 id="destination-faq" className="font-display text-3xl">
                Frequently asked questions
              </h2>
              <div className="mt-5 divide-y rounded-lg border">
                {faqItems.map((item) => (
                  <div key={item.question} className="p-5">
                    <h3 className="font-semibold">{item.question}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <ExploreMap entity={entity} />
            <div className="rounded-lg border p-5">
              <h2 className="font-semibold">Plan your visit</h2>
              <div className="mt-4 grid gap-2">
                <Button asChild>
                  <a href={`${TEXAS_DEFINED_TRIP_PLANNER}?destination=${encodeURIComponent(entity.slug)}`}>
                    <RouteIcon />
                    Add to a trip
                  </a>
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer />
                  Print guide
                </Button>
                {entity.officialUrl && (
                  <Button asChild variant="outline">
                    <a href={entity.officialUrl} target="_blank" rel="noreferrer">
                      Official website <ExternalLink />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-5">
              <h2 className="font-semibold">Explore more</h2>
              <div className="mt-3 grid gap-2 text-sm">
                {entity.region && (
                  <a
                    href={texasDefinedGeographyHref("region", entity.region)}
                    className="rounded-md px-3 py-2 hover:bg-muted hover:text-primary"
                  >
                    More destinations in {entity.region}
                  </a>
                )}
                {entity.county && (
                  <a
                    href={texasDefinedGeographyHref("county", entity.county)}
                    className="rounded-md px-3 py-2 hover:bg-muted hover:text-primary"
                  >
                    Explore {entity.county} County
                  </a>
                )}
                <a
                  href={texasDefinedSearchHref({ types: [entity.entityType] })}
                  className="rounded-md px-3 py-2 capitalize hover:bg-muted hover:text-primary"
                >
                  More Texas {pluralType(entity.entityType)}
                </a>
                <a
                  href={texasDefinedSearchHref()}
                  className="rounded-md px-3 py-2 hover:bg-muted hover:text-primary"
                >
                  Browse all Texas destinations
                </a>
              </div>
            </div>

            {(entity.sourceName || entity.sourceUrl || entity.sourceUpdatedAt) && (
              <div className="rounded-lg border p-5 text-sm">
                <h2 className="font-semibold">Source and freshness</h2>
                {entity.sourceName && <p className="mt-2">{entity.sourceName}</p>}
                {entity.sourceUpdatedAt && (
                  <p className="text-muted-foreground">
                    Source updated {new Date(entity.sourceUpdatedAt).toLocaleDateString()}
                  </p>
                )}
                {entity.sourceUrl && (
                  <a
                    href={entity.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    View source
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>

        {entity.nearby.length > 0 && (
          <section className="mt-16" aria-labelledby="nearby-attractions">
            <h2 id="nearby-attractions" className="mb-2 font-display text-4xl">
              Nearby attractions
            </h2>
            <p className="mb-6 text-muted-foreground">
              Continue exploring with destinations closest to {entity.name}.
            </p>
            <EntityGrid items={entity.nearby} />
          </section>
        )}
        {entity.related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-2 font-display text-4xl">Related destinations</h2>
            <p className="mb-6 text-muted-foreground">
              Similar Texas places selected by destination type and shared interests.
            </p>
            <EntityGrid items={entity.related} />
          </section>
        )}
      </article>
    </main>
  );
}

function buildHighlights(entity: ExploreEntity) {
  if (entity.entityType === "cavern") {
    const tour = profileSection(entity, "tour_information");
    const access = profileSection(entity, "visitor_access");
    return [
      {
        label: "Guided access",
        value: tour.guided_tours === true ? "Guided cavern tour" : "Confirm current tour format",
        icon: Compass,
      },
      {
        label: "Tour length",
        value: String(tour.typical_duration ?? "Varies by tour"),
        icon: Users,
      },
      {
        label: "Reservations",
        value:
          tour.reservations_recommended === true
            ? "Advance booking recommended"
            : "Check current availability",
        icon: Ticket,
      },
      {
        label: "Admission",
        value: entity.feeRequired ? "Paid admission required" : "No standard fee listed",
        icon: Ticket,
      },
      {
        label: "Accessibility",
        value: String(access.accessibility ?? "Contact the operator for route details"),
        icon: Accessibility,
      },
    ];
  }

  return [
    {
      label: "Best for",
      value: entity.activities.slice(0, 3).join(", ") || "Texas sightseeing",
      icon: Compass,
    },
    {
      label: "Location",
      value: [entity.city, entity.region].filter(Boolean).join(", ") || "Texas",
      icon: MapPin,
    },
    {
      label: "Family friendly",
      value: entity.isFamilyFriendly ? "Yes" : "Check destination guidance",
      icon: Users,
    },
    {
      label: "Admission",
      value: entity.feeRequired ? "A fee may be required" : "No standard fee listed",
      icon: Ticket,
    },
    ...(entity.isPetFriendly
      ? [{ label: "Pets", value: "Pet-friendly areas available", icon: PawPrint }]
      : []),
    ...(entity.isAccessible
      ? [{ label: "Accessibility", value: "Accessibility features listed", icon: Accessibility }]
      : []),
  ];
}

function buildOverview(entity: ExploreEntity): string {
  const location = [entity.city, entity.county ? `${entity.county} County` : null, entity.region]
    .filter(Boolean)
    .join(", ");
  const activities = naturalList(entity.activities.slice(0, 5));
  const amenities = naturalList(entity.amenities.slice(0, 5));
  return `${entity.name} is a ${entity.entityType.replaceAll("_", " ")} in ${location || "Texas"}. ${entity.summary || "It is part of the Explore Texas destination directory."}${activities ? ` Visitors commonly come for ${activities}.` : ""}${amenities ? ` Listed facilities include ${amenities}.` : ""}`;
}

function buildPlanningGuidance(entity: ExploreEntity): string {
  const activityText = naturalList(entity.activities.slice(0, 4));
  const facilityText = naturalList(entity.amenities.slice(0, 4));
  const petText = entity.isPetFriendly
    ? "Pet-friendly access is listed, but leash rules and restricted areas should be confirmed before arrival."
    : "Travelers bringing pets should verify whether animals are permitted and which areas may be restricted.";
  const accessText = entity.isAccessible
    ? "The destination lists accessibility features; contact the operator for route-specific or facility-specific details."
    : "Visitors with accessibility needs should contact the destination for current information about trails, buildings, parking, and services.";
  return `Build your itinerary around ${activityText || "the experiences available on site"}. ${facilityText ? `Available facilities may include ${facilityText}.` : "Facility information is limited, so prepare before leaving."} ${petText} ${accessText}`;
}

function buildHistory(entity: ExploreEntity): string | null {
  const profile = entity.profile as Record<string, unknown>;
  for (const key of ["history", "historical_significance", "significance", "geology"]) {
    const value = profile[key];
    if (typeof value === "string" && value.trim().length > 40) return value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const text = Object.values(value as Record<string, unknown>)
        .filter((item): item is string => typeof item === "string" && item.trim().length > 20)
        .join(" ");
      if (text) return text;
    }
  }
  return entity.description && entity.description.length > 300
    ? `${entity.name} is included in the Explore Texas directory for its natural, recreational, or cultural significance. The detailed description above summarizes the available historical and place context from the destination’s published source.`
    : null;
}

function buildFaqItems(entity: ExploreEntity): Array<{ question: string; answer: string }> {
  const location = [entity.city, entity.county ? `${entity.county} County` : null, entity.region]
    .filter(Boolean)
    .join(", ");
  const activities = naturalList(entity.activities.slice(0, 6));
  const amenities = naturalList(entity.amenities.slice(0, 6));
  return [
    {
      question: `Where is ${entity.name}?`,
      answer: `${entity.name} is located in ${location || "Texas"}. Use the map on this page and verify directions with the official destination before departure.`,
    },
    {
      question: `What can you do at ${entity.name}?`,
      answer: activities
        ? `Popular listed activities include ${activities}. Availability may vary by season, weather, water level, closures, or reservation requirements.`
        : "Available activities can change by season and operating conditions. Review the official destination information before your visit.",
    },
    {
      question: `What amenities are available at ${entity.name}?`,
      answer: amenities
        ? `Listed amenities include ${amenities}. Confirm current availability, accessibility, and operating status before traveling.`
        : "The dataset does not yet list detailed amenities for this destination. Check the official website for current facilities and services.",
    },
    {
      question: `Does ${entity.name} charge an admission fee?`,
      answer: entity.feeRequired
        ? "A fee is listed as required or potentially required. Rates, passes, reservations, and additional activity fees can change, so verify current pricing with the destination."
        : "No standard admission fee is listed in this directory, but parking, camping, tours, permits, or special activities may still have charges.",
    },
  ];
}

function naturalList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function pluralType(type: string): string {
  const normalized = type.replaceAll("_", " ");
  if (normalized.endsWith("s")) return normalized;
  if (normalized.endsWith("y")) return `${normalized.slice(0, -1)}ies`;
  return `${normalized}s`;
}

function schemaType(type: string): string {
  if (type === "lake") return "BodyOfWater";
  if (type === "park") return "Park";
  if (type === "campground") return "Campground";
  if (type === "business") return "LocalBusiness";
  if (type === "city") return "City";
  return "TouristAttraction";
}
