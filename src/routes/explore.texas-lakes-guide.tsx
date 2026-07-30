import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

const lakeTypes = [
  {
    title: "Family lake weekends",
    body: "Look for protected swimming areas, nearby state parks, shaded picnic facilities, short nature trails, and lodging close enough to reduce time in the car. Reservoirs near larger cities often offer the broadest mix of marinas, rentals, campgrounds, and restaurants.",
  },
  {
    title: "Fishing-focused trips",
    body: "Choose the species and season first, then compare boat access, bank-fishing areas, fish-cleaning stations, tackle availability, and current lake levels. Wind can completely change the experience on open water, so build a backup shoreline or nearby-town plan.",
  },
  {
    title: "Quiet paddling escapes",
    body: "Smaller coves, spring-fed reaches, and forested East Texas lakes can be better for kayaks and canoes than broad, wind-exposed reservoirs. Confirm launch rules, motor traffic, water releases, and whether the shoreline is public before arriving.",
  },
  {
    title: "Camping and stargazing",
    body: "A lakeside campsite can combine swimming, paddling, fishing, sunsets, and night skies in one base camp. Reserve early for spring and fall weekends, and verify burn bans, generator rules, check-in times, and shoreline access from the campground.",
  },
];

const regions = [
  {
    title: "North Texas and the Prairies",
    body: "Large reservoirs around Dallas–Fort Worth make practical weekend escapes with marinas, boat ramps, campgrounds, and nearby towns. These lakes are convenient, but summer weekends can be busy, so early arrivals and advance reservations matter.",
  },
  {
    title: "East Texas and the Piney Woods",
    body: "Forested shorelines, quieter coves, and tall pines give East Texas lakes a different feel from open prairie reservoirs. This region works especially well for camping, paddling, bass fishing, wildlife watching, and slower multi-day stays.",
  },
  {
    title: "Central Texas and the Hill Country",
    body: "Limestone scenery, clearer water, rivers feeding reservoirs, and nearby small towns make Central Texas ideal for combined lake-and-road-trip itineraries. Water levels can vary sharply, so verify ramp access and swimming conditions before departure.",
  },
  {
    title: "West Texas",
    body: "Lakes are fewer and distances are longer, which makes fuel, weather, and supply planning more important. The reward is often a less crowded setting and dramatic contrast between open water and desert or canyon country.",
  },
  {
    title: "South Texas and the Gulf Coast plain",
    body: "Warm weather extends the recreation season, but heat, wind, drought, and storm risk require flexible planning. Pair a lake stop with wildlife areas, historic towns, or coastal destinations to create a fuller regional trip.",
  },
];

const faqs = [
  {
    question: "What is the best time of year to visit a Texas lake?",
    answer:
      "Spring and fall usually offer the most comfortable temperatures for camping, paddling, hiking, and fishing. Summer is best for swimming and boating but brings stronger heat, heavier weekend crowds, and a greater need for shade and hydration.",
  },
  {
    question: "Do Texas lakes require reservations?",
    answer:
      "The lake itself may not, but campgrounds, state parks, cabins, boat rentals, guided trips, and day-use areas often do. Popular weekends and holidays can fill well in advance.",
  },
  {
    question: "How should I check lake conditions before a trip?",
    answer:
      "Review the official managing agency, park, river authority, or marina source for current water levels, boat-ramp status, closures, algae notices, swim conditions, burn bans, and weather-related restrictions.",
  },
  {
    question: "Can I build a lake trip without a boat?",
    answer:
      "Yes. Many Texas lakes offer shore fishing, swimming areas, paddling rentals, hiking, birding, scenic overlooks, picnic sites, and campgrounds. Choose destinations with clearly documented public shoreline access.",
  },
];

export const Route = createFileRoute("/explore/texas-lakes-guide")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Lakes Guide | Swimming, Fishing, Camping & Weekend Trips",
      description:
        "Plan a Texas lake trip with practical guidance for swimming, fishing, boating, paddling, camping, seasons, regions, safety, and nearby Explore Texas destinations.",
      path: "/explore/texas-lakes-guide",
      type: "article",
      keywords:
        "Texas lakes, best lakes in Texas, Texas lake vacations, Texas fishing lakes, Texas lake camping, Texas swimming lakes",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasLakesGuide,
});

function TexasLakesGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Texas Lakes Guide: Swimming, Fishing, Camping and Weekend Trips",
    description:
      "A practical statewide guide to planning Texas lake trips by activity, region, season, access, and current conditions.",
    image: "https://keeptxred.com/images/explore/texas-lakes-guide-hero.svg",
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    author: { "@type": "Organization", name: "KeepTXRed" },
    publisher: { "@type": "Organization", name: "KeepTXRed" },
    mainEntityOfPage: "https://keeptxred.com/explore/texas-lakes-guide",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Explore Texas lakes</p>
          <h1 className="mt-3 max-w-5xl font-display text-5xl leading-none md:text-7xl">
            Texas Lakes Guide: Plan the Right Trip for the Water, Season, and Region
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Texas lakes can support everything from a quick swimming day to a week of fishing, camping, paddling, and scenic drives. The best trip starts by matching the lake to the experience you actually want—not simply choosing the closest blue shape on a map.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        <img
          src="/images/explore/texas-lakes-guide-hero.svg"
          alt="Texas lake with kayaks, fishing boat, shoreline trees, and distant hills"
          className="w-full rounded-xl border"
          width="1600"
          height="900"
        />

        <article className="mx-auto max-w-4xl space-y-12 font-serif text-lg leading-8">
          <section>
            <h2 className="font-display text-4xl">Start with the kind of lake day you want</h2>
            <p className="mt-5">
              A reservoir built for water supply, a forested recreation lake, and a clear Hill Country impoundment may all appear similar on a map, but they can offer very different shorelines, access rules, water clarity, wind exposure, amenities, and crowd patterns. Before choosing a destination, decide whether the trip is centered on swimming, fishing, boating, paddling, camping, wildlife, or a combination of activities.
            </p>
            <p className="mt-4">
              Use the <Link to="/explore/search" search={{ types: ["lake"], page: 1, pageSize: 24, sort: "relevance" }} className="font-semibold text-primary hover:underline">Explore Texas lake search</Link> to compare published lake destinations, then open nearby county and regional pages to find parks, historic places, trails, and communities that can fill out the itinerary.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Choose a lake by trip style</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {lakeTypes.map((item) => (
                <div key={item.title} className="rounded-xl border bg-muted/20 p-6">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-4xl">Texas lake regions</h2>
            <p className="mt-5">
              Geography changes the entire character of a lake trip. Distance, trees, shoreline slope, water color, wind, heat, and nearby attractions vary greatly across the state.
            </p>
            <div className="mt-6 space-y-5">
              {regions.map((region) => (
                <div key={region.title} className="rounded-lg border-l-4 border-primary bg-muted/20 p-5">
                  <h3 className="font-display text-2xl">{region.title}</h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">{region.body}</p>
                </div>
              ))}
            </div>
          </section>

          <figure>
            <img
              src="/images/explore/texas-lakes-trip-planning.svg"
              alt="Illustrated Texas lake trip planning checklist with weather, water level, reservations, safety, and activities"
              className="w-full rounded-xl border"
              width="1400"
              height="900"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              Confirm conditions and access before every Texas lake trip.
            </figcaption>
          </figure>

          <section>
            <h2 className="font-display text-4xl">When to visit</h2>
            <p className="mt-5">
              Spring is one of the best all-purpose seasons for Texas lakes. Temperatures are often comfortable, wildflowers can improve the drive, fish activity may be strong, and campsites are more pleasant than during peak summer heat. Pair a lake weekend with the <Link to="/explore/texas-wildflower-seasons" className="font-semibold text-primary hover:underline">Texas wildflower seasons guide</Link> for a stronger spring itinerary.
            </p>
            <p className="mt-4">
              Summer favors swimming, boating, and early-morning fishing, but heat safety becomes central. Plan shade, water, sun protection, and indoor or town-based breaks during the hottest part of the afternoon. Fall often delivers excellent camping, hiking, and paddling weather, while winter can be rewarding for quiet shoreline visits, birding, and fishing when conditions cooperate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Check conditions—not just the forecast</h2>
            <p className="mt-5">
              A sunny forecast does not guarantee a good lake day. Water levels can close ramps, expose hazards, reduce swimming access, or change the shoreline. Wind may make open-water paddling unsafe even when skies are clear. Heavy rain upstream can affect currents and debris, while drought can alter marina and campground operations.
            </p>
            <p className="mt-4">
              Before leaving, verify the official managing agency, park, river authority, or marina source. Check lake level, ramp status, swimming notices, algae or bacteria advisories, burn bans, campground rules, boat requirements, fishing regulations, and severe-weather risk. Never rely solely on old reviews or photographs.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Build a complete lake itinerary</h2>
            <p className="mt-5">
              The strongest lake trips include a backup plan and at least one nearby land-based stop. A morning on the water can pair with a cavern tour, state park hike, historic downtown, scenic river overlook, or evening drive. Explore the <Link to="/explore/texas-state-parks-guide" className="font-semibold text-primary hover:underline">Texas state parks guide</Link>, <Link to="/explore/caverns" className="font-semibold text-primary hover:underline">public caverns</Link>, and <Link to="/explore/texas-scenic-drives" className="font-semibold text-primary hover:underline">Texas scenic drives</Link> to build a more resilient weekend.
            </p>
            <p className="mt-4">
              Use the <Link to="/explore/trip-planner" className="font-semibold text-primary hover:underline">Explore Texas trip planner</Link> to organize anchor destinations and nearby stops. Keep drive times realistic, especially when towing, traveling with children, or moving between rural areas with limited fuel and food options.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Lake safety basics</h2>
            <ul className="mt-5 list-disc space-y-3 pl-6">
              <li>Wear properly fitted life jackets for boating, paddling, and young swimmers.</li>
              <li>Do not assume a shoreline is public or safe for swimming.</li>
              <li>Watch for sudden depth changes, submerged structures, currents, and boat traffic.</li>
              <li>Avoid alcohol when operating boats or supervising children near water.</li>
              <li>Leave the water immediately when thunder is heard.</li>
              <li>Carry more drinking water than expected, especially in summer.</li>
              <li>Tell someone your launch point, route, and return time when paddling or fishing remotely.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-4xl">Frequently asked questions</h2>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border p-6">
                  <h3 className="font-display text-2xl">{faq.question}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <section className="rounded-xl border bg-muted/30 p-8 text-center">
          <h2 className="font-display text-4xl">Find a Texas lake</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Compare published lake destinations, nearby parks, camping options, and regional attractions before building your trip.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/explore/search" search={{ types: ["lake"], page: 1, pageSize: 24, sort: "relevance" }} className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground">Browse Texas lakes</Link>
            <Link to="/explore/trip-planner" className="rounded-md border bg-background px-5 py-3 font-semibold">Open the trip planner</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
